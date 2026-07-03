-- KYC document sovereign storage metadata (Didit → MinIO rapatriement)
ALTER TABLE "kyc_documents" ADD COLUMN IF NOT EXISTS "storageKey" text;
ALTER TABLE "kyc_documents" ADD COLUMN IF NOT EXISTS "source" text;
ALTER TABLE "kyc_documents" ADD COLUMN IF NOT EXISTS "diditSessionId" text;
ALTER TABLE "kyc_documents" ADD COLUMN IF NOT EXISTS "contentHash" text;

CREATE INDEX IF NOT EXISTS "kyc_documents_didit_session_idx"
  ON "kyc_documents" ("diditSessionId")
  WHERE "diditSessionId" IS NOT NULL;
