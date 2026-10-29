import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserHomePath, isAdmin } from "../features/auth/auth.utils.js";

function SessionLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-400">
      Checking your session...
    </div>
  );
}

export function Protected({ adminOnly = false }) {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) return <SessionLoading />;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin(user)) return <Navigate to="/" replace />;

  return <Outlet />;
}

export function GuestOnly() {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) return <SessionLoading />;
  if (user) return <Navigate to={getUserHomePath(user)} replace />;

  return <Outlet />;
}
