import { describe, expect, it } from 'vitest'
import { extractDiditAssetsFromDecision } from '@/lib/storage/didit-assets-extract'
import type { DiditDecision } from '@/lib/didit-decision'

describe('extractDiditAssetsFromDecision', () => {
  it('extracts ID, liveness, and face-match media URLs', () => {
    const decision: DiditDecision = {
      session_id: 'sess-1',
      status: 'Approved',
      id_verifications: [
        {
          status: 'Approved',
          front_image: 'https://cdn.example/front.jpg?sig=1',
          back_image: 'https://cdn.example/back.jpg?sig=2',
          portrait_image: 'https://cdn.example/portrait.jpg?sig=3',
        },
      ],
      liveness_checks: [
        {
          status: 'Approved',
          reference_image: 'https://cdn.example/selfie.jpg?sig=4',
          video_url: 'https://cdn.example/liveness.mp4?sig=5',
        },
      ],
      face_matches: [
        {
          status: 'Approved',
          source_image: 'https://cdn.example/source.jpg?sig=6',
          target_image: 'https://cdn.example/target.jpg?sig=7',
        },
      ],
    }

    const assets = extractDiditAssetsFromDecision(decision)
    expect(assets.map((a) => a.documentType)).toEqual([
      'didit_id_front',
      'didit_id_back',
      'didit_id_portrait',
      'didit_liveness_selfie',
      'didit_liveness_video',
      'didit_face_source',
      'didit_face_target',
    ])
  })

  it('deduplicates identical URLs', () => {
    const url = 'https://cdn.example/same.jpg?sig=1'
    const decision: DiditDecision = {
      id_verifications: [{ front_image: url, portrait_image: url }],
    }
    const assets = extractDiditAssetsFromDecision(decision)
    expect(assets).toHaveLength(2)
  })

  it('ignores non-http values', () => {
    const decision: DiditDecision = {
      id_verifications: [{ front_image: 'not-a-url' }],
      liveness_checks: [{ reference_image: null as unknown as string }],
    }
    expect(extractDiditAssetsFromDecision(decision)).toHaveLength(0)
  })
})
