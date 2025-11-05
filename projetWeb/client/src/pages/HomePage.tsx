import React, { useEffect, useState } from 'react';
import { me, getOrgs } from '../utils/api';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface User {
    login: string;
    avatar_url: string;
}

interface Org {
    login: string;
    avatar_url?: string;
}

export default function HomePage() {
    const [user, setUser] = useState<User | null>(null);
    const [orgs, setOrgs] = useState<Org[]>([]);

    useEffect(() => {
        const email = localStorage.getItem('userEmail');
        if (!email) {
            console.warn('🚫 Aucun email trouvé, redirection vers /login');
            window.location.href = '/login';
            return;
        }

        (async () => {
            try {
                const userData = await me();
                if (userData) setUser(userData);

                const orgsData = await getOrgs();
                if (orgsData) setOrgs(orgsData);
            } catch (err) {
                console.error('❌ Erreur HomePage:', err);
            }
        })();
    }, []);


    return (
        <div className="app-container">
            <Header user={user} />

            <main style={{ flex: 1, padding: '2rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>👋 Bienvenue {user ? user.login : 'utilisateur'} !</h2>

                <div>
                    <h3>📂 Tes organisations GitHub</h3>
                    {orgs.length === 0 ? (
                        <p style={{ color: '#666' }}>Aucune organisation trouvée.</p>
                    ) : (
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '1.5rem',
                                marginTop: '1.5rem',
                            }}
                        >
                            {orgs.map((org) => (
                                <Link
                                    key={org.login}
                                    to={`/org/${org.login}`}
                                    className="org-card"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        border: '1px solid #ddd',
                                        borderRadius: '12px',
                                        padding: '1.5rem',
                                        textDecoration: 'none',
                                        color: '#222',
                                        backgroundColor: '#fafafa',
                                        transition: '0.2s ease',
                                    }}
                                >
                                    {org.avatar_url && (
                                        <img
                                            src={org.avatar_url}
                                            alt={org.login}
                                            style={{ width: 60, height: 60, borderRadius: '50%', marginBottom: '1rem' }}
                                        />
                                    )}
                                    <strong>{org.login}</strong>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
