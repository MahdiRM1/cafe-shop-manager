import { useState, useEffect } from "react";
import FormField from "../ui/FormField";
import SelectField from "../ui/SelectField";
import PasswordField from "../ui/PasswordField";

export default function UserModal({
  open,
  onClose,
  onSubmit,
  initialData
}) {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(initialData);

  useEffect(() => {
    if (!open) return;
    setFullName(initialData?.fullName ?? "");
    setUsername(initialData?.username ?? "");
    setRole(initialData?.role ?? "CASIER");
    setError("");
  }, [open, initialData]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !username.trim() || !role) {
      setError("همه‌ی فیلدها الزامی هستن");
      return;
    }

    if (!isEdit && password.length < 6) {
      setError("طول رمز عبور حداقل 6 کاراکتر است");
      return;
    }


    setLoading(true);
    try {
      if (isEdit){
        await onSubmit({
        fullName: fullName.trim(),
        username: username.trim(),
        role
      });        role

      }
      else await onSubmit({
        fullName: fullName.trim(),
        username: username.trim(),
        password,
        role
      });
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
            {isEdit ? "ویرایش کاربر جدید" : "افزودن کاربر جدید"}
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 text-center">
            {error}
          </div>
        )}

        <FormField label="نام کاربری" type="text" value={username} onChange={setUsername} required />
        {!isEdit && ( <PasswordField label="رمز عبور" value={password} onChange={setPassword} required /> )}
        <FormField label="نام کامل" type="text" value={fullName} onChange={setFullName} required />
        <SelectField
          label="نقش"
          value={role}
          onChange={setRole}
          options={[{value: 'CASHIER', label: 'صندوقدار'}, {value: 'BARISTA', label: 'باریستا'}]}
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
            {loading ? "در حال ذخیره..." : isEdit ? "ذخیره تغییرات" : "افزودن"}
          </button>
        </div>
      </form>
    </div>
  );
}