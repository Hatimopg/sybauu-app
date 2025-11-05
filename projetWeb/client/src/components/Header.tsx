import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
    user?: { login: string; avatar_url: string } | null;
}

export default function Header({ user }: HeaderProps) {
    return (
        <header
            style={{
                backgroundColor: '#18181b',
                color: 'white',
                padding: '1rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h1 style={{ fontSize: '1.3rem' }}>🚀 Mon Dashboard GitHlib</h1>

                {user && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img
                            src={user.avatar_url}
                            alt="avatar"
                            style={{ width: 40, height: 40, borderRadius: '50%' }}
                        />
                        <span style={{ fontWeight: 'bold' }}>{user.login}</span>
                    </div>
                )}
            </div>

            <nav style={{ display: 'flex', gap: '1rem' }}>
                <Link to="/home" style={{ color: 'white', textDecoration: 'none' }}>
                    Accueil
                </Link>
                <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
                    Déconnexion
                </Link>
            </nav>
        </header>
    );
}
