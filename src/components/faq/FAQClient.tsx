"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { WHATSAPP_NUMBER } from "@/lib/seo";
import { FAQ_DATA, type FAQItem } from "@/lib/faq";

export type { FAQItem };

const CATEGORIES = [
  "Tümü",
  "Karyola & Modeller",
  "Satış & Avantajlar",
  "Teslimat & Montaj",
  "Teknik Servis & Garanti",
  "Ödeme & Faturalandırma",
  "Kullanım & Hasta Bakımı",
] as const;

export default function FAQClient({ initialFaqs }: { initialFaqs?: FAQItem[] }) {
  const faqs = initialFaqs && initialFaqs.length > 0 ? initialFaqs : FAQ_DATA;
  const [activeCategory, setActiveCategory] = useState<string>("Tümü");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((item: FAQItem) => {
      const matchCategory = activeCategory === "Tümü" || item.category === activeCategory;
      const matchSearch =
        !searchQuery.trim() ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [faqs, activeCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Live Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-4 sm:p-6 shadow-2xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Aklınıza takılan soruyu veya konuyu yazın (örn: motor gücü, teslimat süresi, garanti, fiyatlar)..."
            className="w-full h-12 pl-11 pr-4 rounded-xl border border-neutral-200 bg-neutral-50/60 text-sm focus:outline-hidden focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all text-neutral-900 placeholder:text-neutral-400"
          />
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-3">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq: FAQItem, idx: number) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="bg-white rounded-xl border border-neutral-200/90 overflow-hidden shadow-2xs transition-all duration-200 hover:border-neutral-300"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer select-none"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                      {faq.category}
                    </span>
                    <h2 className="text-sm sm:text-base font-bold text-neutral-950">
                      {faq.question}
                    </h2>
                  </div>

                  <div
                    className={`w-7 h-7 rounded-lg bg-neutral-100 text-neutral-700 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-neutral-900 text-white" : ""
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-700 leading-relaxed border-t border-neutral-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-xl p-8 text-center border border-neutral-200 space-y-3">
            <p className="text-sm text-neutral-500 font-medium">Aramanızla eşleşen soru bulunamadı.</p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Merhaba,%20web%20sitenizdeki%20SSS%20b%C3%B6l%C3%BCm%C3%BCnde%20bulamad%C4%B1%C4%9F%C4%B1m%20bir%20sorum%20var.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-xl text-xs font-bold"
            >
              <span>WhatsApp Danışma Hattına Sorun</span>
              <span>&rarr;</span>
            </a>
          </div>
        )}
      </div>

      {/* Still Need Help CTA Banner */}
      <div className="bg-[#0E1A30] text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1.5 text-center sm:text-left">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-white inline-block">
            7/24 DESTEK
          </span>
          <h3 className="text-lg sm:text-xl font-bold">Sorunuzun Cevabını Bulamadınız mı?</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md">
            Uzman medikal teknisyenlerimiz ve klinik hasta bakım danışmanlarımız sorularınızı anında yanıtlasın.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="tel:+905368200269"
            className="bg-white text-slate-900 font-bold text-xs sm:text-sm px-4 py-3 rounded-xl hover:bg-slate-100 transition-all"
          >
            Hemen Arayın
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Merhaba,%20hasta%20karyolas%C4%B1%20hakk%C4%B1nda%20dan%C4%B1%C5%9Fmak%20istiyorum.`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-xl transition-all flex items-center gap-1.5"
          >
            <span>WhatsApp Danışma</span>
          </a>
        </div>
      </div>
    </div>
  );
}
