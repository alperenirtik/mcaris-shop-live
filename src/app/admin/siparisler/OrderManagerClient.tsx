"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { updateOrderStatusAction, deleteOrderAction, createAdminOrderAction, uploadOrderInvoiceAction } from "@/app/actions/orderActions";
import { OrderStatus } from "@prisma/client";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface OrderItemData {
  id: string;
  productName: string;
  unitPrice: string;
  quantity: number;
  product?: {
    id: string;
    name: string;
    slug: string;
    images: string[];
  } | null;
}

interface OrderData {
  id: string;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  subtotal: string;
  shippingCost: string;
  total: string;
  iyzicoToken: string | null;
  iyzicoPaymentId: string | null;
  failureReason: string | null;
  invoiceUrl?: string | null;
  createdAt: Date;
  user: { id: string; name: string; email: string } | null;
  items: OrderItemData[];
}

interface ProductOption {
  id: string;
  name: string;
  price: string;
  stock?: number;
}

interface OrderManagerClientProps {
  orders: OrderData[];
  availableProducts: ProductOption[];
}

export default function OrderManagerClient({ orders, availableProducts }: OrderManagerClientProps) {
  const [query, setQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Bulk Selection State
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const [bulkStatusToApply, setBulkStatusToApply] = useState<OrderStatus | null>(null);

  // Single Order Deletion State
  const [orderToDelete, setOrderToDelete] = useState<OrderData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Manual order form state
  const [manualCustomerName, setManualCustomerName] = useState("");
  const [manualCustomerPhone, setManualCustomerPhone] = useState("");
  const [manualCustomerEmail, setManualCustomerEmail] = useState("");
  const [manualShippingAddress, setManualShippingAddress] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [orderItemsList, setOrderItemsList] = useState<{ productId: string; name: string; price: string; quantity: number }[]>([]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = query.toLowerCase().trim();
      const matchesQuery =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.customerPhone.includes(q);
      const matchesStatus = !selectedStatus || o.status === selectedStatus;
      return matchesQuery && matchesStatus;
    });
  }, [orders, query, selectedStatus]);

  const paidCount = orders.filter((o) => o.status === "paid").length;
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const shippedCount = orders.filter((o) => o.status === "shipped").length;
  const completedCount = orders.filter((o) => o.status === "completed").length;

  const isAllSelected =
    filteredOrders.length > 0 &&
    filteredOrders.every((o) => selectedOrderIds.has(o.id));

  function handleToggleSelectAll() {
    if (isAllSelected) {
      setSelectedOrderIds(new Set());
    } else {
      setSelectedOrderIds(new Set(filteredOrders.map((o) => o.id)));
    }
  }

  function handleToggleSelect(orderId: string) {
    setSelectedOrderIds((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  }

  function handleBulkStatusChangeRequest(newStatus: OrderStatus) {
    if (selectedOrderIds.size === 0) return;
    setBulkStatusToApply(newStatus);
  }

  async function handleConfirmBulkStatusChange() {
    if (!bulkStatusToApply || selectedOrderIds.size === 0) return;

    setBulkUpdating(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const promises = Array.from(selectedOrderIds).map((id) =>
        updateOrderStatusAction(id, bulkStatusToApply)
      );
      await Promise.all(promises);
      const msg = `${selectedOrderIds.size} adet sipariş başarıyla '${getStatusLabel(bulkStatusToApply)}' olarak güncellendi.`;
      setSuccessMsg(msg);
      toast.success(msg);
      setSelectedOrderIds(new Set());
      setBulkStatusToApply(null);
    } catch {
      const msg = "Toplu güncelleme sırasında bir hata oluştu.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setBulkUpdating(false);
    }
  }

  async function handleStatusChange(orderId: string, newStatus: OrderStatus) {
    setUpdatingId(orderId);
    setErrorMsg(null);
    setSuccessMsg(null);

    const result = await updateOrderStatusAction(orderId, newStatus);
    if (result.error) {
      setErrorMsg(result.error);
      toast.error(result.error);
    } else {
      const msg = `Sipariş durumu '${getStatusLabel(newStatus)}' olarak güncellendi.`;
      setSuccessMsg(msg);
      toast.success(msg);
    }
    setUpdatingId(null);
  }

  async function handleConfirmDelete() {
    if (!orderToDelete) return;

    try {
      setIsDeleting(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const result = await deleteOrderAction(orderToDelete.id);
      if (result.error) {
        setErrorMsg(result.error);
        toast.error(result.error);
      } else {
        const msg = `'${orderToDelete.id}' numaralı sipariş başarıyla silindi.`;
        setSuccessMsg(msg);
        toast.success(msg);
        setOrderToDelete(null);
      }
    } catch {
      toast.error("Sipariş silinirken bir hata oluştu.");
      setErrorMsg("Sipariş silinirken bir hata oluştu.");
    } finally {
      setIsDeleting(false);
    }
  }

  function handleAddItem() {
    if (!selectedProductId) return;
    const prod = availableProducts.find((p) => p.id === selectedProductId);
    if (!prod) return;

    const existing = orderItemsList.find((i) => i.productId === selectedProductId);
    if (existing) {
      const copy = orderItemsList.map((i) =>
        i.productId === selectedProductId ? { ...i, quantity: i.quantity + selectedQuantity } : i
      );
      setOrderItemsList(copy);
    } else {
      setOrderItemsList([
        ...orderItemsList,
        { productId: prod.id, name: prod.name, price: prod.price, quantity: selectedQuantity },
      ]);
    }
    setSelectedProductId("");
    setSelectedQuantity(1);
  }

  function handleRemoveItem(productId: string) {
    setOrderItemsList(orderItemsList.filter((i) => i.productId !== productId));
  }

  async function handleCreateSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMsg(null);
    setCreating(true);

    const formData = new FormData(event.currentTarget);
    const payload = orderItemsList.map((i) => ({ productId: i.productId, quantity: i.quantity }));
    formData.set("itemsRaw", JSON.stringify(payload));

    const result = await createAdminOrderAction({}, formData);
    if (result.error) {
      setErrorMsg(result.error);
    } else {
      setSuccessMsg("Manuel sipariş başarıyla oluşturuldu.");
      setCreateModalOpen(false);
      setManualCustomerName("");
      setManualCustomerPhone("");
      setManualCustomerEmail("");
      setManualShippingAddress("");
      setOrderItemsList([]);
    }
    setCreating(false);
  }

  function getStatusBadgeClass(status: OrderStatus) {
    switch (status) {
      case "paid":
        return "bg-emerald-50 text-emerald-800 border-emerald-300";
      case "shipped":
        return "bg-blue-50 text-blue-800 border-blue-300";
      case "completed":
        return "bg-purple-50 text-purple-800 border-purple-300";
      case "pending":
        return "bg-amber-50 text-amber-800 border-amber-300";
      case "failed":
        return "bg-rose-50 text-rose-800 border-rose-300";
      case "cancelled":
        return "bg-slate-100 text-slate-700 border-slate-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300";
    }
  }

  function getStatusLabel(status: OrderStatus) {
    switch (status) {
      case "paid":
        return "Ödendi";
      case "shipped":
        return "Kargoda";
      case "completed":
        return "Tamamlandı";
      case "pending":
        return "Bekliyor";
      case "failed":
        return "Başarısız";
      case "cancelled":
        return "İptal Edildi";
      default:
        return status;
    }
  }

  return (
    <div className="space-y-6 font-inter">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 font-inter">Sipariş Yönetimi</h1>
            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-full border border-slate-200 font-mono">
              {orders.length} Sipariş
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-inter">
            Müşteri siparişlerini anlık izleyin, durumlarını güncelleyin ve e-fatura ekleyin.
          </p>
        </div>
        <button
          onClick={() => {
            setErrorMsg(null);
            setCreateModalOpen(true);
          }}
          className="px-5 py-2.5 bg-[#0F1E36] hover:bg-[#183158] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow text-center cursor-pointer shrink-0 inline-flex items-center gap-2"
        >
          <span className="text-base font-bold leading-none">+</span>
          <span>Manuel Sipariş Oluştur</span>
        </button>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-bold flex justify-between items-center">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-xs opacity-60 hover:opacity-100 p-1 cursor-pointer">✕</button>
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex justify-between items-center">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="text-xs opacity-60 hover:opacity-100 p-1 cursor-pointer">✕</button>
        </div>
      )}

      {/* Quick Status Stats Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setSelectedStatus("")}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            !selectedStatus
              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
              : "bg-white text-slate-700 border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider block opacity-70">Tüm Siparişler</span>
          <span className="text-lg font-bold font-mono mt-0.5 block">{orders.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatus(selectedStatus === "paid" ? "" : "paid")}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            selectedStatus === "paid"
              ? "bg-emerald-700 text-white border-emerald-700 shadow-sm"
              : "bg-white text-slate-700 border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider block opacity-70">Ödenenler</span>
          <span className="text-lg font-bold font-mono mt-0.5 block">{paidCount}</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatus(selectedStatus === "shipped" ? "" : "shipped")}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            selectedStatus === "shipped"
              ? "bg-blue-700 text-white border-blue-700 shadow-sm"
              : "bg-white text-slate-700 border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider block opacity-70">Kargoda</span>
          <span className="text-lg font-bold font-mono mt-0.5 block">{shippedCount}</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatus(selectedStatus === "pending" ? "" : "pending")}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            selectedStatus === "pending"
              ? "bg-amber-600 text-white border-amber-600 shadow-sm"
              : "bg-white text-slate-700 border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider block opacity-70">Bekleyenler</span>
          <span className="text-lg font-bold font-mono mt-0.5 block">{pendingCount}</span>
        </button>
      </div>

      {/* Bulk Action Bar (When orders are selected) */}
      {selectedOrderIds.size > 0 && (
        <div className="bg-[#0F1E36] text-white p-4 rounded-2xl border border-slate-800 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand"></span>
            <span className="text-xs font-bold font-inter">
              <strong>{selectedOrderIds.size}</strong> sipariş seçildi
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-bold hidden sm:inline">Toplu Durum Değiştir:</span>
            <button
              type="button"
              disabled={bulkUpdating}
              onClick={() => handleBulkStatusChangeRequest("shipped")}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <span>Kargoda Yap</span>
            </button>
            <button
              type="button"
              disabled={bulkUpdating}
              onClick={() => handleBulkStatusChangeRequest("completed")}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              ✓ Tamamlandı Yap
            </button>
            <button
              type="button"
              disabled={bulkUpdating}
              onClick={() => handleBulkStatusChangeRequest("cancelled")}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              ✕ İptal Et
            </button>
            <button
              type="button"
              onClick={() => setSelectedOrderIds(new Set())}
              className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer ml-1"
            >
              Seçimi Temizle
            </button>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center font-inter">
        <div className="w-full sm:flex-1 relative">
          <input
            type="text"
            placeholder="Sipariş no, müşteri adı, telefon veya e-posta ile ara..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 bg-slate-50/50"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer">
              ✕
            </button>
          )}
        </div>

        <div className="w-full sm:w-64 flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 cursor-pointer"
          >
            <option value="">Tüm Durumlar</option>
            <option value="pending">Bekliyor (pending)</option>
            <option value="paid">Ödendi (paid)</option>
            <option value="shipped">Kargoda (shipped)</option>
            <option value="completed">Tamamlandı (completed)</option>
            <option value="failed">Başarısız (failed)</option>
            <option value="cancelled">İptal Edildi (cancelled)</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden font-inter">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleToggleSelectAll}
                    className="rounded border-slate-300 text-brand focus:ring-brand cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4 w-44">Sipariş No / Tarih</th>
                <th className="py-3.5 px-4 min-w-[200px]">Müşteri Bilgisi</th>
                <th className="py-3.5 px-4 min-w-[220px]">Sipariş Kalemleri</th>
                <th className="py-3.5 px-4 w-32 text-right">Toplam Tutar</th>
                <th className="py-3.5 px-4 w-36 text-center">Durum</th>
                <th className="py-3.5 px-4 w-36 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 font-medium">
                    Arama kriterlerinize uygun sipariş bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isChecked = selectedOrderIds.has(order.id);
                  return (
                    <tr
                      key={order.id}
                      className={`hover:bg-slate-50/90 transition-colors ${
                        isChecked ? "bg-brand/5" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(order.id)}
                          aria-label={`'${order.id}' numaralı siparişi seç`}
                          className="rounded border-slate-300 text-brand focus:ring-brand cursor-pointer"
                        />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-xs font-bold text-slate-900 select-all">{order.id}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString("tr-TR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{order.customerName}</span>
                          {order.user && (
                            <span className="px-1.5 py-0.2 text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded">
                              ÜYE
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[200px]">{order.customerEmail}</div>
                        <div className="text-[11px] font-mono text-slate-400">{order.customerPhone}</div>
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        {order.items.slice(0, 2).map((item) => (
                          <div key={item.id} className="text-slate-800 line-clamp-1">
                            • {item.productName} <span className="font-bold text-slate-500">×{item.quantity}</span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="text-slate-400 text-[11px] font-medium mt-0.5">+{order.items.length - 2} ürün daha</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-right">
                        ₺{Number(order.total).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg border cursor-pointer focus:outline-none transition-colors ${getStatusBadgeClass(
                            order.status
                          )}`}
                        >
                          <option value="pending">Bekliyor</option>
                          <option value="paid">Ödendi</option>
                          <option value="shipped">Kargoda</option>
                          <option value="completed">Tamamlandı</option>
                          <option value="failed">Başarısız</option>
                          <option value="cancelled">İptal Edildi</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            aria-label={`'${order.id}' sipariş detayını görüntüle`}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer border border-slate-200"
                          >
                            Detay
                          </button>
                          <button
                            type="button"
                            onClick={() => setOrderToDelete(order)}
                            disabled={isDeleting}
                            aria-label={`'${order.id}' numaralı siparişi sil`}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-rose-200 disabled:opacity-50"
                            title="Sil"
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-inter">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-inter">Sipariş Detayı</h3>
                <p className="text-xs font-mono text-slate-400">ID: {selectedOrder.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                aria-label="Kapat"
                className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕ Kapat
              </button>
            </div>

            {/* Customer & Address Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-2">
                <h4 className="font-bold text-slate-900 text-xs font-inter border-b border-slate-200 pb-1">Müşteri Bilgileri</h4>
                <p><span className="text-slate-500">Ad Soyad:</span> <strong>{selectedOrder.customerName}</strong></p>
                <p><span className="text-slate-500">Telefon:</span> <strong>{selectedOrder.customerPhone}</strong></p>
                <p><span className="text-slate-500">E-posta:</span> <strong>{selectedOrder.customerEmail}</strong></p>
                {selectedOrder.user && (
                  <p><span className="text-slate-500">Üye Hesabı:</span> <span className="font-mono">{selectedOrder.user.email}</span></p>
                )}
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-2">
                <h4 className="font-bold text-slate-900 text-xs font-inter border-b border-slate-200 pb-1">Teslimat &amp; Ödeme</h4>
                <p><span className="text-slate-500">Adres:</span> <span className="font-medium text-slate-800">{selectedOrder.shippingAddress}</span></p>
                <p><span className="text-slate-500">Ödeme ID:</span> <span className="font-mono text-[11px]">{selectedOrder.iyzicoPaymentId || "Yok"}</span></p>
                <p><span className="text-slate-500">Tarih:</span> <span>{new Date(selectedOrder.createdAt).toLocaleString("tr-TR")}</span></p>
              </div>
            </div>

            {/* Order Items Table */}
            <div>
              <h4 className="font-bold text-slate-900 text-xs font-inter mb-2">Sipariş Edilen Ürünler</h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Ürün</th>
                      <th className="py-2.5 px-3 text-center">Adet</th>
                      <th className="py-2.5 px-3 text-right">Birim Fiyat</th>
                      <th className="py-2.5 px-3 text-right">Toplam</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedOrder.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2.5 px-3 font-bold text-slate-800 flex items-center gap-2">
                          {item.product?.images?.[0] && (
                            <Image
                              src={item.product.images[0]}
                              alt={item.productName}
                              width={28}
                              height={28}
                              className="rounded border border-slate-200 object-cover"
                            />
                          )}
                          <span>{item.productName}</span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-700">{item.quantity}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-600">{item.unitPrice} TL</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          {(parseFloat(item.unitPrice) * item.quantity).toFixed(2)} TL
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-col gap-1.5 text-xs text-right font-inter">
              <div className="flex justify-between text-slate-500">
                <span>Ara Toplam:</span>
                <span className="font-mono font-bold text-slate-800">{selectedOrder.subtotal} TL</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Kargo Bedeli:</span>
                <span className="font-mono font-bold text-slate-800">{selectedOrder.shippingCost} TL</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Genel Toplam:</span>
                <span className="font-mono text-emerald-700">{selectedOrder.total} TL</span>
              </div>
            </div>

            {/* Invoice Upload Section */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 font-inter">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-600 shrink-0">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  <span>E-Fatura / İrsaliye</span>
                </h4>
                {selectedOrder.invoiceUrl && (
                  <a
                    href={selectedOrder.invoiceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-brand hover:underline font-bold"
                  >
                    Mevcut Faturayı Görüntüle ↗
                  </a>
                )}
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!selectedOrder) return;
                  setUpdatingId(selectedOrder.id);
                  setErrorMsg(null);
                  setSuccessMsg(null);

                  const formData = new FormData(e.currentTarget);
                  formData.set("orderId", selectedOrder.id);

                  try {
                    const res = await uploadOrderInvoiceAction({}, formData);
                    if (res.error) {
                      setErrorMsg(res.error);
                      toast.error(res.error);
                    } else {
                      const msg = res.message || "Fatura başarıyla kaydedildi.";
                      setSuccessMsg(msg);
                      toast.success(msg);
                    }
                  } catch (err: unknown) {
                    const msg = err instanceof Error ? err.message : "Fatura yüklenirken hata oluştu.";
                    setErrorMsg(msg);
                    toast.error(msg);
                  } finally {
                    setUpdatingId(null);
                  }
                }}
                className="space-y-2"
              >
                <input type="hidden" name="orderId" value={selectedOrder.id} />
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Fatura Dosyası Seç (PDF, PNG, JPG)</label>
                  <input
                    type="file"
                    name="invoiceFile"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="w-full text-xs text-slate-700 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#0F1E36] file:text-white hover:file:bg-[#183158] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <span className="text-[10px] text-slate-500">Müşterinin Hesabım sayfasında otomatik aktif olur.</span>
                  <button
                    type="submit"
                    disabled={updatingId === selectedOrder.id}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {updatingId === selectedOrder.id ? "Yükleniyor..." : "Faturayı Kaydet"}
                  </button>
                </div>
              </form>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-slate-200"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Order Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-inter">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-inter">Manuel Sipariş Oluştur</h3>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                aria-label="Kapat"
                className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕ Kapat
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 font-inter text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Müşteri Ad Soyad *</label>
                  <input
                    type="text"
                    required
                    value={manualCustomerName}
                    onChange={(e) => setManualCustomerName(e.target.value)}
                    placeholder="Ahmet Yılmaz"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telefon Numarası *</label>
                  <input
                    type="tel"
                    required
                    value={manualCustomerPhone}
                    onChange={(e) => setManualCustomerPhone(e.target.value)}
                    placeholder="0532 123 45 67"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">E-Posta Adresi *</label>
                  <input
                    type="email"
                    required
                    value={manualCustomerEmail}
                    onChange={(e) => setManualCustomerEmail(e.target.value)}
                    placeholder="ahmet@example.com"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Teslimat Adresi *</label>
                  <input
                    type="text"
                    required
                    value={manualShippingAddress}
                    onChange={(e) => setManualShippingAddress(e.target.value)}
                    placeholder="Örnek Mah. Gül Sok. No:5 D:2 Kadıköy / İstanbul"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-brand"
                  />
                </div>
              </div>

              {/* Product Selection */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900">Ürün Ekle</h4>
                <div className="flex flex-col sm:flex-row gap-2 items-center">
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-brand w-full"
                  >
                    <option value="">-- Bir Ürün Seçin --</option>
                    {availableProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.price} TL) - Stok: {p.stock}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-brand text-center"
                  />
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl whitespace-nowrap cursor-pointer"
                  >
                    + Listeye Ekle
                  </button>
                </div>

                {/* Added items preview */}
                {orderItemsList.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-200">
                    <p className="text-[11px] font-bold text-slate-600">Seçilen Kalemler ({orderItemsList.length}):</p>
                    {orderItemsList.map((item) => (
                      <div key={item.productId} className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="font-bold text-slate-800">{item.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-slate-600">{item.quantity} x {item.price} TL</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.productId)}
                            className="text-rose-600 font-bold hover:text-rose-800 text-xs cursor-pointer"
                          >
                            Kaldır
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={creating || orderItemsList.length === 0}
                  className="px-6 py-2 bg-[#0F1E36] hover:bg-[#183158] text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {creating ? "Oluşturuluyor..." : "Siparişi Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Status Change Confirm Modal */}
      <ConfirmModal
        isOpen={Boolean(bulkStatusToApply)}
        onClose={() => setBulkStatusToApply(null)}
        onConfirm={handleConfirmBulkStatusChange}
        title="Toplu Sipariş Durumu Güncelle"
        description={`${selectedOrderIds.size} adet seçili siparişi '${bulkStatusToApply ? getStatusLabel(bulkStatusToApply) : ""}' durumuna getirmek istediğinize emin misiniz?`}
        confirmText="Evet, Güncelle"
        cancelText="Vazgeç"
        variant="warning"
        isLoading={bulkUpdating}
      />

      {/* Single Order Delete Confirm Modal */}
      <ConfirmModal
        isOpen={Boolean(orderToDelete)}
        onClose={() => setOrderToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Siparişi Sil"
        description={`'${orderToDelete?.id}' numaralı siparişi tamamen silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
        confirmText="Evet, Siparişi Sil"
        cancelText="Vazgeç"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
