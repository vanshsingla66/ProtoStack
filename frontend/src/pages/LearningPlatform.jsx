import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  ArrowUpRight,
  Star,
  Clock,
  Users,
  CheckCircle2,
  Play,
  ChevronRight,
} from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Full-Stack Development",
    sub: "React · Node.js · PostgreSQL",
    duration: "42h",
    students: "18.4k",
    rating: 4.9,
    level: "Intermediate",
    progress: 68,
  },
  {
    id: 2,
    title: "UI/UX Design Systems",
    sub: "Figma · Design Tokens · A11y",
    duration: "28h",
    students: "11.2k",
    rating: 4.8,
    level: "Advanced",
    progress: 0,
  },
  {
    id: 3,
    title: "Machine Learning",
    sub: "Python · TensorFlow · Stats",
    duration: "36h",
    students: "24.7k",
    rating: 4.9,
    level: "Beginner",
    progress: 0,
  },
  {
    id: 4,
    title: "Cloud & DevOps",
    sub: "AWS · Docker · Kubernetes",
    duration: "31h",
    students: "9.8k",
    rating: 4.7,
    level: "Intermediate",
    progress: 0,
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Senior Engineer, Stripe",
    content:
      "The most rigorous online curriculum I've encountered. Every project is production-grade.",
    avatar: "PS",
  },
  {
    name: "Marcus Chen",
    role: "Product Designer, Linear",
    content:
      "Shipped a complete design system in under a month. The structure is exceptional.",
    avatar: "MC",
  },
  {
    name: "Amara Diallo",
    role: "ML Lead, DeepMind",
    content:
      "Feels like learning from the best engineers in the industry. Genuinely elite.",
    avatar: "AD",
  },
];

export default function LearningPlatform() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 text-neutral-900 font-sans">
      {/* NAV */}
      <nav className="sticky top-0 z-50 backdrop-blur bg-stone-50/90 border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            LearnForge
          </div>

          <div className="hidden md:flex gap-8 text-sm text-neutral-500 font-medium">
            {["Courses", "Paths", "Projects", "Community"].map((l) => (
              <a key={l} href="#" className="hover:text-black transition">
                {l}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a href="#" className="text-sm text-neutral-500 hover:text-black">
              Sign in
            </a>
            <button className="bg-black text-white px-6 py-2 rounded-md text-sm font-semibold flex items-center gap-2 transition hover:bg-blue-600">
              Get started
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-8 py-24">
        <div
          className={`transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="inline-flex items-center gap-2 text-xs font-medium border border-neutral-200 bg-white px-3 py-1 rounded-full text-neutral-500 mb-6">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            New: AI-personalized learning paths
          </span>

          <h1 className="font-serif text-[clamp(3rem,7vw,5rem)] leading-tight tracking-tight max-w-3xl mb-6">
            The craft of building{" "}
            <em className="text-neutral-400 italic">
              things that matter.
            </em>
          </h1>
        </div>

        <p className="text-neutral-500 max-w-md text-lg mb-10">
          Expert-led courses and hands-on projects that take you from
          fundamentals to production-ready expertise.
        </p>

        <div className="flex gap-4 mb-16">
          <button className="bg-black text-white px-6 py-2 rounded-md text-sm font-semibold flex items-center gap-2 transition hover:bg-blue-600">
            Explore courses <ArrowRight size={16} />
          </button>

          <button className="border border-neutral-300 px-6 py-2 rounded-md text-sm text-neutral-600 flex items-center gap-2 transition hover:border-black hover:text-black">
            <Play size={14} /> Watch demo
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 border border-neutral-200">
          {[
            ["240K+", "Active learners"],
            ["1,800+", "Expert instructors"],
            ["50K+", "Hours of content"],
            ["94%", "Completion rate"],
          ].map(([n, l], i) => (
            <div
              key={i}
              className="p-6 border-r border-b border-neutral-200 last:border-r-0"
            >
              <div className="text-4xl font-serif">{n}</div>
              <div className="text-xs text-neutral-400 mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* COURSES */}
      <section className="max-w-6xl mx-auto px-8 py-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="uppercase text-xs tracking-widest text-neutral-400 font-semibold">
              Curriculum
            </p>
            <h2 className="font-serif text-3xl mt-2">
              Featured courses
            </h2>
          </div>

          <button className="border border-neutral-300 px-5 py-2 rounded-md text-sm text-neutral-600 flex items-center gap-2 transition hover:border-black hover:text-black">
            View all <ChevronRight size={14} />
          </button>
        </div>

        <div className="divide-y divide-neutral-200 border-t border-neutral-200">
          {courses.map((c) => (
            <div
              key={c.id}
              className="grid md:grid-cols-6 gap-6 items-center py-6 hover:bg-neutral-100 transition group"
            >
              <div className="md:col-span-2">
                <div className="font-semibold text-sm">{c.title}</div>
                <div className="text-xs text-neutral-400">{c.sub}</div>

                {c.progress > 0 && (
                  <div className="mt-3 max-w-[160px]">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-blue-600 font-medium">
                        In progress
                      </span>
                      <span className="text-neutral-400">
                        {c.progress}%
                      </span>
                    </div>
                    <div className="h-1 bg-neutral-200 rounded">
                      <div
                        className="h-full bg-blue-600 rounded"
                        style={{ width: `${c.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <Clock size={14} /> {c.duration}
              </div>

              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <Users size={14} /> {c.students}
              </div>

              <div className="flex items-center gap-1 text-sm text-neutral-500">
                <Star size={14} fill="black" /> {c.rating}
              </div>

              <div>
                <span className="text-xs px-3 py-1 rounded-full bg-neutral-200 text-neutral-600 font-medium">
                  {c.level}
                </span>
              </div>

              <div className="flex justify-end">
                <div className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center transition group-hover:-rotate-45 group-hover:bg-blue-600">
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-6xl mx-auto px-8 py-20">
        <p className="uppercase text-xs tracking-widest text-neutral-400 font-semibold mb-4">
          Testimonials
        </p>

        <h2 className="font-serif text-3xl mb-10">
          Trusted by builders
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="border border-neutral-200 rounded-xl p-6 bg-white hover:shadow-xl transition"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={14} fill="black" />
                ))}
              </div>

              <p className="text-sm text-neutral-600 mb-6">
                "{t.content}"
              </p>

              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-black text-white text-xs font-bold">
                    {t.avatar}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <div className="text-sm font-semibold">
                    {t.name}
                  </div>
                  <div className="text-xs text-neutral-400">
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-neutral-200 py-24">
        <div className="max-w-6xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center">
          <h2 className="font-serif text-5xl leading-tight">
            Start building <br />
            <em className="text-neutral-400 italic">
              something real.
            </em>
          </h2>

          <div>
            <p className="text-neutral-500 mb-8">
              Join 240,000+ engineers, designers, and data scientists
              who chose LearnForge to level up their careers.
            </p>

            <div className="flex gap-4 mb-6">
              <button className="bg-black text-white px-6 py-3 rounded-md font-semibold flex items-center gap-2 hover:bg-blue-600 transition">
                Get started free <ArrowRight size={16} />
              </button>

              <button className="border border-neutral-300 px-6 py-3 rounded-md text-neutral-600 hover:border-black hover:text-black transition">
                View pricing
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <CheckCircle2 size={14} className="text-blue-600" />
              No credit card required · 7-day free trial
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-neutral-200 py-6">
        <div className="max-w-6xl mx-auto px-8 flex justify-between text-sm text-neutral-400">
          <span>© 2025 LearnForge</span>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Blog", "Contact"].map((l) => (
              <a key={l} href="#" className="hover:text-black transition">
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}