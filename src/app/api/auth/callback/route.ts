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
    const userId = data.account_id

    const { error } = await supabase.from('tokens').upsert({
        user_id: userId,
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
        created_at: new Date(),
    },
        { onConflict: 'user_id' }
    );

    if (error) {
        console.error('Supabase error saving tokens:', error);
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    const regionRes = await fetch(`${HOST}/api/1/region`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${data.access_token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ region: 'NA' }),
    });

    const regionText = await regionRes.text();
    console.log('👋 [Callback] Region registration:', regionRes.status, regionText);

    return NextResponse.redirect(new URL('/dashboard', request.url));
}