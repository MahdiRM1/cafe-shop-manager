import { useState, useEffect } from "react";
import FormField from "../ui/FormField";
import SelectField from "../ui/SelectField";

export default function PaymentModal({
  open,
  onClose,
  onSubmit,
  total
}) {
  const [amount, setAmount] = useState(total);
  const [method, setMethod] = useState("CARD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setError("");
    setAmount(total);
  }, [open, total]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (amount > total) {
      setError("مبلغ پرداختی نمی‌تواند بیشتر از مبلغ باقی مانده باشد");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ amount: amount, method: method });
      onClose();
    } catch (err) {
      console.log(err.response ?? err);
      setError(error.response?.data?.message || "خطا در ذخیره‌سازی پرداخت");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-md p-8 space-y-5 transition-colors duration-300"
      >
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            تایید نهایی خرید
          </h2>
          <p className="text-xl font-bold text-gray-600 dark:text-gray-300">
            {total.toLocaleString("fa-IR")} :هزینه کل سفارش
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 text-center">
            {error}
          </div>
        )}

        <FormField label="مقدار پرداخت" type="number" value={amount} onChange={setAmount} />
        <SelectField
          label='نحوه پرداخت'
          value={method}
          onChange={setMethod}
          options={[{value:"CASH", label:"نقدی"}, {value:"CARD", label:"کارت"}]}
          required
        />

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg py-2.5 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
          >
            انصراف
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white rounded-lg py-2.5 font-medium hover:bg-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "در حال پرداخت..." :  "پرداخت"}
          </button>
        </div>
      </form>
    </div>
  );
}