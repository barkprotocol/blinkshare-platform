# BARK | BlinkShare Frontend (MVP)

![BlinkShare Hero Image](/frontend/public/assets/landing-page.png)

![Bootstrapped][https://github.com/barkprotocol/blinkshare-platform]

## Overview
**BlinkShare** is a platform designed to enable seamless blockchain interactions within social media communities, such as Discord. Built on **Next.js** and **TypeScript**, BlinkShare integrates **Solana web3.js**, **Shadcn/UI**, and **Supabase**, offering an advanced ecosystem for managing community roles and transactions using Solana Blinks.

## Key Features
- **Dialect Blinks**: Leverages Dialect for dynamic messaging and notifications in Solana transactions.
- **Shadcn/UI**: Provides pre-built, customizable components for a visually stunning and user-friendly interface.
- **BlinkShare Bot**: An interactive Discord bot to simplify blockchain interactions and manage server roles.
- **Supabase Integration**: For robust database management and real-time updates.
- **Seamless Role Management**: Automates the assignment and expiration of roles for efficient community management.
- **Secure Transactions**: Built on Solana's fast and secure blockchain, with wallet management powered by **Privy.io**.

---

## Tech Stack
- **Frontend**: Next.js 15, React 19, Typescript, Solana/web3.js, Tailwind CSS, Shadcn/UI
- **Backend**: Node.js with Solana web3.js, Supabase
- **Package Manager**: pnpm
- **Blockchain**: Solana
- **Database**: Supabase
- **Messaging**: Dialect, Resend
- **Payments** Privy.io

---

## Installation and Setup

### Prerequisites
- [Node.js](https://nodejs.org/) >= 20
- [pnpm](https://pnpm.io/) installed globally
- Solana CLI installed locally
- Supabase project set up ([Supabase Documentation](https://supabase.com/docs))

### Clone the Repository
```bash
git clone https://github.com/your-repo/blinkshare.git
cd frontend
```

### Install Dependencies
```bash
pnpm install
```

### Configure Environment Variables
Create a `.env.local` file and include the following:
```env
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
DIALECT_API_KEY=<your-dialect-api-key>
JWT_SECRET=<your-jwt-secret>
SECRET_KEY=<your-secret-key>
```

### Database Setup
Run the following command to initialize Supabase:
```bash
pnpm run db:setup
```

### Development Server
Start the development server:
```bash
pnpm dev
```
The app will be running at `http://localhost:3000`.

---

## BlinkShare Bot
****Adding the Bot to Your Discord Server**
1. Visit [BlinkShare Bot Invite Link](#).
2. Select your server and grant the necessary permissions.
3. Configure the bot using `/blinksetup` for roles and `/blinklink` for Solana wallet linking.

---

## Deployment
BlinkShare is optimized for deployment on **Vercel**:
1. Connect your repository to Vercel.
2. Add environment variables to the Vercel dashboard.
3. Deploy with a single click.

---

## Contributing
We welcome contributions! To get started:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch-name`.
3. Make your changes and commit: `git commit -m "Description of changes"`.
4. Push to the branch: `git push origin feature-branch-name`.
5. Open a pull request.

---

## License
BlinkShare is open-source under the [MIT License](LICENSE).