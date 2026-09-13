import { useState, useRef, useEffect } from "react";

function ChevronDown({ size = 18, className = "" }) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function Check({ size = 16, className = "" }) {
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
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function SelectField({
  label,
  value,
  onChange,
  options = [],
  rtl = true,
  required = false,
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const selected = options.find((opt) => opt.value === value) || null;

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const handleSelect = (optValue) => {
    onChange(optValue);
    setOpen(false);
  };

  return (
    <div className="relative" dir={rtl ? "rtl" : "ltr"} ref={containerRef}>
      <fieldset
        className={`group border rounded-lg px-5 py-1 transition-colors duration-200
        ${
          open
            ? "border-blue-600 dark:border-blue-400"
            : "border-gray-400 dark:border-gray-600"
        }`}
      >
        <legend
          className={`px-2 transition-all duration-300 ease-out
          ${
            open
              ? "text-blue-500 dark:text-blue-400 -translate-y-2"
              : "text-gray-400 dark:text-gray-500"
          }`}
        >
          {label}
          {required && <span className="text-red-500 mr-1">*</span>}
        </legend>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="w-full flex items-center justify-between outline-none bg-transparent py-1 text-gray-800 dark:text-gray-100 text-right"
        >
          <span className={selected ? "" : "text-gray-400 dark:text-gray-500"}>
            {selected ? selected.label : "انتخاب کنید"}
          </span>
          <ChevronDown
            size={18}
            className={`text-gray-400 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </fieldset>

      {required && (
        <input
          tabIndex={-1}
          autoComplete="off"
          className="absolute opacity-0 w-0 h-0"
          value={value ?? ""}
          onChange={() => {}}
          required
        />
      )}

      {open && (
        <ul
          className="absolute z-20 mt-2 w-full max-h-60 overflow-auto rounded-lg
          bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700
          py-1 outline-none animate-[fadeIn_0.15s_ease-out]"
        >
          {options.length === 0 && (
            <li className="px-4 py-2 text-sm text-gray-400 dark:text-gray-500 text-center">
              موردی یافت نشد
            </li>
          )}

          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`flex items-center justify-center px-4 py-2 text-sm cursor-pointer transition-colors duration-150
                ${
                  isSelected
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700/50"
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <Check size={16} className="text-blue-600 dark:text-blue-400" />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}