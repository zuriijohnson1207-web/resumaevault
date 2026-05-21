# ResumaeVault - Supabase Architecture

This document outlines the migration from Base44 to Supabase for ResumaeVault.

## 🏗️ New Architecture with Supabase

### Overview
ResumaeVault will use Supabase as the backend, eliminating the need for Base44 while maintaining all functionality.

### Key Components

```
┌─────────────────────────────────┐
│     Frontend (Vite)             │
│  ├─ Resume Management           │
│  ├─ User Dashboard              │
│  ├─ Job Applications            │
│  └─ Payment/Credits UI          │
└────────────┬────────────────────┘
             │
      ┌──────▼────────┐
      │  Vercel Edge  │
      │   Functions   │
      └──────┬────────┘
             │
      ┌──────▼──────────────┐
      │   Supabase API      │
      ├─ Authentication    │
      ├─ Realtime DB       │
      ├─ Storage           │
      └─ Edge Functions    │
             │
      ┌──────▼──────────────┐
      │  PostgreSQL DB      │
      │  (Managed)          │
      └─────────────────────┘
             │
      ┌──────▼──────────────┐
      │  Stripe API         │
      │  (Payments)         │
      └─────────────────────┘
```

## 📊 Database Schema

### Tables

#### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  profile_name TEXT,
  profile_image TEXT,
  credits INT DEFAULT 0,
  subscription_tier TEXT DEFAULT 'free',
  stripe_customer_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Resumes
```sql
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB,
  file_url TEXT,
  version INT DEFAULT 1,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Job Applications
```sql
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  position_title TEXT NOT NULL,
  resume_id UUID REFERENCES resumes(id),
  application_date DATE,
  status TEXT DEFAULT 'applied',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Credit History
```sql
CREATE TABLE credit_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  transaction_type TEXT,
  description TEXT,
  stripe_charge_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Payment Records
```sql
CREATE TABLE payment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_payment_id TEXT UNIQUE,
  amount DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔐 Authentication

### Supabase Auth Features
- Email/Password authentication
- Social login (Google, GitHub)
- JWT tokens
- Row Level Security (RLS)

### Setup
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

// Sign up
const { user, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})

// Sign in
const { user, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})
```

## 📁 File Storage

### Supabase Storage for Resume Files
```typescript
// Upload resume file
const { data, error } = await supabase
  .storage
  .from('resumes')
  .upload(`${userId}/${fileName}`, file)

// Get signed URL
const { data } = supabase
  .storage
  .from('resumes')
  .getPublicUrl(`${userId}/${fileName}`)
```

## 💳 Stripe Integration

### Webhook Handler (Edge Function)
```typescript
// /functions/stripe-webhook.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@11.7.0"

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!)

serve(async (req) => {
  const signature = req.headers.get("stripe-signature")!
  const body = await req.text()
  
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!
    )

    switch (event.type) {
      case "payment_intent.succeeded":
        // Handle successful payment
        break
      case "customer.subscription.updated":
        // Handle subscription update
        break
    }
  } catch (error) {
    console.error(error)
  }
})
```

## 🚀 Deployment

### Environment Variables
```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Stripe
STRIPE_PUBLIC_KEY=pk_***
STRIPE_SECRET_KEY=sk_***
STRIPE_WEBHOOK_SECRET=whsec_***

# Application
VITE_API_URL=https://resumaevault.vercel.app
NODE_ENV=production
```

### Vercel Deployment
1. Frontend builds and deploys to Vercel
2. Serverless functions connect to Supabase
3. Supabase handles database and authentication
4. Stripe webhooks trigger edge functions

## 📋 Migration Checklist

- [ ] Set up Supabase project
- [ ] Create database tables
- [ ] Configure Row Level Security (RLS)
- [ ] Set up Supabase Auth
- [ ] Configure Stripe integration
- [ ] Create edge functions
- [ ] Update frontend to use Supabase client
- [ ] Test all features
- [ ] Deploy to Vercel
- [ ] Configure custom domain
- [ ] Set up monitoring

## 🔗 Useful Links

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Edge Functions](https://supabase.com/docs/guides/functions)

---

**Status:** In Progress  
**Last Updated:** May 21, 2026
