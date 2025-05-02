import { getValidAccessToken } from "../lib/teslaAuth";

const HOST = 'https://fleet-api.prd.na.vn.cloud.tesla.com';

export default async function DashboardPage() {
    let accessToken: string;
    try {
        accessToken = await getValidAccessToken('demo_user');
    } catch (err) {
        console.error('Error fetching valid token: ', err);
        return <p>Authentication error. Please log in again.</p>
    }

    const res = await fetch(`${HOST}/api/1/products`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'no-store',
    });
    if (!res.ok) {
        console.error('Tesla /products fetch failed:', await res.text());
        return <p>Failed to load your vehicle data.</p>
    }

    const { response } = await res.json();
    const displayName = response?.[0]?.display_name || 'Tesla Driver';

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