import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE, USER_EMAIL } from "../config";
import Header from "../components/Header";
import footer from "../components/Footer";

interface User {
    login: string;
    avatar_url: string;
    html_url: string;
}

const AddMemberPage: React.FC = () => {
    const { org, repo } = useParams<{ org: string; repo: string }>();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<User[]>([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // 🔍 Rechercher un utilisateur GitHub
    const handleSearch = async (q: string) => {
        setQuery(q);
        if (q.trim().length < 2) {
            setResults([]);
            return;
        }

        try {
            const res = await fetch(
                `${API_BASE}/api/search/users?q=${q}&email=${USER_EMAIL}`
            );
            const data = await res.json();
            setResults(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        }
    };

    // ➕ Ajouter un utilisateur au repo
    const handleInvite = async (username: string) => {
        try {
            setLoading(true);
            setMessage("");

            const res = await fetch(
                `${API_BASE}/api/orgs/${org}/repos/${repo}/members`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: USER_EMAIL, username }),
                }
            );

            if (!res.ok) throw new Error();
            setMessage(`✅ Invitation envoyée à ${username}`);
        } catch (err) {
            setMessage("❌ Erreur lors de l’envoi de l’invitation");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f7f9fc",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "2rem",
                fontFamily: "'Inter', sans-serif",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: 600,
                    background: "#fff",
                    borderRadius: 16,
                    padding: "2.5rem",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                }}
            >
                <h2
                    style={{
                        textAlign: "center",
                        color: "#111",
                        marginBottom: "1.5rem",
                        fontWeight: 700,
                    }}
                >
                    👥 Ajouter un membre dans{" "}
                    <span style={{ color: "#0078ff" }}>{repo}</span>
                </h2>

                <input
                    type="text"
                    value={query}
                    placeholder="🔎 Rechercher un utilisateur GitHub..."
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "12px 16px",
                        fontSize: "1rem",
                        border: "1px solid #ddd",
                        borderRadius: 10,
                        outline: "none",
                        transition: "0.2s",
                        marginBottom: "1rem",
                    }}
                    onFocus={(e) =>
                        (e.target.style.border = "1px solid #0078ff")
                    }
                    onBlur={(e) =>
                        (e.target.style.border = "1px solid #ddd")
                    }
                />

                {results.length > 0 && (
                    <div
                        style={{
                            background: "#fafafa",
                            border: "1px solid #eee",
                            borderRadius: 10,
                            padding: "1rem",
                            maxHeight: 300,
                            overflowY: "auto",
                            boxShadow: "inset 0 2px 6px rgba(0,0,0,0.05)",
                        }}
                    >
                        {results.map((user) => (
                            <div
                                key={user.login}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "8px 6px",
                                    borderBottom: "1px solid #f0f0f0",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                    }}
                                >
                                    <img
                                        src={user.avatar_url}
                                        alt={user.login}
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: "50%",
                                        }}
                                    />
                                    <a
                                        href={user.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            color: "#0078ff",
                                            fontWeight: 600,
                                            textDecoration: "none",
                                        }}
                                    >
                                        {user.login}
                                    </a>
                                </div>

                                <button
                                    onClick={() => handleInvite(user.login)}
                                    disabled={loading}
                                    style={{
                                        background: "#2ecc71",
                                        color: "#fff",
                                        padding: "6px 12px",
                                        borderRadius: 8,
                                        border: "none",
                                        cursor: "pointer",
                                        fontWeight: 600,
                                        transition: "0.2s",
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.background =
                                            "#27ae60")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.background =
                                            "#2ecc71")
                                    }
                                >
                                    {loading ? "⏳" : "Inviter"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {message && (
                    <p
                        style={{
                            marginTop: 20,
                            textAlign: "center",
                            fontWeight: 600,
                            color: message.includes("✅")
                                ? "#27ae60"
                                : "#e74c3c",
                        }}
                    >
                        {message}
                    </p>
                )}

                <button
                    onClick={() => navigate(`/org/${org}`)}
                    style={{
                        width: "100%",
                        marginTop: "1.5rem",
                        background: "#0078ff",
                        color: "#fff",
                        border: "none",
                        borderRadius: 10,
                        padding: "10px",
                        fontSize: "1rem",
                        fontWeight: 500,
                        cursor: "pointer",
                        transition: "0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#005fcc")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "#0078ff")
                    }
                >
                    ⬅ Retour
                </button>
            </div>
        </div>
    );
};

export default AddMemberPage;
