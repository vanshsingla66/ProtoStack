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
        
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        
        {/* Notifications */}
        

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