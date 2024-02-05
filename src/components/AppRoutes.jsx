import React from "react";
import { Routes, Route } from "react-router-dom";
import JoinChatForm from "./JoinChatForm";
import Chat from "./Chat";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<JoinChatForm />} />
            <Route path="/chat/:id" element={<Chat />} />
        </Routes>
    );
}
