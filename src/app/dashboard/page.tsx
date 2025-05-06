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
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : typeof err === 'string' ? err : 'Unknown error';
        console.error('Auth error:', message);
        return <p style={{ color: 'red' }}>Authentication error: {message}</p>;
    }

    const userRes = await fetch(`${HOST}/api/1/users/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'no-store',
    });

    let displayName = 'Tesla Driver';
    
    if (userRes.ok) {
        const userData = await userRes.json();
        console.log('User data response:', userData);
        displayName = userData.response?.name || userData.response?.email || displayName;
    } else {
        console.error('Failed to fetch user data:', await userRes.text());
        
        const productsRes = await fetch(`${HOST}/api/1/products`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            cache: 'no-store',
        });

        if (productsRes.ok) {
            const { response } = await productsRes.json();
            console.log('Products response:', response);
            displayName = response?.[0]?.display_name || displayName;
        } else {
            console.error('Failed to fetch products:', await productsRes.text());
        }
    }

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