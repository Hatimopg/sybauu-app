import mysql from 'mysql2/promise';
import 'dotenv/config';

export const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'github_users',
    port: 3307,
});
