import React, { useState } from 'react';
import { API_BASE } from '../config';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const res = await fetch(`${API_BASE}/user/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (data.ok) {
                localStorage.setItem('userEmail', email);
                window.location.href = '/add-token';
            } else {
                alert(data.error || 'Erreur de connexion');
            }
        } catch (err) {
            alert('❌ Erreur serveur : ' + err);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Connexion</h2>
                <input
                    type="email"
                    placeholder="Adresse e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Se connecter</button>
                <a href="/register">Pas encore inscrit ? Créer un compte</a>
            </div>
        </div>
    );
}
