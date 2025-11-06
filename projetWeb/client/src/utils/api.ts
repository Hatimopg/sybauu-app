// src/utils/api.ts
import { API_BASE } from '../config';

async function handleResponse(res: Response) {
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`API error: ${res.status} – ${text}`);
    }
    return res.json();
}

// 🔹 Récupère les infos utilisateur
export async function me(): Promise<any | null> {
    const email = localStorage.getItem('userEmail');
    if (!email) return null;

    const res = await fetch(`${API_BASE}/api/me?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(res);
}

// 🔹 Récupère les organisations GitHub
export async function getOrgs(): Promise<any[] | null> {
    const email = localStorage.getItem('userEmail');
    if (!email) return null;

    const res = await fetch(`${API_BASE}/api/orgs?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(res);
}

// 🔹 Récupère les dépôts d’une organisation
export async function getOrgRepos(org: string): Promise<any[] | null> {
    const email = localStorage.getItem('userEmail');
    if (!email) return null;

    const res = await fetch(
        `${API_BASE}/api/orgs/${encodeURIComponent(org)}/repos?email=${encodeURIComponent(email)}`,
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }
    );
    return handleResponse(res);
}
