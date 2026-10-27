"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function ProgressBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  const startProgress = () => {
    clearAllTimers();
    setIsVisible(true);
    setProgress(20);

    // Kademeli akıcı ilerleme
    const t1 = setTimeout(() => setProgress(45), 120);
    const t2 = setTimeout(() => setProgress(65), 300);
    const t3 = setTimeout(() => setProgress(82), 600);
    const t4 = setTimeout(() => setProgress(90), 1200);

    // Kenar durum: Gezinme iptal olursa veya takılırsa 8 saniye sonra sıfırla
    const safetyTimer = setTimeout(() => {
      completeProgress();
    }, 8000);

    timersRef.current.push(t1, t2, t3, t4, safetyTimer);
  };

  const completeProgress = () => {
    clearAllTimers();
    setProgress(100);

    const fadeTimer = setTimeout(() => {
      setIsVisible(false);
      const resetTimer = setTimeout(() => {
        setProgress(0);
      }, 250);
      timersRef.current.push(resetTimer);
    }, 200);

    timersRef.current.push(fadeTimer);
  };

  // 1. Rota Değişimi: Sayfa geldiğinde çubuğu tamamla
  const prevUrlRef = useRef<string>("");
  useEffect(() => {
    const currentUrl = `${pathname}?${searchParams?.toString() || ""}`;
    if (prevUrlRef.current && prevUrlRef.current !== currentUrl) {
      completeProgress();
    }
    prevUrlRef.current = currentUrl;
  }, [pathname, searchParams]);

  // 2. Tıklama Yakalama: Kullanıcı herhangi bir iç linke tıkladığı an (0ms) çubuğu başlat
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Mod tuşları (Ctrl, Meta, Shift vb.) ile yeni sekmede açılıyorsa engelleme
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.defaultPrevented || e.button !== 0) {
        return;
      }

      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      // Harici, download veya özel protokoller
      const targetAttr = anchor.getAttribute("target");
      if (targetAttr && targetAttr !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("javascript:") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }

      // Sadece aynı domain içi gezinmeler
      try {
        const targetUrl = new URL(anchor.href, window.location.href);
        if (targetUrl.origin !== window.location.origin) return;

        // Sayfa içi hash anchor ise (örn: #ozellikler) başlatma
        if (
          targetUrl.pathname === window.location.pathname &&
          targetUrl.search === window.location.search
        ) {
          return;
        }

        // Geçerli iç gezinme: 0ms gecikmesiz hemen başlat
        startProgress();
      } catch {
        // Geçersiz URL ise işlem yapma
      }
    };

    // Özel olay dinleyicileri (programatik gezinmeler için)
    const handleCustomStart = () => startProgress();
    const handleCustomDone = () => completeProgress();

    document.addEventListener("click", handleClick, { capture: true });
    window.addEventListener("mcaris-nav-start", handleCustomStart);
    window.addEventListener("mcaris-nav-done", handleCustomDone);

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
      window.removeEventListener("mcaris-nav-start", handleCustomStart);
      window.removeEventListener("mcaris-nav-done", handleCustomDone);
      clearAllTimers();
    };
  }, []);

  if (!isVisible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed top-0 left-0 right-0 z-[99999] pointer-events-none transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="h-[3px] bg-gradient-to-r from-slate-900 via-primary to-emerald-500 relative transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          boxShadow: "0 0 8px rgba(16, 185, 129, 0.4)",
        }}
      >
        {/* Çubuğun ucundaki hafif aydınlık bitiş çizgisi */}
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-r from-transparent to-white/70" />
      </div>
    </div>
  );
}

export default function NavigationProgressBar() {
  return (
    <Suspense fallback={null}>
      <ProgressBarInner />
    </Suspense>
  );
}
