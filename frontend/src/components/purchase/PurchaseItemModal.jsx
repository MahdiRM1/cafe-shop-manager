import { useState, useEffect } from "react";
import FormField from "../ui/FormField";
import SelectField from "../ui/SelectField";
import TextAreaField from "../ui/TextAreaField";

export default function PurchaseItemModal({
  open,
  onClose,
  onSubmit,
  materials = [],
}) {
  const [materialId, setMaterialId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!materialId || !quantity || !unitPrice) {
      setError("همه‌ی فیلدها الزامی هستن");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        materialId: materialId,
        quantity: Number(quantity),
        unitPrice: Number(unitPrice),
        note: note || null,
      });
      onClose();
    } catch (err) {
      setError("خطا در ذخیره‌سازی آیتم");
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
        className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-md p-8 space-y-5 transition-colors duration-300 max-h-[90vh] overflow-y-auto"
      >
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            افزودن آیتم جدید
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 text-center">
            {error}
          </div>
        )}

        <SelectField
          label="ماده اولیه"
          value={materialId}
          onChange={setMaterialId}
          options={materials.map((m) => ({ value: m.id, label: m.name }))}
          required
        />      
        <FormField label="مقدار ماده" type="number" value={quantity} onChange={setQuantity} required />
        <FormField label="قیمت هر واحد (تومان)" type="number" value={unitPrice} onChange={setUnitPrice} required />
        
        <TextAreaField label="توضیحات" value={note} onChange={setNote} rtl />

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
            {loading ? "در حال ذخیره..." : "افزودن"}
          </button>
        </div>
      </form>
    </div>
  );
}