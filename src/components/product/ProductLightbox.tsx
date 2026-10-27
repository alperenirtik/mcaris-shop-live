"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";

interface ProductLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  alt: string;
  categoryName?: string;
}

const ZOOM_LEVELS = [1, 1.5, 2, 2.5, 3];

export default function ProductLightbox({
  isOpen,
  onClose,
  images,
  activeIndex,
  onSelectIndex,
  alt,
  categoryName,
}: ProductLightboxProps) {
  const [scale, setScale] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [direction, setDirection] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  // Drag vs clean click tracking
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const hasMovedRef = useRef(false);
  const isDraggingRef = useRef(false);

  // Reset zoom & pan when active image changes
  useEffect(() => {
    setScale(1);
    setPanPosition({ x: 0, y: 0 });
  }, [activeIndex]);

  // Scroll active thumbnail into view smoothly
  useEffect(() => {
    if (!isOpen || !thumbsRef.current) return;
    const activeThumb = thumbsRef.current.children[activeIndex] as
      | HTMLElement
      | undefined;
    if (activeThumb && typeof activeThumb.scrollIntoView === "function") {
      activeThumb.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [isOpen, activeIndex]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    onSelectIndex(activeIndex === 0 ? images.length - 1 : activeIndex - 1);
  }, [activeIndex, images.length, onSelectIndex]);

  const handleNext = useCallback(() => {
    setDirection(1);
    onSelectIndex(activeIndex === images.length - 1 ? 0 : activeIndex + 1);
  }, [activeIndex, images.length, onSelectIndex]);

  const handleZoomIn = useCallback(() => {
    setScale((prev) => {
      const nextIdx = ZOOM_LEVELS.findIndex((z) => z > prev);
      return nextIdx !== -1
        ? ZOOM_LEVELS[nextIdx]
        : ZOOM_LEVELS[ZOOM_LEVELS.length - 1];
    });
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => {
      const reversed = [...ZOOM_LEVELS].reverse();
      const nextIdx = reversed.findIndex((z) => z < prev);
      const nextVal = nextIdx !== -1 ? reversed[nextIdx] : 1;
      if (nextVal === 1) setPanPosition({ x: 0, y: 0 });
      return nextVal;
    });
  }, []);

  const handleResetZoom = useCallback(() => {
    setScale(1);
    setPanPosition({ x: 0, y: 0 });
  }, []);

  const handleToggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      try {
        await containerRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error("Fullscreen error:", err);
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (err) {
        console.error("Exit fullscreen error:", err);
      }
    }
  }, []);

  const handleDoubleClick = useCallback(() => {
    setScale((prev) => {
      if (prev > 1) {
        setPanPosition({ x: 0, y: 0 });
        return 1;
      }
      return 2;
    });
  }, []);

  // Native non-passive mouse wheel zoom (reliable in all browsers)
  useEffect(() => {
    const stage = stageRef.current;
    if (!isOpen || !stage) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.deltaY < 0) {
        // Wheel up -> Zoom In
        setScale((prev) => Math.min(3, Math.round((prev + 0.25) * 100) / 100));
      } else if (e.deltaY > 0) {
        // Wheel down -> Zoom Out
        setScale((prev) => {
          const next = Math.max(1, Math.round((prev - 0.25) * 100) / 100);
          if (next === 1) setPanPosition({ x: 0, y: 0 });
          return next;
        });
      }
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      stage.removeEventListener("wheel", onWheel);
    };
  }, [isOpen]);

  // Keyboard navigation & controls
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    function onFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (scale > 1) {
          handleResetZoom();
        } else {
          onClose();
        }
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "+" || e.key === "=") {
        handleZoomIn();
      } else if (e.key === "-" || e.key === "_") {
        handleZoomOut();
      } else if (e.key === "0") {
        handleResetZoom();
      } else if (e.key === "f" || e.key === "F") {
        handleToggleFullscreen();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, [
    isOpen,
    scale,
    handlePrev,
    handleNext,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    handleToggleFullscreen,
    onClose,
  ]);

  const handleDragStart = () => {
    isDraggingRef.current = true;
  };

  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    { offset, velocity }: PanInfo,
  ) => {
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 100);

    if (scale > 1) return;
    const swipe = Math.abs(offset.x) * velocity.x;
    if (swipe < -600 || offset.x < -40) {
      handleNext();
    } else if (swipe > 600 || offset.x > 40) {
      handlePrev();
    }
  };

  const handleStagePointerDown = (
    e: React.PointerEvent | React.MouseEvent
  ) => {
    if (e.button !== undefined && e.button !== 0) return;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    hasMovedRef.current = false;
  };

  const handleStagePointerMove = (
    e: React.PointerEvent | React.MouseEvent
  ) => {
    if (!pointerStartRef.current) return;
    const dx = Math.abs(e.clientX - pointerStartRef.current.x);
    const dy = Math.abs(e.clientY - pointerStartRef.current.y);
    if (dx > 8 || dy > 8) {
      hasMovedRef.current = true;
    }
  };

  const handleStagePointerUp = () => {
    pointerStartRef.current = null;
    if (hasMovedRef.current) {
      setTimeout(() => {
        hasMovedRef.current = false;
      }, 100);
    }
  };

  const handleStageClick = (e: React.MouseEvent) => {
    // 1. Drag / pan took place -> Do not close
    if (hasMovedRef.current || isDraggingRef.current) {
      return;
    }

    // 2. Check if click falls within the physical bounding box of the active image
    if (imageWrapperRef.current) {
      const rect = imageWrapperRef.current.getBoundingClientRect();
      const clickX = e.clientX;
      const clickY = e.clientY;

      if (
        clickX >= rect.left &&
        clickX <= rect.right &&
        clickY >= rect.top &&
        clickY <= rect.bottom
      ) {
        return;
      }
    }

    // 3. Click landed on outer backdrop whitespace -> Close lightbox
    onClose();
  };

  if (!isOpen) return null;

  const currentImage = images[activeIndex] || "/placeholder-product.png";
  const zoomPercent = Math.round(scale * 100);

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} - Tam Ekran Ürün Galerisi`}
      className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-md flex flex-col justify-between select-none font-inter text-white overflow-hidden animate-in fade-in duration-200"
    >
      {/* 1. Header Toolbar */}
      <header
        className="w-full px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-white/10 bg-neutral-950/70 backdrop-blur-lg z-30 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Info */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
          <span className="text-xs font-mono font-bold bg-white/10 px-2.5 py-1 rounded-md border border-white/15 shrink-0">
            {activeIndex + 1} / {images.length}
          </span>
          <div className="flex items-center gap-2 min-w-0">
            {categoryName && (
              <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white/10 text-neutral-300 rounded border border-white/10 shrink-0">
                {categoryName}
              </span>
            )}
            <h2 className="text-xs sm:text-sm font-semibold text-neutral-200 truncate max-w-xs sm:max-w-md md:max-w-lg">
              {alt}
            </h2>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Zoom Controls */}
          <div className="flex items-center bg-white/10 rounded-lg p-0.5 border border-white/10">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={scale <= 1}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-md text-sm font-bold text-neutral-200 hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
              aria-label="Uzaklaştır"
              title="Uzaklaştır (-)"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>

            <span className="text-[11px] font-mono font-bold text-neutral-300 px-2 min-w-[42px] text-center">
              {zoomPercent}%
            </span>

            <button
              type="button"
              onClick={handleZoomIn}
              disabled={scale >= 3}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-md text-sm font-bold text-neutral-200 hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
              aria-label="Yakınlaştır"
              title="Yakınlaştır (+)"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>

          {/* Reset Zoom Button */}
          {scale > 1 && (
            <button
              type="button"
              onClick={handleResetZoom}
              className="px-2.5 h-7 sm:h-8 flex items-center gap-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-neutral-200 border border-white/10 transition-colors cursor-pointer"
              aria-label="Sıfırla"
              title="Boyutu Sıfırla (0)"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              <span className="hidden sm:inline">1:1</span>
            </button>
          )}

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-neutral-200 border border-white/10 transition-colors cursor-pointer"
            aria-label={isFullscreen ? "Tam Ekrandan Çık" : "Tam Ekran Yap"}
            title="Tam Ekran (F)"
          >
            {isFullscreen ? (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
              </svg>
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            )}
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="h-7 sm:h-8 px-3 flex items-center gap-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-rose-200 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
            aria-label="Kapat"
            title="Kapat (Esc)"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            <span className="hidden sm:inline">Kapat</span>
          </button>
        </div>
      </header>

      {/* 2. Main Stage (Viewport & Backdrop) */}
      <main
        ref={stageRef}
        onPointerDown={handleStagePointerDown}
        onPointerMove={handleStagePointerMove}
        onPointerUp={handleStagePointerUp}
        onMouseDown={handleStagePointerDown}
        onMouseMove={handleStagePointerMove}
        onMouseUp={handleStagePointerUp}
        onClick={handleStageClick}
        className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden p-2 sm:p-6 cursor-zoom-out select-none"
        title="Kapatmak için dış boşluğa tıklayın (Esc)"
        aria-label="Ürün Görsel Sahnesi - Kapatmak için dış boşluğa tıklayın"
      >
        {/* Previous Navigation Chevron */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all z-30 cursor-pointer shadow-lg"
            aria-label="Önceki Görsel"
            title="Önceki Görsel (Sol Ok)"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {/* Current Scaled / Panned Image */}
        <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={activeIndex}
              ref={imageWrapperRef}
              custom={direction}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              drag={scale > 1 ? true : "x"}
              dragConstraints={
                scale > 1
                  ? {
                      left: -250 * (scale - 1),
                      right: 250 * (scale - 1),
                      top: -180 * (scale - 1),
                      bottom: 180 * (scale - 1),
                    }
                  : { left: 0, right: 0 }
              }
              dragElastic={scale > 1 ? 0.2 : 0.7}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDoubleClick={(e) => {
                e.stopPropagation();
                handleDoubleClick();
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
              style={{
                x: panPosition.x,
                y: panPosition.y,
                cursor: scale > 1 ? "grab" : "zoom-in",
              }}
              whileTap={{ cursor: scale > 1 ? "grabbing" : "zoom-in" }}
              className="relative flex items-center justify-center will-change-transform select-none pointer-events-auto"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentImage}
                alt={`${alt} - Tam Ekran Görünüm (${activeIndex + 1}/${images.length})`}
                title={`${alt} - Detay`}
                className="max-w-[92vw] max-h-[75vh] w-auto h-auto object-contain pointer-events-none drop-shadow-2xl rounded-lg"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Next Navigation Chevron */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all z-30 cursor-pointer shadow-lg"
            aria-label="Sonraki Görsel"
            title="Sonraki Görsel (Sağ Ok)"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}

        {/* Double-Click & Backdrop Hint Badge */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-neutral-900/80 border border-white/10 text-neutral-300 text-[11px] px-3 py-1 rounded-full backdrop-blur-sm pointer-events-none hidden sm:flex items-center gap-1.5 opacity-70">
          <span>
            Yakınlaştırmak için çift tıklayın • Kapatmak için dış boşluğa
            tıklayın
          </span>
        </div>
      </main>

      {/* 3. Bottom Thumbnail Rail */}
      {images.length > 1 && (
        <footer
          className="w-full px-4 py-3 border-t border-white/10 bg-neutral-950/80 backdrop-blur-lg z-30 shrink-0 flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            ref={thumbsRef}
            className="flex items-center gap-2 overflow-x-auto max-w-2xl px-2 py-1 no-scrollbar scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {images.map((src, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  type="button"
                  key={`lb-thumb-${src}-${idx}`}
                  onClick={() => onSelectIndex(idx)}
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer bg-white/5 ${
                    isSelected
                      ? "border-white ring-2 ring-white/40 scale-105 opacity-100"
                      : "border-white/20 opacity-50 hover:opacity-90 hover:border-white/50"
                  }`}
                  aria-label={`${alt} - Küçük Önizleme ${idx + 1}`}
                >
                  <Image
                    src={src}
                    alt={`${alt} - Thumbnail ${idx + 1}`}
                    fill
                    sizes="60px"
                    className="object-contain object-center !p-0.5 pointer-events-none w-full h-full"
                  />
                </button>
              );
            })}
          </div>
        </footer>
      )}
    </div>
  );
}
