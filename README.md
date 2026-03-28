# You Shall Not Inject — Frontend UI

A modern, responsive React application for learning prompt injection defense through interactive challenges. Built with React, Vite, Axios, and Playwright E2E testing.

## Overview

This frontend provides an engaging, user-friendly interface for progressing through five prompt injection challenges. Users authenticate, view challenge descriptions, submit answers, track their progress, and unlock hints as they advance.

## Features

- **User Authentication** — Signup and login with persistent JWT session storage
- **Dynamic Challenge View** — Responsive challenge cards with level progression
- **Answer Submission** — Real-time feedback on correct/incorrect submissions
- **Progress Tracking** — Dashboard showing level completion and hint usage
- **Responsive Design** — Mobile-first CSS with full desktop support
- **E2E Test Coverage** — Automated Playwright tests for all user flows
- **Error Handling** — User-friendly error messages and 401 logout redirect

## Tech Stack

- **Framework:** React 18+ with Vite
- **HTTP Client:** Axios with interceptors for auth + errors
- **CSS:** CSS3 (flexbox, grid, media queries)
- **Testing:** Playwright (automated E2E)
- **Build:** Vite (dev server + production bundle)
- **Environment:** .env configuration

## Getting Started

### Prerequisites

- Node.js v18+
- Backend API running on `http://localhost:3000` (or configured in .env)
- npm or yarn package manager

### Installation

```bash
cd frontend
npm install
```

### Environment Setup

Create a `.env` file in the `frontend/` directory:

```env
# Backend API
VITE_API_BASE_URL=http://localhost:3000

# Frontend Port (optional, defaults to 5173)
VITE_PORT=5173
```

Copy `.env.example` to `.env` and update as needed.

### Running the Development Server

```bash
npm run dev
```

Opens on `http://localhost:5173` by default. The dev server hot-reloads on file changes.

### Building for Production

```bash
npm run build
```

Creates an optimized production bundle in `dist/`.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── LoginForm.jsx       # Signup/login component
│   │   ├── ChallengeCard.jsx   # Single challenge display
│   │   ├── ChallengeList.jsx   # Challenge grid/list
│   │   ├── SubmissionForm.jsx  # Answer submission
│   │   ├── ProgressBar.jsx     # Level & hint progress
│   │   ├── Dashboard.jsx       # Main authenticated view
│   │   └── NotFound.jsx        # 404 fallback
│   ├── services/
│   │   └── api.js              # Axios instance + request/response interceptors
│   ├── hooks/
│   │   └── useAuth.js          # Auth context + token management
│   ├── App.jsx                 # Main router & layout
│   ├── App.css                 # Global styles
│   └── main.jsx                # Entry point
├── e2e/
│   └── app.e2e.spec.js         # Playwright test suite
├── public/
│   └── (static assets if any)
├── .env.example
├── .env
├── .gitignore
├── vite.config.js              # Vite configuration
├── playwright.config.js         # Playwright test config
├── vitest.config.js            # Unit test config (if applicable)
├── package.json
└── README.md
```

## Components

### LoginForm
Handles signup and login. Stores JWT token in localStorage for session persistence.

**Props:** `onLoginSuccess` callback

**State:**
- `email`, `password`
- `isLogin` (toggle between signup/login modes)
- `loading`, `error`

### ChallengeCard
Displays a single challenge with title, description, and submission form.

**Props:**
- `challenge` (object)
- `onSubmitSuccess` callback
- `isCompleted` (boolean)

### ChallengeList
Renders all challenges as a grid. Shows "Locked" state for challenges not yet unlocked.

**Props:**
- `challenges` (array)
- `userProgress` (object)
- `onChallengeSelect` callback

### SubmissionForm
Input field and submit button for challenge answers.

**Props:**
- `challengeId`
- `onSuccess` callback
- `onError` callback

### Dashboard
Main authenticated view combining progress bar, challenge list, and selected challenge.

**Props:** None (uses auth context and API calls)

### ProgressBar
Shows current level (X of 5) and hints remaining (X of 3).

**Props:**
- `currentLevel`
- `hintsUsed`

## Authentication Flow

1. **Signup/Login** — User enters email/password, backend returns JWT token
2. **Store Token** — Token saved in localStorage under key `auth_token`
3. **Set Headers** — Axios interceptor adds `Authorization: Bearer <token>` to all requests
4. **Verify Session** — On app load, frontend checks if token exists and is valid
5. **Logout** — Clear token from localStorage, redirect to login
6. **401 Handling** — If token expires, axios interceptor logs user out automatically

### Token Storage

```javascript
// In api.js (axios interceptor)
const token = localStorage.getItem('auth_token');
if (token) {
  config.headers['Authorization'] = `Bearer ${token}`;
}

// On 401 response
if (error.response.status === 401) {
  localStorage.removeItem('auth_token');
  window.location.href = '/login';
}
```

## API Integration

All API calls use Axios with centralized configuration in `src/services/api.js`.

### Example: Submit Challenge Answer

```javascript
import { api } from './services/api';

const submitAnswer = async (challengeId, userPrompt) => {
  try {
    const response = await api.post('/api/submissions', {
      challengeId,
      userPrompt
    });
    // response.data = { success: true, message: "...", nextTechniqueHint: "..." }
    return response.data;
  } catch (error) {
    console.error('Submission failed:', error);
    throw error;
  }
};
```

### Example: Get All Challenges

```javascript
const fetchChallenges = async () => {
  const response = await api.get('/api/challenges');
  return response.data; // Array of challenges
};
```

## Testing

### E2E Tests with Playwright

Test suite in `e2e/app.e2e.spec.js` covers:

1. **Landing & Auth** — Load app, signup/login flow
2. **Challenge Navigation** — View challenges, check locked state
3. **Submission Flow** — Submit correct answer, verify success message
4. **Failure Handling** — Submit incorrect answer, see error feedback
5. **Progress Display** — Verify progress bar updates after challenge completion

#### Run E2E Tests

```bash
# Requires backend running on localhost:3000 with E2E_MODE=true
npm run e2e
```

Tests run headless by default. To see browser UI:

```bash
npx playwright test --headed
```

To debug a single test:

```bash
npx playwright test e2e/app.e2e.spec.js -g "should complete challenge flow"
```

#### Playwright Configuration

See `playwright.config.js`:
- baseURL: `http://localhost:5173`
- Headless mode enabled
- Screenshots on failure
- 30-second timeout per test
- Auto-start backend dev server (via webServer config)

## Styling Strategy

All styling is in `src/App.css` using vanilla CSS3:

- **Flexbox** for layout and navigation
- **Grid** for challenge card layouts
- **Media queries** for responsive design (breakpoints: 768px, 1024px)
- **CSS variables** for consistent theming (colors, spacing, fonts)

### Key CSS Classes

- `.app` — Main container
- `.auth-form` — Login/signup form
- `.challenge-card` — Individual challenge box
- `.challenge-grid` — Responsive grid of challenges
- `.progress-bar` — User progress display
- `.submission-form` — Answer input + submit button
- `.locked` — Styling for locked challenges
- `.success` — Success message styling
- `.error` — Error message styling

### Responsive Design

```css
/* Mobile first */
.challenge-grid {
  display: grid;
  grid-template-columns: 1fr;
}

/* Tablet and up */
@media (min-width: 768px) {
  .challenge-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .challenge-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## Error Handling

### API Errors

Axios interceptor catches all HTTP errors and displays user-friendly messages:

```javascript
response.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    // Show user-friendly error message
    console.error(error.response?.data?.error || 'Request failed');
    throw error;
  }
);
```

### Form Validation

- Email format checked before submit (regex)
- Password must be 6+ characters
- Empty fields show inline error messages
- Backend validation enforced server-side (defense in depth)

## Key Design Decisions

### Why Vite?

Fast local development with hot module replacement (HMR). Significantly faster than Create React App.

### Why Axios Over Fetch?

Axios provides:
- Built-in request/response interceptors (perfect for auth)
- Timeout handling
- Request cancellation
- Cleaner syntax for error handling

### Why localStorage for JWT?

Pros:
- Simple, no backend session store needed
- Works across page refreshes
- Shared context across browser tabs

Trade-off:
- Vulnerable to XSS if your app is compromised, but not worse than HttpOnly cookies on a malicious site

For this learning app, localStorage is appropriate.

### Why Progressive Component Structure?

Components are small and single-purpose:
- Easy to test independently
- Reusable across views
- Clear data flow (props down, callbacks up)
- Low coupling between components

## Deployment

See the main project README for full deployment steps. Frontend can be hosted on any static file server or Node.js app.

### Netlify (Recommended)

```bash
npm run build
# Deploy the dist/ folder to Netlify
```

### Vercel

```bash
npm run build
vercel deploy
```

### Docker

```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000` |
| `VITE_PORT` | Dev server port | `5173` |

## Troubleshooting

### Port Already in Use
```bash
# Change Vite port in vite.config.js
export default {
  server: {
    port: 5174
  }
}
```

### CORS Errors
Ensure backend is running and `VITE_API_BASE_URL` matches. Backend should have CORS enabled:
```javascript
// backend/src/server.js
app.use(cors()); // Allow all origins in dev
```

### 401 on Every Request
- Check token is saved in localStorage after login
- Verify backend JWT_SECRET matches
- Check backend is running on correct port

### E2E Tests Fail
- Backend must be running with `E2E_MODE=true`
- Frontend dev server must be on `http://localhost:5173`
- Check `playwright.config.js` webServer config points to correct ports

## Contributing

Submit feature requests or bug reports via GitHub Issues. Pull requests welcome!

## License

MIT License — See LICENSE file in the project root.

## Support

Questions? Check the main project README or open an issue on GitHub.
