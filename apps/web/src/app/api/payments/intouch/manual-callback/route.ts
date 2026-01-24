import { NextRequest, NextResponse } from 'next/server';
 

/**
 * Manual Callback Endpoint
 * 
 * This endpoint processes payment information from redirect URL parameters
 * when InTouch callbacks are not being received. It's a fallback mechanism
 * to ensure payments are processed even if server-to-server callbacks fail.
 * 
 * This should only be used as a temporary solution until InTouch properly
 * configures their callback system.
 */

export async function POST(request: NextRequest) {
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8787'
    const body = await request.text()
    const res = await fetch(`${backendUrl}/api/payments/intouch/manual-callback`, {
      method: 'POST',
      headers: {
        'content-type': request.headers.get('content-type') || 'application/json',
        cookie: request.headers.get('cookie') || '',
      },
      body,
    })

    const responseBody = await res.text()
    return new NextResponse(responseBody, {
      status: res.status,
      headers: {
        'content-type': res.headers.get('content-type') || 'application/json',
      },
    })

  } catch (error) {
    console.error('[Manual Callback] Error processing manual callback:', error);
    
    const failureMessage = error instanceof Error ? error.message : 'Internal server error';

    if (failureMessage === 'INTENT_NOT_FOUND') {
      return NextResponse.json({ error: 'Transaction intent not found' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Internal server error', details: failureMessage },
      { status: 500 }
    );
  }
}



