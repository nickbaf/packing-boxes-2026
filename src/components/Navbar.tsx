import { Link, useLocation } from "react-router-dom";
import { Package, Plus, Search, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import SaveButton from "@/components/SaveButton";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", label: "Boxes", icon: Package },
  { to: "/add", label: "Add Box", icon: Plus },
  { to: "/search", label: "Search", icon: Search },
];

export default function Navbar() {
  const { username, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="no-print sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold text-zinc-100">
            <Package className="h-5 w-5 text-blue-400" />
            PackBox
          </Link>
          <div className="flex items-center gap-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  location.pathname === to
                    ? "bg-zinc-800 text-zinc-100"
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SaveButton />
          <span className="text-sm text-zinc-500">{username}</span>
          <button
            onClick={logout}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}
