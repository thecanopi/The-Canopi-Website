# Canopi - AI-Powered Healthcare Consulting

## About

Canopi delivers AI-powered consulting solutions for healthcare organizations, driving innovation and operational excellence.

## Technology Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- Supabase (Backend)

## Getting Started

### Prerequisites

- Bun installed - [install Bun](https://bun.sh/docs/installation)

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd canopi

# Install dependencies
bun install

# Start the development server
bun run dev
```

The application will be available at `http://localhost:8080`

## Project Structure

- `src/components` - Reusable UI components
- `src/pages` - Page components
- `src/hooks` - Custom React hooks
- `src/lib` - Utility functions
- `supabase/functions` - Edge functions for backend logic

## Environment Variables

Create a `.env` file with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

## License

Proprietary - Canopi © 2024
