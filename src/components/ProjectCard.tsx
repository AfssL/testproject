/**
 * @file ProjectCard.tsx
 * Kartu project gaya Lando Norris: tanpa kotak/border, gambar besar sebagai bintang utama.
 *  - Muncul dengan efek "unmask" (bingkai membuka) + gambar zoom-out saat di-scroll.
 *  - Hover: gambar zoom-in, muncul gelembung "Lihat" yang mengikuti mouse, judul berubah warna.
 * Ganti teks gelembung di bawah (cari: Lihat). Gambar diambil dari project.image (data/portfolioData.ts).
 */
import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { ProjectItem } from '../types';

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
  accentColor: string;
  onSelect: (project: ProjectItem) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, accentColor, onSelect }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);

  // Gambar bergerak & mengecil perlahan seiring scroll (parallax zoom-out)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.3, 1.1, 1.0]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['-7%', '7%']);

  // Gelembung "Lihat" mengikuti mouse dengan gerak pegas
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const bx = useSpring(mx, { stiffness: 260, damping: 26 });
  const by = useSpring(my, { stiffness: 260, damping: 26 });
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  const tall = index % 2 === 0; // selang-seling tinggi/lebar supaya tata letak tidak kaku

  return (
    <div ref={ref} className="group cursor-pointer" onClick={() => onSelect(project)}>
      <motion.div
        initial={{ clipPath: 'inset(12% 12% 12% 12%)', opacity: 0 }}
        whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        onMouseMove={onMove}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0c1f1c] via-[#101214] to-[#040908] ${
          tall ? 'aspect-[4/5]' : 'aspect-[5/4]'
        }`}
      >
        {project.image ? (
          <motion.img
            src={project.image}
            alt={project.title}
            style={{ scale: imgScale, y: imgY }}
            className="absolute inset-0 h-full w-full object-cover transition-[filter] duration-700 group-hover:brightness-110"
          />
        ) : (
          <span className="hero-outline absolute inset-0 grid place-items-center font-display text-[clamp(90px,16vw,200px)] font-black">
            {String(index + 1).padStart(2, '0')}
          </span>
        )}

        <motion.span
          style={{ x: bx, y: by, backgroundColor: accentColor }}
          animate={{ scale: hover ? 1 : 0, opacity: hover ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="pointer-events-none absolute left-0 top-0 -ml-12 -mt-12 grid h-24 w-24 place-items-center rounded-full text-xs font-bold text-black"
        >
          Lihat
        </motion.span>
      </motion.div>

      <div className="mt-6 flex items-start justify-between gap-6">
        <div className="min-w-0">
          <p className="mb-2 text-xs text-slate-500">
            {project.year} · {project.categoryLabel}
          </p>
          <h3 className="font-display text-[clamp(26px,3.4vw,44px)] font-black uppercase leading-[0.95] text-white transition-colors duration-500 group-hover:text-[#00D2BE]">
            {project.title}
          </h3>
          <p className="mt-3 line-clamp-2 max-w-md text-sm text-slate-400">{project.shortDescription}</p>
          <p className="mt-3 text-xs text-slate-500">{project.tools.slice(0, 4).join('  /  ')}</p>
        </div>
        <ArrowUpRight className="mt-1 h-6 w-6 shrink-0 text-slate-500 transition-all duration-500 group-hover:rotate-12 group-hover:text-[#00D2BE]" />
      </div>
    </div>
  );
};
