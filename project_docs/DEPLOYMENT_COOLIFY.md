# Coolify Deployment Guide

## Overview

This guide covers deploying the Samanaffa monorepo (web + backend) using Coolify on a Hetzner server. Coolify provides a Vercel-like experience with git-based deployments, preview branches, and automatic SSL.

## Prerequisites

- Hetzner server (Ubuntu 22.04+ recommended)
- Docker and Docker Compose installed
- Domain name (optional, for custom URLs)
- GitHub repository access

## Server Setup

### 1. Install Docker

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Install Coolify

```bash
# Install Coolify (one-liner)
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash

# Or with specific settings
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash -s -- \
  --domain your-domain.com \
  --admin-email admin@your-domain.com \
  --admin-password your-secure-password
```

### 3. Access Coolify

- Open `http://your-server-ip:8000`
- Complete initial setup
- Create an admin account

## Project Configuration

### 1. Connect GitHub Repository

1. In Coolify dashboard: **Applications** → **New Application**
2. Choose **GitHub** as source
3. Authenticate with GitHub (install Coolify GitHub App)
4. Select your repository: `samanaffa/sn_ape_clean`
5. Choose branch: `main` (or `master`)

### 2. Application Setup

Create two applications:

#### A. Web Application (Frontend)

**Basic Settings:**
- **Name**: `samanaffa-web`
- **Source**: GitHub
- **Repository**: `samanaffa/sn_ape_clean`
- **Branch**: `main`
- **Root Directory**: `/apps/web`
- **Build Command**: `bun run build`
- **Start Command**: `bun run start`
- **Port**: `3000`

**Environment Variables:**
```bash
VITE_API_URL=https://your-backend-domain.com
DATABASE_URL=postgresql://user:pass@host:5432/db
BETTER_AUTH_SECRET=your-secret-key
NEXT_PUBLIC_APP_URL=https://your-frontend-domain.com
```

#### B. Backend Application (API)

**Basic Settings:**
- **Name**: `samanaffa-backend`
- **Source**: GitHub
- **Repository**: `samanaffa/sn_ape_clean`
- **Branch**: `main`
- **Root Directory**: `/apps/backend`
- **Build Command**: `bun run build` (optional, for type checking)
- **Start Command**: `bun run src/server.ts`
- **Port**: `8787`

**Environment Variables:**
```bash
DATABASE_URL=postgresql://user:pass@host:5432/db
ADMIN_JWT_SECRET=your-jwt-secret
FRONTEND_URL=https://your-frontend-domain.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
```

### 3. Database Setup

#### Option 1: External Database (Recommended)

Use Neon, Supabase, or Railway PostgreSQL:
1. Create database instance
2. Get connection string
3. Add to both applications' environment variables

#### Option 2: Self-Hosted Database

Add a PostgreSQL service in Coolify:
1. **Services** → **New Service**
2. Choose **PostgreSQL**
3. Configure credentials
4. Connect applications to internal database

### 4. Domain Configuration

#### Automatic SSL (Coolify Managed)

1. **Domains** → **Add Domain**
2. Add your domain (e.g., `app.samanaffa.com`)
3. Coolify handles SSL automatically

#### Manual DNS Setup

If using your own domain:
```bash
# A records for frontend
app.samanaffa.com → YOUR_SERVER_IP

# A records for backend
api.samanaffa.com → YOUR_SERVER_IP
```

## Deployment Files

### docker-compose.yml (Optional)

If you prefer Docker Compose over Coolify's UI:

```yaml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://backend:8787
      - DATABASE_URL=${DATABASE_URL}
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
    depends_on:
      - backend

  backend:
    build:
      context: .
      dockerfile: apps/backend/Dockerfile
    ports:
      - "8787:8787"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - ADMIN_JWT_SECRET=${ADMIN_JWT_SECRET}
      - FRONTEND_URL=http://localhost:3000
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=samanaffa
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### Dockerfile for Web

```dockerfile
# apps/web/Dockerfile
FROM oven/bun:1-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lock ./
COPY apps/web/package.json ./apps/web/
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/
RUN bun install --frozen-lockfile

# Build application
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build:web

# Production image
FROM base AS runner
WORKDIR /app
COPY --from=builder /app/apps/web/dist ./dist
COPY --from=builder /app/apps/web/package.json ./
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3000
CMD ["bun", "run", "start"]
```

### Dockerfile for Backend

```dockerfile
# apps/backend/Dockerfile
FROM oven/bun:1-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lock ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/
RUN bun install --frozen-lockfile

# Build (type-check only)
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run --filter @samanaffa/backend type-check

# Production image
FROM base AS runner
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/src ./apps/backend/src
COPY --from=builder /app/packages/shared/src ./packages/shared/src
COPY --from=builder /app/apps/backend/package.json ./
COPY --from=builder /app/packages/shared/package.json ./packages/shared/
COPY --from=builder /app/drizzle ./drizzle

EXPOSE 8787
CMD ["bun", "run", "src/server.ts"]
```

## Deployment Workflow

### 1. Initial Deployment

1. Push changes to GitHub:
   ```bash
   git add .
   git commit -m "feat: add coolify deployment configuration"
   git push origin main
   ```

2. Coolify will automatically:
   - Detect the push
   - Build applications
   - Start containers
   - Generate URLs

### 2. Preview Deployments

Coolify automatically creates preview deployments for:
- Pull requests
- Feature branches
- Tags

Access pattern:
- `branch-name.app.samanaffa.com` (frontend)
- `branch-name.api.samanaffa.com` (backend)

### 3. Environment Management

**Production:**
```bash
# Main branch variables
DATABASE_URL=postgresql://...
ADMIN_JWT_SECRET=prod-secret
```

**Preview:**
```bash
# Preview branch variables (auto-inherited)
DATABASE_URL=postgresql://...
ADMIN_JWT_SECRET=preview-secret
```

## Monitoring & Logs

### Coolify Dashboard

1. **Applications** → Select app
2. **Logs** tab for real-time logs
3. **Metrics** for resource usage
4. **Deployments** for deployment history

### CLI Access

```bash
# SSH into server
ssh root@your-server-ip

# View running containers
docker ps

# View logs
docker logs -f container-name

# Access Coolify data
cd /data/coolify
```

## Troubleshooting

### Common Issues

#### 1. Build Failures

```bash
# Check build logs in Coolify UI
# Common fixes:
- Ensure all dependencies in package.json
- Check TypeScript compilation: bun run type-check
- Verify environment variables
```

#### 2. Database Connection

```bash
# Test connection from container
docker exec -it backend-container bunx drizzle-kit push

# Check database URL format
postgresql://user:password@host:port/database
```

#### 3. CORS Issues

```bash
# Ensure FRONTEND_URL matches deployed domain
# Check backend CORS configuration
# Verify API URL in frontend
```

#### 4. Port Conflicts

```bash
# Check port usage
netstat -tulpn | grep :3000
netstat -tulpn | grep :8787

# Update ports in Coolify if needed
```

### Health Checks

Add health check endpoints:

```typescript
// apps/backend/src/routes/health.ts
app.get('/health', async (c) => {
  try {
    // Test database
    await db.select().from(adminUsers).limit(1)
    return c.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      database: 'connected'
    })
  } catch (error) {
    return c.json({ 
      status: 'unhealthy', 
      error: error.message 
    }, 500)
  }
})
```

## Security Best Practices

### 1. Secrets Management

```bash
# Use Coolify's encrypted secrets
# Never commit secrets to git
# Rotate secrets regularly
```

### 2. Network Security

```bash
# Use internal networking for database
# Expose only necessary ports
# Configure firewall rules
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable
```

### 3. SSL/TLS

- Coolify handles SSL automatically
- Force HTTPS redirects
- Use strong ciphers

## Backup Strategy

### Database Backups

```bash
# Automated backups (Coolify can handle)
# Manual backup:
docker exec postgres-container pg_dump -U user dbname > backup.sql

# Restore:
docker exec -i postgres-container psql -U user dbname < backup.sql
```

### Application Backups

```bash
# Backup Coolify data
tar -czf coolify-backup.tar.gz /data/coolify

# Backup application data
rsync -av /data/coolify/volumes/ backup@remote-server:/backups/
```

## Performance Optimization

### 1. Container Resources

```yaml
# In Coolify UI, set resource limits:
# Web: 512MB RAM, 0.5 CPU
# Backend: 1GB RAM, 0.5 CPU
# Database: 2GB RAM, 1 CPU
```

### 2. Caching

```bash
# Enable build cache
# Use multi-stage Dockerfiles
# Cache node_modules
```

### 3. CDN Integration

```bash
# Configure CDN for static assets
# Use Cloudflare/R2 for file storage
# Enable gzip compression
```

## Migration from Vercel

### 1. DNS Migration

```bash
# Update DNS records gradually
# Lower TTL before migration
# Monitor for issues
```

### 2. Environment Variables

```bash
# Export from Vercel dashboard
# Import to Coolify
# Test in preview first
```

### 3. Database Migration

```bash
# Export from Vercel Postgres
# Import to new database
# Update connection strings
# Run drizzle migrations
```

## Cost Comparison

| Service | Monthly Cost | Notes |
|---------|-------------|-------|
| Hetzner Server | €5-20 | Depending on specs |
| Coolify | Free | Self-hosted |
| Database | $0-25 | External or self-hosted |
| Domain | $10-15/year | Optional |
| **Total** | **€5-35/month** | vs $50-200+ on Vercel |

## Support

- Coolify Discord: https://discord.gg/coolify
- Documentation: https://coolify.io/docs
- GitHub Issues: https://github.com/coollabsio/coolify

## Quick Start Checklist

- [ ] Install Docker on Hetzner server
- [ ] Install Coolify
- [ ] Connect GitHub repository
- [ ] Configure web application
- [ ] Configure backend application
- [ ] Set up database
- [ ] Configure domains
- [ ] Test deployment
- [ ] Set up monitoring
- [ ] Configure backups

---

**This deployment setup eliminates all the Vercel issues you've been fighting:**
- No ESM module resolution problems
- No serverless cold starts
- Simple environment management
- Direct database access
- Full control over the stack
