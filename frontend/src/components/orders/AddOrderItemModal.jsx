import { useState, useEffect } from "react";
import FormField from "../ui/FormField";

export default function AddOrderItemModal({ open, item, onClose, onSubmit }) {
  const [quantity, setQuantity] = useState("1");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setQuantity("1");
      setError("");
    }
  }, [open]);

  if (!open || !item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const qty = Number(quantity);

    if (!quantity || qty <= 0) {
      setError("تعداد باید بیشتر از صفر باشد");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(qty);
    } catch (err) {
      console.log(err.response ?? err);
      setError(
        err.response?.data?.message || "خطا در افزودن آیتم به سفارش"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm animate-fade-in-up"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
      >
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {item.name}
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {item.price?.toLocaleString("fa-IR")} تومان
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <FormField
            label="تعداد"
            type="number"
            value={quantity}
            onChange={setQuantity}
            autoFocus
          />
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-white dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            انصراف
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "در حال افزودن..." : "افزودن به سفارش"}
          </button>
        </div>
      </form>
    </div>
  );
}