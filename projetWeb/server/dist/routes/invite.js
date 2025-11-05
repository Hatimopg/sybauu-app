"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const db_1 = require("../db");
const router = express_1.default.Router(); // 🟢 ici la ligne manquait !
// 🔐 Récupère le token GitHub de l’inviteur
async function getToken(email) {
    const [rows] = await db_1.db.query("SELECT github_token FROM users WHERE email = ?", [email]);
    return rows[0]?.github_token || null;
}
// 🎟️ Route : accepter une invitation GitHub
router.post("/accept", async (req, res) => {
    const { org, repo, email, inviterEmail } = req.body;
    try {
        const inviterToken = await getToken(inviterEmail);
        if (!inviterToken)
            return res.status(401).json({ error: "Token d’invitation introuvable." });
        // 🔎 On récupère le nom GitHub du membre invité
        const [userRow] = await db_1.db.query("SELECT github_username FROM users WHERE email = ?", [email]);
        const username = userRow?.github_username;
        if (!username)
            return res.status(400).json({ error: "Nom d’utilisateur GitHub introuvable." });
        console.log(`➡️ Tentative d’ajout de ${username} dans ${org}/${repo}`);
        // 💌 Appel officiel à l’API GitHub
        const response = await axios_1.default.put(`https://api.github.com/repos/${org}/${repo}/collaborators/${username}`, { permission: "push" }, {
            headers: {
                Authorization: `Bearer ${inviterToken}`,
                Accept: "application/vnd.github+json",
            },
        });
        console.log("✅ Réponse GitHub :", response.data);
        res.json({ success: true, message: `Invitation envoyée à ${username}` });
    }
    catch (err) {
        console.error("❌ Erreur GitHub :", err.response?.data || err.message);
        res.status(500).json({
            error: err.response?.data?.message || "Échec de l’envoi d’invitation GitHub.",
        });
    }
});
exports.default = router; // 🟢 indispensable à la fin
