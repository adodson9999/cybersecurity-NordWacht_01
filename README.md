# Zander Services AI Consultancy Platform

Welcome to the Zander Services AI Consultancy Platform repository. This project is a robust, serverless application built to power a specialized cybersecurity and AI consultancy platform. It includes a high-performance landing page, a custom 24/7 scheduling engine, a lead management CRM, and an automated content publishing system, all while adhering to a strict "no-auth" headless admin workflow.

## 🚀 Tech Stack

This project leverages modern web technologies for a highly performant and SEO/GEO-optimized experience:

### Frontend
- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/), `lucide-react` for icons, `clsx` & `tailwind-merge`
- **Language:** [TypeScript](https://www.typescriptlang.org/)

### Backend & Infrastructure
- **Database & Services:** [Supabase](https://supabase.com/) (Serverless Postgres, Edge Functions)
- **Architecture:** Serverless API routes

## 🛠️ Getting Started

### Prerequisites
Make sure you have Node.js and npm (or pnpm/yarn) installed on your system.
You will also need a Supabase project set up for the backend functionalities.

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Ensure you have your `.env` file configured. You will need your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   # Add any other required environment variables
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

- `/app`: Next.js App Router pages and API routes.
- `/components`: Reusable UI components (e.g., ROI calculator, scheduling widget).
- `/public`: Static assets.

## ⚙️ Key Features
- **High-Performance Landing Page:** Optimized for speed and GEO/SEO discoverability.
- **24/7 Scheduling Engine:** Custom-built scheduling workflows.
- **Lead Management CRM:** Integrated directly with the Supabase backend.
- **Headless Admin Workflow:** "No-auth" operations for streamlined administrative tasks.

## 📝 Scripts

- `npm run dev`: Starts the development server with Turbopack.
- `npm run build`: Builds the app for production.
- `npm run start`: Runs the built app in production mode.
- `npm run lint`: Runs Next.js ESLint configuration.
