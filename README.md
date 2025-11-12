# Donation Leaderboard

A Next.js application for managing and displaying donation leaderboards with admin dashboard functionality.

## Features

- Public donation leaderboard
- Admin dashboard for managing donors and donations
- Real-time statistics and analytics
- Supabase integration for data storage
- Responsive design with Tailwind CSS

## Tech Stack

- **Framework:** Next.js 16
- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase
- **Animations:** Framer Motion
- **Icons:** React Icons

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run the database schema (located in `src/db/schema.sql`) in your Supabase dashboard
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable React components
├── db/                  # Database schemas
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries (Supabase clients)
└── middleware.ts        # Next.js middleware for auth
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

Deploy to Vercel or any platform supporting Next.js. Ensure environment variables are set in your deployment platform.
