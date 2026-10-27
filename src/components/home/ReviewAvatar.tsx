"use client";

import { useState } from "react";

interface ReviewAvatarProps {
  src?: string;
  name: string;
  size?: number;
  className?: string;
}

const AVATAR_PALETTES = [
  "bg-amber-100 text-amber-900 border-amber-200/80",
  "bg-emerald-100 text-emerald-900 border-emerald-200/80",
  "bg-blue-100 text-blue-900 border-blue-200/80",
  "bg-indigo-100 text-indigo-900 border-indigo-200/80",
  "bg-rose-100 text-rose-900 border-rose-200/80",
  "bg-teal-100 text-teal-900 border-teal-200/80",
  "bg-violet-100 text-violet-900 border-violet-200/80",
];

function getInitials(name: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function getPalette(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return AVATAR_PALETTES[Math.abs(hash) % AVATAR_PALETTES.length];
}

export default function ReviewAvatar({
  src,
  name,
  size = 32,
  className = "",
}: ReviewAvatarProps) {
  const [hasError, setHasError] = useState(false);

  const initials = getInitials(name);
  const palette = getPalette(name);

  if (!src || hasError) {
    return (
      <div
        className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 font-bold text-xs shadow-2xs select-none ${palette} ${className}`}
        aria-hidden="true"
        title={name}
      >
        <span>{initials}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name ? `${name} - Müşteri Değerlendirmesi` : "Müşteri Değerlendirmesi"}
      width={size}
      height={size}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-neutral-200/80 ${className}`}
    />
  );
}
