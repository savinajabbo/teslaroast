import { NextResponse } from 'next/server';

export async function GET() {
    const clientId = process.env.TESLA_CLIENT_ID!;
    const redirectUri = process.env.TESLA_REDIRECT_URI!;
    const state = 'random123';

    const teslaAuthUrl = `https://auth.tesla.com/oauth2/v3/authorize` +
      `?client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=openid user_data offline_access` +
      `&state=${state}`;

    return NextResponse.redirect(teslaAuthUrl);
} 