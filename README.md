# Instagram Agent with A/B Testing

AI-powered Instagram content generator with A/B testing capabilities.

## Live Demo

**[https://homework-instagram-agent-frontend.vercel.app](https://homework-instagram-agent-frontend.vercel.app)**

## Quick Start

1. Clone repository
2. Copy `.env.example` to `.env` and add API keys on both apps `backend` and `frontend`
3. Run `npm run docker:dev`
4. Open http://localhost:3000

## Features

- AI content generation (OpenAI/Gemini)
- A/B testing with two variants
- User authentication (optional)
- Content history tracking
- Responsive design

## Tech Stack

**Frontend:** Next.js 15.4.5, TypeScript, Tailwind CSS, React Hook Form + Zod  
**Backend:** NestJS, Prisma, PostgreSQL, JWT  
**Deploy:** Vercel (frontend), Railway (backend)

## Development

### Docker (Recommended)

```bash
npm run docker:dev        # Start all services
npm run docker:dev:down   # Stop services
npm run docker:dev:reset  # Reset database
```

### Local Setup

```bash
npm install
cd apps/backend && npx prisma migrate dev
cd apps/frontend && npm run dev  # Terminal 1
cd apps/backend && npm run start:dev  # Terminal 2
```

## API Endpoints

- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `POST /api/generate` - Generate AI content
- `POST /api/select` - Select preferred option
- `GET /api/history` - User content history

## Environment Variables

**Backend (.env):**

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/instagram_agent"
JWT_SECRET="your-secret"
OPENAI_API_KEY="your-key"
GEMINI_API_KEY="your-key"
```

**Frontend (.env):**

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

## Deployment

**Railway:** Connect repo, set `apps/backend`, set env vars, deploy backend  
**Vercel:** Connect repo, set `apps/frontend` as root, deploy frontend
