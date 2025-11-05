"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const db_1 = require("../db");
const router = express_1.default.Router();
// 🧠 Récupérer le token GitHub depuis MySQL
async function getToken(email) {
    const [rows] = await db_1.db.query("SELECT github_token FROM users WHERE email = ?", [email]);
    return rows[0]?.github_token || null;
}
// 🧍 Profil utilisateur
router.get("/me", async (req, res) => {
    const email = req.query.email;
    const token = await getToken(email);
    if (!token)
        return res.status(401).json({ error: "Token not found" });
    const userRes = await axios_1.default.get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${token}` },
    });
    res.json(userRes.data);
});
// 🏢 Organisations GitHub (réelles)
router.get("/orgs", async (req, res) => {
    const email = req.query.email;
    const token = await getToken(email);
    if (!token)
        return res.status(401).json({ error: "Token not found" });
    const orgsRes = await axios_1.default.get("https://api.github.com/user/orgs", {
        headers: { Authorization: `Bearer ${token}` },
    });
    res.json(orgsRes.data);
});
// 📁 Repositories d’une organisation
router.get("/orgs/:org/repos", async (req, res) => {
    const { org } = req.params;
    const email = req.query.email;
    const token = await getToken(email);
    if (!token)
        return res.status(401).json({ error: "Token not found" });
    try {
        const reposRes = await axios_1.default.get(`https://api.github.com/orgs/${org}/repos`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { per_page: 100 },
        });
        res.json(reposRes.data);
    }
    catch (err) {
        console.error("Erreur fetch repos:", err.response?.data || err.message);
        res.status(500).json({ error: "Failed to fetch organization repos" });
    }
});
// 📦 Créer un dépôt dans une organisation
router.post("/orgs/:org/repos", async (req, res) => {
    const { org } = req.params;
    const { email, repoName, isPrivate } = req.body;
    const token = await getToken(email);
    if (!token)
        return res.status(401).json({ error: "Token not found" });
    try {
        const createRes = await axios_1.default.post(`https://api.github.com/orgs/${org}/repos`, { name: repoName, private: isPrivate }, { headers: { Authorization: `Bearer ${token}` } });
        res.json({ success: true, repo: createRes.data });
    }
    catch (err) {
        console.error("Erreur création dépôt:", err.response?.data || err.message);
        res.status(500).json({ error: "Failed to create repo in organization" });
    }
});
// 🧩 Ajouter un utilisateur à un dépôt (collaborateur)
router.post("/orgs/:org/repos/:repo/members", async (req, res) => {
    const { org, repo } = req.params;
    const { email, username } = req.body;
    const token = await getToken(email);
    if (!token)
        return res.status(401).json({ error: "Token not found" });
    try {
        await axios_1.default.put(`https://api.github.com/repos/${org}/${repo}/collaborators/${username}`, { permission: "push" }, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github+json",
            },
        });
        res.json({ success: true, message: `Invitation envoyée à ${username}` });
    }
    catch (err) {
        console.error("Erreur ajout membre :", err.response?.data || err.message);
        res.status(500).json({ error: "Failed to invite member" });
    }
});
// 🔍 Recherche d’utilisateurs GitHub
router.get("/search/users", async (req, res) => {
    const email = req.query.email;
    const q = req.query.q;
    const token = await getToken(email);
    if (!token)
        return res.status(401).json({ error: "Token not found" });
    const usersRes = await axios_1.default.get(`https://api.github.com/search/users?q=${q}+in:login&per_page=5`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    res.json(usersRes.data.items || []);
});
exports.default = router;
