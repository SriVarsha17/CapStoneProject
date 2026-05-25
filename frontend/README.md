# Blog Application Frontend

React + Vite frontend for the blog application.

## Run Modes

- Development: `npm run dev`
- Production build: `npm run build`
- Preview production build: `npm run preview`

## Environment Setup

1. Copy `.env.example` to `.env`
2. Set backend API base URL:

```
VITE_API_BASE_URL=http://localhost:5000
```

In production, set it to your deployed backend URL (for example `https://api.example.com`).

## Deploy Checklist

- Build with `npm run build`
- Host the generated `dist/` folder on your static hosting platform
- Ensure backend CORS allows this frontend domain
- Ensure frontend and backend both use HTTPS in production
