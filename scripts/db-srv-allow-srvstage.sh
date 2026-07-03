#!/usr/bin/env bash
# Run ON db-srv as awade (requires sudo password once).
# Allows srvstage (10.10.111.4) to connect to samanaffa_dev as samanaffa_dev_app.
set -euo pipefail

RULE='host samanaffa_dev samanaffa_dev_app 10.10.111.4 scram-sha-256'
HBA=/etc/postgresql/16/main/pg_hba.conf

if sudo grep -qF "$RULE" "$HBA" 2>/dev/null; then
  echo "Rule already present."
else
  echo "$RULE" | sudo tee -a "$HBA" >/dev/null
  echo "Added pg_hba rule."
fi

sudo systemctl reload postgresql
echo "PostgreSQL reloaded. Test from srvstage:"
echo '  psql "postgresql://samanaffa_dev_app:%40Devpass1@10.10.111.3:5432/samanaffa_dev?sslmode=prefer" -c "SELECT 1"'
