"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import ProductLightbox from "./ProductLightbox";

interface ProductGalleryProps {
  images: string[];
  alt: string;
  categoryName?: string;
}

export default function ProductGallery({
  images,
  alt,
  categoryName,
}: ProductGalleryProps) {
  const gallery = images && images.length > 0 ? images : ["/placeholder-product.png"];
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Thumbnail drag-to-scroll states
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (!scrollRef.current) return;
    const activeThumb = scrollRef.current.children[active] as HTMLElement | undefined;
    if (activeThumb && typeof activeThumb.scrollIntoView === "function") {
      activeThumb.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [active]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActive((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  }, [gallery.length]);

  const handleNext = useCallback(() => {
    setDirection(1);
    setActive((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  }, [gallery.length]);

  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    { offset, velocity }: PanInfo
  ) => {
    const swipe = Math.abs(offset.x) * velocity.x;
    if (swipe < -500 || offset.x < -30) {
      handleNext();
    } else if (swipe > 500 || offset.x > 30) {
      handlePrev();
    }
  };

  // Thumbnail Mouse Drag Scrolling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const scrollLeftBtn = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRightBtn = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  const categoryLabel = categoryName || "Medikal Ekipman";
  const currentImage = gallery[active] || "/placeholder-product.png";
  const mainImageAlt = `${alt} - ${categoryLabel} Orijinal Görseli (${active + 1}/${gallery.length}) | MCARIS`;
  const mainImageTitle = `${alt} - ${categoryLabel} Detay Görseli`;

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="space-y-3.5 select-none font-inter">
      {/* 1. Main Cover Image Card */}
      <figure
        role="figure"
        itemProp="image"
        itemScope
        itemType="https://schema.org/ImageObject"
        className="relative aspect-square w-full rounded-2xl overflow-hidden border border-slate-200/90 bg-neutral-50 group flex items-center justify-center cursor-pointer shadow-xs m-0"
        title="Görseli tam ekran incelemek için tıklayın"
        onClick={() => setIsLightboxOpen(true)}
      >
        <meta itemProp="url" content={currentImage} />
        <meta itemProp="contentUrl" content={currentImage} />
        <figcaption className="sr-only" itemProp="caption">
          {mainImageAlt}
        </figcaption>

        {/* Animated Slide Viewport */}
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={active}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 350, damping: 32 },
              opacity: { duration: 0.15 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing w-full h-full"
          >
            <Image
              src={currentImage}
              alt={mainImageAlt}
              title={mainImageTitle}
              fill
              priority={active === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              className="object-contain object-center !p-3 sm:!p-5 w-full h-full pointer-events-none group-hover:scale-[1.02] transition-transform duration-500 ease-out"
            />
          </motion.div>
        </AnimatePresence>

        {/* Floating Chevrons on Card Hover */}
        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-neutral-800 shadow-md border border-neutral-200 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10 cursor-pointer active:scale-95"
              aria-label="Önceki Görsel"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-neutral-800 shadow-md border border-neutral-200 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10 cursor-pointer active:scale-95"
              aria-label="Sonraki Görsel"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}

        {/* Counter Badge */}
        {gallery.length > 1 && (
          <span className="absolute bottom-3 right-3 text-[11px] font-mono font-bold bg-neutral-900/80 text-white px-2.5 py-1 rounded-md backdrop-blur-xs z-10 border border-white/10 shadow-xs">
            {active + 1} / {gallery.length}
          </span>
        )}

        {/* Enlarge Hint Pill */}
        <div className="absolute top-3 right-3 opacity-90 group-hover:opacity-100 transition-opacity z-10">
          <span className="bg-white/95 hover:bg-white text-neutral-800 text-[11px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm border border-neutral-200/80 backdrop-blur-xs transition-all">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-neutral-600">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
            <span>Büyüt</span>
          </span>
        </div>
      </figure>

      {/* 2. Thumbnail Strip */}
      {gallery.length > 1 && (
        <div className="relative group/thumbs">
          {/* Scroll Left Button */}
          <button
            type="button"
            onClick={scrollLeftBtn}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2.5 w-7 h-7 rounded-full bg-white border border-neutral-200 shadow-sm text-neutral-700 hover:text-neutral-950 hover:border-neutral-400 flex items-center justify-center z-10 opacity-0 group-hover/thumbs:opacity-100 transition-opacity hidden md:flex cursor-pointer"
            aria-label="Sola kaydır"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Thumbnails Container */}
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="flex gap-2.5 overflow-x-auto px-1 py-2 no-scrollbar cursor-grab active:cursor-grabbing scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {gallery.map((src, index) => {
              const isSelected = index === active;
              return (
                <button
                  type="button"
                  key={`thumb-${src}-${index}`}
                  onClick={() => {
                    setDirection(index > active ? 1 : -1);
                    setActive(index);
                  }}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer bg-neutral-50 ${
                    isSelected
                      ? "border-neutral-950 ring-2 ring-neutral-950/20 ring-offset-1 shadow-sm"
                      : "border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`${alt} - Küçük Önizleme ${index + 1}`}
                >
                  <Image
                    src={src}
                    alt={`${alt} - Küçük Önizleme ${index + 1}`}
                    title={`${alt} - Önizleme`}
                    fill
                    sizes="100px"
                    className="pointer-events-none object-contain object-center !p-1 w-full h-full"
                  />
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button
            type="button"
            onClick={scrollRightBtn}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2.5 w-7 h-7 rounded-full bg-white border border-neutral-200 shadow-sm text-neutral-700 hover:text-neutral-950 hover:border-neutral-400 flex items-center justify-center z-10 opacity-0 group-hover/thumbs:opacity-100 transition-opacity hidden md:flex cursor-pointer"
            aria-label="Sağa kaydır"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}

      {/* 3. Cinema Lightbox Modal */}
      <ProductLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={gallery}
        activeIndex={active}
        onSelectIndex={setActive}
        alt={alt}
        categoryName={categoryLabel}
      />
    </div>
  );
}
