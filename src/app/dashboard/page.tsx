import supabase from "../supabase";

const HOST = 'https://fleet-api.prd.na.vn.cloud.tesla.com';

export default async function DashboardPage() {
    const { data: tokenData, error } = await supabase
        .from('tokens')
        .select('access_token')
        .eq('user_id', 'demo_user')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
    
    if (error || !tokenData) {
        return <p>Failed to load access token: {error?.message || 'no token found'}</p>
    }

    const res = await fetch(`${HOST}/api/1/products`, {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
        cache: 'no-store',
    });

    const text = await res.text();
    console.error('Tesla /products failed:', res.status, text);

    if (!res.ok) {
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