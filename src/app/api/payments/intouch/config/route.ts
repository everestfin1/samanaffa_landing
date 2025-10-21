import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Determine if we're in test environment
    const isTestEnvironment = process.env.NODE_ENV !== 'production';
    
    // Use test credentials if in test environment, otherwise use production
    const apiKey = isTestEnvironment 
      ? process.env.INTOUCH_TEST_API_KEY 
      : process.env.INTOUCH_API_KEY;

    if (!apiKey) {
      const missingVar = isTestEnvironment ? 'INTOUCH_TEST_API_KEY' : 'INTOUCH_API_KEY';
      console.error(`${missingVar} not found in environment variables`);
      return NextResponse.json(
        { error: `Intouch API key not configured (${missingVar})` },
        { status: 500 }
      );
    }

    console.log(`[InTouch Config] Using ${isTestEnvironment ? 'TEST' : 'PRODUCTION'} credentials`);

    return NextResponse.json({
      apiKey: apiKey,
      environment: isTestEnvironment ? 'test' : 'production',
    });
  } catch (error) {
    console.error('Error fetching Intouch config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Intouch configuration' },
      { status: 500 }
    );
  }
}
