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
 * 🌍 Frontend autorisés
 * (Railway lit FRONTEND_URL depuis tes variables d'environnement)
 */
const allowedOrigins = [
    process.env.FRONTEND_URL || "https://sybauu.com",
    "https://www.sybauu.com",
    "http://localhost:5174", // pour tests locaux
];

// ✅ Middleware CORS sécurisé
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.warn("🚫 CORS refusé pour:", origin);
                callback(new Error("CORS non autorisé"));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

// Permet aux requêtes préflight (OPTIONS) de passer sans erreur
app.options("*", cors());

// Middleware de parsing
app.use(express.json());
app.use(cookieParser());

// 🔹 Routes principales
app.use("/auth", authRoutes);
app.use("/api", apiRoutes);
app.use("/user", userRoutes);
app.use("/api/invite", inviteRoutes);

// 🔹 Lancement du serveur
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log("🌍 Accepting requests from:", allowedOrigins.join(", "));
});
