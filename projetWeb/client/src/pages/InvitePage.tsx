import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_BASE } from "../config";

export default function InvitePage() {
    const [params] = useSearchParams();
    const org = params.get("org");
    const repo = params.get("repo");
    const inviter = params.get("inviter");
    const navigate = useNavigate();

    const [message, setMessage] = useState("🔄 Vérification de votre statut...");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const email = localStorage.getItem("userEmail");

        // 🟡 Si pas connecté → on redirige vers /login
        if (!email) {
            setMessage("⚠️ Vous devez vous connecter avec GitHub avant d’accepter l’invitation.");
            setLoading(false);
            return;
        }

        const acceptInvite = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/invite/accept`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        org,
                        repo,
                        email, // celui du user connecté
                        inviterEmail: inviter,
                    }),
                });

                const data = await res.json();
                if (res.ok) {
                    setMessage(`✅ Vous avez été invité avec succès à rejoindre le dépôt ${repo} !`);
                } else {
                    setMessage(`❌ Erreur : ${data.error || "Impossible d’ajouter l’utilisateur."}`);
                }
            } catch (err) {
                console.error(err);
                setMessage("❌ Erreur lors du traitement de l’invitation.");
            } finally {
                setLoading(false);
            }
        };

        acceptInvite();
    }, [org, repo, inviter]);

    return (
        <div className="app-container" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Header />

            <main
                style={{
                    flex: 1,
                    padding: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        background: "#fff",
                        padding: "2rem",
                        borderRadius: 12,
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                        textAlign: "center",
                        maxWidth: "500px",
                    }}
                >
                    <h2 style={{ marginBottom: "1rem", color: "#007bff" }}>🎟️ Invitation GitHub</h2>
                    <p style={{ marginBottom: "1rem" }}>
                        Organisation : <strong>{org}</strong>
                        <br />
                        Dépôt : <strong>{repo}</strong>
                    </p>
                    <p style={{ fontWeight: 500 }}>{message}</p>

                    {/* 🟢 Bouton GitHub corrigé */}
                    {!loading && message.includes("connecter") && (
                        <button
                            onClick={async () => {
                                try {
                                    const res = await fetch(`${API_BASE}/auth/url`); // ✅ utilise ton API_BASE ici aussi
                                    const data = await res.json();
                                    if (data.url) {
                                        window.location.href = data.url; // redirection vers GitHub
                                    } else {
                                        alert("Impossible d'obtenir l'URL GitHub 😭");
                                    }
                                } catch (err) {
                                    console.error(err);
                                    alert("Erreur de connexion GitHub.");
                                }
                            }}
                            style={{
                                textAlign: "center",
                                backgroundColor: "#0078ff",
                                color: "#fff",
                                border: "none",
                                borderRadius: 6,
                                padding: "10px 20px",
                                fontSize: "1rem",
                                fontWeight: "bold",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                marginTop: "15px",
                            }}
                        >
                            🔒 Se connecter avec GitHub
                        </button>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
