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
 * 🔹 FRONTEND_URL = ton domaine public (Hostinger)
 * 🔹 API_URL = ton domaine Railway (facultatif)
 */
const FRONTEND_URL = process.env.FRONTEND_URL || "https://sybauu.com";

app.use(
    cors({
        origin: [FRONTEND_URL, "https://www.sybauu.com"], // accepte les deux variantes
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

// 🔹 Routes principales
app.use("/auth", authRoutes);
app.use("/api", apiRoutes);
app.use("/user", userRoutes);
app.use("/api/invite", inviteRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌍 Accepting requests from: ${FRONTEND_URL}`);
});
