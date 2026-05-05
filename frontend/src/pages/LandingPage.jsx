import { useNavigate } from "react-router-dom";
import { motion, useScroll, useSpring, useInView, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowRight, CheckCircle2, Zap, Code, TrendingUp, LineChart, Star, Rocket, Play, ChevronRight, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const spring = { type: "spring", stiffness: 80, damping: 18 };
const container = (stagger = 0.1) => ({ hidden: {}, show: { transition: { staggerChildren: stagger } } });
const fadeUp = { hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: spring } };

const features = [
  { id: 1, title: "AI Interview Practice", description: "Get role-specific technical questions with AI-powered scoring. Real feedback in real-time.", icon: Zap, color: "emerald" },
  { id: 2, title: "Resume Analysis", description: "Auto-parse resumes to extract skills and create a complete profile that powers everything.", icon: Code, color: "blue" },
  { id: 3, title: "Learning Roadmaps", description: "Personalized step-by-step roadmaps based on your skills and career goals.", icon: TrendingUp, color: "violet" },
];

const testimonials = [
  { name: "Sarah Chen", role: "Frontend Engineer", content: "The technical questions felt real. Actually helped me prep better than courses.", avatar: "SC", color: "bg-emerald-500" },
  { name: "Priya Verma", role: "Backend Engineer", content: "System design scenarios were spot-on. Got offers from 3 companies.", avatar: "PV", color: "bg-blue-500" },
  { name: "James Park", role: "ML Engineer", content: "Best interview prep I've used. The feedback loop is amazing.", avatar: "JP", color: "bg-violet-500" },
];

const stats = [
  { n: "50", display: "50+", label: "Sessions run" },
  { n: "1000", display: "1K+", label: "Interviews taken" },
  { n: "95", display: "95%", label: "Found it helpful" },
];

const howItWorks = [
  { step: 1, title: "Create Your Profile", description: "Upload your resume and our AI extracts your skills automatically.", icon: Zap },
  { step: 2, title: "Practice with AI", description: "Get personalized technical questions based on your role and experience level.", icon: Code },
  { step: 3, title: "Get Real Feedback", description: "AI analyzes your answers and provides detailed improvement suggestions.", icon: LineChart },
  { step: 4, title: "Track Progress", description: "Monitor your growth with our interactive dashboard and personalized roadmap.", icon: TrendingUp },
];

const faqItems = [
  { question: "How does the AI generate questions?", answer: "Our AI uses role-specific templates combined with deep learning to generate questions that match real interview patterns from top companies." },
  { question: "Can I track my progress?", answer: "Yes! You get a comprehensive dashboard showing all your interviews, scores trends, and a personalized roadmap based on your gaps." },
  { question: "Is my resume data secure?", answer: "Absolutely. We use industry-standard encryption and never share your data with third parties." },
  { question: "Do you offer team/company plans?", answer: "Yes, reach out to our sales team for enterprise pricing and bulk licensing options." },
  { question: "Can I export my results?", answer: "You can download detailed interview reports as PDF for your records and to share with mentors." },
];

const benefits = [
  { title: "Role-Specific Questions", desc: "Questions tailored to your target role—Frontend, Backend, ML, DevOps, Data Science, QA." },
  { title: "Real-Time Feedback", desc: "Get immediate analysis on clarity, depth, technical accuracy, and communication style." },
  { title: "Skill Gap Analysis", desc: "Identify weak areas and get a personalized roadmap to address them before your real interview." },
  { title: "Unlimited Practice", desc: "Practice as many times as you want with new questions every session." },
  { title: "Resume Parsing", desc: "Our AI extracts skills automatically so your interview questions match your actual background." },
  { title: "Progress Tracking", desc: "Visualize your improvement over time with detailed analytics and score history." },
];

function NavLink({ label, to, onClick, active }) {
  return (
    <motion.a
      href={`#${to}`}
      onClick={(e) => {
        e.preventDefault();
        onClick && onClick(to);
      }}
      className={`text-sm font-medium transition-colors ${
        active ? "text-emerald-600" : "text-neutral-600 hover:text-neutral-900"
      }`}
    >
      {label}
    </motion.a>
  );
}

function StatCard({ n, display, label, i }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / 1200, 1);
      setCount(Math.round(p * parseInt(n, 10)));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView]);

  return (
    <motion.div ref={ref} className="text-center" initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ ...spring, delay: i * 0.1 }}>
      <div className="text-3xl font-bold text-emerald-600">{inView ? display : "0"}</div>
      <div className="text-sm text-neutral-600 mt-1">{label}</div>
    </motion.div>
  );
}

function FeatureCard({ feature, i }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      className="p-6 border border-neutral-200 rounded-xl bg-white hover:border-emerald-300 hover:shadow-lg transition-all group"
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ ...spring, delay: i * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <motion.div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
        <Icon className="text-emerald-600" size={24} />
      </motion.div>
      <h3 className="text-lg font-semibold text-neutral-900 mb-2">{feature.title}</h3>
      <p className="text-neutral-600 text-sm leading-relaxed">{feature.description}</p>
    </motion.div>
  );
}

function TestimonialCard({ t, i }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      className="p-6 border border-neutral-200 rounded-xl bg-white"
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ ...spring, delay: i * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, j) => (
          <Star key={j} size={14} className="fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-neutral-700 mb-4 text-sm leading-relaxed">"{t.content}"</p>
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className={`${t.color} text-white text-xs font-bold`}>{t.avatar}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold text-sm text-neutral-900">{t.name}</div>
          <div className="text-xs text-neutral-500">{t.role}</div>
        </div>
      </div>
    </motion.div>
  );
}

function MagneticButton({ children, onClick, className }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const x = useSpring(pos.x, { stiffness: 200, damping: 18 });
  const y = useSpring(pos.y, { stiffness: 200, damping: 18 });

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      className={className}
      style={{ x, y }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (rect) {
          setPos({
            x: (e.clientX - rect.left - rect.width / 2) * 0.15,
            y: (e.clientY - rect.top - rect.height / 2) * 0.15,
          });
        }
      }}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
}

function HowItWorksCard({ item, i }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const Icon = item.icon;

  return (
    <motion.div
      ref={ref}
      className="relative p-8 border border-neutral-200 rounded-xl bg-white hover:border-emerald-300 hover:shadow-lg transition-all"
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ ...spring, delay: i * 0.12 }}
      whileHover={{ y: -4 }}
    >
      <div className="absolute -top-4 -left-4 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
        {item.step}
      </div>
      <motion.div className="w-14 h-14 bg-emerald-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-emerald-200 transition-colors">
        <Icon className="text-emerald-600" size={28} />
      </motion.div>
      <h3 className="text-xl font-semibold text-neutral-900 mb-3">{item.title}</h3>
      <p className="text-neutral-600 leading-relaxed text-sm">{item.description}</p>
    </motion.div>
  );
}

function BenefitItem({ benefit, i }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <motion.div
      ref={ref}
      className="flex gap-4"
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ ...spring, delay: i * 0.08 }}
    >
      <div className="flex-shrink-0">
        <motion.div className="flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        </motion.div>
      </div>
      <div>
        <h4 className="text-lg font-semibold text-neutral-900 mb-1">{benefit.title}</h4>
        <p className="text-neutral-600 text-sm">{benefit.desc}</p>
      </div>
    </motion.div>
  );
}

function FAQItem({ item, i }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="border border-neutral-200 rounded-lg overflow-hidden bg-white hover:border-emerald-200 transition-colors"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ ...spring, delay: i * 0.08 }}
    >
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left"
      >
        <h3 className="font-semibold text-neutral-900 text-sm md:text-base">{item.question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <ChevronRight size={20} className="text-emerald-600" />
        </motion.div>
      </motion.button>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50">
          <p className="text-neutral-600 text-sm leading-relaxed">{item.answer}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const navShadow = useSpring(scrollY, { stiffness: 200, damping: 30 });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const ids = ["home", "features", "testimonials", "how", "benefits", "faq", "cta"];
    const onScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      let current = "home";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.offsetTop <= scrollPos) current = id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (to) => {
    const el = document.getElementById(to);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
    setActive(to);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans">
      {/* Navigation */}
      <motion.nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-neutral-200" style={{ boxShadow: navShadow }}>
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
          <motion.div className="flex items-center gap-2 font-bold text-xl" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
            <div className="w-2 h-2 bg-emerald-600 rounded-full" />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">LearnForge</span>
          </motion.div>


          <div className="flex items-center gap-4">
            <button className="md:hidden text-neutral-600 hover:text-neutral-900" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <motion.div className="hidden md:flex gap-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <NavLink label="Features" to="features" onClick={handleNav} active={active === "features"} />
              <NavLink label="Testimonials" to="testimonials" onClick={handleNav} active={active === "testimonials"} />
              <NavLink label="How it works" to="how" onClick={handleNav} active={active === "how"} />
              <NavLink label="FAQ" to="faq" onClick={handleNav} active={active === "faq"} />
            </motion.div>
          </div>

          <motion.div className="flex items-center gap-3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
            <button onClick={() => navigate("/signin")} className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors font-medium">
              Sign in
            </button>
            <MagneticButton onClick={() => navigate("/register")} className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm">
              Get started
            </MagneticButton>
          </motion.div>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-60 bg-black/40 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute right-0 top-0 w-72 h-full bg-white shadow-lg p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="font-bold">ProtoStack</div>
              <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="text-neutral-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              <NavLink label="Home" to="home" onClick={handleNav} active={active === "home"} />
              <NavLink label="Features" to="features" onClick={handleNav} active={active === "features"} />
              <NavLink label="Testimonials" to="testimonials" onClick={handleNav} active={active === "testimonials"} />
              <NavLink label="How it works" to="how" onClick={handleNav} active={active === "how"} />
              <NavLink label="FAQ" to="faq" onClick={handleNav} active={active === "faq"} />
              <div className="mt-4">
                <button onClick={() => navigate("/signin")} className="w-full text-left text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Sign in</button>
                <button onClick={() => navigate("/register")} className="w-full mt-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Get started</button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="home" className="max-w-6xl mx-auto px-8 py-24">
        <motion.div className="text-center mb-12" initial="hidden" animate="show" variants={container(0.1)}>
          <motion.div variants={fadeUp} className="inline-block mb-6">
            <span className="text-sm font-bold text-emerald-600 uppercase tracking-wide">🎯 Interview Prep Platform</span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-5xl lg:text-6xl font-serif font-bold leading-tight max-w-4xl mx-auto mb-4">
            Master your interviews, one question at a time
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg text-neutral-600 max-w-2xl mx-auto mb-10">
            AI-powered practice questions, real feedback, and personalized roadmaps. Stop guessing what they'll ask. Start knowing.
          </motion.p>

          <motion.div variants={fadeUp} className="flex justify-center gap-4">
            <MagneticButton onClick={() => navigate("/dashboard")} className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-md flex items-center gap-2">
              Start Free Interview <ArrowRight size={18} />
            </MagneticButton>
            <button className="border-2 border-neutral-300 px-8 py-3 rounded-lg font-semibold text-neutral-900 hover:border-emerald-600 hover:text-emerald-600 transition-colors">
              View Demo
            </button>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16 pt-12 border-t border-neutral-200" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          {stats.map((s, i) => (
            <StatCard key={i} {...s} i={i} />
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gradient-to-b from-neutral-50 to-white py-24">
        <div className="max-w-6xl mx-auto px-8">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="show" viewport={{ once: true }} variants={container(0.1)}>
            <motion.span variants={fadeUp} className="text-sm font-bold text-emerald-600 uppercase tracking-wide">
              Features
            </motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-serif font-bold mt-4 mb-4">
              Everything you need
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Complete tools for serious interview prep
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <FeatureCard key={f.id} feature={f} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24">
        <div className="max-w-6xl mx-auto px-8">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="show" viewport={{ once: true }} variants={container(0.1)}>
            <motion.span variants={fadeUp} className="text-sm font-bold text-emerald-600 uppercase tracking-wide">
              Success Stories
            </motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-serif font-bold mt-4">
              Trusted by engineers
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} t={t} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-24 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-6xl mx-auto px-8">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="show" viewport={{ once: true }} variants={container(0.1)}>
            <motion.span variants={fadeUp} className="text-sm font-bold text-emerald-600 uppercase tracking-wide">
              How It Works
            </motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-serif font-bold mt-4 mb-4">
              Four steps to interview mastery
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Simple, efficient, and proven to work
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {howItWorks.map((item, i) => (
              <HowItWorksCard key={item.step} item={item} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-24">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={container(0.1)}>
              <motion.span variants={fadeUp} className="text-sm font-bold text-emerald-600 uppercase tracking-wide">
                Why ProtoStack
              </motion.span>
              <motion.h2 variants={fadeUp} className="text-4xl font-serif font-bold mt-4 mb-8">
                Everything you need to succeed
              </motion.h2>
              <div className="space-y-6">
                {benefits.slice(0, 3).map((b, i) => (
                  <BenefitItem key={i} benefit={b} i={i} />
                ))}
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={container(0.1)}>
              <div className="space-y-6">
                {benefits.slice(3).map((b, i) => (
                  <BenefitItem key={i + 3} benefit={b} i={i + 3} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-3xl mx-auto px-8">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="show" viewport={{ once: true }} variants={container(0.1)}>
            <motion.span variants={fadeUp} className="text-sm font-bold text-emerald-600 uppercase tracking-wide">
              FAQ
            </motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl font-serif font-bold mt-4">
              Questions? We have answers.
            </motion.h2>
          </motion.div>

          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <FAQItem key={i} item={item} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="cta" className="bg-gradient-to-r from-emerald-600 to-teal-600 py-24">
        <div className="max-w-4xl mx-auto px-8 text-center text-white">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl lg:text-5xl font-serif font-bold mb-6">
            Ready to ace your next interview?
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-lg text-emerald-50 mb-8 max-w-2xl mx-auto">
            Join hundreds of engineers getting smarter at interviews. Start today—free.
          </motion.p>
          <MagneticButton onClick={() => navigate("/register")} className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors shadow-lg">
            Get Started Free
          </MagneticButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-neutral-50 py-12">
        <div className="max-w-6xl mx-auto px-8 text-center text-sm text-neutral-600">
          <div className="mb-4">© 2025 ProtoStack. All rights reserved.</div>
          <div className="flex justify-center gap-6">
            {["Terms", "Privacy", "Contact"].map((l) => (
              <a key={l} href="#" className="hover:text-emerald-600 transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
