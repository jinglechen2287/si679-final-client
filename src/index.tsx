import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import ProtectedRoute from "./routes/ProtectedRoute.tsx";
import Login from "./routes/Auth/Login.tsx";
import Register from "./routes/Auth/Register.tsx";
import Dashboard from "./routes/Dashboard/Dashboard.tsx";
import Editor from "./routes/Editor/Editor.tsx";
import "./index.css";
import EditProfile from "./routes/Auth/EditProfile.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<EditProfile />} />
          <Route path="/:projectId" element={<Editor />} />
        </Route>

        <Route path="/*" element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
