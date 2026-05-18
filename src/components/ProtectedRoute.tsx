import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: Array<"user" | "admin" | "sysadmin" | "execsysadmin">;
};

type StoredAuthUser = {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: "user" | "admin" | "sysadmin" | "execsysadmin";
};

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const token = localStorage.getItem("auth_token");
  const rawUser = localStorage.getItem("auth_user");

  if (!token || !rawUser) {
    return <Navigate to="/login" replace />;
  }

  let authUser: StoredAuthUser | null = null;

  try {
    authUser = JSON.parse(rawUser);
  } catch {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    (!authUser?.role || !allowedRoles.includes(authUser.role))
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}