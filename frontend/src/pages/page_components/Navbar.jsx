import { Menu, Search, Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar({
  user,
  setMobileOpen,
  setCollapsed
}) {
  return (
    <header className="h-14 border-b border-neutral-200 bg-white flex items-center justify-between px-5 shrink-0">
      
      {/* Left Side */}
      <div className="flex items-center gap-3">
        
        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-neutral-400 hover:text-black transition"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={18} />
        </button>

        {/* Desktop Collapse Button */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="hidden md:block text-neutral-400 hover:text-black transition"
        >
          <Menu size={16} />
        </button>

        {/* Search */}
        <div className="relative hidden sm:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300" />
          <input
            placeholder="Search courses, topics…"
            className="border border-neutral-200 rounded-md pl-9 pr-3 h-8 text-sm outline-none focus:border-black transition bg-stone-50 w-56 placeholder:text-neutral-300"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        
        {/* Notifications */}
        <button className="relative text-neutral-400 hover:text-black transition">
          <Bell size={16} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-600 rounded-full" />
        </button>

        {/* User Avatar */}
        <Avatar className="w-7 h-7">
          <AvatarFallback className="bg-black text-white text-xs font-bold">
            {user?.name?.[0] ?? "M"}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}