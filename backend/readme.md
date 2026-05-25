# Blog Application Backend

Node.js + Express API for a multi-role blog platform.

## Run Modes

- Development: `npm run dev`
- Production: `npm start`

## Environment Setup

1. Copy `.env.example` to `.env`
2. Fill required variables:

```
PORT=5000
DB_URL=your_mongodb_connection_string
JWT_SECRET=your_strong_random_secret
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
CORS_ORIGINS=http://localhost:5173
TRUST_PROXY=false

CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

### Notes

- `CORS_ORIGINS` supports comma-separated values for multiple frontend domains.
- In production (`NODE_ENV=production`), auth cookies are sent as `Secure` + `SameSite=None`.
- If behind a reverse proxy (Render, Nginx, Azure, etc.), set `TRUST_PROXY=true`.

## Health Endpoint

- `GET /health` returns `200` when service is up.

## Deploy Checklist

- Use managed MongoDB URI in `DB_URL`
- Set strong `JWT_SECRET`
- Set production frontend origin(s) in `CORS_ORIGINS`
- Set `NODE_ENV=production`
- Add HTTPS at hosting/proxy level
