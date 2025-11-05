"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const axios_1 = __importDefault(require("axios"));
const db_1 = require("../db");
const router = express_1.default.Router();
// 🔹 Inscription
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: 'Missing fields' });
    const hashed = await bcrypt_1.default.hash(password, 10);
    try {
        await db_1.db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashed]);
        res.json({ ok: true });
    }
    catch (err) {
        console.error('❌ Error register:', err);
        if (err.code === 'ER_DUP_ENTRY')
            return res.status(400).json({ error: 'User already exists' });
        res.status(500).json({ error: 'Database error' });
    }
});
// 🔹 Connexion
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: 'Missing fields' });
    const [rows] = await db_1.db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
    if (!user)
        return res.status(404).json({ error: 'User not found' });
    const match = await bcrypt_1.default.compare(password, user.password);
    if (!match)
        return res.status(401).json({ error: 'Invalid password' });
    res.json({ ok: true, user: { email: user.email } });
});
// 🔹 Ajout / mise à jour du token GitHub
router.post('/token', async (req, res) => {
    const { email, github_token } = req.body;
    if (!email || !github_token)
        return res.status(400).json({ error: 'Missing fields' });
    // Vérifie si le user existe
    const [rows] = await db_1.db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
    if (!user)
        return res.status(404).json({ error: 'User not found' });
    // Vérifie la validité du token GitHub
    try {
        const test = await axios_1.default.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${github_token}` },
        });
        if (test.status !== 200) {
            return res.status(401).json({ error: 'Invalid GitHub token' });
        }
    }
    catch (err) {
        console.error('❌ Invalid GitHub token');
        return res.status(401).json({ error: 'Invalid GitHub token' });
    }
    // ✅ Sauvegarde en BDD
    try {
        await db_1.db.query('UPDATE users SET github_token = ? WHERE email = ?', [github_token, email]);
        res.json({ ok: true });
    }
    catch (err) {
        console.error('❌ Failed to save token:', err);
        res.status(500).json({ error: 'Failed to save token' });
    }
});
exports.default = router;
