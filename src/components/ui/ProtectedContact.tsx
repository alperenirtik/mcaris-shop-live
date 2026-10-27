"use client";

import React, { useState, useEffect } from "react";

interface ProtectedEmailProps {
  user?: string;
  domain?: string;
  display?: string;
  className?: string;
  prefix?: string;
}

export function ProtectedEmail({
  user = "info",
  domain = "mcaris.com.tr",
  display,
  className = "",
  prefix = "",
}: ProtectedEmailProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const email = `${user}@${domain}`;
  const displayText = display || email;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = `mailto:${email}`;
  };

  // SSR / Static scraper fallback: character code entity / reversed string without plain mailto
  if (!isClient) {
    return (
      <span className={className}>
        {prefix}
        <span className="select-all" data-contact="protected">
          {display ? displayText : `${user} [at] ${domain}`}
        </span>
      </span>
    );
  }

  return (
    <a
      href={`mailto:${email}`}
      onClick={handleClick}
      rel="nofollow noreferrer"
      className={`cursor-pointer ${className}`}
      title="E-Posta Gönder"
    >
      {prefix}
      <span>{displayText}</span>
    </a>
  );
}

interface ProtectedPhoneProps {
  phone?: string;
  display?: string;
  className?: string;
  prefix?: string;
  showPulse?: boolean;
}

export function ProtectedPhone({
  phone = "+905368200269",
  display = "+905368200269",
  className = "",
  prefix = "",
  showPulse = false,
}: ProtectedPhoneProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const cleanPhone = phone.replace(/\s+/g, "");

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = `tel:${cleanPhone}`;
  };

  if (!isClient) {
    return (
      <span className={className}>
        {prefix}
        <span data-phone="protected">{display}</span>
      </span>
    );
  }

  return (
    <a
      href={`tel:${cleanPhone}`}
      onClick={handleClick}
      rel="nofollow noreferrer"
      className={`cursor-pointer ${className}`}
      title="Ara"
    >
      {prefix}
      <span>{display}</span>
    </a>
  );
}
