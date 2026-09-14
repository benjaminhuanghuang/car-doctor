# Deployment

## Web

Static Site at <https://dashboard.render.com/static/srv-d6aep575r7bs73922ct0>

URL: <https://car-doctor-web.onrender.com>

### Settings

- Root Directory: blank (Render will run command at root)
- Build Command: pnpm exec turbo run build --filter=car-doctor-web
- Publish Directory: apps/web/dist

### Environment

- VITE_API_URL: `https://car-doctor-vcgx.onrender.com/api`

### Deploy

Manual Deploy -> Deploy latest commit

## Backend

Web Service at <https://dashboard.render.com/web/srv-d6aebkq4d50c73c08gh0>

URL: <https://car-doctor-vcgx.onrender.com>

### Settings

- Root Directory: blank (Render will run command at root)
- Build Command: pnpm exec turbo run build --filter=@car-doctor/backend
- Start Command: pnpm --filter @car-doctor/backend start

### Environment

MONGODB_URI:
JWT_EXPIRES_IN:
JWT_SECRET:
