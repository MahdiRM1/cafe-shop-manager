import { useMemo, useState, useEffect, useRef } from "react";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import gregorian from "react-date-object/calendars/gregorian";
import persian_fa from "react-date-object/locales/persian_fa";

export default function DateTimeField({
  label = "زمان",
  value = "",
  onChange,
  required = false,
  showTime = true, // false باشد یعنی فقط تاریخ لازم است، بدون ساعت و دقیقه
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const initial = useMemo(() => {
    if (!value) return null;
    try {
      const [datePart, timePart] = value.split("T");
      const [gy, gm, gd] = datePart.split("-").map(Number);
      const [gh, gmin] = (timePart || "00:00").split(":").map(Number);
      // calendar را صریح gregorian می‌گذاریم تا با ورودی (که همیشه میلادی است) هم‌خوان باشد
      return new DateObject({
        year: gy,
        month: gm,
        day: gd,
        hour: gh || 0,
        minute: gmin || 0,
        calendar: gregorian,
      }).convert(persian);
    } catch {
      return null;
    }
  }, [value]);

  const [year, setYear] = useState(initial?.year ?? "");
  const [month, setMonth] = useState(initial?.month?.number ?? "");
  const [day, setDay] = useState(initial?.day ?? "");
  const [hour, setHour] = useState(initial?.hour ?? "");
  const [minute, setMinute] = useState(initial?.minute ?? "");

  const monthNames = persian_fa.months.map((m) => m[0]);
  const weekDayNames = persian_fa.weekDays.map((w) => w[1]); // نام کوتاه

  const daysInMonth = useMemo(() => {
    if (!year || !month) return 31;
    try {
      return new DateObject({
        year: Number(year),
        month: Number(month),
        day: 1,
        calendar: persian,
        locale: persian_fa,
      }).month.length;
    } catch {
      return 31;
    }
  }, [year, month]);

  useEffect(() => {
    if (!year || !month || !day) return;
    const safeDay = Math.min(Number(day), daysInMonth);
    // وقتی ساعت نمایش داده نمی‌شود، همیشه ابتدای روز (۰۰:۰۰) در نظر گرفته می‌شود
    const h = !showTime ? 0 : hour === "" ? 0 : Number(hour);
    const m = !showTime ? 0 : minute === "" ? 0 : Number(minute);

    const persianDate = new DateObject({
      year: Number(year),
      month: Number(month),
      day: safeDay,
      hour: h,
      minute: m,
      calendar: persian,
      locale: persian_fa,
    });

    // نکته‌ی مهم: convert باید ماژول calendar واقعی بگیرد (gregorian که import شده)
    // نه رشته‌ی "gregorian"، وگرنه تبدیل بی‌اثر می‌ماند و مقدار شمسی
    // به اشتباه به‌عنوان میلادی برگردانده می‌شود.
    const g = persianDate.convert(gregorian);
    const gy = g.year;
    const gm = String(g.month.number).padStart(2, "0");
    const gd = String(g.day).padStart(2, "0");

    if (!showTime) {
      onChange(`${gy}-${gm}-${gd}`);
    } else {
      const gh = String(h).padStart(2, "0");
      const gmin = String(m).padStart(2, "0");
      onChange(`${gy}-${gm}-${gd}T${gh}:${gmin}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month, day, hour, minute, showTime]);

  // بستن پنل با کلیک بیرون
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentPersianYear = new DateObject({ calendar: persian }).year;
  const years = Array.from({ length: 25 }, (_, i) => currentPersianYear - 5 + i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5); // گام ۵ دقیقه‌ای برای دقت کافی و سرعت بیشتر

  const displayText = useMemo(() => {
    if (!year || !month || !day) return null;
    const monthName = monthNames[Number(month) - 1];
    if (!showTime) {
      return `${toFa(day)} ${monthName} ${toFa(year)}`;
    }
    const h = hour === "" ? "۰۰" : toFa(String(hour).padStart(2, "0"));
    const m = minute === "" ? "۰۰" : toFa(String(minute).padStart(2, "0"));
    return `${toFa(day)} ${monthName} ${toFa(year)}  ساعت ${h}:${m}`;
  }, [year, month, day, hour, minute, monthNames, showTime]);

  function toFa(n) {
    const digits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return String(n).replace(/[0-9]/g, (d) => digits[d]);
  }

  function setToday() {
    const now = new DateObject({ calendar: persian });
    setYear(now.year);
    setMonth(now.month.number);
    setDay(now.day);
    if (showTime) {
      setHour(now.hour);
      setMinute(Math.round(now.minute / 5) * 5);
    }
  }

  function selectClass(extra = "") {
    return `bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1.5 text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-colors ${extra}`;
  }

  return (
    <div ref={containerRef} className="relative" dir="rtl">
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
        {label}
        {required && <span className="text-rose-500 mr-1">*</span>}
      </label>

      {/* دکمه نمایش مقدار انتخاب‌شده */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`
          w-full flex items-center justify-between gap-2
          rounded-xl border px-4 py-2.5
          bg-white dark:bg-gray-800
          shadow-sm hover:shadow-md
          transition-all duration-200
          ${open
            ? "border-blue-500 ring-2 ring-blue-500/20"
            : "border-gray-300 dark:border-gray-600"}
        `}
      >
        <span
          className={
            displayText
              ? "text-gray-800 dark:text-gray-100 font-medium"
              : "text-gray-400 dark:text-gray-500"
          }
        >
          {displayText || (showTime ? "تاریخ و ساعت را انتخاب کنید" : "تاریخ را انتخاب کنید")}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* پنل باز شونده */}
      {open && (
        <div
          className="
            absolute z-20 mt-2 w-full min-w-[320px]
            bg-white dark:bg-gray-800
            border border-gray-200 dark:border-gray-700
            rounded-xl shadow-lg
            p-4
          "
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
              تاریخ شمسی
            </span>
            <button
              type="button"
              onClick={setToday}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              انتخاب امروز{showTime ? " و الان" : ""}
            </button>
          </div>

          {/* ردیف تاریخ */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <select
              className={selectClass("w-full text-center")}
              value={day}
              onChange={(e) => setDay(e.target.value)}
            >
              <option value="" disabled>روز</option>
              {days.map((d) => (
                <option key={d} value={d}>{toFa(d)}</option>
              ))}
            </select>

            <select
              className={selectClass("w-full text-center")}
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="" disabled>ماه</option>
              {monthNames.map((name, idx) => (
                <option key={idx} value={idx + 1}>{name}</option>
              ))}
            </select>

            <select
              className={selectClass("w-full text-center")}
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="" disabled>سال</option>
              {years.map((y) => (
                <option key={y} value={y}>{toFa(y)}</option>
              ))}
            </select>
          </div>

          {/* ردیف ساعت — فقط وقتی showTime فعال باشد نمایش داده می‌شود */}
          {showTime && (
            <>
              <div className="h-px bg-gray-100 dark:bg-gray-700 my-3" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500">ساعت</span>
                <div className="flex items-center gap-1">
                  <select
                    className={selectClass("w-16 text-center")}
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
                  >
                    <option value="" disabled>--</option>
                    {hours.map((h) => (
                      <option key={h} value={h}>{toFa(String(h).padStart(2, "0"))}</option>
                    ))}
                  </select>
                  <span className="text-gray-400 font-medium">:</span>
                  <select
                    className={selectClass("w-16 text-center")}
                    value={minute}
                    onChange={(e) => setMinute(e.target.value)}
                  >
                    <option value="" disabled>--</option>
                    {minutes.map((m) => (
                      <option key={m} value={m}>{toFa(String(m).padStart(2, "0"))}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          <button
            type="button"
            onClick={() => setOpen(false)}
            className={`
              w-full rounded-lg py-2
              bg-blue-600 hover:bg-blue-700
              text-white text-sm font-medium
              transition-colors
              ${showTime ? "" : "mt-1"}
            `}
          >
            تأیید
          </button>
        </div>
      )}
    </div>
  );
}