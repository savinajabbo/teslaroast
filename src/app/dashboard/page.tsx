import supabase from "../supabase"

export default async function DashboardPage() {
    const { data: tokenData, error } = await supabase
    .from('tokens')
    .select('access_token')
    .eq('user_id', 'demo_user')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

    if (error || !tokenData) {
        return <p>Failed to load access token</p>;
    }

    const teslaRes = await fetch('https://fleet-api.prd.eu.vn.cloud.tesla.com/api/1/products', {
        headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
        },
        cache: 'no-store',
    });

    const teslaData = await teslaRes.json();
    const displayName = teslaData.response?.[0]?.display_name || 'Tesla Driver';

    console.log(JSON.stringify(teslaData, null, 2));

    return (
        <main className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-foreground mb-4">
                    Welcome, {displayName}!
                </h1>

            </div>
        </main>
    )
}