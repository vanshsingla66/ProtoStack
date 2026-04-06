import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  Bot,
  User,
  Settings,
  LogOut,
  X
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Map, label: "Roadmap", path: "/roadmap" },
  { icon: Bot, label: "AI Interview", path: "/ai-interview" },
  { icon: User, label: "Profile", path: "/profile" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function Sidebar({
  collapsed,
  mobile = false,
  setMobileOpen,
  user,
  onSignOut
}) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className={`flex items-center gap-2 h-14 border-b px-5 ${collapsed && !mobile ? "justify-center" : ""}`}>
        <span className="w-2 h-2 bg-blue-600 rounded-full" />
        {(!collapsed || mobile) && <span className="font-bold text-sm">LearnForge</span>}

        {mobile && (
          <button onClick={() => setMobileOpen(false)} className="ml-auto text-gray-400 hover:text-black">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ icon: Icon, label, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
              text-gray-500 hover:bg-gray-50 hover:text-black
              ${collapsed && !mobile ? "justify-center" : ""}`}
          >
            <Icon size={16} />
            {(!collapsed || mobile) && label}
          </button>
        ))}
      </nav>

      {/* User */}
      {(!collapsed || mobile) && (
        <div className="px-5 pb-5 pt-3 border-t">
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-black text-white text-xs font-bold">
                {user?.name?.[0] ?? "M"}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <div className="text-xs font-semibold truncate">{user?.name}</div>
              <div className="text-xs text-gray-400 truncate">{user?.email}</div>
            </div>
          </div>

          <button
            onClick={() => {
              onSignOut?.();
              navigate("/");
            }}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-red-500"
          >
            <LogOut size={12} /> Sign out
          </button>
        </div>
      )}

      {/* Collapsed logout */}
      {collapsed && !mobile && (
        <div className="pb-4 flex justify-center border-t pt-4">
          <button
            onClick={() => {
              onSignOut?.();
              navigate("/");
            }}
            className="text-gray-400 hover:text-red-500"
          >
            <LogOut size={16} />
          </button>
        </div>
      )}
    </div>
  );
}