import { Navigate, Outlet } from "react-router";
import { getJWT } from "~/data/auth";

export default function ProtectedRoute() {
  const jwt = getJWT();

  if (!jwt) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

