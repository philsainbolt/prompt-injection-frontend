# Prompt Injection Frontend

Frontend for the Prompt Injection Learning App. Built with React, Vite, and TailwindCSS.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and configure:
   ```
   cp .env.example .env
   ```

3. Start the development server:
   ```
   npm run dev
   ```

The app will be available at `http://localhost:5173`

## Building

```
npm run build
```

## Testing

```
npm test
```

## Project Structure

- `/src/components` - Reusable React components
- `/src/pages` - Page components (Landing, Dashboard, ChallengePage, ProfilePage)
- `/src/services` - API service module
- `/src/hooks` - Custom React hooks
- `/src/context` - React context for auth state
- `/__tests__` - Test files

## Features

- User authentication (login/signup)
- Challenge listing and viewing
- Prompt injection submission
- User profile management
- Protected routes
