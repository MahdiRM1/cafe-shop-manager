import { useState, useEffect } from "react";
import PasswordField from "../ui/PasswordField";

function UserIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export default function EditPasswordModal({
  open,
  onClose,
  onSubmit,
  initialData,
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setPassword("");
    setError("");
  }, [open, initialData]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("طول رمز عبور حداقل 6 کاراکتر است");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ newPassword: password });
      onClose();
    } catch (err) {
      setError("خطا در ذخیره‌سازی کاربر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50 animate-fade-in-up"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-md p-8 space-y-5 transition-colors duration-300 max-h-[90vh] overflow-y-auto"
      >
        <div className="text-center space-y-3">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            ویرایش رمز عبور
          </h2>

          <div className="inline-flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-2">
            <UserIcon size={16} className="text-gray-400 dark:text-gray-500 shrink-0" />
            <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">
              {initialData?.fullName}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              ({initialData?.role === "CASHIER" ? "صندوقدار" : "باریستا"})
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 text-center">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <div className="relative">
            <PasswordField
              value={password}
              label="رمز عبور جدید"
              onChange={setPassword}
            />
          </div>
          
        </div>

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
            {loading ? "در حال ذخیره..." : "ذخیره"}
          </button>
        </div>
      </form>
    </div>
  );
}