import { PostgrestError } from "@supabase/supabase-js";
import supabase from "../supabase";

const TESLA_TOKEN_URL = 'https://auth.tesla.com/oauth2/v3/token';

export async function getValidAccessToken(userId: string) {
    const { data: row, error: loadErr } = await supabase
        .from('tokens')
        .select(`
            access_token,
            refresh_token,
            expires_in,
            created_at
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (loadErr || !row) {
        throw new Error('Could not load tokens from database.');
    }

    const issuedAt = Math.floor(new Date(row.created_at).getTime() / 1000);
    const expiresAt = issuedAt + row.expires_in;
    const now = Math.floor(Date.now() / 1000);

    if (now + 60 < expiresAt) {
        return row.access_token;
    }

    const res = await fetch(TESLA_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            grant_type: 'refresh_token',
            client_id: process.env.TESLA_CLIENT_ID,
            client_secret: process.env.TESLA_CLIENT_SECRET,
            refresh_token: row.refresh_token,
        }),
    });
    if (!res.ok) throw new Error('Failed refreshing token: ' + res.status);

    const data = await res.json();

    const { error: saveErr } = await supabase
        .from('tokens')
        .update({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_in: data.expires_in,
            created_at: new Date(),
        })
        .eq('user_id', userId)
        .eq('refresh_token', row.refresh_token);

    if (saveErr) throw new Error('Failed saving refreshed token.');

    return data.access_token
}