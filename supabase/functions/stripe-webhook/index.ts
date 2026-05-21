// Stripe webhook handler for Vercel Edge Functions
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.26.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!)
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const signature = req.headers.get('stripe-signature')
  const body = await req.text()

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    )

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const customerId = paymentIntent.customer as string

        // Get user from Stripe customer ID
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (user) {
          // Add credits
          await supabase.rpc('add_credits', {
            user_id: user.id,
            amount: Math.floor((paymentIntent.amount || 0) / 100)
          })

          // Record payment
          await supabase
            .from('payment_records')
            .insert({
              user_id: user.id,
              stripe_payment_id: paymentIntent.id,
              amount: (paymentIntent.amount || 0) / 100,
              currency: paymentIntent.currency,
              status: 'succeeded'
            })
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Get user
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (user) {
          // Update subscription tier
          const tier = subscription.items.data[0]?.price?.metadata?.tier || 'free'
          await supabase
            .from('users')
            .update({ subscription_tier: tier })
            .eq('id', user.id)
        }
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        const customerId = charge.customer as string

        // Get user
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (user) {
          // Deduct credits
          await supabase.rpc('deduct_credits', {
            user_id: user.id,
            amount: Math.floor((charge.amount || 0) / 100)
          })

          // Update payment record
          await supabase
            .from('payment_records')
            .update({ status: 'refunded' })
            .eq('stripe_payment_id', charge.payment_intent as string)
        }
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('Webhook error:', err)
    return new Response(
      JSON.stringify({ error: 'Webhook handler failed' }),
      { status: 400 }
    )
  }
})
