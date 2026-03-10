# My Triathlon

A comprehensive sprint triathlon training application designed to help athletes prepare mentally and physically for race day.

View here: https://my-triathlon.vercel.app/athlete

## Features

### 🏃 Athlete Dashboard

- **Race countdown**: Live countdown to your target race date
- **Weekly calendar**: Track your training schedule across all three disciplines
- **Discipline tracking**: Monitor progress in swimming, biking, and running

### 📔 Training Journal

- **Daily entries**: Log your training sessions with mood tracking
- **Multi-discipline support**: Tag entries by swim, bike, or run
- **Confidence tracking**: Monitor your confidence levels over time for each discipline

### 🧠 Mental Game Tools

- **Visualization exercises**: Structured mental preparation for race day
- **Motivational quotes**: Curated collection of inspiring quotes
- **Mental notes**: Track your mental preparation and mindset

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: TailwindCSS with shadcn/ui components
- **Icons**: Lucide React
- **Fonts**: Geist Sans, Geist Mono, and Oswald

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Set up your environment variables in `.env.local`:

```
DATABASE_URL=your_postgres_connection_string
```

3. Run database migrations:

```bash
pnpm drizzle-kit push
```

4. Start the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the app

## Database Schema

The application uses four main tables:

- `journal_entries`: Training journal with mood and discipline tracking
- `confidence_entries`: Daily confidence ratings per discipline
- `visualization_notes`: Mental preparation notes
- `motivational_items`: Inspirational quotes and sources
