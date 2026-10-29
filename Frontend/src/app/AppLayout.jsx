import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Bot } from "lucide-react";
import { getCurrentUser } from "../features/auth/service/auth.service.js";
import { setError, setLoading, setUser } from "../features/auth/auth.slice.js";
import { isAdmin } from "../features/auth/auth.utils.js";

const navigationLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/arena", label: "Arena" },
  { to: "/chat", label: "Chat" },
  { to: "/video", label: "Video" },
];

function AppLayout() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    let active = true;

    getCurrentUser()
      .then((currentUser) => {
        if (active) dispatch(setUser(currentUser));
      })
      .catch((error) => {
        if (!active) return;

        dispatch(setUser(null));
        if (error?.response?.status !== 401) {
          dispatch(
            setError(
              error?.response?.data?.message ||
                error?.message ||
                "Unable to verify your session. Please try again.",
            ),
          );
        }
      })
      .finally(() => {
        if (active) dispatch(setLoading(false));
      });

    return () => {
      active = false;
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#06080F] text-slate-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#090C14]/95 backdrop-blur-xl">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8"
        >
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-indigo-300">
              <Bot className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-base font-semibold tracking-tight text-white">
              Cosmos
            </span>
          </Link>

          <div className="flex min-w-0 items-center gap-1 overflow-x-auto">
            {user ? (
              <>
                {navigationLinks.map(({ to, label, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors ${
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
                {isAdmin(user) && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors ${
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                      }`
                    }
                  >
                    Admin
                  </NavLink>
                )}
                <span className="ml-2 hidden whitespace-nowrap border-l border-white/10 pl-4 text-xs text-slate-400 sm:inline">
                  {user.username || user.email}
                </span>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                    }`
                  }
                >
                  Sign in
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                    }`
                  }
                >
                  Create account
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}

export default AppLayout;
