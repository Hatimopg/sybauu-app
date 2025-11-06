import mysql from "mysql2/promise";
import "dotenv/config";

// 🔹 Détermine si on est sur un environnement distant (Railway ou Hostinger)
const isRailway = !!process.env.MYSQLHOST; // Railway fournit cette variable automatiquement
const isHostinger = process.env.DB_HOST?.includes("hostinger");

export const db = mysql.createPool({
    host:
        process.env.DB_HOST ||
        (isRailway
            ? process.env.MYSQLHOST
            : isHostinger
                ? "mysql.hostinger.com"
                : "127.0.0.1"),
    user:
        process.env.DB_USER ||
        process.env.MYSQLUSER ||
        (isHostinger ? "u975469854_user" : "root"),
    password:
        process.env.DB_PASS ||
        process.env.MYSQLPASSWORD ||
        (isHostinger ? "ton_mdp_hostinger" : ""),
    database:
        process.env.DB_NAME ||
        process.env.MYSQLDATABASE ||
        (isHostinger ? "u975469854_mydb" : "github_users"),
    port:
        Number(process.env.DB_PORT) ||
        Number(process.env.MYSQLPORT) ||
        (isHostinger ? 3306 : 3307),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// ✅ Test rapide affiché dans les logs (utile pour Render/Railway)
(async () => {
    try {
        const connection = await db.getConnection();
        console.log("✅ MySQL connected:", {
            host: process.env.DB_HOST || process.env.MYSQLHOST,
            database: process.env.DB_NAME || process.env.MYSQLDATABASE,
        });
        connection.release();
    } catch (err: any) {
        console.error("❌ MySQL connection failed:", err.message);
    }
})();
