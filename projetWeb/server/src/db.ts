import mysql from "mysql2/promise";
import "dotenv/config";

/**
 * 🔹 Détection automatique de l'environnement
 * - Railway → détecté via MYSQLHOST
 * - Hostinger → détecté si DB_HOST contient "hostinger"
 * - Local → sinon
 */
const isRailway = !!process.env.MYSQLHOST;
const isHostinger = process.env.DB_HOST?.includes("hostinger");

/**
 * 🔹 Configuration dynamique selon l'environnement
 */
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
        (isHostinger ? process.env.HOSTINGER_DB_PASS || "" : ""),
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

/**
 * ✅ Test rapide de connexion MySQL
 * Affiche dans les logs de Render / Railway / Hostinger
 */
(async () => {
    try {
        const connection = await db.getConnection();
        console.log("✅ MySQL connected:", {
            host:
                process.env.DB_HOST ||
                process.env.MYSQLHOST ||
                (isHostinger ? "mysql.hostinger.com" : "127.0.0.1"),
            database:
                process.env.DB_NAME ||
                process.env.MYSQLDATABASE ||
                (isHostinger ? "u975469854_mydb" : "github_users"),
        });
        connection.release();
    } catch (err: any) {
        console.error("❌ MySQL connection failed:", err.message);
    }
})();
