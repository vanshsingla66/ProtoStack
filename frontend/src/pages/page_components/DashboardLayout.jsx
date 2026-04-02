import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout({ user, onSignOut }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-stone-50 text-neutral-900 overflow-hidden">

      {/* Sidebar */}
      <aside
        style={{ width: collapsed ? 60 : 220 }}
        className="hidden md:flex flex-col border-r bg-white transition-all"
      >
        <Sidebar
          collapsed={collapsed}
          user={user}
          onSignOut={onSignOut}
        />
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-56 bg-white border-r h-full z-10">
            <Sidebar
              mobile
              setMobileOpen={setMobileOpen}
              user={user}
              onSignOut={onSignOut}
            />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        <Navbar
          user={user}
          setMobileOpen={setMobileOpen}
          setCollapsed={setCollapsed}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto px-5 md:px-8 py-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
}