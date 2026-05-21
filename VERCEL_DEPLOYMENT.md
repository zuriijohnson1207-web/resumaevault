# Vercel Deployment Guide for ResumaeVault

## Quick Start

### Option 1: Connect via GitHub (Recommended)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Sign in with your GitHub account

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Search for `zuriijohnson1207-web/resumaevault`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset:** Select "Other"
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **Set Environment Variables**
   Click "Environment Variables" and add:
   ```
   STRIPE_PUBLIC_KEY=pk_your_stripe_key
   STRIPE_SECRET_KEY=sk_your_stripe_key
   BASE44_APP_ID=your_base44_app_id
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your site is live! 🎉

### Option 2: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Project name: `resumaevault`
   - Framework: `Other`
   - Output directory: `dist`

5. **Add Environment Variables**
   ```bash
   vercel env add STRIPE_PUBLIC_KEY
   vercel env add STRIPE_SECRET_KEY
   vercel env add BASE44_APP_ID
   ```

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Environment Variables

Make sure these are configured in your Vercel project settings:

| Variable | Required | Description |
|----------|----------|-------------|
| `STRIPE_PUBLIC_KEY` | Yes | Stripe public API key |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret API key |
| `BASE44_APP_ID` | Yes | Base44 platform app ID |
| `NODE_ENV` | Yes | Set to `production` |

## Deployment Architecture

```
┌─────────────────────────────────┐
│     Vercel Edge Network         │
│  (CDN & Static Hosting)         │
└──────────────┬──────────────────┘
               │
       ┌───────┴────────┐
       │                │
    ┌──▼──┐        ┌────▼────┐
    │HTML │        │Functions│
    │CSS  │        │(Node.js)│
    │JS   │        └────┬────┘
    └─────┘             │
                        │
              ┌─────────┴──────────┐
              │                    │
         ┌────▼────┐         ┌─────▼─────┐
         │Base44   │         │Stripe API │
         │Backend  │         │           │
         └─────────┘         └───────────┘
```

## Deployment Checklist

- [ ] Repository is public on GitHub
- [ ] All dependencies are in `package.json`
- [ ] Build script is configured (`npm run build`)
- [ ] Environment variables are set
- [ ] `.env.example` is committed to repo
- [ ] `vercel.json` is configured
- [ ] `.gitignore` excludes node_modules and .env

## Monitoring & Logs

After deployment:

1. **View Logs**
   ```bash
   vercel logs
   ```

2. **Monitor Performance**
   - Visit Vercel Dashboard
   - Check Analytics tab
   - Monitor Function Invocations

3. **View Errors**
   - Dashboard → Deployments → Recent deployment → Logs

## Scaling & Performance

Vercel automatically scales your deployment. For optimal performance:

- **Serverless Functions:** Auto-scale based on traffic
- **CDN:** Distributed globally for fast content delivery
- **Cold Starts:** Minimize with warm lambdas (Pro+ plan)

## Cost Estimation

- **Hobby Plan (Free):** Limited builds, suitable for development
- **Pro Plan:** $20/month, recommended for production
- **Enterprise:** Custom pricing for large-scale apps

## Rollback

To rollback to a previous deployment:

1. Go to Vercel Dashboard
2. Click Deployments
3. Find the deployment you want to rollback to
4. Click "Promote to Production"

## Custom Domain

1. In Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Configure DNS records as shown
4. SSL certificate is auto-generated

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check `npm run build` works locally |
| Missing env vars | Verify in Vercel settings → Environment Variables |
| Functions not working | Check Base44 connectivity, review logs |
| Stripe webhook fails | Update webhook URL in Stripe dashboard |

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Vercel Support:** https://vercel.com/support
- **Repository Issues:** GitHub Issues tab

---

**Happy Deploying! 🚀**
