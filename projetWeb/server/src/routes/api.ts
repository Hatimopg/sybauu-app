import express from "express";
import axios from "axios";
import { db } from "../db";


const router = express.Router();

// 🧠 Récupérer le token GitHub depuis MySQL
async function getToken(email: string): Promise<string | null> {
    const [rows]: any = await db.query("SELECT github_token FROM users WHERE email = ?", [email]);
    return rows[0]?.github_token || null;
}

// 🧍 Profil utilisateur
router.get("/me", async (req, res) => {
    const email = req.query.email as string;
    const token = await getToken(email);
    if (!token) return res.status(401).json({ error: "Token not found" });

    const userRes = await axios.get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${token}` },
    });
    res.json(userRes.data);
});

// 🏢 Organisations GitHub (réelles)
router.get("/orgs", async (req, res) => {
    const email = req.query.email as string;
    const token = await getToken(email);
    if (!token) return res.status(401).json({ error: "Token not found" });

    const orgsRes = await axios.get("https://api.github.com/user/orgs", {
        headers: { Authorization: `Bearer ${token}` },
    });
    res.json(orgsRes.data);
});

// 📁 Repositories d’une organisation
router.get("/orgs/:org/repos", async (req, res) => {
    const { org } = req.params;
    const email = req.query.email as string;
    const token = await getToken(email);
    if (!token) return res.status(401).json({ error: "Token not found" });

    try {
        const reposRes = await axios.get(`https://api.github.com/orgs/${org}/repos`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { per_page: 100 },
        });
        res.json(reposRes.data);
    } catch (err: any) {
        console.error("Erreur fetch repos:", err.response?.data || err.message);
        res.status(500).json({ error: "Failed to fetch organization repos" });
    }
});

// 📦 Créer un dépôt dans une organisation
router.post("/orgs/:org/repos", async (req, res) => {
    const { org } = req.params;
    const { email, repoName, isPrivate } = req.body;
    const token = await getToken(email);
    if (!token) return res.status(401).json({ error: "Token not found" });

    try {
        const createRes = await axios.post(
            `https://api.github.com/orgs/${org}/repos`,
            { name: repoName, private: isPrivate },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        res.json({ success: true, repo: createRes.data });
    } catch (err: any) {
        console.error("Erreur création dépôt:", err.response?.data || err.message);
        res.status(500).json({ error: "Failed to create repo in organization" });
    }
});

// 🧩 Ajouter un utilisateur à un dépôt (collaborateur)
router.post("/orgs/:org/repos/:repo/members", async (req, res) => {
    const { org, repo } = req.params;
    const { email, username } = req.body;
    const token = await getToken(email);
    if (!token) return res.status(401).json({ error: "Token not found" });

    try {
        await axios.put(
            `https://api.github.com/repos/${org}/${repo}/collaborators/${username}`,
            { permission: "push" },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/vnd.github+json",
                },
            }
        );

        res.json({ success: true, message: `Invitation envoyée à ${username}` });
    } catch (err: any) {
        console.error("Erreur ajout membre :", err.response?.data || err.message);
        res.status(500).json({ error: "Failed to invite member" });
    }
});

// 🔍 Recherche d’utilisateurs GitHub
router.get("/search/users", async (req, res) => {
    const email = req.query.email as string;
    const q = req.query.q as string;
    const token = await getToken(email);
    if (!token) return res.status(401).json({ error: "Token not found" });

    const usersRes = await axios.get(`https://api.github.com/search/users?q=${q}+in:login&per_page=5`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    res.json(usersRes.data.items || []);
});

export default router;
