export default function SelectField({
  label,
  value,
  onChange,
  options = [], // [{ value, label }]
  rtl = true,
  required = false,
}) {
  return (
    <fieldset
      className="group border border-gray-400 dark:border-gray-600 rounded-lg px-5 py-1
      transition-colors duration-200
      focus-within:border-blue-600 dark:focus-within:border-blue-400 focus-within:ring-blue-500/20"
    >
      <legend
        className="
            px-2 text-gray-400 dark:text-gray-500
            transition-all duration-300 ease-out
            group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400
            group-focus-within:-translate-y-2
        "
      >
        {label}
      </legend>

      <select
        value={value}
        dir={rtl ? "rtl" : "ltr"}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full outline-none bg-transparent py-1 text-gray-800 dark:text-gray-100 dark:[color-scheme:dark]"
      >
        <option value="" disabled>
          انتخاب کنید
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </fieldset>
  );
}