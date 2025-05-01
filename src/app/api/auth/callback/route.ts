import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/app/supabase';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    const body = {
        grant_type: 'authorization_code',
        client_id: process.env.TESLA_CLIENT_ID,
        client_secret: process.env.TESLA_CLIENT_SECRET,
        code: code,
        redirect_uri: process.env.TESLA_REDIRECT_URI
    }

    const response = await fetch('https://auth.tesla.com/oauth2/v3/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();

    await supabase.from('tokens').insert({
        user_id: data.account_id || 'demo_user',
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
        created_at: new Date(),
    });

    const { error } = await supabase.from('tokens').insert({
        user_id: data.account_id || 'demo user',
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
        created_at: new Date(),
    });

    if (error) {
        console.error('Supabase error saving tokens:', error);
        return NextResponse.json({ success: false, error: error.message}, { status: 500});
    }

    console.log('Tesla Tokens: ', data);
    return NextResponse.redirect(new URL('/dashboard', request.url));
}