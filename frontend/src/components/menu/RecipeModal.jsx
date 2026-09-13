import { useState, useEffect } from "react";
import FormField from "../ui/FormField";
import SelectField from "../ui/SelectField";
import { getRecipe } from "../../services/menuService";
import { getRawMaterials } from "../../services/inventoryService";

export default function RecipeModal({
  open,
  onClose,
  onSubmit,
  menuItem,
}) {
  const [rawMaterial, setRawMaterial] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [materials, setMaterials] = useState([]);
  const [recipe, setRecipe] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  const fetchData = async () => {
    setError("");

    if (!menuItem?.id) {
      setError("شناسه آیتم منو موجود نیست");
      return;
    }

    setLoading(true);

    try {
      const [materialsData, recipeData] = await Promise.all([
        getRawMaterials(),
        getRecipe(menuItem.id),
      ]);

      setMaterials(materialsData);
      setRecipe(recipeData);
    } catch (error) {
      console.log(error.response ?? error);

      setError(
        error.response?.data?.message ||
          "خطا در دریافت مواد اولیه و رسپی"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && menuItem?.id) {
      fetchData();
    }
  }, [open, menuItem]);

  if (!open) return null;

  const handleSubmitItem = () => {
    setError("");

    if (!rawMaterial || !quantity) {
      setError("ماده اولیه و مقدار را وارد کنید");
      return;
    }

    if (Number(quantity) <= 0) {
      setError("مقدار باید بیشتر از صفر باشد");
      return;
    }

    const alreadyExists = recipe.some(
      (item) => Number(item.rawMaterialId) === Number(rawMaterial.id)
    );

    if (alreadyExists) {
      setError("این ماده اولیه قبلاً به رسپی اضافه شده است");
      return;
    }

    setRecipe((prev) => [
      ...prev,
      {
        rawMaterialId: Number(rawMaterial.id),
        rawMaterialName: rawMaterial.name,
        quantityNeeded: Number(quantity),
        rawMaterialUnit: rawMaterial.unit,
      },
    ]);

    setRawMaterial(null);
    setQuantity("");
  };

  const handleRemoveItem = (index) => {
    setRecipe((prev) => prev.filter((_, i) => i !== index));

    if (editingIndex === index) {
      setEditingIndex(null);
      setEditValue("");
    }
  };

  const handleStartEdit = (index) => {
    setError("");
    setEditingIndex(index);
    setEditValue(String(recipe[index].quantityNeeded));
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditValue("");
  };

  const handleSaveEdit = (index) => {
    setError("");

    if (!editValue || Number(editValue) <= 0) {
      setError("مقدار باید بیشتر از صفر باشد");
      return;
    }

    setRecipe((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantityNeeded: Number(editValue) } : item
      )
    );

    setEditingIndex(null);
    setEditValue("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (recipe.length === 0) {
      setError("حداقل یک ماده اولیه به رسپی اضافه کنید");
      return;
    }

    setLoading(true);

    try {
      await onSubmit(recipe);
      onClose();
    } catch (error) {
      console.log(error.response ?? error);

      setError(
        error.response?.data?.message ||
          "خطا در ذخیره‌سازی رسپی"
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
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
      >
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                رسپی {menuItem.name}
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                مواد اولیه و مقدار مورد نیاز برای تهیه این آیتم
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
        <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
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
          {/* Add material */}
          <div className="rounded-xl border mb-10 border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                افزودن ماده اولیه
              </h3>
            </div>

            <div className="grid grid-cols-[1fr_110px_auto] items-end gap-3">
              <SelectField
                label="ماده اولیه"
                value={rawMaterial}
                onChange={setRawMaterial}
                options={materials
                  .filter(
                    (m) =>
                      !recipe.some(
                        (item) => Number(item.rawMaterialId) === Number(m.id)
                      )
                  )
                  .map((m) => ({
                    value: m,
                    label: m.name,
                  }))}
              />

              <FormField
                label="مقدار"
                type="number"
                placeholder={rawMaterial ? `(${rawMaterial.unit})` : ""}
                value={quantity}
                onChange={setQuantity}
              />

              <button
                type="button"
                onClick={handleSubmitItem}
                className="mb-0.5 flex h-10 items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-sm font-medium text-white transition hover:bg-blue-700 active:scale-95"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>

                افزودن
              </button>
            </div>
          </div>

          {/* Current recipe */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                مواد تشکیل‌دهنده
              </h3>

              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                {recipe.length.toLocaleString("fa-IR")} ماده
              </span>
            </div>

            {recipe.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 px-4 py-8 text-center dark:border-gray-700">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  هنوز ماده‌ای به رسپی اضافه نشده
                </p>

                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  از بخش زیر مواد اولیه مورد نیاز را اضافه کنید
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                {recipe.map((item, index) => {
                  const isEditing = editingIndex === index;

                  return (
                    <div
                      key={item.id ?? index}
                      className="group flex items-center gap-3 border-b border-gray-100 px-4 py-3 last:border-b-0 dark:border-gray-800"
                    >
                      {/* Name */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-100">
                          {item.rawMaterialName}
                        </p>
                      </div>

                      {/* Quantity / Edit */}
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            autoFocus
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleSaveEdit(index);
                              }
                              if (e.key === "Escape") {
                                handleCancelEdit();
                              }
                            }}
                            className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-sm text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                          />

                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {item.rawMaterialUnit}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleSaveEdit(index)}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-green-600 transition hover:bg-green-50 dark:hover:bg-green-950/30"
                            title="ذخیره"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </button>

                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 dark:hover:bg-gray-800"
                            title="انصراف"
                          >
                            <svg
                              width="16"
                              height="16"
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
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="text-left">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                              {Number(item.quantityNeeded).toLocaleString(
                                "fa-IR"
                              )}
                            </span>

                            <span className="mr-1 text-xs text-gray-400 dark:text-gray-500">
                              {item.rawMaterialUnit}
                            </span>
                          </div>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => handleStartEdit(index)}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 opacity-70 transition hover:bg-blue-50 hover:text-blue-600 group-hover:opacity-100 dark:hover:bg-blue-950/30"
                            title="ویرایش مقدار"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                            </svg>
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 opacity-70 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-950/30"
                            title="حذف"
                          >
                            <svg
                              width="17"
                              height="17"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                            >
                              <path d="M3 6h18" />
                              <path d="M8 6V4h8v2" />
                              <path d="M19 6l-1 14H6L5 6" />
                              <path d="M10 11v5" />
                              <path d="M14 11v5" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
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
            disabled={loading || recipe.length === 0}
            className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "در حال ذخیره..." : "ثبت رسپی"}
          </button>
        </div>
      </form>
    </div>
  );
}