import { useEffect, useState } from "react";
import {
  ChevronRight, Clock, Star, ArrowUpRight
} from "lucide-react";

const COURSES = [
  { id: 1, title: "Full-Stack Development", sub: "React · Node.js · PostgreSQL", duration: "42h", rating: 4.9, level: "Intermediate", progress: 68 },
  { id: 2, title: "UI/UX Design Systems", sub: "Figma · Design Tokens · A11y", duration: "28h", rating: 4.8, level: "Advanced", progress: 34 },
  { id: 3, title: "Machine Learning", sub: "Python · TensorFlow · Stats", duration: "36h", rating: 4.9, level: "Beginner", progress: 0 },
  { id: 4, title: "Cloud & DevOps", sub: "AWS · Docker · Kubernetes", duration: "31h", rating: 4.7, level: "Intermediate", progress: 0 },
];

const ACTIVITY = [
  { emoji: "✅", label: "Completed: React Hooks & Context lecture", time: "2h ago" },
  { emoji: "▶️", label: "Started: TypeScript Generics — Chapter 3", time: "Yesterday" },
  { emoji: "🏆", label: "Earned badge: Quick Learner (5 days streak)", time: "2 days ago" },
  { emoji: "👥", label: "Joined community: System Design Circle", time: "3 days ago" },
];

export default function DashboardPage({ user }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className={`space-y-10 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>

      {/* Greeting */}
      <div>
        <p className="uppercase text-xs tracking-widest text-neutral-400 font-semibold mb-1">
          Dashboard
        </p>
        <h1 className="font-serif text-3xl">
          Welcome back, {firstName}.
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          You have 2 courses in progress. Your streak is 9 days 🔥
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 border border-neutral-200">
        {[
          ["12", "Courses enrolled"],
          ["47h", "This month"],
          ["9", "Day streak"],
          ["2,340", "XP earned"],
        ].map(([val, label], i) => (
          <div key={i} className="p-5 border-r border-b last:border-r-0">
            <div className="text-3xl font-serif">{val}</div>
            <div className="text-xs text-neutral-400 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Courses */}
      <section>
        <div className="flex justify-between items-end mb-5">
          <div>
            <p className="uppercase text-xs text-neutral-400 font-semibold">
              AI Recommended
            </p>
            <h2 className="font-serif text-2xl mt-1">
              Your learning path
            </h2>
          </div>

          <button className="border px-4 py-1.5 rounded-md text-sm flex items-center gap-2 hover:border-black">
            View all <ChevronRight size={13} />
          </button>
        </div>

        <div className="divide-y border rounded-xl overflow-hidden bg-white">
          {COURSES.map((c) => (
            <div key={c.id} className="grid md:grid-cols-5 gap-4 items-center px-5 py-5 hover:bg-neutral-50 group cursor-pointer">
              
              <div className="md:col-span-2">
                <div className="font-semibold text-sm">{c.title}</div>
                <div className="text-xs text-neutral-400">{c.sub}</div>

                {c.progress > 0 && (
                  <div className="mt-2 max-w-[160px]">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-blue-600">In progress</span>
                      <span>{c.progress}%</span>
                    </div>
                    <div className="h-1 bg-neutral-200 rounded">
                      <div
                        className="h-full bg-blue-600 rounded"
                        style={{ width: `${c.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="text-xs text-neutral-500 flex items-center gap-1">
                <Clock size={12} /> {c.duration}
              </div>

              <div className="text-xs text-neutral-500 flex items-center gap-1">
                <Star size={12} fill="black" /> {c.rating}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs px-2 py-1 bg-neutral-100 rounded-full">
                  {c.level}
                </span>

                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center group-hover:-rotate-45 group-hover:bg-blue-600 transition">
                  <ArrowUpRight size={13} />
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* Activity */}
      <section>
        <p className="uppercase text-xs text-neutral-400 font-semibold mb-4">
          Recent Activity
        </p>

        <div className="border rounded-xl bg-white divide-y">
          {ACTIVITY.map((item, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-neutral-50">
              <span>{item.emoji}</span>
              <p className="flex-1 text-sm">{item.label}</p>
              <span className="text-xs text-neutral-400">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}