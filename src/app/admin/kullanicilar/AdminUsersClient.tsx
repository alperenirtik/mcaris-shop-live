"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { updateUserRoleAction, deleteUserAction } from "./actions";
import { Role } from "@prisma/client";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface UserItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  createdAt: Date;
  _count: {
    orders: number;
  };
}

export default function AdminUsersClient({ initialUsers }: { initialUsers: UserItem[] }) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [userToToggleRole, setUserToToggleRole] = useState<{ user: UserItem; newRole: Role } | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase().trim();
      const matchesQuery =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone && u.phone.includes(q));

      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      return matchesQuery && matchesRole;
    });
  }, [users, search, roleFilter]);

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const customerCount = users.filter((u) => u.role === "USER").length;

  const handleConfirmRoleToggle = async () => {
    if (!userToToggleRole) return;
    const { user, newRole } = userToToggleRole;

    setUpdatingId(user.id);
    setIsProcessing(true);
    setToastMsg(null);

    try {
      await updateUserRoleAction(user.id, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
      );
      const msg = `Kullanıcı yetkisi başarıyla ${newRole === "ADMIN" ? "Yönetici (ADMIN)" : "Müşteri (USER)"} olarak güncellendi.`;
      setToastMsg({ type: "success", text: msg });
      toast.success(msg);
      setUserToToggleRole(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Yetki güncellenirken bir hata oluştu.";
      setToastMsg({ type: "error", text: msg });
      toast.error(msg);
    } finally {
      setUpdatingId(null);
      setIsProcessing(false);
    }
  };

  const handleConfirmDeleteUser = async () => {
    if (!userToDelete) return;

    setUpdatingId(userToDelete.id);
    setIsProcessing(true);
    setToastMsg(null);

    try {
      await deleteUserAction(userToDelete.id);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      const msg = `'${userToDelete.name}' adlı kullanıcı hesabı başarıyla silindi.`;
      setToastMsg({ type: "success", text: msg });
      toast.success(msg);
      setUserToDelete(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Kullanıcı silinirken hata oluştu.";
      setToastMsg({ type: "error", text: msg });
      toast.error(msg);
    } finally {
      setUpdatingId(null);
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 font-inter">
      {/* Toast Alert */}
      {toastMsg && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs sm:text-sm font-bold font-inter ${
            toastMsg.type === "success"
              ? "bg-emerald-50 text-emerald-900 border-emerald-300"
              : "bg-rose-50 text-rose-900 border-rose-300"
          }`}
        >
          <span>{toastMsg.text}</span>
          <button type="button" onClick={() => setToastMsg(null)} className="text-xs opacity-60 hover:opacity-100 p-1 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Header & Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-inter">
        <button
          type="button"
          onClick={() => setRoleFilter("all")}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            roleFilter === "all"
              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
              : "bg-white text-slate-700 border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider block opacity-70">Toplam Kullanıcı</span>
          <p className="text-2xl font-bold mt-1 font-mono">{totalUsers}</p>
        </button>

        <button
          type="button"
          onClick={() => setRoleFilter(roleFilter === "ADMIN" ? "all" : "ADMIN")}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            roleFilter === "ADMIN"
              ? "bg-amber-700 text-white border-amber-700 shadow-sm"
              : "bg-white text-slate-700 border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider block opacity-70">Yöneticiler (ADMIN)</span>
          <p className="text-2xl font-bold mt-1 font-mono">{adminCount}</p>
        </button>

        <button
          type="button"
          onClick={() => setRoleFilter(roleFilter === "USER" ? "all" : "USER")}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            roleFilter === "USER"
              ? "bg-blue-700 text-white border-blue-700 shadow-sm"
              : "bg-white text-slate-700 border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider block opacity-70">Müşteriler (USER)</span>
          <p className="text-2xl font-bold mt-1 font-mono">{customerCount}</p>
        </button>
      </div>

      {/* User Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 font-inter">
        <div>
          <h2 className="text-base font-bold text-slate-900 font-inter">Kullanıcı &amp; Yetki Listesi</h2>
          <p className="text-xs text-slate-500 font-inter">Sistemdeki tüm kayıtlı kullanıcıları ve erişim rollerini yönetin.</p>
        </div>
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            placeholder="İsim, telefon veya e-posta ile ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 bg-slate-50/50"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden font-inter">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                <th className="py-3.5 px-4 min-w-[200px]">Kullanıcı Bilgisi</th>
                <th className="py-3.5 px-4 w-36">İletişim</th>
                <th className="py-3.5 px-4 w-44">Mevcut Rol</th>
                <th className="py-3.5 px-4 w-32 text-center">Sipariş Sayısı</th>
                <th className="py-3.5 px-4 w-32 text-right">Kayıt Tarihi</th>
                <th className="py-3.5 px-4 w-52 text-right">Yetkilendirme &amp; İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 font-medium text-xs sm:text-sm">
                    Arama kriterine uygun kullanıcı bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/90 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono truncate max-w-[200px]">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                      {u.phone || <span className="text-slate-300">—</span>}
                    </td>
                    <td className="py-3.5 px-4">
                      {u.role === "ADMIN" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          <span>YÖNETİCİ (ADMIN)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          <span>MÜŞTERİ (USER)</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200 text-xs font-mono">
                        {u._count.orders} Sipariş
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-xs text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          disabled={isProcessing || updatingId === u.id}
                          onClick={() =>
                            setUserToToggleRole({
                              user: u,
                              newRole: u.role === "ADMIN" ? "USER" : "ADMIN",
                            })
                          }
                          aria-label={`'${u.name}' kullanıcısının rolünü değiştir`}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border disabled:opacity-50 ${
                            u.role === "ADMIN"
                              ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
                              : "bg-[#0F1E36] hover:bg-[#183158] text-white border-transparent"
                          }`}
                        >
                          {updatingId === u.id
                            ? "İşleniyor..."
                            : u.role === "ADMIN"
                            ? "Müşteri Yap"
                            : "Yönetici Yap"}
                        </button>

                        <button
                          type="button"
                          disabled={isProcessing || updatingId === u.id}
                          onClick={() => setUserToDelete(u)}
                          aria-label={`'${u.name}' adlı kullanıcı hesabını sil`}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors border border-rose-200 cursor-pointer disabled:opacity-50"
                          title="Kullanıcıyı Sil"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Change Modal */}
      <ConfirmModal
        isOpen={Boolean(userToToggleRole)}
        onClose={() => setUserToToggleRole(null)}
        onConfirm={handleConfirmRoleToggle}
        title="Kullanıcı Yetkisini Değiştir"
        description={
          userToToggleRole?.newRole === "ADMIN"
            ? `'${userToToggleRole?.user.name}' adlı kullanıcıya Yönetici (ADMIN) yetkisi vermek istediğinize emin misiniz?`
            : `'${userToToggleRole?.user.name}' adlı kullanıcının Yönetici yetkisini kaldırıp Müşteri (USER) yapmak istediğinize emin misiniz?`
        }
        confirmText="Evet, Yetkiyi Değiştir"
        cancelText="Vazgeç"
        variant="warning"
        isLoading={isProcessing}
      />

      {/* Delete User Modal */}
      <ConfirmModal
        isOpen={Boolean(userToDelete)}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleConfirmDeleteUser}
        title="Kullanıcı Hesabını Sil"
        description={`'${userToDelete?.name}' adlı kullanıcı hesabını tamamen silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
        confirmText="Evet, Hesabı Sil"
        cancelText="Vazgeç"
        variant="danger"
        isLoading={isProcessing}
      />
    </div>
  );
}
