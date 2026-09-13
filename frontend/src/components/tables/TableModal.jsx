import { useState, useEffect } from "react";
import FormField from "../ui/FormField";
import SelectField from "../ui/SelectField";

export default function TableModal({
  open,
  onClose,
  onSubmit
}) {
  const [tableNumber, setTableNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setError("");
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    setLoading(true);
    try {
      await onSubmit({ tableNumber, capacity });
      onClose();
    } catch (err) {
      console.log(err.response ?? err);
      setError(error.response?.data?.message || "خطا در ایجاد میز");
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
        className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-md p-8 space-y-5 transition-colors duration-300"
      >
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            افزودن میز
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 text-center">
            {error}
          </div>
        )}

        <FormField label="شماره میز" type="text" value={tableNumber} onChange={setTableNumber} />
        <FormField label="ظرفیت میز" type="number" value={capacity} onChange={setCapacity} />

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
            {loading ? "در حال افزودن..." :  "افزودن"}
          </button>
        </div>
      </form>
    </div>
  );
}