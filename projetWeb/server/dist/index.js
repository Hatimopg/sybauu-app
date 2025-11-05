"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("dotenv/config");
const auth_1 = __importDefault(require("./routes/auth"));
const api_1 = __importDefault(require("./routes/api"));
const user_1 = __importDefault(require("./routes/user"));
const invite_1 = __importDefault(require("./routes/invite"));
const app = (0, express_1.default)();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5174';
app.use((0, cors_1.default)({
    origin: FRONTEND_URL,
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// 🔹 Routes principales
app.use('/auth', auth_1.default);
app.use('/api', api_1.default);
app.use('/user', user_1.default);
app.use("/api/invite", invite_1.default);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
