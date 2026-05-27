# Tesla Invest 🚗⚡

A full-featured Tesla Investment & Car Platform built with React + Vite.

## Features

- 🏠 Home, Models, Investment, About & Contact pages
- 🔐 User authentication (register / login) with localStorage persistence
- 🛒 Car ordering & payment flow
- 📊 User dashboard with investment tracking
- 🛡️ Admin panel for managing orders, payments & users
- 📱 Fully responsive design

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9+ (comes with Node)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/tesla-invest.git
cd tesla-invest

# 2. Set up environment variables
cp .env.example .env
# Then edit .env and set your admin username & password

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev
```

The app will open at **http://localhost:3000**.

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=your_secure_password_here
```

> ⚠️ **Never commit `.env` to Git.** It is already listed in `.gitignore`.  
> The `.env.example` file (with placeholder values) is safe to commit.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Project Structure

```
tesla-invest/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx        # Main application (all components)
│   └── main.jsx       # React DOM entry point
├── .env               # Your local secrets (gitignored)
├── .env.example       # Template for env vars (safe to commit)
├── index.html
├── vite.config.js
├── package.json
├── eslint.config.js
└── .gitignore
```

## Database / Storage

> **This app uses the browser's `localStorage` as its data store — there is no SQL or external database connected.**

All users, orders, investments, and payments are saved in the visitor's browser. This means:

- ✅ Zero setup — works instantly with no backend
- ✅ Great for demos and prototyping
- ❌ Data is per-browser and per-device (not shared across users or devices)
- ❌ Clearing browser data wipes all records

### Want a real database?

If you need persistent, shared data you can migrate to a backend. Recommended options:

| Option | Stack | Good for |
|--------|-------|----------|
| **Supabase** | PostgreSQL + REST/Realtime | Full SQL, free tier, easy auth |
| **Firebase** | NoSQL (Firestore) | Fast setup, Google ecosystem |
| **PlanetScale** | MySQL serverless | Scalable SQL, branching |
| **MongoDB Atlas** | NoSQL | Flexible schema, free tier |

The app's data functions (`getUsers`, `saveUsers`, `dbLogin`, `dbRegister`) are isolated and can be swapped for API calls without changing any UI code.

## Deployment

### Vercel (recommended)
```bash
npm i -g vercel
vercel
# Set VITE_ADMIN_USERNAME and VITE_ADMIN_PASSWORD in the Vercel dashboard
```

### Netlify
```bash
npm run build
# Drag & drop the dist/ folder at netlify.com/drop
# Set env vars under Site Settings → Environment Variables
```

## Tech Stack

- [React 18](https://react.dev/)
- [Vite 5](https://vitejs.dev/)
- localStorage for data persistence

## License

MIT
