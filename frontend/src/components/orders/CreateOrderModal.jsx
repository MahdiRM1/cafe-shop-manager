import { useState, useEffect } from "react";
import SelectField from "../ui/SelectField";
import { getTables } from '../../services/tableService';

export default function CreateOrderModal({
  open,
  onClose,
  onSubmit,
}) {
  const [type, setType] = useState("");
  const [tableId, setTableId] = useState("");
  const [tables, setTables] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTables = async () => {
    setLoading(true);

    try {
      const tableData = await getTables();
      console.log(tableData);
      setTables(tableData);
    } catch (err) {
      console.log(error.response ?? error);

      setError(
        error.response?.data?.message ||
          "خطا در دریافت اطلاعات میزها"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    fetchTables();
    setType("");
    setTableId("");
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    setLoading(true);
    try {
      await onSubmit({
        type,
        tableId
      });
      onClose();
    } catch (err) {
      setError("خطا در ساخت سفارش");
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
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            ایجاد سفارش جدید
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 text-center">
            {error}
          </div>
        )}

        <SelectField
          label="نوع سفارش"
          value={type}
          onChange={setType}
          options={[{value: 'DINE_IN', label: 'سالن'}, {value: 'TAKEAWAY', label: 'بیرون بر'}]}
          required
        />
        
        {type === 'DINE_IN' && (
          <SelectField 
            label="شماره میز" 
            value={tableId} 
            onChange={setTableId} 
            options={tables.map(table => ({value: table.id, label: table.tableNumber}))}
            required />
        )}


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