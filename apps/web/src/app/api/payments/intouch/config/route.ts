import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Determine if we're in test environment
    // Check NEXT_PUBLIC_APP_ENV and VERCEL_ENV first, fallback to NODE_ENV
    const isTestEnvironment = 
      process.env.NEXT_PUBLIC_APP_ENV === 'development' ||
      process.env.NEXT_PUBLIC_APP_ENV === 'test' ||
      process.env.VERCEL_ENV === 'development' ||
      process.env.VERCEL_ENV === 'preview' ||
      (!process.env.NEXT_PUBLIC_APP_ENV && process.env.NODE_ENV !== 'production');
    
    // Use test credentials if in test environment, otherwise use production
    const apiKey = isTestEnvironment 
      ? process.env.INTOUCH_TEST_API_KEY 
      : process.env.INTOUCH_API_KEY;

    const merchantId = isTestEnvironment
      ? process.env.INTOUCH_TEST_MERCHANT_ID
      : process.env.INTOUCH_MERCHANT_ID;

    const domain = isTestEnvironment
      ? (process.env.INTOUCH_TEST_DOMAIN || 'dev.samanaffa.com')
      : (process.env.INTOUCH_DOMAIN || 'samanaffa.com');

    if (!apiKey) {
      const missingVar = isTestEnvironment ? 'INTOUCH_TEST_API_KEY' : 'INTOUCH_API_KEY';
      console.error(`${missingVar} not found in environment variables`);
      console.error(`Environment check: NEXT_PUBLIC_APP_ENV=${process.env.NEXT_PUBLIC_APP_ENV}, VERCEL_ENV=${process.env.VERCEL_ENV}, NODE_ENV=${process.env.NODE_ENV}`);
      return NextResponse.json(
        { error: `Intouch API key not configured (${missingVar})` },
        { status: 500 }
      );
    }

    if (!merchantId) {
      const missingVar = isTestEnvironment ? 'INTOUCH_TEST_MERCHANT_ID' : 'INTOUCH_MERCHANT_ID';
      console.error(`${missingVar} not found in environment variables`);
      return NextResponse.json(
        { error: `Intouch merchant ID not configured (${missingVar})` },
        { status: 500 }
      );
    }

    console.log(`[InTouch Config] Using ${isTestEnvironment ? 'TEST' : 'PRODUCTION'} credentials`);

    return NextResponse.json({
      apiKey,
      merchantId,
      domain,
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
