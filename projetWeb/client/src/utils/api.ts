const API_BASE = 'http://localhost:4000';

async function handleResponse(res: Response) {
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`API error: ${res.status} – ${text}`);
    }
    return res.json();
}

export async function me(): Promise<any | null> {
    const email = localStorage.getItem('userEmail');
    if (!email) return null;

    const res = await fetch(`${API_BASE}/api/me?email=${encodeURIComponent(email)}`);
    return handleResponse(res);
}

export async function getOrgs(): Promise<any[] | null> {
    const email = localStorage.getItem('userEmail');
    if (!email) return null;

    const res = await fetch(`${API_BASE}/api/orgs?email=${encodeURIComponent(email)}`);
    return handleResponse(res);
}

export async function getOrgRepos(org: string): Promise<any[] | null> {
    const email = localStorage.getItem('userEmail');
    if (!email) return null;

    const res = await fetch(
        `${API_BASE}/api/orgs/${encodeURIComponent(org)}/repos?email=${encodeURIComponent(email)}`
    );
    return handleResponse(res);
}
