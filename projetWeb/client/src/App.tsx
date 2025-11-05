// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AddTokenPage from "./pages/AddTokenPage";
import OrgReposPage from "./pages/OrgReposPage";
import HomePage from "./pages/HomePage";
import AddMemberPage from "./pages/AddMemberPage"; // ✅ <-- L'import manquant
import CreateRepoPage from "./pages/CreateRepoPage"; // ✅
import InvitePage from "./pages/InvitePage";

export default function App() {
    return (
        <Routes>
            {/* Redirection vers /login si on est sur / */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/add-token" element={<AddTokenPage />} />
            <Route path="/org/:org" element={<OrgReposPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/org/:org/repos/:repo/members" element={<AddMemberPage />} />
            <Route path="/org/:org/repos/new" element={<CreateRepoPage />} />
            <Route path="/invite" element={<InvitePage />} />
        </Routes>
    );
}
