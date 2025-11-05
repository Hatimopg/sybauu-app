import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE, USER_EMAIL } from "../config";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CreateRepoPage: React.FC = () => {
    const { org } = useParams<{ org: string }>();
    const [repoName, setRepoName] = useState("");
    const [isPrivate, setIsPrivate] = useState(true);
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCreate = async () => {
        if (!repoName.trim()) {
            setMsg("⚠️ Nom du dépôt requis !");
            return;
        }

        try {
            setLoading(true);
            setMsg("");

            const res = await fetch(`${API_BASE}/api/orgs/${org}/repos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: USER_EMAIL,
                    repoName,
                    isPrivate,
                }),
            });

            if (!res.ok) throw new Error();
            setMsg("✅ Dépôt créé avec succès !");
            setTimeout(() => navigate(`/org/${org}`), 1200);
        } catch (err) {
            console.error(err);
            setMsg("❌ Erreur lors de la création du dépôt.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Header />

            <main style={{ flex: 1, background: "#f7f9fc", display: "flex", justifyContent: "center", alignItems: "center", padding: "2rem" }}>
                <div
                    style={{
                        width: "100%",
                        maxWidth: 460,
                        background: "#fff",
                        borderRadius: 16,
                        boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
                        padding: "2.5rem 2rem",
                    }}
                >
                    <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "#111", fontSize: "1.8rem", fontWeight: 700 }}>
                        🚀 Créer un dépôt — <span style={{ color: "#0078ff" }}>{org}</span>
                    </h2>

                    <label htmlFor="repo" style={{ fontWeight: 600, color: "#333", display: "block", marginBottom: 8 }}>
                        Nom du dépôt
                    </label>
                    <input
                        id="repo"
                        type="text"
                        placeholder="ex: fastdeliver-dashboard"
                        value={repoName}
                        onChange={(e) => setRepoName(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "12px 14px",
                            borderRadius: 8,
                            border: "1px solid #dcdcdc",
                            marginBottom: 20,
                            fontSize: "1rem",
                            transition: "border 0.2s",
                        }}
                    />

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                        <label style={{ fontWeight: 500, color: "#444" }}>Dépôt privé (recommandé)</label>
                        <input
                            type="checkbox"
                            checked={isPrivate}
                            onChange={(e) => setIsPrivate(e.target.checked)}
                            style={{
                                width: 22,
                                height: 22,
                                accentColor: "#0078ff",
                                cursor: "pointer",
                            }}
                        />
                    </div>

                    <button
                        onClick={handleCreate}
                        disabled={loading}
                        style={{
                            width: "100%",
                            background: "#2ecc71",
                            color: "white",
                            padding: "12px",
                            borderRadius: 10,
                            border: "none",
                            fontSize: "1.1rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            boxShadow: "0 4px 10px rgba(46, 204, 113, 0.3)",
                        }}
                    >
                        {loading ? "⏳ Création..." : "Créer le dépôt 🚀"}
                    </button>

                    {msg && (
                        <p
                            style={{
                                marginTop: 20,
                                textAlign: "center",
                                fontWeight: 600,
                                color: msg.includes("✅") ? "#27ae60" : "#e74c3c",
                            }}
                        >
                            {msg}
                        </p>
                    )}

                    <button
                        onClick={() => navigate(`/org/${org}`)}
                        style={{
                            width: "100%",
                            marginTop: 16,
                            background: "#0078ff",
                            color: "#fff",
                            padding: "10px",
                            borderRadius: 8,
                            border: "none",
                            fontSize: "1rem",
                            fontWeight: 500,
                            cursor: "pointer",
                        }}
                    >
                        ⬅ Retour
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CreateRepoPage;
