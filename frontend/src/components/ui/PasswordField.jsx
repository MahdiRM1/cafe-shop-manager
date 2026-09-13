import { useState } from "react";

function EyeIcon({ size = 18, className = "" }) {
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
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ size = 18, className = "" }) {
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
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 11 8 11 8a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.53 13.53 0 0 0 1 12s4 8 11 8a9.74 9.74 0 0 0 5.39-1.61" />
      <path d="M2 2l20 20" />
    </svg>
  );
}

export default function PasswordField({ label, value, onChange, required = false }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
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
          group-focus-within:-translate-y-2"
        >
          {label}
          {required && <span className="text-red-500 mr-1">*</span>}
        </legend>

        <div className="relative flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            dir="ltr"
            className="w-full outline-none bg-transparent text-gray-800 dark:text-gray-100 py-1 pl-4"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute -left-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            tabIndex={-1}
          >
            {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        </div>
      </fieldset>
      <p className="text-xs text-gray-400 dark:text-gray-500 px-1 pt-1">
        حداقل ۶ کاراکتر
      </p>
    </div>
  );
}