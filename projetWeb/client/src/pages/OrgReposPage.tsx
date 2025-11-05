import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { API_BASE, USER_EMAIL } from "../config";
import Header from "../components/Header";
import Footer from "../components/Footer";

const OrgReposPage: React.FC = () => {
    const { org } = useParams<{ org: string }>();
    const [repos, setRepos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loadRepos = async () => {
        if (!org) return;
        try {
            const res = await fetch(
                `${API_BASE}/api/orgs/${org}/repos?email=${encodeURIComponent(USER_EMAIL)}`,
                { credentials: "include" }
            );
            const data = await res.json();
            setRepos(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
            setRepos([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRepos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [org]);

    if (!org) return <div>Organisation inconnue</div>;

    return (
        <div className="app-container" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Header />

            <main style={{ flex: 1, background: "#f7f9fc", padding: "2rem" }}>
                <div className="org-page" style={{ maxWidth: 900, margin: "0 auto" }}>
                    {/* ---- HEADER ---- */}
                    <div
                        className="org-header"
                        style={{
                            marginBottom: 24,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#111" }}>
                            📦 Organisation : <span style={{ color: "#0078ff" }}>{org}</span>
                        </h2>
                        <div style={{ display: "flex", gap: 8 }}>
                            <button
                                onClick={() => navigate(`/org/${org}/repos/new`)}
                                style={{
                                    background: "#2ecc71",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 8,
                                    padding: "10px 16px",
                                    cursor: "pointer",
                                    fontWeight: 600,
                                }}
                            >
                                ➕ Créer un dépôt
                            </button>
                            <button
                                onClick={() => navigate("/home")}
                                style={{
                                    background: "#e74c3c",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 8,
                                    padding: "10px 16px",
                                    cursor: "pointer",
                                    fontWeight: 600,
                                }}
                            >
                                ✖ Retour
                            </button>
                        </div>
                    </div>

                    {/* ---- LISTE DES REPOS ---- */}
                    <h3 style={{ marginBottom: 12, color: "#222", fontWeight: 600 }}>Dépôts existants</h3>

                    {loading ? (
                        <p>Chargement…</p>
                    ) : repos.length === 0 ? (
                        <p style={{ color: "#666" }}>Aucun dépôt trouvé</p>
                    ) : (
                        <div className="repo-list" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {repos.map((repo) => {
                                const inviteLink = `http://localhost:5174/invite?org=${org}&repo=${repo.name}&inviter=${USER_EMAIL}`;
                                return (
                                    <div
                                        key={repo.id}
                                        className="repo-card"
                                        style={{
                                            background: "#fff",
                                            padding: "1.2rem 1.5rem",
                                            borderRadius: 10,
                                            boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "0.8rem",
                                            transition: "transform 0.15s ease",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                            <span style={{ fontWeight: 600, fontSize: "1.1rem" }}>{repo.name}</span>
                                            <div style={{ display: "flex", gap: 16 }}>
                                                <Link
                                                    to={`/org/${org}/repos/${repo.name}/members`}
                                                    style={{
                                                        textDecoration: "none",
                                                        color: "#0078ff",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    👤 Ajouter un membre
                                                </Link>
                                                <a
                                                    href={repo.html_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        textDecoration: "none",
                                                        color: "#333",
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    🔗 Voir sur GitHub
                                                </a>
                                            </div>
                                        </div>

                                        {/* ---- LIEN D’INVITATION ---- */}
                                        <div
                                            style={{
                                                background: "#f3f6fa",
                                                borderRadius: 8,
                                                padding: "0.6rem 0.8rem",
                                                border: "1px solid #e1e5eb",
                                            }}
                                        >
                                            <label
                                                style={{
                                                    display: "block",
                                                    fontSize: "0.9rem",
                                                    color: "#555",
                                                    marginBottom: "4px",
                                                    fontWeight: 500,
                                                }}
                                            >
                                                🔗 Lien d’invitation :
                                            </label>
                                            <input
                                                readOnly
                                                value={inviteLink}
                                                onClick={(e) => e.currentTarget.select()}
                                                style={{
                                                    width: "100%",
                                                    padding: "8px",
                                                    borderRadius: 6,
                                                    border: "1px solid #ccc",
                                                    background: "#fff",
                                                    cursor: "pointer",
                                                    fontFamily: "monospace",
                                                    color: "#333",
                                                    fontSize: "0.9rem",
                                                }}
                                            />
                                            <small style={{ color: "#777" }}>
                                                💡 Clique pour copier le lien et l’envoyer à ton pote.
                                            </small>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default OrgReposPage;
