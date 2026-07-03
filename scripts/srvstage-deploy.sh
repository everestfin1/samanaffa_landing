#!/usr/bin/env bash
# Deploy Sama Naffa to srvstage (run ON srvstage as user awade with sudo).
# Prerequisites: deploy GitHub key, .env at /home/deploy/samanaffa-app/.env
set -euo pipefail

APP_DIR=/home/deploy/samanaffa-app
REPO=git@github.com:everestfin1/samanaffa_landing.git
BRANCH=staging

echo "==> Checking prerequisites"
if ! sudo -u deploy test -f "$APP_DIR/.env"; then
  echo "ERROR: Missing $APP_DIR/.env — upload and chown to deploy:deploy (chmod 600) first."
  exit 1
fi

if ! sudo -u deploy ssh -o BatchMode=yes -T git@github.com 2>&1 | grep -q 'successfully authenticated'; then
  echo "ERROR: deploy user cannot access GitHub — add deploy public key to repo deploy keys."
  exit 1
fi

echo "==> Clone or update repo"
if sudo -u deploy test -d "$APP_DIR/.git"; then
  sudo -u deploy bash -c "cd '$APP_DIR' && git fetch origin && git checkout '$BRANCH' && git pull origin '$BRANCH'"
else
  sudo -u deploy git clone --branch "$BRANCH" "$REPO" "$APP_DIR"
fi

echo "==> Install dependencies"
sudo -u deploy bash -c "cd '$APP_DIR' && npm ci"

echo "==> Run migrations"
sudo -u deploy bash -c "cd '$APP_DIR' && npm run db:migrate"

echo "==> Build"
sudo -u deploy bash -c "cd '$APP_DIR' && npm run build"

echo "==> PM2"
sudo -u deploy mkdir -p "$APP_DIR/logs"
sudo -u deploy bash -c "cd '$APP_DIR' && pm2 delete samanaffa-app 2>/dev/null || true"
sudo -u deploy bash -c "cd '$APP_DIR' && pm2 start ecosystem.config.cjs"
sudo -u deploy pm2 save

echo "==> Smoke"
sleep 3
curl -sf -o /dev/null http://127.0.0.1:3000/ && echo "OK: app responds on :3000" || echo "WARN: :3000 not responding yet"
curl -sk -o /dev/null -w "nginx: %{http_code}\n" https://127.0.0.1/ -H "Host: staging.samanaffa.com"

echo "==> Done. Test from Mac (VPN + /etc/hosts): https://staging.samanaffa.com"
