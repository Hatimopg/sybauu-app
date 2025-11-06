import mysql from "mysql2/promise";
import "dotenv/config";

// 🔹 Détermine si on est en production (Render)
const isProd = process.env.NODE_ENV === "production";

export const db = mysql.createPool({
    host: process.env.DB_HOST || (isProd ? "mysql.hostinger.com" : "127.0.0.1"),
    user: process.env.DB_USER || (isProd ? "u975469854_user" : "root"),
    password: process.env.DB_PASS || (isProd ? "ton_mdp_hostinger" : ""),
    database: process.env.DB_NAME || (isProd ? "u975469854_mydb" : "github_users"),
    port: Number(process.env.DB_PORT) || (isProd ? 3306 : 3307),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// ✅ Test rapide de connexion (affiché dans Render logs)
(async () => {
    try {
        const connection = await db.getConnection();
        console.log("✅ MySQL connected:", {
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
        });
        connection.release();
    } catch (err) {
        console.error("❌ MySQL connection failed:", err);
    }
})();
