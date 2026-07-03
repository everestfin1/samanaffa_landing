# Sama Naffa BullMQ worker

Background job processor for srvstage (`10.10.111.4`). Uses the same Redis instance as the app.

## Setup on srvstage

```bash
cd /home/deploy/samanaffa-worker
git pull   # or sync from monorepo worker/ directory
npm install
REDIS_URL=redis://127.0.0.1:6379 npm start
```

## PM2

The root `ecosystem.config.cjs` includes a `samanaffa-worker` entry. After first deploy:

```bash
pm2 start ecosystem.config.cjs --only samanaffa-worker
```

## Jobs (stubs)

| Job name | Purpose |
|----------|---------|
| `ping` | Health check |
| `email.send` | Async email dispatch (wire to nodemailer later) |

Enqueue from the Next.js app once a shared Redis client helper is added.
