import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8787'
    const res = await fetch(`${backendUrl}/api/payments/intouch/config`, {
      method: 'GET',
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    })

    const body = await res.text()
    return new NextResponse(body, {
      status: res.status,
      headers: {
        'content-type': res.headers.get('content-type') || 'application/json',
      },
    })
  } catch (error) {
    console.error('Error fetching Intouch config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Intouch configuration' },
      { status: 500 }
    );
  }
}
