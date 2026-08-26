"use client";

import { useState } from "react";
import * as m from "motion/react-m";
import { AnimatePresence } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

const categories = ["All", "Kitchen", "Living Room", "Bedroom", "Wardrobe", "Full Home"];

const projects = [
  // Kitchen (3)
  { id: 1, title: "Modern L-Shaped Kitchen", category: "Kitchen", image: "/images/hero/luxury-kitchen.jpg", size: "large", featured: true },
  { id: 2, title: "Classic Wood Kitchen", category: "Kitchen", image: "/images/portfolio/kitchen-after.jpg", size: "small" },
  { id: 3, title: "Open Plan Kitchen", category: "Kitchen", image: "/images/portfolio/kitchen-before.jpg", size: "medium" },
  
  // Living Room (3)
  { id: 4, title: "Minimalist Living Space", category: "Living Room", image: "/images/hero/elegant-living-room.jpg", size: "small", featured: true },
  { id: 5, title: "Cozy Family Lounge", category: "Living Room", image: "/images/portfolio/living-room-before.jpg", size: "medium" },
  { id: 6, title: "Contemporary Living Area", category: "Living Room", image: "/images/hero/elegant-living-room.jpg", size: "large" },
  
  // Bedroom (3)
  { id: 7, title: "Cozy Master Bedroom", category: "Bedroom", image: "/images/portfolio/master-bedroom.jpg", size: "large", featured: true },
  { id: 8, title: "Minimalist Guest Room", category: "Bedroom", image: "/images/portfolio/bedroom-before.jpg", size: "small" },
  { id: 9, title: "Luxury Suite Bedroom", category: "Bedroom", image: "/images/portfolio/master-bedroom.jpg", size: "medium" },
  
  // Wardrobe (3)
  { id: 10, title: "Walk-in Glass Wardrobe", category: "Wardrobe", image: "/images/portfolio/walk-in-wardrobe.jpg", size: "medium" },
  { id: 11, title: "Bespoke Wooden Closet", category: "Wardrobe", image: "/images/portfolio/walk-in-wardrobe.jpg", size: "large", featured: true },
  { id: 12, title: "Modern Minimalist Wardrobe", category: "Wardrobe", image: "/images/portfolio/walk-in-wardrobe.jpg", size: "small" },
  
  // Full Home (3)
  { id: 13, title: "Luxury Penthouse", category: "Full Home", image: "/images/hero/luxury-penthouse.jpg", size: "large", featured: true },
  { id: 14, title: "Contemporary Apartment", category: "Full Home", image: "/images/portfolio/contemporary-apartment.jpg", size: "medium" },
  { id: 15, title: "Modern Villa Interior", category: "Full Home", image: "/images/hero/luxury-penthouse.jpg", size: "small" },
];

export function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = activeCategory === "All"
    ? projects.filter(project => project.featured)
    : projects.filter(project => project.category === activeCategory);

  return (
    <section id="portfolio" className="py-12 md:py-16 bg-white dark:bg-slate-900 border-t border-black/5 dark:border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy/5 dark:bg-white/5 border border-black/10 dark:border-white/10 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-saffron"></span>
              <span className="text-sm font-semibold text-navy/80 dark:text-slate-300 tracking-wide">PORTFOLIO</span>
            </div>
            <m.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy dark:text-white tracking-tight leading-[1.1]"
            >
              Our <span className="italic font-light text-saffron">Design Gallery</span>
            </m.h2>
          </div>
          
          <m.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-wrap gap-2"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-[background-color,border-color,transform] duration-300 border ${
                  activeCategory === category
                    ? "bg-navy text-white border-navy dark:bg-white dark:text-navy dark:border-white"
                    : "bg-transparent text-navy/70 dark:text-slate-400 border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
                }`}
              >
                {category}
              </button>
            ))}
          </m.div>
        </div>

        <m.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
          <AnimatePresence>
            {filteredProjects.map((project, index) => {
              let gridClass = "col-span-1 row-span-1";
              if (activeCategory === "All" && index === 0) {
                gridClass = "md:col-span-2 row-span-1";
              } else if (activeCategory !== "All" && index === 0) {
                gridClass = "md:col-span-2 lg:col-span-1 row-span-1";
              }
              
              return (
                <m.div
                  layout
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className={`group relative overflow-hidden rounded-[2rem] bg-slate-100 dark:bg-slate-800 ${gridClass} shadow-sm hover:shadow-xl transition-[box-shadow,transform] duration-500`}
                >
                  <Image 
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                  
                  <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end h-full">
                    <span className="text-saffron text-xs font-bold tracking-widest uppercase mb-2 block opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-[opacity,transform] duration-500">
                      {project.category}
                    </span>
                    <h3 className="font-heading text-2xl font-bold text-white flex items-center justify-between opacity-90 group-hover:opacity-100 transition-opacity">
                      {project.title}
                      <span className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                        <ArrowUpRight size={20} className="text-white" />
                      </span>
                    </h3>
                  </div>
                </m.div>
              );
            })}
          </AnimatePresence>
        </m.div>
      </div>
    </section>
  );
}
