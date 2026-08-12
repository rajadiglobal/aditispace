"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowLeftRight, Play, Pause, RotateCcw, Sparkles } from "lucide-react";
import Image from "next/image";

interface TransformationProject {
  id: string;
  title: string;
  category: string;
  beforeImage: string;
  afterImage: string;
  description: string;
}

const PROJECTS: TransformationProject[] = [
  {
    id: "penthouse",
    title: "Grand Penthouse Salon",
    category: "Living Space",
    beforeImage: "/images/portfolio/living-room-before.jpg",
    afterImage: "/images/portfolio/contemporary-apartment.jpg",
    description: "Converted an unfinished concrete structure into a light-filled architectural masterpiece with custom Italian marble finishings."
  },
  {
    id: "kitchen",
    title: "Architectural Culinary Haven",
    category: "Kitchen & Dining",
    beforeImage: "/images/portfolio/kitchen-before.jpg",
    afterImage: "/images/portfolio/kitchen-after.jpg",
    description: "Transformed a cramped dated kitchen into a modern minimalist culinary space featuring seamless walnut cabinetry and monolithic island."
  },
  {
    id: "suite",
    title: "Serene Sanctuary Suite",
    category: "Master Bedroom",
    beforeImage: "/images/portfolio/bedroom-before.jpg",
    afterImage: "/images/portfolio/master-bedroom.jpg",
    description: "Reimagined a plain bedroom into a luxurious retreat featuring micro-cement accent walls, warm ambient lighting, and organic linen textiles."
  }
];

export function BeforeAfter() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(0); // Starts at 0 (full Before state)
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasTransformed, setHasTransformed] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.4 });
  const animRef = useRef<number | null>(null);

  const activeProject = PROJECTS[activeProjectIndex];

  // Auto transformation animation routine
  const startTransformation = useCallback((startPos = 0, targetPos = 100, duration = 3000) => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    
    let startTime: number | null = null;
    setIsPlaying(true);

    const animateStep = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth easeInOutCubic curve
      const easeProgress = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const currentPos = startPos + (targetPos - startPos) * easeProgress;
      setSliderPosition(currentPos);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animateStep);
      } else {
        setIsPlaying(false);
        setHasTransformed(true);
      }
    };

    animRef.current = requestAnimationFrame(animateStep);
  }, []);

  // Trigger transformation when scrolled into view
  useEffect(() => {
    if (isInView && !hasTransformed && !isDragging) {
      setSliderPosition(0);
      const timer = setTimeout(() => {
        startTransformation(0, 100, 2800);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isInView, hasTransformed, isDragging, startTransformation]);

  // Handle project switch
  const handleSelectProject = (index: number) => {
    setActiveProjectIndex(index);
    setSliderPosition(0);
    setHasTransformed(false);
    setTimeout(() => {
      startTransformation(0, 100, 2800);
    }, 150);
  };

  // Replay animation
  const handleReplay = () => {
    setSliderPosition(0);
    setHasTransformed(false);
    startTransformation(0, 100, 2800);
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      setIsPlaying(false);
    } else {
      const target = sliderPosition >= 99 ? 0 : 100;
      const start = sliderPosition;
      startTransformation(start, target, (Math.abs(target - start) / 100) * 2800);
    }
  };

  // Pointer move handler
  const handleMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setIsPlaying(false);

    const containerRect = containerRef.current.getBoundingClientRect();
    const x =
      "touches" in event
        ? event.touches[0].clientX - containerRect.left
        : (event as React.MouseEvent).clientX - containerRect.left;

    const position = Math.max(0, Math.min((x / containerRect.width) * 100, 100));
    setSliderPosition(position);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setIsPlaying(false);
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <section className="py-24 bg-neutral-950 text-white overflow-hidden relative border-t border-white/5">
      {/* Background ambient gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-neutral-950/40 to-neutral-950 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs uppercase tracking-widest mb-4 font-medium">
            <Sparkles className="w-3.5 h-3.5" /> Live Auto-Transformation
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 tracking-tight">
            Watch Spaces <span className="font-medium text-amber-500 italic">Evolve</span>
          </h2>
          <p className="text-neutral-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
            Experience the automated reveal of raw structures turning into bespoke luxury sanctuaries. Drag or replay to inspect every detail.
          </p>

          {/* Project selector tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {PROJECTS.map((project, idx) => (
              <button
                key={project.id}
                onClick={() => handleSelectProject(idx)}
                className={`px-5 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 ${
                  activeProjectIndex === idx
                    ? "bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/20 scale-105"
                    : "bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10"
                }`}
              >
                {project.title}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Main transformation display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-6xl mx-auto"
        >
          <div
            ref={containerRef}
            className="relative w-full aspect-[4/3] md:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl cursor-ew-resize group border border-white/10 select-none"
            onMouseMove={handleMove}
            onTouchMove={handleMove}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            {/* Before Image (Base background layer) */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={activeProject.beforeImage}
                alt={`${activeProject.title} Before Transformation`}
                fill
                className="object-cover pointer-events-none"
                priority
              />
              <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase border border-white/20 text-white/90 shadow-xl">
                Before State
              </div>
            </div>

            {/* After Image (Clipped overlay layer) */}
            <div
              className="absolute inset-0 w-full h-full pointer-events-none transition-none"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <Image
                src={activeProject.afterImage}
                alt={`${activeProject.title} After Transformation`}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute top-6 right-6 bg-amber-500/90 backdrop-blur-md px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase border border-amber-300/30 text-neutral-950 shadow-xl">
                After Transformation
              </div>
            </div>

            {/* Divider Line & Laser Beam Effect */}
            <div
              className="absolute top-0 bottom-0 w-[3px] bg-amber-400 shadow-[0_0_20px_#f59e0b,_0_0_35px_#f59e0b] pointer-events-none transition-none"
              style={{ left: `${sliderPosition}%` }}
            >
              {/* Laser sweep aura */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-300 to-transparent opacity-80 animate-pulse" />

              {/* Slider Handle Button */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-neutral-950 border-2 border-amber-400 text-amber-400 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.6)] transition-transform group-hover:scale-110">
                <ArrowLeftRight className="w-5 h-5 text-amber-400" />
              </div>
            </div>

            {/* Interactive hint overlay */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-xs font-light tracking-widest uppercase bg-black/40 px-5 py-2 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-white/10 flex items-center gap-2">
              <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" /> Drag anytime to control
            </div>
          </div>

          {/* Controls & Description Bar */}
          <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
            <div className="text-center md:text-left">
              <div className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-1">
                {activeProject.category}
              </div>
              <h3 className="text-lg font-medium text-white">
                {activeProject.title}
              </h3>
              <p className="text-sm text-neutral-400 font-light mt-0.5 max-w-xl">
                {activeProject.description}
              </p>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={togglePlayPause}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-all border border-white/10 active:scale-95"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-400" /> Pause Auto-Transform
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-amber-400" /> Play Transformation
                  </>
                )}
              </button>

              <button
                onClick={handleReplay}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-semibold transition-all shadow-md shadow-amber-500/20 active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Replay
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

