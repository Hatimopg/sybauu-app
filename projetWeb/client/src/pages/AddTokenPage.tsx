import React, { useState } from 'react';
import { API_BASE } from '../config';

export default function AddTokenPage() {
    const [token, setToken] = useState('');
    const email = localStorage.getItem('userEmail');

    const handleSaveToken = async () => {
        if (!token || token.trim().length < 30) {
            alert('Merci de saisir un token GitHub valide.');
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/user/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, github_token: token }),
            });

            const data = await res.json();
            if (data.ok) {
                alert('Token enregistré avec succès ✅');
                window.location.href = '/home';
            } else {
                alert(data.error || 'Erreur serveur');
            }
        } catch (err) {
            alert('❌ Erreur de connexion au serveur : ' + err);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Ajoute ton token GitHub</h2>
                <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '1rem' }}>
                    Ton token servira à accéder à ton profil GitHub de manière sécurisée.
                </p>
                <input
                    type="password"
                    placeholder="Ton token GitHub"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                />
                <button onClick={handleSaveToken}>Sauvegarder</button>
            </div>
        </div>
    );
}
