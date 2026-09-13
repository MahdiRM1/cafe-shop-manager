import { useState, useEffect } from "react";
import FormField from "../ui/FormField";

export default function InventoryModal({
  open,
  onClose,
  onSubmit,
  initialData = null,
}) {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [minStockAlert, setMinStockAlert] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(initialData);

  useEffect(() => {
    if (!open) return;
    setName(initialData?.name ?? "");
    setUnit(initialData?.unit ?? "");
    setMinStockAlert(initialData?.minStockAlert ?? "");
    setError("");
  }, [open, initialData]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !unit.trim() || !minStockAlert) {
      setError("همه فیلد ها الزامی هستند.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        unit: unit.trim(),
        minStockAlert: Number(minStockAlert),
      });
      onClose();
    } catch (err) {
      console.log(err.response ?? err);
      setError(error.response?.data?.message || "خطا در ذخیره‌سازی ماده اولیه");
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
            {isEdit ? "ویرایش ماده اولیه" : "افزودن ماده اولیه جدید"}
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 text-center">
            {error}
          </div>
        )}

        <FormField label="نام ماده اولیه" type="text" value={name} onChange={setName} required />
        <FormField label="واحد ماده اولیه" type="text" value={unit} onChange={setUnit} />
        <FormField label="محدوده هشدار ماده اولیه" type="number" value={minStockAlert} onChange={setMinStockAlert} />

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
            {loading ? "در حال ذخیره..." : isEdit ? "ذخیره تغییرات" : "افزودن"}
          </button>
        </div>
      </form>
    </div>
  );
}