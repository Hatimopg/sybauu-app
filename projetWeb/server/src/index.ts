import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import authRoutes from "./routes/auth";
import apiRoutes from "./routes/api";
import userRoutes from "./routes/user";
import inviteRoutes from "./routes/invite";

const app = express();

// 🌍 Liste des origines autorisées
const allowedOrigins = [
    "https://sybauu.com",
    "https://www.sybauu.com",
    "http://localhost:5174",
];

// ✅ Middleware CORS global
app.use(
    cors({
        origin: (origin, callback) => {
            // Autoriser les requêtes sans origin (Postman, curl, etc.)
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) {
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

// ✅ Répondre explicitement aux préflight OPTIONS
app.options("*", cors({
    origin: allowedOrigins,
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// 🔹 Routes principales
app.use("/auth", authRoutes);
app.use("/api", apiRoutes);
app.use("/user", userRoutes);
app.use("/api/invite", inviteRoutes);

// 🔹 Gestion d’erreur pour éviter les 500 silencieux
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
    console.log("🌍 Accepting requests from:", allowedOrigins.join(", "));
});
