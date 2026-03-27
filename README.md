# Key Crawl Frontend

A React frontend for keyword tracking and news scraping.

## Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS v4** with shadcn/ui components
- **TanStack Query** for data fetching
- **react-router-dom** for routing

## Development

```bash
# Install dependencies
bun install

# Start dev server
bun dev

# Build for production
bun build

# Type check
bun typecheck

# Lint
bun lint

# Format
bun format
```

## Environment Variables

Create a `.env` file (see `.env.example`):

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

## Docker

### Using Docker Compose

```bash
# Build and run (reads from .env)
docker compose up --build

# Run in background
docker compose up -d
```

App will be available at `http://localhost:3000`.

### Using Docker directly

```bash
# Build with custom API URLs
docker build \
  --build-arg VITE_API_URL=https://api.example.com \
  --build-arg VITE_WS_URL=wss://api.example.com \
  -t key-crawl-fe .

# Run
docker run -p 3000:80 key-crawl-fe
```

**Note:** Environment variables are embedded at build time by Vite, so they must be passed as build arguments.

## Adding shadcn Components

```bash
bunx shadcn@latest add <component-name>
```

Components are placed in `src/components/ui/`. Import with:

```tsx
import { Button } from "@/components/ui/button"
```

## Project Structure

See `CLAUDE.md` for architecture details and coding conventions.