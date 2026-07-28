# Cloudflare R2 — mandate signatures

Electronic signatures from onboarding step **E8** are stored as PNG files in **Cloudflare R2** (S3-compatible API). The `users.signature` column holds an object reference (`minio://signatures/{userId}/mandate.png`), not the raw image bytes.

Local dev without R2 falls back to inline `data:image/png;base64,...` in Postgres.

---

## 1. Create the R2 bucket

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → **R2** → **Create bucket**
2. Name: `samanaffa-signatures` (or your choice — set `S3_BUCKET_SIGNATURES` to match)
3. Location: pick closest to your app server (e.g. Western Europe)

---

## 2. Create an API token

1. R2 → **Manage R2 API tokens** → **Create API token**
2. Permissions: **Object Read & Write** on the signatures bucket (or all buckets in the account)
3. Copy **Access Key ID** and **Secret Access Key** (shown once)

---

## 3. Get your account ID

R2 overview page → **Account ID** (32-char hex).

S3 API endpoint:

```text
https://<ACCOUNT_ID>.r2.cloudflarestorage.com
```

**Do not** append the bucket name to `S3_ENDPOINT` — the bucket is set separately via `S3_BUCKET_SIGNATURES`.

```bash
# ✅ Correct
S3_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
S3_BUCKET_SIGNATURES=samanaffa-signatures

# ❌ Wrong — bucket must not be in the endpoint URL
S3_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com/samanaffa-signatures
```

---

## 4. Environment variables

Add to `.env.local` (dev) and your deployment host (staging/production):

```bash
# Cloudflare R2 (S3-compatible)
S3_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
S3_ACCESS_KEY=<R2_ACCESS_KEY_ID>
S3_SECRET_KEY=<R2_SECRET_ACCESS_KEY>
S3_REGION=auto
S3_BUCKET_SIGNATURES=samanaffa-signatures

# R2: virtual-hosted style (default for Cloudflare)
S3_FORCE_PATH_STYLE=false

# Optional — presigned URL TTL for admin retrieval (seconds, default 900)
S3_SIGNED_URL_TTL_SECONDS=900
```

If you already use R2/MinIO for Didit KYC assets, **reuse the same** `S3_ENDPOINT`, `S3_ACCESS_KEY`, and `S3_SECRET_KEY` — only add `S3_BUCKET_SIGNATURES`.

| Variable | Required | Description |
|----------|----------|-------------|
| `S3_ENDPOINT` | Yes | `https://<account_id>.r2.cloudflarestorage.com` |
| `S3_ACCESS_KEY` | Yes | R2 API token access key |
| `S3_SECRET_KEY` | Yes | R2 API token secret |
| `S3_BUCKET_SIGNATURES` | Yes | Bucket name for mandate PNGs |
| `S3_REGION` | No | Use `auto` for R2 (default) |
| `S3_FORCE_PATH_STYLE` | No | `false` for R2; `true` for local MinIO |
| `S3_SIGNED_URL_TTL_SECONDS` | No | Presigned GET expiry (default `900`) |

**Production:** `S3_BUCKET_SIGNATURES` must be set — the mandate API returns `503` if missing in production.

---

## 5. Local MinIO (optional)

```bash
docker compose -f docker-compose.minio.yml up -d
```

```bash
S3_ENDPOINT=http://127.0.0.1:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET_SIGNATURES=samanaffa-signatures
S3_FORCE_PATH_STYLE=true
```

---

## 6. Verify

```bash
npm run storage:smoke-signatures
```

---

## Storage layout

| Object key | Content |
|------------|---------|
| `signatures/{userId}/mandate.png` | PNG from E8 `SignaturePad` |

DB value: `minio://signatures/{userId}/mandate.png`

---

## Code references

| File | Role |
|------|------|
| `src/lib/storage/signatures.ts` | Upload + presigned URL helper |
| `src/app/api/onboarding/mandate/route.ts` | E8 POST handler |
| `src/lib/signature.ts` | Validation (`isPersistedSignature`) |
