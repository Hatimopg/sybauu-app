import React, { useState } from 'react';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        const res = await fetch('http://localhost:4000/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (data.ok) {
            localStorage.setItem('userEmail', email);
            window.location.href = '/add-token';
        } else {
            alert(data.error || 'Erreur inscription');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Créer un compte</h2>
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
                <button onClick={handleRegister}>S’inscrire</button>
                <a href="/login">Déjà un compte ? Se connecter</a>
            </div>
        </div>
    );
}
