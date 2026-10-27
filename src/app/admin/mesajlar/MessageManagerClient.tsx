"use client";

import { useState } from "react";
import { deleteContactMessageAction } from "@/app/actions/contactAdminActions";
import { toast } from "sonner";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface ContactMessageItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string | null;
  message: string;
  createdAt: Date;
}

interface MessageManagerClientProps {
  messages: ContactMessageItem[];
}

export default function MessageManagerClient({ messages: initialMessages }: MessageManagerClientProps) {
  const [messages, setMessages] = useState<ContactMessageItem[]>(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageItem | null>(initialMessages[0] || null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    const res = await deleteContactMessageAction(deleteId);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(res.message);
      setMessages((prev) => prev.filter((m) => m.id !== deleteId));
      if (selectedMessage?.id === deleteId) {
        setSelectedMessage(null);
      }
    }
    setIsDeleting(false);
    setDeleteId(null);
  };

  return (
    <div className="space-y-6 font-body">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-inter">Gelen İletişim Mesajları</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-inter mt-1">
            Ziyaretçilerin iletişim formundan gönderdiği talepler ve mesajlar.
          </p>
        </div>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto font-mono">
          Toplam {messages.length} Mesaj
        </span>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500 font-medium text-sm">Gelen kutunuzda henüz bir mesaj bulunmuyor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Message List */}
          <div className="lg:col-span-5 space-y-3 max-h-[700px] overflow-y-auto pr-1 font-inter">
            {messages.map((m) => {
              const isSelected = selectedMessage?.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMessage(m)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? "border-brand bg-brand/5 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 truncate">{m.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(m.createdAt).toLocaleDateString("tr-TR", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-700 truncate">
                    {m.subject || "Konusuz Mesaj"}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{m.message}</p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Message Detail */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm font-inter">
            {selectedMessage ? (
              <div className="space-y-6">
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{selectedMessage.name}</h2>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                      <a href={`mailto:${selectedMessage.email}`} className="text-brand hover:underline font-medium">
                        {selectedMessage.email}
                      </a>
                      <span>•</span>
                      <a href={`tel:${selectedMessage.phone}`} className="font-mono text-slate-700 hover:underline">
                        {selectedMessage.phone}
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDeleteId(selectedMessage.id)}
                    className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Sil
                  </button>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Konu Başlığı
                  </span>
                  <p className="text-sm font-bold text-slate-900">{selectedMessage.subject || "Belirtilmemiş"}</p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Mesaj İçeriği
                  </span>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || "MCARIS Bilgilendirme")}`}
                    className="px-4 py-2 bg-brand hover:bg-brand-dark text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    E-Posta İle Yanıtla
                  </a>
                  <a
                    href={`https://wa.me/${selectedMessage.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-2"
                  >
                    WhatsApp'tan Yaz
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-sm">
                Detayını görüntülemek için sol taraftan bir mesaj seçiniz.
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Mesajı Sil"
        description="Bu iletişim mesajını kalıcı olarak silmek istediğinizden emin misiniz?"
        confirmText="Evet, Sil"
        cancelText="Vazgeç"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
