import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight, ArrowUpRight, Star, Clock, Users,
  CheckCircle2, Play, ChevronRight,
} from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const courses = [
  { id: 1, title: "Full-Stack Development",  sub: "React · Node.js · PostgreSQL", duration: "42h",  students: "18.4k", rating: 4.9, level: "Intermediate", progress: 68 },
  { id: 2, title: "UI/UX Design Systems",    sub: "Figma · Design Tokens · A11y",  duration: "28h",  students: "11.2k", rating: 4.8, level: "Advanced",     progress: 0  },
  { id: 3, title: "Machine Learning",        sub: "Python · TensorFlow · Stats",  duration: "36h",  students: "24.7k", rating: 4.9, level: "Beginner",      progress: 0  },
  { id: 4, title: "Cloud & DevOps",          sub: "AWS · Docker · Kubernetes",    duration: "31h",  students: "9.8k",  rating: 4.7, level: "Intermediate", progress: 0  },
];

const testimonials = [
  { name: "Priya Sharma",  role: "Senior Engineer, Stripe",  content: "The most rigorous online curriculum I've encountered. Every project is production-grade.", avatar: "PS" },
  { name: "Marcus Chen",   role: "Product Designer, Linear", content: "Shipped a complete design system in under a month. The structure is exceptional.",       avatar: "MC" },
  { name: "Amara Diallo",  role: "ML Lead, DeepMind",        content: "Feels like learning from the best engineers in the industry. Genuinely elite.",            avatar: "AD" },
];

const stats = [
  { n: "240000", display: "240K+", label: "Active learners"     },
  { n: "1800",   display: "1,800+", label: "Expert instructors" },
  { n: "50000",  display: "50K+",  label: "Hours of content"    },
  { n: "94",     display: "94%",   label: "Completion rate"     },
];

const marqueeItems = [
  "Project-based tracks",
  "Weekly mentor reviews",
  "Interview prep simulators",
  "Real-world capstones",
  "Live cohort sessions",
  "Portfolio-ready output",
];

/* ─────────────────────────────────────────────
   VARIANTS
───────────────────────────────────────────── */
const spring = { type: "spring", stiffness: 80, damping: 18 };
const springFast = { type: "spring", stiffness: 260, damping: 22 };

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0,  transition: spring },
};

const container = (stagger = 0.1) => ({
  hidden: {},
  show:   { transition: { staggerChildren: stagger } },
});

/* ─────────────────────────────────────────────
   SCROLL PROGRESS BAR
───────────────────────────────────────────── */
function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-emerald-600 origin-left z-[100]"
      style={{ scaleX }}
    />
  );
}

/* ─────────────────────────────────────────────
   COUNT-UP STAT
───────────────────────────────────────────── */
function StatCard({ n, display, label, i }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [count, setCount] = useState(0);
  const target = parseInt(n, 10);
  const suffix = display.replace(/[\d,]/g, "");

  useEffect(() => {
    if (!inView) return;
    let frame;
    const start = performance.now();
    const dur = 1600;
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(ease * target));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target]);

  const formatted = target >= 1000
    ? (count >= 1000 ? Math.floor(count / 1000) + "K" : count.toString())
    : count.toString();

  return (
    <motion.div
      ref={ref}
      className="p-6 border-r border-b border-neutral-200 last:border-r-0"
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ ...spring, delay: i * 0.1 }}
    >
      <div className="text-4xl font-serif tabular-nums">
        {inView ? `${formatted}${suffix}` : "0"}
      </div>
      <div className="text-xs text-neutral-400 mt-1">{label}</div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   MAGNETIC BUTTON
───────────────────────────────────────────── */
function MagneticButton({ children, onClick, className }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const x = useSpring(pos.x, { stiffness: 200, damping: 18 });
  const y = useSpring(pos.y, { stiffness: 200, damping: 18 });

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    setPos({
      x: (e.clientX - rect.left - rect.width / 2) * 0.25,
      y: (e.clientY - rect.top - rect.height / 2) * 0.25,
    });
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      className={className}
      style={{ x, y }}
      onMouseMove={handleMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={springFast}
    >
      {children}
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   NAV UNDERLINE LINK
───────────────────────────────────────────── */
function NavLink({ label }) {
  return (
    <motion.a
      href="#"
      className="relative text-sm text-neutral-500 font-medium"
      whileHover="hovered"
      initial="rest"
    >
      <motion.span
        variants={{ rest: { color: "rgb(115 115 115)" }, hovered: { color: "#000" } }}
        transition={{ duration: 0.15 }}
      >
        {label}
      </motion.span>
      <motion.span
        className="absolute -bottom-0.5 left-0 h-px bg-black block"
        variants={{ rest: { width: "0%" }, hovered: { width: "100%" } }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
      />
    </motion.a>
  );
}

/* ─────────────────────────────────────────────
   HERO PARALLAX BLOB
───────────────────────────────────────────── */
function HeroBlob() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, -60]);
  const opacity = useTransform(scrollY, [0, 300], [0.2, 0]);
  return (
    <motion.div
      className="pointer-events-none absolute top-0 right-0 w-[520px] h-[520px] rounded-full"
      style={{
        y, opacity,
        background: "radial-gradient(circle, rgba(16,185,129,0.28) 0%, rgba(251,191,36,0.12) 35%, transparent 72%)",
        filter: "blur(64px)",
      }}
    />
  );
}

function FloatingSkillChips() {
  const chips = [
    { label: "React", x: "68%", y: "18%", delay: 0 },
    { label: "ML", x: "78%", y: "34%", delay: 0.6 },
    { label: "System Design", x: "62%", y: "46%", delay: 1.1 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 hidden md:block">
      {chips.map((chip) => (
        <motion.div
          key={chip.label}
          className="absolute px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50/90 text-xs font-semibold text-emerald-700 shadow-sm"
          style={{ left: chip.x, top: chip.y }}
          initial={{ opacity: 0, y: 8 }}
          animate={{
            opacity: [0.7, 1, 0.7],
            y: [0, -10, 0],
            x: [0, 3, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: chip.delay,
          }}
        >
          {chip.label}
        </motion.div>
      ))}
    </div>
  );
}

function HeroSpotlight() {
  const [spotlight, setSpotlight] = useState({ x: 35, y: 28, active: false });

  useEffect(() => {
    const handleMove = (e) => {
      const width = window.innerWidth || 1;
      const height = Math.max(window.innerHeight * 0.8, 1);

      if (e.clientY > height) {
        setSpotlight((prev) => ({ ...prev, active: false }));
        return;
      }

      setSpotlight({
        x: (e.clientX / width) * 100,
        y: (e.clientY / height) * 100,
        active: true,
      });
    };

    const handleLeave = () => {
      setSpotlight((prev) => ({ ...prev, active: false }));
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseout", handleLeave);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseout", handleLeave);
    };
  }, []);

  return (
    <motion.div className="absolute inset-0 pointer-events-none">
      <motion.div
        className="absolute w-[420px] h-[420px] rounded-full"
        animate={{
          left: `${spotlight.x}%`,
          top: `${spotlight.y}%`,
          opacity: spotlight.active ? 0.38 : 0.16,
          scale: spotlight.active ? 1 : 0.92,
        }}
        transition={{ type: "spring", stiffness: 90, damping: 24 }}
        style={{
          x: "-50%",
          y: "-50%",
          background: "radial-gradient(circle, rgba(16,185,129,0.32) 0%, rgba(16,185,129,0.1) 30%, rgba(16,185,129,0) 72%)",
          filter: "blur(24px)",
        }}
      />
    </motion.div>
  );
}

function AnimatedMeshBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-40 -top-40 w-[42rem] h-[42rem] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.2) 0%, rgba(16,185,129,0) 65%)",
          filter: "blur(30px)",
        }}
        animate={{ x: [0, 70, -20, 0], y: [0, 45, 80, 0], scale: [1, 1.08, 0.96, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-32 top-16 w-[36rem] h-[36rem] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(251,191,36,0.18) 0%, rgba(251,191,36,0) 68%)",
          filter: "blur(32px)",
        }}
        animate={{ x: [0, -80, -30, 0], y: [0, 60, 20, 0], scale: [1, 0.94, 1.06, 1] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(circle at center, black 55%, transparent 100%)",
        }}
        animate={{ backgroundPositionX: ["0px", "96px"], backgroundPositionY: ["0px", "48px"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

function DriftParticles() {
  const dots = [
    { x: "12%", y: "22%", size: "8px", delay: 0 },
    { x: "24%", y: "58%", size: "6px", delay: 0.5 },
    { x: "40%", y: "18%", size: "10px", delay: 1 },
    { x: "57%", y: "62%", size: "7px", delay: 1.4 },
    { x: "73%", y: "28%", size: "9px", delay: 1.9 },
    { x: "86%", y: "54%", size: "6px", delay: 2.2 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 hidden md:block">
      {dots.map((dot, idx) => (
        <motion.span
          key={`dot-${idx}`}
          className="absolute rounded-full bg-emerald-700/50"
          style={{ left: dot.x, top: dot.y, width: dot.size, height: dot.size }}
          animate={{
            y: [0, -18, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.8, 1.15, 0.8],
          }}
          transition={{ duration: 4.5, repeat: Infinity, delay: dot.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function FeatureMarquee() {
  const track = [...marqueeItems, ...marqueeItems];

  return (
    <div className="border border-emerald-100 mt-8 rounded-lg bg-gradient-to-r from-emerald-50/70 via-amber-50/50 to-white overflow-hidden">
      <motion.div
        className="flex items-center gap-6 py-3"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, ease: "linear", repeat: Infinity }}
      >
        {track.map((item, index) => (
          <div key={`${item}-${index}`} className="shrink-0 flex items-center gap-6 text-sm text-neutral-500">
            <span className="uppercase text-[10px] tracking-widest text-emerald-700 font-semibold">LearnForge</span>
            <span>{item}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   COURSE ROW
───────────────────────────────────────────── */
function CourseRow({ c, i }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      className="grid md:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-6 items-center py-6 px-2 cursor-pointer relative"
      initial={{ opacity: 0, x: -32 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ ...spring, delay: i * 0.08 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <motion.div
        className="absolute inset-0 bg-neutral-100 rounded-lg -z-10"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.18 }}
      />

      <div>
        <div className="font-semibold text-sm">{c.title}</div>
        <div className="text-xs text-neutral-400">{c.sub}</div>
        {c.progress > 0 && (
          <div className="mt-3 max-w-[160px]">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-emerald-600 font-medium">In progress</span>
              <span className="text-neutral-400">{c.progress}%</span>
            </div>
            <div className="h-1 bg-neutral-200 rounded overflow-hidden">
              <motion.div
                className="h-full bg-emerald-600 rounded"
                initial={{ width: 0 }}
                animate={inView ? { width: `${c.progress}%` } : {}}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 + 0.4 }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm text-neutral-500"><Clock size={14} /> {c.duration}</div>
      <div className="flex items-center gap-2 text-sm text-neutral-500"><Users size={14} /> {c.students}</div>
      <div className="flex items-center gap-1 text-sm text-neutral-500"><Star size={14} fill="black" /> {c.rating}</div>
      <div><span className="text-xs px-3 py-1 rounded-full bg-neutral-200 text-neutral-600 font-medium">{c.level}</span></div>

      <motion.div
        className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center"
        animate={{
          rotate: hovered ? -45 : 0,
          backgroundColor: hovered ? "#059669" : "#000",
          scale: hovered ? 1.12 : 1,
        }}
        transition={springFast}
      >
        <ArrowUpRight size={14} />
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   TESTIMONIAL CARD
───────────────────────────────────────────── */
function TestimonialCard({ t, i }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      className="border border-amber-100 rounded-xl p-6 bg-gradient-to-b from-white to-amber-50/50"
      initial={{ opacity: 0, y: 36, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ ...spring, delay: i * 0.12 }}
      whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
    >
      <motion.div
        className="flex gap-1 mb-4"
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        variants={container(0.07)}
      >
        {[...Array(5)].map((_, j) => (
          <motion.div
            key={j}
            variants={{
              hidden: { opacity: 0, scale: 0, rotate: -30 },
              show:   { opacity: 1, scale: 1, rotate: 0,
                        transition: { type: "spring", stiffness: 260, damping: 18, delay: i * 0.12 } },
            }}
          >
            <Star size={14} fill="black" />
          </motion.div>
        ))}
      </motion.div>
      <p className="text-sm text-neutral-600 mb-6">"{t.content}"</p>
      <div className="flex items-center gap-3">
        <Avatar><AvatarFallback className="bg-black text-white text-xs font-bold">{t.avatar}</AvatarFallback></Avatar>
        <div>
          <div className="text-sm font-semibold">{t.name}</div>
          <div className="text-xs text-neutral-400">{t.role}</div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const navShadow = useTransform(scrollY, [0, 40], ["0 0 0px rgba(0,0,0,0)", "0 1px 16px rgba(0,0,0,0.07)"]);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffdf6_0%,#f7fbf9_42%,#f5f7fa_100%)] text-neutral-900 font-sans overflow-x-hidden">
      <AnimatedMeshBackground />
      <div className="pointer-events-none absolute inset-0 opacity-60" style={{ backgroundImage: "radial-gradient(circle at 18% 14%, rgba(16,185,129,0.14), transparent 28%), radial-gradient(circle at 82% 20%, rgba(251,191,36,0.14), transparent 26%)" }} />
      <ReadingProgress />

      {/* ── NAV ── */}
      <motion.nav
        className="sticky top-0 z-50 backdrop-blur-md bg-[#fffdf7]/90 border-b border-emerald-100"
        style={{ boxShadow: navShadow }}
      >
        <div className="max-w-6xl mx-auto px-8 h-14 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2 font-bold text-sm"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...spring, delay: 0.05 }}
          >
            <motion.span
              className="w-2 h-2 bg-emerald-600 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            LearnForge
          </motion.div>

          <motion.div
            className="hidden md:flex gap-8"
            initial="hidden" animate="show"
            variants={container(0.07)}
          >
            {["Courses", "Paths", "Projects", "Community"].map((l) => (
              <motion.div key={l} variants={fadeUp}>
                <NavLink label={l} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...spring, delay: 0.15 }}
          >
            <motion.button
              onClick={() => navigate("/signin")}
              className="text-sm text-neutral-500 relative"
              whileHover="hovered" initial="rest"
            >
              <motion.span variants={{ rest: { color: "rgb(115 115 115)" }, hovered: { color: "#000" } }} transition={{ duration: 0.15 }}>
                Sign in
              </motion.span>
              <motion.span
                className="absolute -bottom-0.5 left-0 h-px bg-black block"
                variants={{ rest: { width: "0%" }, hovered: { width: "100%" } }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
              />
            </motion.button>

            <MagneticButton
              onClick={() => navigate("/register")}
              className="bg-black text-white px-6 py-2 rounded-md text-sm font-semibold"
            >
              Get started
            </MagneticButton>
          </motion.div>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <section className="max-w-6xl mx-auto px-8 py-24 relative">
        <HeroBlob />
        <HeroSpotlight />
        <DriftParticles />
        <FloatingSkillChips />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...spring, delay: 0.2 }}
        >
          <motion.span
            className="inline-flex items-center gap-2 text-xs font-medium border border-neutral-200 bg-white px-3 py-1 rounded-full text-neutral-500 mb-6 cursor-default"
            whileHover={{ borderColor: "#6ee7b7", backgroundColor: "#ecfdf5", scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <motion.span
              className="w-2 h-2 bg-emerald-600 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            New: AI-personalized learning paths
          </motion.span>
        </motion.div>

        {/* Headline — word by word */}
        <motion.h1
          className="font-serif text-[clamp(3rem,7vw,5rem)] leading-tight tracking-tight max-w-3xl mb-6"
          initial="hidden" animate="show"
          variants={container(0.05)}
        >
          {["The", "craft", "of", "building"].map((w) => (
            <motion.span key={w} variants={fadeUp} className="inline-block mr-[0.26em]">{w}</motion.span>
          ))}
          <br />
          <motion.em
            className="text-neutral-400 italic"
            variants={{
              hidden: { opacity: 0, y: 24 },
              show:   { opacity: 1, y: 0, transition: { ...spring, delay: 0.25 } },
            }}
          >
            things that matter.
          </motion.em>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-neutral-500 max-w-md text-lg mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.52 }}
        >
          Expert-led courses and hands-on projects that take you from fundamentals to production-ready expertise.
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex gap-4 mb-16"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.64 }}
        >
          <MagneticButton
            onClick={() => navigate("/register")}
            className="bg-black text-white px-6 py-2 rounded-md text-sm font-semibold flex items-center gap-2"
          >
            Explore courses
            <motion.span whileHover={{ x: 4 }} transition={springFast}><ArrowRight size={16} /></motion.span>
          </MagneticButton>
          <MagneticButton className="border border-neutral-300 px-6 py-2 rounded-md text-sm text-neutral-600 flex items-center gap-2">
            <motion.span whileHover={{ scale: 1.3 }} transition={springFast}><Play size={14} /></motion.span>
            Watch demo
          </MagneticButton>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 border border-neutral-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.78, duration: 0.4 }}
        >
          {stats.map((s, i) => <StatCard key={i} {...s} i={i} />)}
        </motion.div>

        <FeatureMarquee />
      </section>

      <Separator />

      {/* ── COURSES ── */}
      <section className="max-w-6xl mx-auto px-8 py-20 relative">
        <div className="pointer-events-none absolute -left-20 top-8 w-56 h-56 rounded-full bg-emerald-200/25 blur-3xl" />
        <motion.div
          className="flex justify-between items-end mb-10"
          initial="hidden" whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={container(0.1)}
        >
          <motion.div variants={fadeUp}>
            <p className="uppercase text-xs tracking-widest text-neutral-400 font-semibold">Curriculum</p>
            <h2 className="font-serif text-3xl mt-2">Featured courses</h2>
          </motion.div>
          <motion.button
            variants={fadeUp}
            className="border border-neutral-300 px-5 py-2 rounded-md text-sm text-neutral-600 flex items-center gap-2"
            whileHover={{ borderColor: "#000", color: "#000" }}
            whileTap={{ scale: 0.97 }}
          >
            View all
            <motion.span whileHover={{ x: 3 }} transition={springFast}><ChevronRight size={14} /></motion.span>
          </motion.button>
        </motion.div>

        <div className="divide-y divide-neutral-200 border-t border-neutral-200">
          {courses.map((c, i) => <CourseRow key={c.id} c={c} i={i} />)}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="max-w-6xl mx-auto px-8 py-20 relative">
        <div className="pointer-events-none absolute -right-20 top-10 w-60 h-60 rounded-full bg-amber-200/25 blur-3xl" />
        <motion.div
          initial="hidden" whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={container(0.08)}
        >
          <motion.p variants={fadeUp} className="uppercase text-xs tracking-widest text-neutral-400 font-semibold mb-4">Testimonials</motion.p>
          <motion.h2 variants={fadeUp} className="font-serif text-3xl mb-10">Trusted by builders</motion.h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => <TestimonialCard key={i} t={t} i={i} />)}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-neutral-200 py-24">
        <div className="max-w-6xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center">
          <motion.h2
            className="font-serif text-5xl leading-tight"
            initial="hidden" whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            variants={container(0.06)}
          >
            {["Start", "building"].map((w) => (
              <motion.span key={w} variants={fadeUp} className="inline-block mr-[0.25em]">{w}</motion.span>
            ))}
            <br />
            <motion.em className="text-neutral-400 italic" variants={fadeUp}>something real.</motion.em>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ ...spring, delay: 0.15 }}
          >
            <p className="text-neutral-500 mb-8">
              Join 240,000+ engineers, designers, and data scientists who chose LearnForge to level up their careers.
            </p>
            <div className="flex gap-4 mb-6">
              <MagneticButton
                onClick={() => navigate("/register")}
                className="bg-black text-white px-6 py-3 rounded-md font-semibold flex items-center gap-2"
              >
                Get started free
                <motion.span whileHover={{ x: 4 }} transition={springFast}><ArrowRight size={16} /></motion.span>
              </MagneticButton>
              <MagneticButton className="border border-neutral-300 px-6 py-3 rounded-md text-neutral-600">
                View pricing
              </MagneticButton>
            </div>
            <motion.div
              className="flex items-center gap-2 text-xs text-neutral-400"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.4 }}
            >
              <CheckCircle2 size={14} className="text-emerald-600" />
              No credit card required · 7-day free trial
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <motion.footer
        className="border-t border-neutral-200 py-6"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true }} transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-8 flex justify-between text-sm text-neutral-400">
          <span>© 2025 LearnForge</span>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Blog", "Contact"].map((l) => (
              <motion.a
                key={l} href="#"
                className="relative"
                whileHover="hovered" initial="rest"
              >
                <motion.span variants={{ rest: { color: "rgb(163 163 163)" }, hovered: { color: "#000" } }} transition={{ duration: 0.15 }}>{l}</motion.span>
                <motion.span
                  className="absolute -bottom-0.5 left-0 h-px bg-neutral-500 block"
                  variants={{ rest: { width: "0%" }, hovered: { width: "100%" } }}
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                />
              </motion.a>
            ))}
          </div>
        </div>
      </motion.footer>
    </div>
  );
}