"use client";

import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { Download, Mail, Code, Briefcase, GraduationCap, ChevronRight, Star, Layers, Terminal, Award } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Lenis from "lenis";

const Loader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [showWords, setShowWords] = useState(false);
  const [index, setIndex] = useState(0);
  const words = ["YOU ARE", "NOT READY", "FOR THIS"];

  // Phase 1: 0 to 100%
  useEffect(() => {
    if (showWords) return;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setShowWords(true), 400); // small pause at 100%
          return 100;
        }
        return prev + 2;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [showWords]);

  // Phase 2: Sequential Words
  useEffect(() => {
    if (!showWords) return;
    if (index >= words.length) {
      setTimeout(onComplete, 400);
      return;
    }
    const timer = setTimeout(() => {
      setIndex(prev => prev + 1);
    }, 1100); // Smooth 1100ms per word
    return () => clearTimeout(timer);
  }, [showWords, index, onComplete, words.length]);

  return (
    <motion.div
      className="fixed inset-0 z-[999999] bg-[#020008] flex flex-col items-center justify-center"
      initial={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
    >
      <AnimatePresence mode="wait">
        {!showWords ? (
          <motion.div
            key="progress"
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex flex-col items-center justify-center"
          >
            <div className="text-[15vw] font-black tracking-tighter text-stroke-outline leading-none text-white">
              {progress}%
            </div>
            <div className="text-orange-500 uppercase tracking-[0.5em] text-sm font-bold mt-4 glitch-text" data-text="Loading Experience">
              Loading Experience...
            </div>
          </motion.div>
        ) : (
          index < words.length && (
            <motion.div
              key={index}
              initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="text-5xl md:text-8xl font-black tracking-tighter absolute"
              style={{
                background: 'linear-gradient(to right, #ff8c00, #ff0055)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {words[index]}
            </motion.div>
          )
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('a') || target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-orange-500 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
          scale: isHovering ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 1000, damping: 40, mass: 0.1 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 border border-orange-500 rounded-full pointer-events-none z-[9998] mix-blend-difference flex items-center justify-center"
        animate={{
          x: mousePosition.x - 24,
          y: mousePosition.y - 24,
          scale: isHovering ? 2.5 : 1,
          backgroundColor: isHovering ? "rgba(255, 140, 0, 0.1)" : "rgba(255, 140, 0, 0)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.5 }}
      >
        {isHovering && <div className="text-[6px] text-orange-500 font-bold uppercase tracking-widest">Explore</div>}
      </motion.div>

      {/* Interactive Spotlight */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0 mix-blend-screen opacity-60"
        animate={{
          background: `radial-gradient(circle 600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(157, 0, 255, 0.15), transparent 80%)`
        }}
        transition={{ type: "tween", ease: "linear", duration: 0 }}
      />
    </>
  );
};

// --- Rain Drops Effect ---
const RainDrops = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    class RainLine {
      z: number = Math.random(); // Depth factor for 3D parallax effect
      x: number = Math.random() * width;
      y: number = Math.random() * height;

      // Closer drops (z near 1) fall much faster and look longer due to motion blur
      speed: number = (this.z * 25) + 15;
      length: number = (this.z * 40) + 20;

      // Closer drops are thicker and more visible
      opacity: number = (this.z * 0.3) + 0.1;
      thickness: number = (this.z * 1.5) + 0.5;

      update() {
        this.y += this.speed;
        this.x += this.speed * 0.15; // Natural wind angle (slight diagonal)

        if (this.y > height) {
          this.y = -this.length;
          this.x = Math.random() * width;
        }
      }

      draw() {
        if (!ctx) return;

        // Create motion blur effect (fades out at the tail)
        const endX = this.x + this.speed * 0.15;
        const endY = this.y + this.length;

        const grad = ctx.createLinearGradient(this.x, this.y, endX, endY);
        grad.addColorStop(0, `rgba(200, 215, 255, 0)`); // Tail is transparent
        grad.addColorStop(1, `rgba(200, 215, 255, ${this.opacity})`); // Head is visible water color

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = this.thickness;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    }

    // Spawn more lines (250) for a denser, natural downpour
    const rainLines = Array.from({ length: 250 }, () => new RainLine());

    let frameId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw background rain
      rainLines.forEach(r => {
        r.update();
        r.draw();
      });

      frameId = requestAnimationFrame(render);
    };
    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[0]" style={{ opacity: 0.9 }} />;
};

// --- 3D Hero Geometric Element ---
const Hero3DElement = () => {
  return (
    <div className="absolute right-0 xl:-right-10 top-1/2 -translate-y-1/2 mt-3 w-[400px] h-[400px] hidden lg:flex justify-center items-center pointer-events-none z-10" style={{ perspective: "1000px" }}>
      {/* Outer Dashed Ring */}
      <motion.div
        animate={{ rotateZ: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute w-full h-full border-[2px] border-orange-500/50 rounded-full"
        style={{ borderStyle: "dashed" }}
      />

      {/* 3D Sphere Rings */}
      <motion.div
        animate={{ rotateX: 360, rotateY: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute w-[250px] h-[250px] border-[2px] border-purple-500/60 rounded-full shadow-[0_0_30px_rgba(168,85,247,0.2)]"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 border-[2px] border-pink-500/60 rounded-full shadow-[0_0_30px_rgba(236,72,153,0.2)]" style={{ transform: "rotateX(90deg)" }} />
        <div className="absolute inset-0 border-[2px] border-blue-500/60 rounded-full shadow-[0_0_30px_rgba(59,130,246,0.2)]" style={{ transform: "rotateY(90deg)" }} />
      </motion.div>

      {/* Floating Tech Nodes */}
      {["React", "Next.js", "GSAP", "3D", "UI/UX"].map((tech, i) => {
        const radius = 160;
        const angle = (i * 360) / 5; // evenly spaced
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <motion.div
            key={i}
            className="absolute px-5 py-2.5 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center font-bold text-white text-sm shadow-[0_0_20px_rgba(255,140,0,0.4)] border border-orange-500/50"
            animate={{
              y: [y - 10, y + 10, y - 10],
              x: [x - 5, x + 5, x - 5],
            }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
          >
            {tech}
          </motion.div>
        );
      })}

      {/* Core Glowing Orb */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="w-24 h-24 rounded-full bg-gradient-to-tr from-orange-500 to-pink-600 shadow-[0_0_100px_rgba(255,140,0,0.8)] flex items-center justify-center relative z-20 border-[2px] border-white/20"
      >
        <span className="text-white font-black text-xs tracking-widest relative z-30 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">DEV CORE</span>
      </motion.div>
    </div>
  );
};

export default function Portfolio() {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  // Smooth spring animation for the navbar scroll progress
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white relative overflow-hidden selection:bg-orange-500/30 cursor-none">
      <AnimatePresence>
        {isLoading && <Loader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <>
          <CustomCursor />
          <RainDrops />
        </>
      )}

      {/* Intense Fire & Smoke Effects */}
      <motion.div style={{ y: yBg }} className="absolute w-full h-full inset-0 z-[-2] pointer-events-none">
        <div className="fire-blob bg-orange-600/30 w-[600px] h-[600px] top-[-10%] left-[-10%]"></div>
        <div className="fire-blob bg-purple-800/30 w-[500px] h-[500px] bottom-[10%] right-[-10%] animation-delay-2000"></div>
        <div className="fire-blob bg-red-600/20 w-[400px] h-[400px] top-[40%] left-[30%] animation-delay-4000"></div>
      </motion.div>

      {/* 3D Continuous Moving Orb */}
      <div className="orb-3d w-48 h-48 sm:w-64 sm:h-64 top-[20%] left-[10%]"></div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass-card rounded-none border-t-0 border-l-0 border-r-0 border-b border-white/10">
        {/* Scroll Progress Background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-purple-600/20 origin-left"
          style={{ scaleX }}
        />
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold tracking-tighter"
          >
            Portfolio<span className="text-purple-500">.</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex gap-8 text-sm font-medium text-gray-300"
          >
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#skills" className="hover:text-white transition-colors">Skills</a>
            <a href="#education" className="hover:text-white transition-colors">Education</a>
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
          </motion.div>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-20 space-y-32">

        {/* HERO SECTION */}
        <section className="min-h-[80vh] flex flex-col justify-center items-start relative w-full">

          <Hero3DElement />

          {/* Awwwards Huge Background Text */}
          <motion.div
            className="absolute top-[20%] left-[-5%] text-[15vw] font-black uppercase leading-none text-stroke-outline whitespace-nowrap select-none pointer-events-none z-[-1]"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            DEVELOPER
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5 max-w-4xl relative z-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="inline-flex items-center gap-2 px-5 py-2.5 mt-8 rounded-full glass-card text-sm text-orange-300 border-orange-500/30 shadow-[0_0_20px_rgba(255,140,0,0.2)] uppercase tracking-widest font-bold"
            >
              <Star size={16} className="text-yellow-400 animate-spin-slow" /> Available for opportunities
            </motion.div>

            <h1 className="text-7xl md:text-[8rem] font-black tracking-tighter leading-[0.9] mt-2">
              <span className="block overflow-hidden">
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="block"
                >
                  Hi, I&apos;m
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-4">
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="block text-gradient glitch-text"
                  data-text="Jatin Joshi"
                >
                  Jatin Joshi
                </motion.span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="text-2xl md:text-3xl text-gray-400 font-light max-w-2xl leading-relaxed -mt-2"
            >
              A passionate <strong className="text-white">Web & App Developer</strong> crafting <span className="italic text-orange-400">award-winning</span> digital experiences.
            </motion.p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a href="#about" className="shine-card px-8 py-3.5 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform flex items-center gap-2">
                Get in Touch <ChevronRight size={18} />
              </a>
              <a href="https://drive.google.com/file/d/1MSHEq01CWZeACuydcDNZu6E6RxzgCBhC/view" target="_blank" className="shine-card px-8 py-3.5 glass-card font-semibold rounded-full hover:bg-white/10 transition-colors flex items-center gap-2">
                <Download size={18} /> Download CV
              </a>
            </div>
          </motion.div>
        </section>

        {/* INFINITE MARQUEE SECTION */}
        <div className="marquee-container my-10">
          <motion.div
            className="flex gap-10 min-w-max text-4xl md:text-6xl font-black text-stroke-outline tracking-wider"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 15, repeat: Infinity }}
          >
            <span>CREATIVE DEVELOPER • FULL STACK MAGICIAN • UI/UX ENTHUSIAST • PROBLEM SOLVER • </span>
            <span>CREATIVE DEVELOPER • FULL STACK MAGICIAN • UI/UX ENTHUSIAST • PROBLEM SOLVER • </span>
          </motion.div>
        </div>

        {/* ABOUT & CONTACT SECTION */}
        <section id="about" className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-8 glass-panel shine-card p-10 md:p-14"
          >
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Terminal className="text-purple-500" /> About Me
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Passionate Web Developer skilled in frontend development, backend integration, database-driven applications, Progressive Web Apps (PWA), and mobile app development.
              <br /><br />
              Experienced in building modern, responsive, animation-rich web applications using React, Next.js, and advanced UI technologies. Focused on scalable architecture, smooth user experiences, performance optimization, and clean interactive interfaces.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-4 glass-panel shine-card p-10 md:p-14 flex flex-col justify-center space-y-6"
          >
            <h3 className="text-xl font-bold mb-2">Connect</h3>
            <div className="space-y-4">
              <a href="mailto:jatin20051112@gmail.com" className="flex items-center gap-4 text-gray-400 hover:text-white group transition-colors">
                <div className="shrink-0 w-12 h-12 rounded-full glass-card flex items-center justify-center group-hover:border-purple-500/50 transition-colors">
                  <Mail size={20} />
                </div>
                <span className="font-medium break-all">jatin20051112@gmail.com</span>
              </a>
              <div className="flex items-center gap-4 text-gray-400 group transition-colors">
                <div className="shrink-0 w-12 h-12 rounded-full glass-card flex items-center justify-center group-hover:border-pink-500/50 transition-colors">
                  <Briefcase size={20} />
                </div>
                <span className="font-medium">+91-9119586969</span>
              </div>
              <a href="https://github.com/JatinJoshi-JJ" target="_blank" className="flex items-center gap-4 text-gray-400 hover:text-white group transition-colors">
                <div className="shrink-0 w-12 h-12 rounded-full glass-card flex items-center justify-center group-hover:border-white/50 transition-colors">
                  <Code size={20} />
                </div>
                <span className="font-medium">GitHub Profile</span>
              </a>
            </div>
          </motion.div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="space-y-12">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center"
          >
            Technical Expertise
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['React & Next.js', 'TypeScript', 'Tailwind CSS', 'Redux / Zustand', 'Node.js & MongoDB', 'GSAP & Framer Motion', 'Three.js & Spline', 'PWA & React Native'].map((skill, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card shine-card p-6 text-center transition-transform cursor-pointer hover:border-orange-500/50"
              >
                <div className="text-lg font-semibold text-gray-200">{skill}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* EDUCATION SECTION */}
        <section id="education" className="space-y-8 pt-10">
          <h2 className="text-4xl font-bold flex items-center justify-center gap-3 mb-12">
            <GraduationCap className="text-pink-500" /> Education
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card shine-card p-8 border-t-4 border-t-orange-500"
            >
              <h3 className="text-xl font-bold mb-2">BBA (Computer Applications)</h3>
              <p className="text-orange-400 font-medium mb-4">Synergy School of Commerce, Pune • 2023 - 2026</p>
              <p className="text-gray-400 text-sm leading-relaxed">Pursuing degree in Computer Applications, focusing on advanced software development and computer science.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-card shine-card p-8 border-t-4 border-t-pink-500"
            >
              <h3 className="text-xl font-bold mb-2">HSC (Commerce)</h3>
              <p className="text-pink-400 font-medium mb-4">Prestige Public School, Pune • 2023</p>
              <p className="text-gray-400 text-sm leading-relaxed">Graduated with 87.50% — Class Topper.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="glass-card shine-card p-8 border-t-4 border-t-purple-500"
            >
              <h3 className="text-xl font-bold mb-2">SSC</h3>
              <p className="text-purple-400 font-medium mb-4">Aruna Chaudhary Madhyamic Vidyalaya • 2021</p>
              <p className="text-gray-400 text-sm leading-relaxed">Graduated with 85.60% — Class Topper.</p>
            </motion.div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="space-y-12 pt-10">
          <h2 className="text-4xl font-bold flex items-center justify-center gap-3">
            <Layers className="text-purple-500" /> Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* NEXOGEN Agency */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -10 }}
              viewport={{ once: true }}
              className="glass-card shine-card p-6 group hover:border-orange-500/50 transition-colors flex flex-col"
            >
              <h3 className="text-xl font-bold mb-2 text-white">NEXOGEN – Design Agency</h3>
              <p className="text-gray-400 text-sm mb-6 flex-grow">A full-stack AI-powered SaaS platform with premium Awwwards-inspired UI, 3D elements, and JWT auth.</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Next.js', 'MongoDB', 'GSAP', 'Three.js'].map((tech) => (
                  <span key={tech} className="text-xs px-2 py-1 glass-card text-gray-300 rounded-md">{tech}</span>
                ))}
              </div>
              <a href="https://nexogen-thenextgendesignagency.netlify.app" target="_blank" className="w-full py-3 text-center bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-xl transition-colors">View Live Project</a>
            </motion.div>

            {/* NEXOGEN AI Code Editor */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -10 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-card shine-card p-6 group hover:border-pink-500/50 transition-colors flex flex-col"
            >
              <h3 className="text-xl font-bold mb-2 text-white">NEXOGEN AI – Code Editor</h3>
              <p className="text-gray-400 text-sm mb-6 flex-grow">A premium AI-powered cross-platform desktop & PWA code editor with local execution and live preview.</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Electron', 'Next.js', 'SQLite', 'WebSockets'].map((tech) => (
                  <span key={tech} className="text-xs px-2 py-1 glass-card text-gray-300 rounded-md">{tech}</span>
                ))}
              </div>
              <a href="https://nexogen-code-editor.netlify.app" target="_blank" className="w-full py-3 text-center bg-pink-600 hover:bg-pink-500 text-white font-semibold rounded-xl transition-colors">View Live Project</a>
            </motion.div>

            {/* Mock Interview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -10 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-card shine-card p-6 group hover:border-purple-500/50 transition-colors flex flex-col"
            >
              <h3 className="text-xl font-bold mb-2 text-white">Mock Interview Platform</h3>
              <p className="text-gray-400 text-sm mb-6 flex-grow">AI-powered mock interview platform with responsive UI, dashboard experience, and auth flow.</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['React.js', 'Next.js', 'Tailwind', 'AI'].map((tech) => (
                  <span key={tech} className="text-xs px-2 py-1 glass-card text-gray-300 rounded-md">{tech}</span>
                ))}
              </div>
              <a href="https://nexogen-webapp.netlify.app" target="_blank" className="w-full py-3 text-center bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-colors">View Live Project</a>
            </motion.div>

            {/* SCSDB */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -10 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="glass-card shine-card p-6 group hover:border-red-500/50 transition-colors flex flex-col"
            >
              <h3 className="text-xl font-bold mb-2 text-white">SCSDB – Movie Platform</h3>
              <p className="text-gray-400 text-sm mb-6 flex-grow">Movie and series discovery platform with cast details, trailers, ratings, and streaming recommendations.</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['React.js', 'Tailwind CSS', 'API'].map((tech) => (
                  <span key={tech} className="text-xs px-2 py-1 glass-card text-gray-300 rounded-md">{tech}</span>
                ))}
              </div>
              <a href="https://scsdb-jj.netlify.app" target="_blank" className="w-full py-3 text-center bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-colors">View Live Project</a>
            </motion.div>

            {/* NPM Library */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -10 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="glass-card shine-card p-6 group hover:border-orange-500/50 transition-colors flex flex-col lg:col-span-2"
            >
              <h3 className="text-xl font-bold mb-2 text-white flex items-center gap-2">
                NEXOGEN UI Library <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full border border-orange-500/30">NPM Package</span>
              </h3>
              <p className="text-gray-400 text-sm mb-6 flex-grow">An installable npm UI library for reusable components like buttons, cards, and navbars. Developed with advanced GSAP animations and ScrollTrigger.</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['React.js', 'NPM', 'GSAP', 'HTML/CSS'].map((tech) => (
                  <span key={tech} className="text-xs px-2 py-1 glass-card text-gray-300 rounded-md">{tech}</span>
                ))}
              </div>
              <a href="https://www.npmjs.com/package/nexogen-ui-library" target="_blank" className="shine-card w-full py-3 text-center bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                <Terminal size={18} /> NPM Package
              </a>
            </motion.div>

          </div>
        </section>

        {/* CERTIFICATIONS SECTION */}
        <section id="certifications" className="space-y-8 pt-10">
          <h2 className="text-4xl font-bold flex items-center justify-center gap-3 mb-12">
            <Award className="text-yellow-500" /> Certifications
          </h2>
          <div className="glass-panel p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Full Stack Development MasterClass", org: "NoviTech R&D Private Limited", url: "https://drive.google.com/file/d/1w2sJHmrugnmppcFcaaG40IbKPcYgUvu4/view?usp=drivesdk" },
                { title: "Front-End Web Development", org: "Reliance Foundation Skilling Academy", url: "https://drive.google.com/file/d/16KlWqftyb12hJGrJIkqgknymlef0MudC/view?usp=drivesdk" },
                { title: "Web Development Course", org: "STP Computer Education", url: "https://drive.google.com/file/d/1t3pWE0wiEO-ku-T0RsPXLowHigGFosfA/view?usp=drivesdk" },
                { title: "Introduction to Front-End Development", org: "SkillUp by Simplilearn", url: "https://drive.google.com/file/d/13JDOgFXC41p0KUMZxKM_4tuWOn9pGbyQ/view?usp=drivesdk" },
                { title: "HTML Course", org: "STP Computer Education", url: "https://drive.google.com/file/d/1fyaoemen4-SsJ_MU6VKR8I7ugGVJk_Sz/view?usp=drivesdk" },
                { title: "CSS3 Course", org: "STP Computer Education", url: "https://drive.google.com/file/d/1shXdOqBa3Ptvtgo20CY_rNOz63_J4P0e/view?usp=drivesdk" },
                { title: "JavaScript Course", org: "STP Computer Education", url: "https://drive.google.com/file/d/1F10Wb-lnJHn5etNcEFmAIbfZXCOT1v1B/view?usp=drivesdk" }
              ].map((cert, index) => (
                <motion.a
                  href={cert.url}
                  target="_blank"
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-4 glass-card shine-card hover:bg-white/5 transition-colors group cursor-pointer hover:border-yellow-500/50 block"
                >
                  <div className="w-10 h-10 shrink-0 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center group-hover:bg-yellow-500/40 transition-colors">
                    <Award size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-200 group-hover:text-yellow-400 transition-colors">{cert.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{cert.org}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-white/10 py-8 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Jatin Joshi JJ. All rights reserved.</p>
      </footer>
    </div>
  );
}
