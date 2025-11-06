import fs from "fs";
import mysql from "mysql2/promise";
import "dotenv/config";

(async () => {
    try {
        console.log("🚀 Importation du fichier SQL en cours...");

        // 📦 Connexion à la base (Railway ou locale)
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || process.env.MYSQLHOST,
            user: process.env.DB_USER || process.env.MYSQLUSER,
            password: process.env.DB_PASS || process.env.MYSQLPASSWORD,
            database: process.env.DB_NAME || process.env.MYSQLDATABASE,
            port: Number(process.env.DB_PORT || process.env.MYSQLPORT) || 3306,
            multipleStatements: true, // ⚡ permet d'exécuter plusieurs requêtes SQL
        });

        // 📄 Lis ton fichier SQL exporté
        const sqlFile = "./github_users_export.sql"; // mets le fichier à la racine du projet
        if (!fs.existsSync(sqlFile)) {
            throw new Error(`❌ Fichier introuvable: ${sqlFile}`);
        }

        const sql = fs.readFileSync(sqlFile, "utf8");

        // ⚙️ Exécute le SQL
        await connection.query(sql);
        console.log("✅ Importation terminée avec succès !");
        await connection.end();
    } catch (err: any) {
        console.error("❌ Erreur lors de l'importation:", err.message);
    }
})();
