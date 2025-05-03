import supabase from "../supabase";
import { getValidAccessToken } from "../lib/teslaAuth";

const HOST = 'https://fleet-api.prd.na.vn.cloud.tesla.com';

export default async function DashboardPage() {
    // const { data: tokenData, error } = await supabase
    //     .from('tokens')
    //     .select('access_token')
    //     .eq('user_id', 'demo_user')
    //     .order('created_at', { ascending: false })
    //     .limit(1)
    //     .single();
    
    // if (error || !tokenData) {
    //     return <p>Failed to load access token: {error?.message || 'no token found'}</p>
    // }
    let accessToken: string;
    try {
        accessToken = await getValidAccessToken('demo_user');
    } catch (err: any) {
        console.error('Auth error:', err);
        return <p style={{ color: 'red' }}>Authentication error: {err.message}</p>;
    }

    const res = await fetch(`${HOST}/api/1/products`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'no-store',
    });

    const text = await res.text();

    if (!res.ok) {
        console.error('Tesla /products failed:', res.status, text);
        return (
            <p style={{ color: 'red' }}>
                Failed to load vehicle data: {res.status} -<br />
                <pre style={{ whiteSpace: 'pre-wrap' }}>{text}</pre>
            </p>
        );
    }

    const { response } = JSON.parse(text);
    const displayName = response?.[0]?.display_name || 'Tesla Driver';

    return (
        <main className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-foreground mb-4">
                    Welcome, {displayName}!
                </h1>
            </div>
        </main>
    );
}