/**
 * Extract downloadable media URLs from a Didit session decision.
 * @see https://docs.didit.me/reference/data-models
 */

import type { DiditDecision } from '@/lib/didit-decision'

export interface DiditAssetCandidate {
  documentType: string
  fileName: string
  url: string
}

const ID_IMAGE_FIELDS: Array<{ field: string; documentType: string; fileName: string }> = [
  { field: 'front_image', documentType: 'didit_id_front', fileName: 'id-front.jpg' },
  { field: 'back_image', documentType: 'didit_id_back', fileName: 'id-back.jpg' },
  { field: 'portrait_image', documentType: 'didit_id_portrait', fileName: 'id-portrait.jpg' },
  { field: 'full_front_image', documentType: 'didit_id_full_front', fileName: 'id-full-front.jpg' },
  { field: 'full_back_image', documentType: 'didit_id_full_back', fileName: 'id-full-back.jpg' },
]

function pushUrl(
  out: DiditAssetCandidate[],
  seen: Set<string>,
  documentType: string,
  fileName: string,
  url: unknown,
): void {
  if (typeof url !== 'string' || !url.startsWith('http')) return
  const dedupeKey = `${documentType}:${url}`
  if (seen.has(dedupeKey)) return
  seen.add(dedupeKey)
  out.push({ documentType, fileName, url })
}

export function extractDiditAssetsFromDecision(decision: DiditDecision): DiditAssetCandidate[] {
  const out: DiditAssetCandidate[] = []
  const seen = new Set<string>()

  for (const idVerification of decision.id_verifications ?? []) {
    const record = idVerification as Record<string, unknown>
    for (const { field, documentType, fileName } of ID_IMAGE_FIELDS) {
      pushUrl(out, seen, documentType, fileName, record[field])
    }
  }

  for (const [index, liveness] of (decision.liveness_checks ?? []).entries()) {
    const record = liveness as Record<string, unknown>
    const suffix = index > 0 ? `-${index + 1}` : ''
    pushUrl(
      out,
      seen,
      `didit_liveness_selfie${suffix}`,
      `liveness-selfie${suffix}.jpg`,
      record.reference_image,
    )
    pushUrl(
      out,
      seen,
      `didit_liveness_video${suffix}`,
      `liveness-video${suffix}.mp4`,
      record.video_url,
    )
  }

  for (const [index, faceMatch] of (decision.face_matches ?? []).entries()) {
    const record = faceMatch as Record<string, unknown>
    const suffix = index > 0 ? `-${index + 1}` : ''
    pushUrl(
      out,
      seen,
      `didit_face_source${suffix}`,
      `face-source${suffix}.jpg`,
      record.source_image,
    )
    pushUrl(
      out,
      seen,
      `didit_face_target${suffix}`,
      `face-target${suffix}.jpg`,
      record.target_image,
    )
  }

  return out
}
