import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/app/supabase';

const HOST = 'https://fleet-api.prd.na.vn.cloud.tesla.com';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    const tokenRes = await fetch('https://auth.tesla.com/oauth2/v3/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            grant_type: 'authorization_code',
            client_id: process.env.TESLA_CLIENT_ID,
            client_secret: process.env.TESLA_CLIENT_SECRET,
            redirect_uri: process.env.TESLA_REDIRECT_URI,
            code,
        }),
    });
    const data = await tokenRes.json();

    const { error } = await supabase.from('tokens').upsert({
        user_id: data.account_id || 'demo_user',
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
        created_at: new Date(),
    });
    if (error) {
        console.error('Supabase error saving tokens:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const regionRes = await fetch(`${HOST}/api/1/users/region`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${data.access_token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ region: 'NA' }),
    });
    console.log('Region registration status:', regionRes.status, await regionRes.text());

    return NextResponse.redirect(new URL('/dashboard', request.url));
}