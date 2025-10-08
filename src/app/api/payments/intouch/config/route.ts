import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.INTOUCH_API_KEY;

    if (!apiKey) {
      console.error('INTOUCH_API_KEY not found in environment variables');
      return NextResponse.json(
        { error: 'Intouch API key not configured' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      apiKey: apiKey,
    });
  } catch (error) {
    console.error('Error fetching Intouch config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Intouch configuration' },
      { status: 500 }
    );
  }
}
