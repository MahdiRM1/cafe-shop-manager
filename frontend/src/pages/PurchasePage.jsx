import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PurchaseItemModal from "../components/purchase/PurchaseItemModal";
import PaymentModal from "../components/purchase/PaymentModal";
import {
  openPurchase,
  getPurchaseItems,
  addItem,
  updateItem,
  deletePurchaseItem,
  checkoutPurchase,
  cancelPurchase,
  createPayment,
  purchasePayments,
} from "../services/purchaseService";
import { getRawMaterials } from "../services/inventoryService";

export default function PurchasePage() {
  const [purchaseId, setPurchaseId] = useState(null);
  const [items, setItems] = useState([]);
  const [payments, setPayments] = useState([]);
  const [materials, setMaterials] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openItem, setOpenItem] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);


  const totalAmount = items.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.unitPrice),
    0
  );

  const totalPayment = payments.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0
  );

  const navigate = useNavigate();

  useEffect(() => {
    initPurchase();
  }, []);

  const initPurchase = async () => {
    setLoading(true);
    setError("");
    try {
      const materialsData = await getRawMaterials();
      setMaterials(materialsData);

      const purchase = await openPurchase();
      setPurchaseId(purchase.id);

      const payments = await purchasePayments(purchase.id);
      setPayments(payments);

      const itemsData = await getPurchaseItems(purchase.id);
      setItems(itemsData);
    } catch (err) {
      console.log(err.response ?? err);
      setError(error.response?.data?.message || "خطا در آماده‌سازی خرید");
    } finally {
      setLoading(false);
    }
  };

  const reloadItems = async () => {
    const itemsData = await getPurchaseItems(purchaseId);
    setItems(itemsData);
  };

  const reloadPayments = async () => {
    const paymentssData = await purchasePayments(purchaseId);
    setPayments(paymentssData);
  };

  const handleAddItem = async (payload) => {
    try {
        await addItem(purchaseId, payload);
        await reloadItems();
    } catch (err) {
      console.log(err.response ?? err);
      setError(error.response?.data?.message || "خطا در افزودن آیتم");
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      await updateItem(purchaseId, itemId, { quantity: Number(newQuantity) });
      await reloadItems();
    } catch (err) {
      console.log(err.response ?? err);
      setError(error.response?.data?.message || "خطا در بروزرسانی آیتم");
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await deletePurchaseItem(purchaseId, itemId);
      await reloadItems();
    } catch (err) {
      console.log(err.response ?? err);
      setError(error.response?.data?.message || "خطا در حذف آیتم");
    }
  };

  const handlePayment = async (payload) => {
    try {
      await createPayment(purchaseId, payload);
      reloadPayments();
    } catch (err) {
      console.log(err.response ?? err);
      setError(error.response?.data?.message || "خطا در پرداخت");
    }
  }

  const handleCheckout = async () => {
    if (items.length === 0) {
      setError("حداقل یک آیتم باید اضافه شده باشه");
      return;
    }

    try {
      await checkoutPurchase(purchaseId);
      navigate("/inventory");
    } catch (err) {
      console.log(err.response ?? err);
      setError(error.response?.data?.message || "خطا در نهایی‌سازی خرید");
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("خرید لغو بشه؟")) return;
    try {
      await cancelPurchase(purchaseId);
      await initPurchase();
    } catch (err) {
      console.log(err.response ?? err);
      setError(error.response?.data?.message || "خطا در لغو خرید");
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/60 py-10">
        در حال بارگذاری...
      </p>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gray-100 dark:bg-gray-950 p-6 transition-colors duration-300"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            ثبت خرید مواد اولیه
          </h1>

          <button
            onClick={() => setOpenItem(true)}
            className="bg-blue-600 text-white rounded-lg px-5 py-2.5 font-medium hover:bg-blue-800 transition-all duration-300"
          >
            + افزودن آیتم
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 text-center">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 space-y-4 animate-fade-in-up">
          {items.length === 0 ? (
            <p className="text-center text-gray-400 dark:text-gray-500 py-6">
              هنوز آیتمی اضافه نشده
            </p>
          ) : (
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                <th className="py-3 px-2 font-medium text-center">ماده اولیه</th>
                <th className="py-3 px-2 font-medium text-center">مقدار</th>
                <th className="py-3 px-2 font-medium text-center">قیمت هر واحد (تومان)</th>
                <th className="py-3 px-2 font-medium text-center">هزینه (تومان)</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-3 px-2 text-gray-800 dark:text-gray-100 text-center">{item.materialName}</td>
                  <td className="py-3 px-2 text-gray-600 dark:text-gray-300 text-center">{item.quantity.toLocaleString("fa-IR")} {item.materialUnit}</td>
                  <td className="py-3 px-2 text-gray-600 dark:text-gray-300 text-center">{item.unitPrice.toLocaleString("fa-IR")}</td>
                  <td className="py-3 px-2 text-gray-600 dark:text-gray-300 text-center">{(item.unitPrice * item.quantity).toLocaleString("fa-IR")}</td>
                  <td className="py-3 px-2 space-x-2 space-x-reverse">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium mr-3 transition-all duration-300"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
                ))}
                  <tr className="border-t-2 border-black dark:border-white">
                    <td className="py-3 px-2 text-gray-800 dark:text-gray-100 text-center">مجموع</td>
                    <td className="py-3 px-2 text-gray-600 dark:text-gray-300 text-center"></td>
                    <td className="py-3 px-2 text-gray-600 dark:text-gray-300 text-center"></td>
                    <td className="py-3 px-2 text-gray-600 dark:text-gray-300 text-center">{totalAmount.toLocaleString("fa-IR")}</td>
                    <td className="py-3 px-2 space-x-2 space-x-reverse">
                    <button
                      onClick={() => setPaymentOpen(true)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3 transition-all duration-300"
                    >
                      پرداخت
                    </button>
                  </td>
                  </tr>
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 space-y-4 animate-fade-in-up">
          {payments.length === 0 ? (
            <p className="text-center text-gray-400 dark:text-gray-500 py-6">
              هنوز پرداختی اضافه نشده
            </p>
          ) : (
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                <th className="py-3 px-2 font-medium text-center">مقدار پرداخت</th>
                <th className="py-3 px-2 font-medium text-center">نحوه پرداخت</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-3 px-2 text-gray-800 dark:text-gray-100 text-center">{payment.amount.toLocaleString("fa-IR")}</td>
                  <td className="py-3 px-2 text-gray-600 dark:text-gray-300 text-center">{payment.method === "Card" ? "کارت" : "نقدی"}</td>
                </tr>
                ))}
                  <tr className="border-t-2 border-black dark:border-white">
                    <td className="py-3 px-2 text-gray-800 dark:text-gray-100 text-center">مجموع</td>
                    <td className="py-3 px-2 text-gray-600 dark:text-gray-300 text-center">{totalPayment.toLocaleString("fa-IR")}</td>
                  </tr>
              </tbody>
            </table>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-lg py-2.5 font-medium transition-all duration-300"
          >
            لغو خرید
          </button>
          <button
            disabled={totalPayment < totalAmount}
            onClick={() => handleCheckout()}
            className="flex-1 border disabled:opacity-50 border-blue-600 text-blue-600 rounded-lg py-2.5 font-medium hover:bg-blue-600 hover:text-white transition-all duration-300 disabled:cursor-not-allowed"
          >
            نهایی کردن خرید
          </button>
        </div>

        <PurchaseItemModal
          open={openItem}
          onClose={() => setOpenItem(false)}
          onSubmit={handleAddItem}
          materials={materials}
        />

        <PaymentModal
          open={paymentOpen}
          onClose={() => setPaymentOpen(false)}
          onSubmit={handlePayment}
          total={totalAmount}
        />
      </div>
    </div>
  );
}