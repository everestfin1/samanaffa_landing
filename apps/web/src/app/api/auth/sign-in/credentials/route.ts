import { NextRequest } from 'next/server'
import { POST as loginPOST } from '../../login/route'

export async function POST(request: NextRequest) {
  // Compatibility endpoint for AuthProvider: delegates to existing /api/auth/login
  return loginPOST(request)
}
