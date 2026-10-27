"use client";

import { usePathname } from "next/navigation";

interface AppShellProps {
  header: React.ReactNode;
  categoryNav: React.ReactNode;
  footer: React.ReactNode;
  mobileBottomNav: React.ReactNode;
  floatingLiveSupport: React.ReactNode;
  cartDrawer: React.ReactNode;
  children: React.ReactNode;
}

export default function AppShell({
  header,
  categoryNav,
  footer,
  mobileBottomNav,
  floatingLiveSupport,
  cartDrawer,
  children,
}: AppShellProps) {
  const pathname = usePathname();
  const isFullscreen = pathname?.startsWith("/admin") || pathname?.startsWith("/sofor");

  if (isFullscreen) {
    return (
      <main className="w-full min-h-screen bg-slate-50">
        {children}
      </main>
    );
  }

  return (
    <>
      <header className="sticky top-0 w-full z-50">
        {header}
        {categoryNav}
      </header>
      <main className="w-full bg-background">
        {children}
      </main>
      {footer}
      {mobileBottomNav}
      {floatingLiveSupport}
      {cartDrawer}
    </>
  );
}
