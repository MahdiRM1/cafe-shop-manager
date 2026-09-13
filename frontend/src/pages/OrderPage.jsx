import { useState, useEffect, useMemo } from "react";
import SelectField from "../components/ui/SelectField";
import AddOrderItemModal from "../components/orders/AddOrderItemModal.jsx";
import {
  getMenuItems,
  getCategories,
} from "../services/menuService";
import {
  getOrders,
  openOrder,
  addItem,
  getOrderItems,
  deleteOrderItem,
  checkoutOrder,
  cancelOrder,
  createPayment,
  orderPayments as getOrderPayments,
} from "../services/orderService";
import CreateOrderModal from "../components/orders/CreateOrderModal.jsx";
import PaymentModal from "../components/purchase/PaymentModal.jsx";

export default function OrderPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("any");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderCreateOpen, setOrderCreateOpen] = useState(false);

  // همه سفارش‌های باز + شناسه سفارش فعال (چند سفارش هم‌زمان)
  const [openOrders, setOpenOrders] = useState([]);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [activeOrderItems, setActiveOrderItems] = useState([]);
  const [orderPayments, setOrderPayments] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const activeOrder = useMemo(
    () => openOrders.find((o) => o.id === activeOrderId) ?? null,
    [openOrders, activeOrderId]
  );

  const totalAmount = activeOrderItems.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.unitPrice),
    0
  );

  const paidAmount = orderPayments.reduce(
    (sum, p) => sum + Number(p.amount ?? 0),
    0
  );

  const isFullyPaid = activeOrderItems.length > 0 && paidAmount >= totalAmount;

  const fetchItems = async (orderId = activeOrder?.id) => {
    if (orderId) {
      const orderItemsData = await getOrderItems(orderId);
      setActiveOrderItems(orderItemsData);
    } else {
      setActiveOrderItems([]);
    }
  };

  const fetchPayments = async (orderId = activeOrder?.id) => {
    if (orderId) {
      const paymentsData = await getOrderPayments(orderId);
      setOrderPayments(paymentsData ?? []);
    } else {
      setOrderPayments([]);
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [itemsData, categoriesData, allOrders] = await Promise.all([
        getMenuItems(),
        getCategories(),
        getOrders(),
      ]);
      const ordersWeNeed = allOrders.filter((o) => o.status === "OPEN");
      setItems(itemsData);
      setCategories(categoriesData);
      setOpenOrders(ordersWeNeed);
      setActiveOrderId((prev) =>
        prev && ordersWeNeed.some((o) => o.id === prev)
          ? prev
          : ordersWeNeed?.[0]?.id ?? null
      );
      const nextActiveId =
        prevIdStillOpen(prevActiveIdRef.current, ordersWeNeed) ??
        ordersWeNeed?.[0]?.id ??
        null;
      if (nextActiveId) {
        await Promise.all([fetchItems(nextActiveId), fetchPayments(nextActiveId)]);
      } else {
        setActiveOrderItems([]);
        setOrderPayments([]);
      }
    } catch (err) {
      console.log(err.response ?? err);
      setError(err.response?.data?.message || "خطا در دریافت اطلاعات منو");
    } finally {
      setLoading(false);
    }
  };

  // کمک‌تابع برای اینکه اگر سفارش فعال قبلی هنوز باز است، همان حفظ شود
  const prevActiveIdRef = { current: activeOrderId };
  function prevIdStillOpen(prevId, orders) {
    return prevId && orders.some((o) => o.id === prevId) ? prevId : null;
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // با تغییر سفارش فعال یا باز/بسته شدن سبد، آیتم‌ها و پرداخت‌های همان سفارش را می‌گیریم
  useEffect(() => {
    fetchItems(activeOrderId);
    fetchPayments(activeOrderId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeOrderId, cartOpen]);

  const handleOpenOrder = async (payload) => {
    setError("");
    setOrderLoading(true);
    try {
      const newOrder = await openOrder(payload);
      setOpenOrders((prev) => [...prev, newOrder]);
      setActiveOrderId(newOrder.id);
      setOrderCreateOpen(false);
    } catch (err) {
      console.log(err.response ?? err);
      setError(err.response?.data?.message || "خطا در باز کردن سفارش");
    } finally {
      setOrderLoading(false);
    }
  };

  const handleItemClick = (item) => {
    if (!activeOrder) {
      setError("ابتدا یک سفارش جدید باز کنید یا یکی را انتخاب کنید");
      return;
    }
    if (!item.available) return;
    setSelectedItem(item);
  };

  const handleAddToOrder = async (quantity) => {
    await addItem(activeOrder.id, {
      menuItemId: selectedItem.id,
      quantity,
    });
    fetchItems();
    setSelectedItem(null);
  };

  // فقط ثبت پرداخت؛ سفارش هنوز باز می‌ماند تا کاربر با دکمه «ثبت سفارش» نهایی‌اش کند
  const handlePayment = async (payload) => {
    try {
      await createPayment(activeOrder.id, payload);
      setPaymentOpen(false);
      await fetchPayments();
    } catch (err) {
      console.log(err.response ?? err);
      setError(err.response?.data?.message || "خطا در پرداخت");
    }
  };

  const handleDeleteItem = async (itemId) => {
    await deleteOrderItem(activeOrder.id, itemId);
    fetchItems();
  };

  // نهایی‌سازی سفارش فعال؛ فقط سفارش تسویه‌شده از لیست تب‌ها حذف می‌شود
  const handleCheckout = async () => {
    if (!activeOrder) {
      setError("سفارشی انتخاب نشده است");
      return;
    }
    if (activeOrderItems.length === 0) {
      setError("سبد سفارش خالی است");
      return;
    }
    if (!isFullyPaid) {
      setError("مبلغ سفارش هنوز به‌طور کامل پرداخت نشده است");
      return;
    }
    setError("");
    setCheckoutLoading(true);
    try {
      await checkoutOrder(activeOrder.id);
      const closedId = activeOrder.id;
      setOpenOrders((prev) => prev.filter((o) => o.id !== closedId));
      setActiveOrderId((prev) => {
        const remaining = openOrders.filter((o) => o.id !== closedId);
        return prev === closedId ? remaining[0]?.id ?? null : prev;
      });
      setCartOpen(false);
    } catch (err) {
      console.log(err.response ?? err);
      setError(err.response?.data?.message || "خطا در نهایی‌سازی سفارش");
    } finally {
      setCheckoutLoading(false);
    }
  };

  // لغو سفارش فعال؛ فقط همان سفارش از لیست تب‌ها حذف می‌شود
  const handleCancel = async () => {
    if (!activeOrder) return;
    if (!window.confirm("سفارش لغو بشه؟")) return;
    setError("");
    setCancelLoading(true);
    try {
      await cancelOrder(activeOrder.id);
      const cancelledId = activeOrder.id;
      setOpenOrders((prev) => prev.filter((o) => o.id !== cancelledId));
      setActiveOrderId((prev) => {
        const remaining = openOrders.filter((o) => o.id !== cancelledId);
        return prev === cancelledId ? remaining[0]?.id ?? null : prev;
      });
      setCartOpen(false);
    } catch (err) {
      console.log(err.response ?? err);
      setError(err.response?.data?.message || "خطا در لغو خرید");
    } finally {
      setCancelLoading(false);
    }
  };

  const filteredItems = categoryFilter !== "any" 
    ? items.filter((item) => item.categoryId?.toString() === categoryFilter)
    : items;

  const groupedByCategory = categories
    .slice()
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .map((category) => ({
      category: category,
      items: filteredItems.filter((item) => item.categoryId === category.id),
    }));

  const filteredCategory = categoryFilter !== "any"
  ? groupedByCategory.filter((group) => group.items.length > 0)
  : groupedByCategory;

  const renderCard = (item, gridMode = false) => (
    <div
      key={item.id}
      onClick={() => handleItemClick(item)}
      className={`${gridMode ? "w-full" : "w-60 shrink-0"} bg-gray-50 dark:bg-gray-800/60 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all duration-300 flex flex-col ${
        item.available ? "cursor-pointer" : "cursor-not-allowed opacity-60"
      } animate-fade-in-up`}
    >
      <div className="aspect-square w-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
        {item.imagePath ? (
          <img
            src={item.imagePath}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <svg
            width="84"
            height="108"
            viewBox="0 0 96.59 122.88"
            className="text-gray-400 dark:text-gray-500 fill-current"
          >
            <path d="M42.65,7.68A26.83,26.83,0,0,1,46.83,0a43.57,43.57,0,0,0-1.44,10.6C45.54,17.07,48.57,20.05,53,28c6.4,11.52,3.3,22.66-5.21,31.85C50.85,49.59,52.29,43,50,35.47a34,34,0,0,0-2.74-6.22c-2.86-5.21-6-9.51-5.69-15.8a20.81,20.81,0,0,1,1.13-5.77ZM10.89,54.6a2.43,2.43,0,0,1,.54-1.06c1.57-2.46,5.24-4.54,10.36-6A73.09,73.09,0,0,1,36.34,45,26.9,26.9,0,0,1,36,49.35a65.37,65.37,0,0,0-12.66,2.24c-4.17,1.22-7,2.63-7.69,4l-.15.92c.28,1.52,3.22,3.1,7.84,4.45a82.84,82.84,0,0,0,22.28,2.68A82.89,82.89,0,0,0,67.85,61c4.63-1.35,7.58-2.94,7.85-4.46l-.09-.74c-.56-1.44-3.42-2.91-7.76-4.18a60.51,60.51,0,0,0-7.74-1.65,28,28,0,0,0,1.2-4.18,63.87,63.87,0,0,1,8,1.74c5.48,1.61,9.31,3.87,10.67,6.56a2.41,2.41,0,0,1,.33.83,4.7,4.7,0,0,1,.22,1.39c0,.12,0,.23,0,.34.18,1.71.3,3.39.38,5,5-1.58,8.79-1,11.46.93a10.42,10.42,0,0,1,4.14,7.65,17.1,17.1,0,0,1-1.86,9.27c-3.09,6.2-9.92,11.7-20.42,11.72-.37.66-.76,1.3-1.16,1.92a44.38,44.38,0,0,1,11.74,4.64c3.94,2.42,6.17,5.35,6.17,8.64,0,5-5.46,9.35-14.29,12.22-8,2.62-19.06,4.24-31.2,4.24s-23.19-1.62-31.21-4.24C5.46,115.77,0,111.46,0,106.42c0-3.29,2.23-6.22,6.17-8.64a44.62,44.62,0,0,1,12.06-4.72,53,53,0,0,1-7.1-17.67A50.69,50.69,0,0,1,10,65.22a55.22,55.22,0,0,1,.58-8.75v-.19a4.89,4.89,0,0,1,.31-1.68Zm4,7.55c0,1-.07,2-.06,3a47.1,47.1,0,0,0,1,9.22c2.76,12.66,8.86,21.3,16.2,26a25,25,0,0,0,27.63-.13c7.2-4.69,13.11-13.28,15.65-25.76a47.39,47.39,0,0,0,.88-8.81v-.35a1.22,1.22,0,0,1,0-.27c0-.91,0-1.84-.06-2.78a29.17,29.17,0,0,1-6.79,2.82A88.4,88.4,0,0,1,45.57,68a88.53,88.53,0,0,1-23.78-2.9,28.94,28.94,0,0,1-6.93-2.91ZM81,66.74A49.81,49.81,0,0,1,80,75.41a57.12,57.12,0,0,1-3.33,10.88c7-.75,11.53-4.62,13.68-8.93a12.39,12.39,0,0,0,1.38-6.66,5.7,5.7,0,0,0-2.14-4.2c-1.73-1.23-4.58-1.4-8.64.24ZM70,97.33a35.47,35.47,0,0,1-7.74,6.91,29.83,29.83,0,0,1-32.82.16,35.43,35.43,0,0,1-8.12-7.15,43.56,43.56,0,0,0-12.65,4.64c-2.46,1.51-3.85,3.06-3.85,4.53,0,2.71,4.18,5.44,11,7.64,7.56,2.47,18.07,4,29.72,4s22.15-1.52,29.71-4c6.77-2.2,11-4.93,11-7.64,0-1.47-1.39-3-3.85-4.53A42.93,42.93,0,0,0,70,97.33Zm-32-82.06c-1.06,7-.13,9.16,2.17,12.45,2.55,3.64,4.7,6.48,5.33,10.05.88,5-1.41,10.36-4.45,14.22,4.76-23.42-13.36-17.91-3.05-36.72Z" />
          </svg>
        )}
      </div>

      <div className="p-3 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-gray-800 dark:text-gray-100 text-sm leading-snug line-clamp-2">
            {item.name}
          </h3>
          <span
            className={`shrink-0 text-[10px] rounded-full px-2 py-0.5 font-medium whitespace-nowrap ${
              item.available
                ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                : "bg-red-50 dark:bg-red-900/30 text-red-400 dark:text-red-400"
            }`}
          >
            {item.available ? "موجود" : item.unavailableReason}
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mt-auto">
          {item.price?.toLocaleString("fa-IR")} تومان
        </p>
      </div>
    </div>
  );

  const renderRow = (rows) => (
    <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin animate-fade-in-up">
      {rows.length <= 0 ? (
        <p className="text-center text-gray-400 dark:text-gray-500 px-10">آیتمی یافت نشد</p>
      ) : (
        rows.map(row => renderCard(row, false))
      )}
    </div>
  );

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gray-100 dark:bg-gray-950 p-6 transition-colors duration-300"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              ثبت سفارش
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {openOrders.length > 0
                ? `${openOrders.length} سفارش باز`
                : "برای شروع، یک سفارش جدید باز کنید"}
            </p>
          </div>

          <button
            onClick={() => setOrderCreateOpen(true)}
            disabled={orderLoading}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            {orderLoading ? "در حال باز کردن..." : "سفارش جدید"}
          </button>
        </div>

        {/* تب سفارش‌های باز */}
        {openOrders.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin">
            {openOrders.map((o) => {
              const isActive = o.id === activeOrderId;
              return (
                <button
                  key={o.id}
                  onClick={() => setActiveOrderId(o.id)}
                  className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-blue-300"
                  }`}
                >
                  {o.label ? o.label : `سفارش ${o.id}`}
                </button>
              );
            })}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 text-center">
            {error}
          </div>
        )}

        <div className="max-w-xs">
          <SelectField
            label="فیلتر بر اساس دسته‌بندی"
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={[
              { value: "any", label: "همه" },
              ...categories.map((c) => ({ value: c.id.toString(), label: c.name })),
            ]}
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/60 py-10">
            در حال بارگذاری...
          </p>
        ) : filteredItems.length === 0 ? (
          <p className='text-center text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/60 py-10'>
            آیتمی یافت نشد
          </p>
        ) : categoryFilter === "any"  ? (
          <div className="space-y-2 bg-white dark:bg-gray-900 rounded-4xl">
            {filteredCategory.map(({ category, items: catItems }) => (
              <div
                key={category.id}
                className="p-6 space-y-2 transition-colors duration-300 animate-fade-in-up"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    {category.name}
                    <span className="text-sm font-normal text-gray-400 dark:text-gray-500 mr-2">
                      ({catItems.length} آیتم)
                    </span>
                  </h2>
                </div>
                {renderRow(catItems)}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredItems.map((item) => renderCard(item, true))}
            </div>
          </div>
        )}
      </div>

        {activeOrder && !cartOpen && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 left-6 flex items-center gap-2 rounded-full bg-blue-600 text-white px-5 py-3.5 shadow-lg hover:bg-blue-700 transition z-40"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <span className="text-sm font-medium">
            {activeOrderItems?.length.toLocaleString("fa-IR") ?? 0} قلم
          </span>
        </button>
      )}
      
      {cartOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-end z-50"
          onClick={() => setCartOpen(false)}
        >
          <div
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm h-full bg-white dark:bg-gray-900 shadow-xl flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="font-bold text-gray-800 dark:text-gray-100">
                سبد سفارش {activeOrder ? `— ${activeOrder.label ?? `سفارش ${activeOrder.id}`}` : ""}
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18" /><path d="M6 6l12 12" />
                </svg>
              </button>
            </div>
 
            {!activeOrder ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 px-5 py-6">
                سفارشی انتخاب نشده است
              </p>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto">
                  {/* بخش آیتم‌های سفارش */}
                  <div className="px-5 py-3 space-y-2">
                    {!activeOrderItems || activeOrderItems.length === 0 ? (
                      <p className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center">
                        سبد خالی است
                      </p>
                    ) : (
                      activeOrderItems.map((line) => (
                        <div
                          key={line.id ?? `${line.menuItemId}-${line.name}`}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex-1">
                            <p className="text-gray-700 dark:text-gray-200">{line.menuItemName}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              {line.quantity} × {line.price?.toLocaleString("fa-IR")}
                            </p>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 font-medium">
                            {((line.unitPrice ?? 0) * (line.quantity ?? 0)).toLocaleString("fa-IR")}
                          </p>
                          <button
                            onClick={() => handleDeleteItem(line.id)}
                            className="text-red-600 hover:text-red-900 pr-10"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <path d="M18 6L6 18" /><path d="M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="px-5 py-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
                    <span className="text-sm text-gray-500 dark:text-gray-400">جمع کل</span>
                    <span className="font-bold text-gray-800 dark:text-gray-100">
                      {totalAmount.toLocaleString("fa-IR")} تومان
                    </span>
                  </div>

                  {orderPayments.length > 0 && (
                    <div className="px-5 py-3 space-y-2 border-t border-gray-100 dark:border-gray-800">
                      <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">
                        پرداخت‌ها
                      </h3>
                      {orderPayments.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <div>
                            <p className="text-gray-700 dark:text-gray-200">
                              {p.method === "CASH" ? "نقدی" : p.method === "CARD" ? "کارت" : p.method}
                            </p>
                            {p.createdAt && (
                              <p className="text-xs text-gray-400 dark:text-gray-500">
                                {new Date(p.createdAt).toLocaleString("fa-IR")}
                              </p>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 font-medium">
                            {Number(p.amount ?? 0).toLocaleString("fa-IR")} تومان
                          </p>
                        </div>
                      ))}

                      <div className="flex items-center justify-between text-sm pt-1">
                        <span className="text-gray-500 dark:text-gray-400">جمع پرداخت‌شده</span>
                        <span className="font-bold text-green-600 dark:text-green-400">
                          {paidAmount.toLocaleString("fa-IR")} تومان
                        </span>
                      </div>
                      {!isFullyPaid && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">باقی‌مانده</span>
                          <span className="font-bold text-amber-600 dark:text-amber-400">
                            {(totalAmount - paidAmount).toLocaleString("fa-IR")} تومان
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="px-5 pt-2 pb-3">
                    <button
                      onClick={() => setPaymentOpen(true)}
                      disabled={!activeOrderItems || activeOrderItems.length === 0 || isFullyPaid}
                      className="w-full rounded-lg bg-blue-600 text-white py-2.5 font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isFullyPaid ? "پرداخت تکمیل شده" : "پرداخت"}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 px-5 pb-5 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={handleCheckout}
                    disabled={!isFullyPaid || checkoutLoading}
                    title={!isFullyPaid ? "ابتدا مبلغ سفارش را به‌طور کامل پرداخت کنید" : undefined}
                    className="w-full rounded-lg bg-green-600 text-white py-2.5 font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {checkoutLoading ? "در حال ثبت..." : "ثبت سفارش"}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={cancelLoading}
                    className="w-full rounded-lg bg-red-600 text-white py-2.5 font-medium hover:bg-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cancelLoading ? "در حال لغو..." : "انصراف"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <AddOrderItemModal
        open={!!selectedItem}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onSubmit={handleAddToOrder}
      />

      <CreateOrderModal
        open={orderCreateOpen}
        onClose={() => setOrderCreateOpen(false)}
        onSubmit={handleOpenOrder}
      />

       <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        onSubmit={handlePayment}
        total={(totalAmount - paidAmount)}
      />
    </div>
  );
}