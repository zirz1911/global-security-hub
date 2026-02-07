# Global Security Hub

A comprehensive directory of 150+ security agencies, intelligence services, defense ministries, and law enforcement organizations from around the world.

## Live Demo

The website displays information about global security organizations including:
- **173 Organizations** from **76 Countries**
- **12 Categories** (Police, Intelligence, Defence, Embassy, Cyber Security, etc.)
- **692 Personnel Records** with positions and ranks

## Features

- Organization directory with search and filtering
- Detailed organization pages with personnel information
- Responsive design for all devices
- Fast static page generation with ISR
- Admin panel for data management (coming soon)

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Database:** SQLite + Prisma ORM
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/zirz1911/global-security-hub.git
cd global-security-hub
```

2. Install dependencies:
```bash
npm install
```

3. Setup database:
```bash
npx prisma migrate dev
npm run db:seed
```

4. Run development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
global-security-hub/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Homepage (organization list)
│   └── org/[id]/page.tsx   # Organization detail page
├── components/             # React components
│   ├── OrganizationCard.tsx
│   ├── OrganizationList.tsx
│   ├── PersonnelCard.tsx
│   └── SearchFilter.tsx
├── lib/                    # Utilities
│   ├── prisma.ts           # Database client
│   ├── session.ts          # Auth session config
│   └── types.ts            # TypeScript types
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed script
└── public/                 # Static assets
```

## Data Categories

| Type | Count |
|------|-------|
| Police | 30+ |
| Intelligence | 25+ |
| Defence | 20+ |
| Embassy | 35+ |
| Cyber Security | 15+ |
| Government | 15+ |
| Trade | 10+ |
| Others | 20+ |

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:seed` - Seed database with organizations
- `npm run db:studio` - Open Prisma Studio

## Environment Variables

Create a `.env` file with:

```env
DATABASE_URL="file:./dev.db"
SESSION_SECRET="your-secret-key-at-least-32-characters"
```

## License

MIT

---

*Last Updated: February 2026*
