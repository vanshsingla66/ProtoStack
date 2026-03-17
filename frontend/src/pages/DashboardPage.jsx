import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, TrendingUp, User, Settings, LogOut,
  Search, Bell, ChevronRight, Clock, Users, Star, ArrowUpRight,
  Play, Menu, X
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const COURSES = [
  { id: 1, title: "Full-Stack Development", sub: "React · Node.js · PostgreSQL", duration: "42h", students: "18.4k", rating: 4.9, level: "Intermediate", progress: 68 },
  { id: 2, title: "UI/UX Design Systems", sub: "Figma · Design Tokens · A11y", duration: "28h", students: "11.2k", rating: 4.8, level: "Advanced", progress: 34 },
  { id: 3, title: "Machine Learning", sub: "Python · TensorFlow · Stats", duration: "36h", students: "24.7k", rating: 4.9, level: "Beginner", progress: 0 },
  { id: 4, title: "Cloud & DevOps", sub: "AWS · Docker · Kubernetes", duration: "31h", students: "9.8k", rating: 4.7, level: "Intermediate", progress: 0 },
];

const ACTIVITY = [
  { emoji: "✅", label: "Completed: React Hooks & Context lecture", time: "2h ago" },
  { emoji: "▶️", label: "Started: TypeScript Generics — Chapter 3", time: "Yesterday" },
  { emoji: "🏆", label: "Earned badge: Quick Learner (5 days streak)", time: "2 days ago" },
  { emoji: "👥", label: "Joined community: System Design Circle", time: "3 days ago" },
];

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: BookOpen, label: "Courses" },
  { icon: TrendingUp, label: "Progress" },
  { icon: User, label: "Profile" },
  { icon: Settings, label: "Settings" },
];

export default function DashboardPage({ user, onSignOut }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const firstName = user?.name?.split(" ")[0] ?? "there";

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full">
      <div className={`flex items-center gap-2 h-14 border-b border-neutral-200 px-5 shrink-0 ${collapsed && !mobile ? "justify-center" : ""}`}>
        <span className="w-2 h-2 bg-blue-600 rounded-full shrink-0" />
        {(!collapsed || mobile) && <span className="font-bold text-sm">LearnForge</span>}
        {mobile && (
          <button onClick={() => setMobileOpen(false)} className="ml-auto text-neutral-400 hover:text-black">
            <X size={16} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
              ${active ? "bg-neutral-100 text-black" : "text-neutral-500 hover:bg-neutral-50 hover:text-black"}
              ${collapsed && !mobile ? "justify-center" : ""}`}
          >
            <Icon size={15} className="shrink-0" />
            {(!collapsed || mobile) && label}
          </button>
        ))}
      </nav>

      {(!collapsed || mobile) && (
        <div className="px-5 pb-5 pt-3 border-t border-neutral-200">
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-black text-white text-xs font-bold">
                {user?.name?.[0] ?? "M"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="text-xs font-semibold truncate">{user?.name}</div>
              <div className="text-xs text-neutral-400 truncate">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={() => { onSignOut?.(); navigate("/"); }}
            className="flex items-center gap-2 text-xs text-neutral-400 hover:text-red-500 transition"
          >
            <LogOut size={12} /> Sign out
          </button>
        </div>
      )}

      {collapsed && !mobile && (
        <div className="pb-4 flex justify-center border-t border-neutral-200 pt-4">
          <button onClick={() => { onSignOut?.(); navigate("/"); }} className="text-neutral-400 hover:text-red-500 transition">
            <LogOut size={15} />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-stone-50 text-neutral-900 font-sans overflow-hidden">
      {/* Desktop sidebar */}
      <aside
        style={{ width: collapsed ? 60 : 220 }}
        className="hidden md:flex flex-col border-r border-neutral-200 bg-white shrink-0 transition-all duration-300 overflow-hidden"
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay sidebar */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-56 bg-white border-r border-neutral-200 h-full z-10">
            <SidebarContent mobile />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top nav */}
        <header className="h-14 border-b border-neutral-200 bg-white flex items-center justify-between px-5 shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-neutral-400 hover:text-black transition"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={18} />
            </button>
            <button
              onClick={() => setCollapsed(c => !c)}
              className="hidden md:block text-neutral-400 hover:text-black transition"
            >
              <Menu size={16} />
            </button>
            <div className="relative hidden sm:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300" />
              <input
                placeholder="Search courses, topics…"
                className="border border-neutral-200 rounded-md pl-9 pr-3 h-8 text-sm outline-none focus:border-black transition bg-stone-50 w-56 placeholder:text-neutral-300"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative text-neutral-400 hover:text-black transition">
              <Bell size={16} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-600 rounded-full" />
            </button>
            <Avatar className="w-7 h-7">
              <AvatarFallback className="bg-black text-white text-xs font-bold">
                {user?.name?.[0] ?? "M"}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Body */}
        <main className={`flex-1 overflow-y-auto px-5 md:px-8 py-8 space-y-10 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>

          {/* Greeting */}
          <div>
            <p className="uppercase text-xs tracking-widest text-neutral-400 font-semibold mb-1">Dashboard</p>
            <h1 className="font-serif text-3xl">Welcome back, {firstName}.</h1>
            <p className="text-sm text-neutral-500 mt-1">You have 2 courses in progress. Your streak is 9 days 🔥</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 border border-neutral-200">
            {[
              ["12", "Courses enrolled"],
              ["47h", "This month"],
              ["9", "Day streak"],
              ["2,340", "XP earned"],
            ].map(([val, label], i) => (
              <div key={i} className="p-5 border-r border-b border-neutral-200 last:border-r-0">
                <div className="text-3xl font-serif">{val}</div>
                <div className="text-xs text-neutral-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* AI Recommended Courses */}
          <section>
            <div className="flex justify-between items-end mb-5">
              <div>
                <p className="uppercase text-xs tracking-widest text-neutral-400 font-semibold">AI Recommended</p>
                <h2 className="font-serif text-2xl mt-1">Your learning path</h2>
              </div>
              <button className="border border-neutral-300 px-4 py-1.5 rounded-md text-sm text-neutral-600 flex items-center gap-2 hover:border-black hover:text-black transition">
                View all <ChevronRight size={13} />
              </button>
            </div>

            <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-xl overflow-hidden bg-white">
              {COURSES.map((c) => (
                <div key={c.id} className="grid md:grid-cols-5 gap-4 items-center px-5 py-5 hover:bg-neutral-50 transition group cursor-pointer">
                  <div className="md:col-span-2">
                    <div className="font-semibold text-sm">{c.title}</div>
                    <div className="text-xs text-neutral-400 mt-0.5">{c.sub}</div>
                    {c.progress > 0 && (
                      <div className="mt-2.5 max-w-[160px]">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-blue-600 font-medium">In progress</span>
                          <span className="text-neutral-400">{c.progress}%</span>
                        </div>
                        <div className="h-1 bg-neutral-200 rounded">
                          <div className="h-full bg-blue-600 rounded transition-all" style={{ width: `${c.progress}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500"><Clock size={12} /> {c.duration}</div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500"><Star size={12} fill="black" /> {c.rating}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-full font-medium">{c.level}</span>
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center group-hover:-rotate-45 group-hover:bg-blue-600 transition-all">
                      <ArrowUpRight size={13} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent activity */}
          <section>
            <p className="uppercase text-xs tracking-widest text-neutral-400 font-semibold mb-4">Recent Activity</p>
            <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white divide-y divide-neutral-100">
              {ACTIVITY.map((item, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-neutral-50 transition">
                  <span className="text-lg">{item.emoji}</span>
                  <p className="flex-1 text-sm text-neutral-700">{item.label}</p>
                  <span className="text-xs text-neutral-400 shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}