import { useState, useEffect } from "react";
import FormField from "../components/ui/FormField";
import { getCurrentShift, openShift, closeShift } from "../services/shiftService";

export default function ShiftPage() {
  const [shift, setShift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openingCash, setOpeningCash] = useState("");
  const [closingCash, setClosingCash] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadCurrentShift = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getCurrentShift();
      setShift(data);
    } catch (err) {
      // اگه شیفت بازی نبود، بک‌اند احتمالاً خطا میده (404 یا مشابه)
      // این یعنی حالت عادیه: شیفتی باز نیست، نه یه خطای واقعی
      setShift(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentShift();
  }, []);

  const handleOpenShift = async (e) => {
    e.preventDefault();
    setError("");

    if (!openingCash) {
      setError("مقدار پول اولیه الزامی است");
      return;
    }

    setSubmitting(true);
    try {
      const newShift = await openShift({ openingCash: Number(openingCash) });
      setShift(newShift);
      setOpeningCash("");
    } catch (err) {
      console.log(err.response ?? err);
      const message = err.response?.data?.message || "خطا در باز کردن شیفت";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseShift = async (e) => {
    e.preventDefault();
    setError("");

    if (!closingCash) {
      setError("مقدار نقد شمارش‌شده الزامی است");
      return;
    }

    if (!window.confirm("شیفت بسته بشه؟")) return;

    setSubmitting(true);
    try {
      await closeShift({ closingCash: Number(closingCash) });
      setShift(null);
      setClosingCash("");
    } catch (err) {
      const message = err.response?.data?.error || "خطا در بستن شیفت";
      setError(message);
    } finally {
      setSubmitting(false);
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
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          مدیریت شیفت
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 text-center">
            {error}
          </div>
        )}

        {shift ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 space-y-5 transition-colors duration-300animate-fade-in-up">
            <div className="text-center space-y-1">
              <span className="inline-block bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs rounded-full px-3 py-1 font-medium">
                شیفت باز است
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                کاربر: {shift.userFullName}
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">پول اولیه شیفت</span>
                <span className="text-gray-800 dark:text-gray-100 font-medium">
                  {Number(shift.openingCash).toLocaleString("fa-IR")} تومان
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">زمان شروع</span>
                <span className="text-gray-800 dark:text-gray-100 font-medium">
                  {new Date(shift.openedAt).toLocaleString("fa-IR")}
                </span>
              </div>
            </div>

            <form onSubmit={handleCloseShift} className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <FormField
                label="مقدار نقد شمارش‌شده (تومان)"
                type="number"
                value={closingCash}
                onChange={setClosingCash}
                required
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-red-600 text-white rounded-lg py-2.5 font-medium hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "در حال ثبت..." : "بستن شیفت"}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 space-y-5 transition-colors duration-300 animate-fade-in-up">
            <div className="text-center">
              <span className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs rounded-full px-3 py-1 font-medium">
                شیفت باز نیست
              </span>
            </div>

            <form onSubmit={handleOpenShift} className="space-y-4">
              <FormField
                label="پول اولیه شیفت (تومان)"
                type="number"
                value={openingCash}
                onChange={setOpeningCash}
                required
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white rounded-lg py-2.5 font-medium hover:bg-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "در حال ثبت..." : "باز کردن شیفت"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}