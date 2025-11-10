import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import authRoutes from "./routes/auth";
import apiRoutes from "./routes/api";
import userRoutes from "./routes/user";
import inviteRoutes from "./routes/invite";

const app = express();

/**
 * 🌍 Détection automatique des origines autorisées
 * (Railway → FRONTEND_URL = "https://sybauu.com,https://www.sybauu.com")
 */
const FRONTEND_URLS = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(",").map(url => url.trim())
    : ["https://sybauu.com", "https://www.sybauu.com", "http://localhost:5174"];

console.log("✅ CORS Allowed Origins:", FRONTEND_URLS);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true); // autorise Postman, etc.
            if (FRONTEND_URLS.includes(origin)) {
                return callback(null, true);
            }
            console.warn("🚫 CORS refusé pour:", origin);
            return callback(new Error("CORS non autorisé"));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// ✅ Réponse explicite pour préflight OPTIONS
app.options("*", cors({
    origin: FRONTEND_URLS,
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// 🔹 Routes
app.use("/auth", authRoutes);
app.use("/api", apiRoutes);
app.use("/user", userRoutes);
app.use("/api/invite", inviteRoutes);

// 🔹 Erreur CORS lisible
app.use((err: any, req: any, res: any, next: any) => {
    console.error("❌ Erreur serveur:", err.message);
    if (err.message.includes("CORS")) {
        return res.status(403).json({ error: "CORS non autorisé" });
    }
    res.status(500).json({ error: "Erreur serveur" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log("🌍 Accepting requests from:", FRONTEND_URLS.join(", "));
});
