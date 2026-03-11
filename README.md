# Sugarush (Full-Stack Architecture)

## Step 1 — Backend Architecture Implementation
Sugarush is now a production-ready, full-stack Next.js application leveraging modern, scalable technologies:
- **Framework**: Next.js (App Router)
- **Database**: SQLite (Configured instantly for local testing via Prisma, seamlessly migration-ready to PostgreSQL via `prisma.schema`).
- **ORM**: Prisma Client v5 (Strict TypeScript definitions matching frontend interfaces)
- **Authentication**: NextAuth.js (Auth.js) v5 with global session management.
- **AI Integration**: Mistral AI natively integrated into `/api/chat` router.

## Step 2 — Backend Folder Structure
```
Sugarush/
├── prisma/
│   └── schema.prisma           # Prisma Data Schema & Database link
├── lib/
│   ├── auth.ts                 # NextAuth credentials authentication config
│   ├── prisma.ts               # Global cached Prisma Client singleton
│   └── mocks.ts                # (Legacy) Fallback objects for UI seeding
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts # Credential auth routes
│   │   ├── user/route.ts       # Profile & XP REST integration
│   │   ├── glucose/route.ts    # Secure Glucose POST/GET CRUD
│   │   ├── meals/route.ts      # Multi-table inserts (Meals + FoodItems)
│   │   ├── rewards/route.ts    # Server-side transaction handling & XP deduplication 
│   │   └── chat/route.ts       # Mistral AI (Now guarded by JWT Authentication)
│   ├── Providers.tsx           # Global NextAuth Context Wrapper
│   └── layout.tsx              # React component wrapping app with Providers
└── .env                        # Local variables for DB & Mistral Auth
```

## Step 3 — Secure Setup Instructions
To run this application natively:

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Initialize Database**
   Our Prisma schema creates `dev.db` dynamically. Push the schema to the database:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

3. **Configure Environment**
   Ensure `.env` contains:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="any_super_secret_secure_string_here"
   NEXTAUTH_URL="http://localhost:3000"
   ```
   Ensure `.env.local` contains:
   ```env
   MISTRAL_API_KEY="your_actual_mistral_api_key"
   ```

4. **Start the Application**
   ```bash
   npm run dev
   ```

## Step 4 — Connect the Frontend
The frontend `store/index.ts` zustand state requires integration via HTTP calls (e.g. `await fetch('/api/glucose')`) utilizing the session tokens provided by `<SessionProvider>`.
Because of NextAuth v5, users now fetch `const { data: session } = useSession()` client-side, or `await auth()` on the server, before invoking these API endpoints.
