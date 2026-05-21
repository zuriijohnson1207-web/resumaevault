# 📄 ResumaeVault

A comprehensive resume management and monetization platform built with modern web technologies. ResumaeVault enables users to store, manage, and monetize their professional resume data securely.

## 🎯 Features

### Core Functionality
- **Resume Management** - Store and organize multiple resume versions
- **User Profiles** - Comprehensive user profile management with professional information
- **Job Application Tracking** - Track and manage job applications
- **Credit System** - In-app credit system for premium features
- **Payment Processing** - Integrated Stripe payment processing
- **Admin Controls** - Administrative override capabilities and credit adjustments

### Advanced Features
- **Access Control** - Fine-grained access management and feature verification
- **Code Changes** - Apply and track code modifications through admin panel
- **File Operations** - Secure file upload, storage, and retrieval
- **Webhook Integration** - Stripe webhook handling for real-time payment updates
- **Sync Operations** - Automatic sync between user access states and Stripe customers
- **Subscription Management** - Handle subscription upgrades and downgrades

## 🏗️ Architecture

### Backend (Base44 Platform)
The application is built on **Base44**, a serverless backend platform with the following components:

**Entities:**
- `AdminCodeChangeLog` - Tracks administrative code changes
- `AdminOverride` - Manages admin override records
- `Application` - Core application entity
- `CreditHistory` - Maintains credit transaction history
- `JobApplication` - Job application records
- `PaymentRecord` - Payment transaction records
- `Resume` - Resume data and versions
- `UserProfile` - User account and profile information

**Serverless Functions:**
- `addCreditsAndSync` - Add credits to user accounts and sync with Stripe
- `adminCreditAdjust` - Administrative credit adjustment function
- `applyCodeChange` - Apply code modifications
- `createCheckout` - Initialize Stripe checkout sessions
- `fixAccessAndDistributeCredits` - Recover and distribute credits
- `getFileContent` - Retrieve file contents
- `importStripeCustomers` - Import Stripe customer data
- `readAppFile` - Read application files
- `stripeWebhook` - Handle Stripe webhook events
- `syncAccessState` - Synchronize access permissions
- `syncUnlockState` - Synchronize unlock states
- `syncUsersToStripe` - Sync user data to Stripe
- `upgradeSubscriptionAndSync` - Handle subscription upgrades
- `verifyAllOverrideAccess` - Verify admin override access
- `verifyFeatureAccess` - Check feature access permissions
- `zuReadFile` - Read files with utility functions

### Frontend
- **Components** - Reusable UI components configuration
- **Configuration** - ESLint and JavaScript module configuration
- **Build System** - Modern JavaScript/Node.js build setup

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- Stripe account for payment processing
- Base44 platform access

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/zuriijohnson1207-web/resumaevault.git
cd resumaevault
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file with the following variables:
```env
# Stripe Configuration
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Base44 Configuration
BASE44_APP_ID=your_base44_app_id

# Application Configuration
NODE_ENV=development
```

4. **Start the development server**
```bash
npm run dev
```

## 📁 Project Structure

```
resumaevault/
├── base44/
│   ├── entities/              # Data models
│   │   ├── AdminCodeChangeLog.json
│   │   ├── AdminOverride.json
│   │   ├── Application.json
│   │   ├── CreditHistory.json
│   │   ├── JobApplication.json
│   │   ├── PaymentRecord.json
│   │   ├── Resume.json
│   │   └── UserProfile.json
│   ├── functions/             # Serverless functions
│   │   ├── addCreditsAndSync/
│   │   ├── adminCreditAdjust/
│   │   ├── applyCodeChange/
│   │   ├── createCheckout/
│   │   ├── fixAccessAndDistributeCredits/
│   │   ├── getFileContent/
│   │   ├── importStripeCustomers/
│   │   ├── readAppFile/
│   │   ├── stripeWebhook/
│   │   ├── syncAccessState/
│   │   ├── syncUnlockState/
│   │   ├── syncUsersToStripe/
│   │   ├── upgradeSubscriptionAndSync/
│   │   ├── verifyAllOverrideAccess/
│   │   ├── verifyFeatureAccess/
│   │   └── zuReadFile/
│   ├── config.json            # Platform configuration
│   └── .app.json              # App ID configuration
├── components.json            # Component configuration
├── eslint.config.js           # ESLint rules
├── jsconfig.json              # JavaScript config
├── index.html                 # Entry point
├── package.json               # Dependencies
└── package-lock.json          # Locked dependencies
```

## 🔐 Security Features

- **Access Control** - Role-based access control with admin overrides
- **Secure Authentication** - Integration with Stripe for secure payment authentication
- **Credit Verification** - Real-time credit balance verification
- **Audit Logging** - Admin code change logging and tracking
- **Data Sync** - Automatic synchronization ensures data consistency

## 💳 Payment Integration

ResumaeVault integrates with **Stripe** for secure payment processing:

- Checkout session creation
- Webhook event handling
- Subscription management
- Customer synchronization
- Credit-based transactions

### Setting Up Stripe Integration

1. Create a Stripe account at https://stripe.com
2. Obtain your API keys from the Stripe dashboard
3. Configure webhook endpoint for order updates
4. Add keys to your environment configuration

## 📊 Credit System

The credit system allows users to:
- Purchase credits for premium features
- Track credit usage history
- Manage subscriptions for recurring credits
- Upgrade or downgrade subscription tiers
- View credit balance and transaction history

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Run linter with fix
npm run lint:fix

# Run tests
npm run test
```

### Code Quality

This project uses ESLint for code quality. All commits should pass linting:

```bash
npm run lint
```

## 🔄 API Endpoints

### Authentication & Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/:id` - Get user profile

### Resume Management
- `POST /api/resumes` - Create resume
- `GET /api/resumes/:id` - Get resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume

### Payments & Credits
- `POST /api/checkout` - Create checkout session
- `GET /api/credits/balance` - Get credit balance
- `POST /api/credits/add` - Add credits
- `GET /api/payments/history` - Payment history

### Admin
- `POST /api/admin/credits/adjust` - Adjust user credits
- `POST /api/admin/override` - Admin override
- `GET /api/admin/logs` - View admin logs

## 📝 License

This project is proprietary. All rights reserved.

## 👤 Author

**zuriijohnson1207-web**
- GitHub: [@zuriijohnson1207-web](https://github.com/zuriijohnson1207-web)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📞 Support

For support, please open an issue in the repository or contact the development team.

---

**Last Updated:** May 21, 2026  
**Status:** In Development
