import express, { Request, Response } from "express";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";
import { db } from "../db"; // 🟢 ajout import DB pour sauvegarder le token & username

const router = express.Router();

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "";
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || "";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5174";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    console.warn("⚠️ Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in .env");
}

// 🧭 Étape 1 : Générer l’URL d’auth GitHub
router.get("/url", (_req, res) => {
    const state = uuidv4();
    const params = new URLSearchParams({
        client_id: GITHUB_CLIENT_ID,
        redirect_uri: `${BACKEND_URL}/auth/github/callback`,
        scope: "read:user read:org repo admin:org", // 🟢 ajout de 'repo' et 'admin:org' pour invitations
        state,
        allow_signup: "true",
    });

    res.json({
        url: `https://github.com/login/oauth/authorize?${params.toString()}`,
        state,
    });
});

// 🧭 Étape 2 : Callback GitHub
router.get("/github/callback", async (req: Request, res: Response) => {
    const { code } = req.query;
    if (!code) return res.status(400).send("Missing code");

    try {
        // 1️⃣ Échange du code contre un access token
        const tokenRes = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                code,
            },
            { headers: { Accept: "application/json" } }
        );

        const { access_token } = tokenRes.data;
        if (!access_token) return res.status(400).send("No access token");

        // 2️⃣ Récupération des infos de l'utilisateur
        const userRes = await axios.get("https://api.github.com/user", {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const user = userRes.data;
        console.log("👤 Connecté en tant que :", user.login);

        // 3️⃣ Sauvegarde du token + username dans MySQL
        await db.query(
            `INSERT INTO users (email, github_token, github_username)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE
         github_token = VALUES(github_token),
         github_username = VALUES(github_username)`,
            [user.email, access_token, user.login]
        );

        // 4️⃣ Création du cookie
        res.cookie("gh_token", access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 jours
        });

        // 5️⃣ Redirection vers le front
        res.redirect(`${FRONTEND_URL}/home`);
    } catch (err: any) {
        console.error("❌ OAuth error:", err.response?.data || err.message);
        res.status(500).send("OAuth exchange failed");
    }
});

// 🚪 Logout
router.post("/logout", (_req, res) => {
    res.clearCookie("gh_token", { path: "/" });
    res.json({ ok: true });
});

export default router;
