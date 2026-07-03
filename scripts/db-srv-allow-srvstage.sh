#!/usr/bin/env bash
# Run ON db-srv as awade (requires sudo password once).
# Allows srvstage (10.10.111.4) to connect to samanaffa_dev as samanaffa_dev_app.
set -euo pipefail

RULE_HOST='host samanaffa_dev samanaffa_dev_app 10.10.111.4 scram-sha-256'
RULE_SSL='hostssl samanaffa_dev samanaffa_dev_app 10.10.111.4 scram-sha-256'
HBA=/etc/postgresql/16/main/pg_hba.conf

for RULE in "$RULE_HOST" "$RULE_SSL"; do
  if sudo grep -qF "$RULE" "$HBA" 2>/dev/null; then
    echo "Already present: $RULE"
  else
    echo "$RULE" | sudo tee -a "$HBA" >/dev/null
    echo "Added: $RULE"
  fi
done

sudo systemctl reload postgresql
echo "PostgreSQL reloaded. Test from srvstage:"
echo '  psql "postgresql://samanaffa_dev_app:%40Devpass1@10.10.111.3:5432/samanaffa_dev?sslmode=disable" -c "SELECT 1"'
