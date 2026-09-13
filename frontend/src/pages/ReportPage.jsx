import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import gregorian from "react-date-object/calendars/gregorian";
import DateTimeField from "../components/ui/DateTimeField";
import {
  getDailyReport,
  getRangeSales,
  getTopItems,
  getRangeProfit,
  getShifts,
  getShiftReport,
} from "../services/reportService";

const TABS = [
  { id: "daily", label: "روزانه" },
  { id: "range", label: "بازه فروش" },
  { id: "top", label: "پرفروش‌ترین‌ها" },
  { id: "profit", label: "سود" },
  { id: "shifts", label: "شیفت‌ها" },
];

const toISODate = (dateObj) => {
  const g = dateObj.convert(gregorian);
  const y = g.year;
  const m = String(g.month.number).padStart(2, "0");
  const d = String(g.day).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const todayISO = () => toISODate(new DateObject({ calendar: persian }));

const startOfMonthISO = () => {
  const start = new DateObject({ calendar: persian }).set({ day: 1 });
  return toISODate(start);
};


const startOfMonthDate = () => startOfMonthISO();
const todayDate = () => todayISO();

const dateOnly = (value) => (value ? value.split("T")[0] : "");

const money = (n) => Number(n ?? 0).toLocaleString("fa-IR");

const ORDER_TYPE_LABELS = {
  DINE_IN: "دورهمی",
  TAKEAWAY: "بیرون‌بر",
  DELIVERY: "ارسالی",
};

const ORDER_STATUS_LABELS = {
  OPEN: "باز",
  PENDING: "در انتظار",
  CLOSED: "بسته‌شده",
  CANCELLED: "لغوشده",
};

const ORDER_STATUS_STYLES = {
  OPEN: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  PENDING: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  CLOSED: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString("fa-IR", { dateStyle: "short", timeStyle: "short" }) : "—";

function OrderSummaryCard({ order }) {
  const netAmount = Number(order.amount ?? 0) - Number(order.discount ?? 0);
  const statusStyle = ORDER_STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300";

  return (
    <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 hover:border-blue-200 dark:hover:border-blue-900 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2 animate-fade-in-up">
        <div>
          <p className="font-medium text-gray-800 dark:text-gray-100">
            سفارش #{order.id}
            {order.tableNumber ? ` · میز ${order.tableNumber}` : ""}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {ORDER_TYPE_LABELS[order.type] ?? order.type} · {order.userFullName ?? "—"}
          </p>
        </div>
        <span className={`shrink-0 text-xs font-medium rounded-full px-2.5 py-1 ${statusStyle}`}>
          {ORDER_STATUS_LABELS[order.status] ?? order.status}
        </span>
      </div>

      <div className="flex items-end justify-between gap-2 mt-3 animate-fade-in-up">
        <div className="text-xs text-gray-400 dark:text-gray-500">
          {formatDateTime(order.closedAt ?? order.createdAt)}
        </div>
        <div className="text-left">
          {Number(order.discount) > 0 && (
            <p className="text-xs text-gray-400 dark:text-gray-500 line-through">
              {money(order.amount)} تومان
            </p>
          )}
          <p className="font-bold text-gray-800 dark:text-gray-100">
            {money(netAmount)} تومان
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ReportPage() {
  const [activeTab, setActiveTab] = useState("daily");

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gray-100 dark:bg-gray-950 p-6 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            گزارش‌گیری
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            آمار فروش، سود و عملکرد شیفت‌ها
          </p>
        </div>

        {/* تب‌ها */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
                activeTab === t.id
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-blue-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "daily" && <DailyReportTab />}
        {activeTab === "range" && <RangeSalesTab />}
        {activeTab === "top" && <TopItemsTab />}
        {activeTab === "profit" && <ProfitTab />}
        {activeTab === "shifts" && <ShiftsTab />}
      </div>
    </div>
  );
}

/* ---------------- کارت خلاصه‌ی عددی ---------------- */
function StatCard({ label, value, accent = "text-gray-800 dark:text-gray-100" }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-5">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`text-xl font-bold mt-1 ${accent}`}>{value}</p>
    </div>
  );
}

/* ---------------- گزارش روزانه ---------------- */
function DailyReportTab() {
  const [date, setDate] = useState(todayDate());
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getDailyReport(date);
      setReport(data);
    } catch (err) {
      console.log(err.response ?? err);
      setError(err.response?.data?.message || "خطا در دریافت گزارش روزانه");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-5 animate-fade-in-up">
        <div className="max-w-xs">
          <DateTimeField label="تاریخ" value={date} onChange={setDate} showTime={false} />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 text-center">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/60 py-10">
          در حال بارگذاری...
        </p>
      ) : !report ? (
        <p className="text-center text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/60 py-10">
          داده‌ای یافت نشد
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up">
            <StatCard label="تعداد سفارش" value={money(report.orderCount)} />
            <StatCard
              label="مبلغ دریافتی"
              value={`${money(report.received)} تومان`}
              accent="text-green-600 dark:text-green-400"
            />
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md overflow-hidden animate-fade-in-up">
            <h2 className="font-bold text-gray-800 dark:text-gray-100 px-5 pt-5 pb-2">
              سفارش‌های امروز
            </h2>
            {!report.orders || report.orders.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 px-5 pb-5">
                سفارشی ثبت نشده است
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                      <th className="text-right font-medium px-5 py-2">شماره سفارش</th>
                      <th className="text-right font-medium px-5 py-2">وضعیت</th>
                      <th className="text-right font-medium px-5 py-2">مبلغ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.orders.map((o) => (
                      <tr
                        key={o.id}
                        className="border-b border-gray-50 dark:border-gray-800/50 last:border-0"
                      >
                        <td className="px-5 py-2.5 text-gray-700 dark:text-gray-200">
                          {o.id}
                        </td>
                        <td className="px-5 py-2.5 text-gray-500 dark:text-gray-400">
                          {o.status}
                        </td>
                        <td className="px-5 py-2.5 text-gray-700 dark:text-gray-200 font-medium">
                          {money(o.amount)} تومان
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------- کامپوننت مشترک انتخاب بازه تاریخی ---------------- */
function DateRangePicker({ from, to, onFrom, onTo }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-5 flex items-end gap-3 flex-wrap">
      <div className="min-w-55">
        <DateTimeField label="از تاریخ" value={from} onChange={onFrom} showTime={false} />
      </div>
      <div className="min-w-55">
        <DateTimeField label="تا تاریخ" value={to} onChange={onTo} showTime={false} />
      </div>
    </div>
  );
}

/* ---------------- بازه فروش ---------------- */
function RangeSalesTab() {
  const [from, setFrom] = useState(startOfMonthDate());
  const [to, setTo] = useState(todayDate());
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      // بک‌اند LocalDateTime می‌خواهد؛ ابتدا و انتهای روز را می‌سازیم
      const data = await getRangeSales(`${dateOnly(from)}T00:00:00`, `${dateOnly(to)}T23:59:59`);
      setReport(data);
    } catch (err) {
      console.log(err.response ?? err);
      setError(err.response?.data?.message || "خطا در دریافت گزارش بازه فروش");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to]);

  return (
    <div className="space-y-4">
      <DateRangePicker from={from} to={to} onFrom={setFrom} onTo={setTo} />

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 text-center">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/60 py-10">
          در حال بارگذاری...
        </p>
      ) : !report ? (
        <p className="text-center text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/60 py-10">
          داده‌ای یافت نشد
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard label="تعداد سفارش" value={money(report.totalOrderCount)} />
            <StatCard
              label="مبلغ فروش"
              value={`${money(report.saleAmount)} تومان`}
              accent="text-green-600 dark:text-green-400"
            />
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-5">
            <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-3">
              سفارش‌های این بازه
            </h2>
            {!report.orders || report.orders.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500">
                سفارشی در این بازه یافت نشد
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {report.orders.map((order) => (
                  <OrderSummaryCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------- پرفروش‌ترین‌ها ---------------- */
function TopItemsTab() {
  const [from, setFrom] = useState(startOfMonthDate());
  const [to, setTo] = useState(todayDate());
  const [topItems, setTopItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getTopItems(`${dateOnly(from)}T00:00:00`, `${dateOnly(to)}T23:59:59`);
      setTopItems(data ?? []);
    } catch (err) {
      console.log(err.response ?? err);
      setError(err.response?.data?.message || "خطا در دریافت گزارش پرفروش‌ترین‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to]);

  const chartData = topItems.map((i) => ({
    name: i.menuItemName,
    فروش: Number(i.totalQuantitySold ?? 0),
  }));

  return (
    <div className="space-y-4">
      <DateRangePicker from={from} to={to} onFrom={setFrom} onTo={setTo} />

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 text-center animate-fade-in-up">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/60 py-10">
          در حال بارگذاری...
        </p>
      ) : topItems.length === 0 ? (
        <p className="text-center text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/60 py-10">
          داده‌ای در این بازه یافت نشد
        </p>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-5">
            <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4">
              نمودار پرفروش‌ترین آیتم‌ها
            </h2>
            <div style={{ direction: "ltr" }} className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip />
                  <Bar dataKey="فروش" fill="#2563eb" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                    <th className="text-right font-medium px-5 py-2">آیتم</th>
                    <th className="text-right font-medium px-5 py-2">تعداد فروش</th>
                    <th className="text-right font-medium px-5 py-2">درآمد</th>
                  </tr>
                </thead>
                <tbody>
                  {topItems.map((i) => (
                    <tr
                      key={i.menuItemId}
                      className="border-b border-gray-50 dark:border-gray-800/50 last:border-0"
                    >
                      <td className="px-5 py-2.5 text-gray-700 dark:text-gray-200">
                        {i.menuItemName}
                      </td>
                      <td className="px-5 py-2.5 text-gray-500 dark:text-gray-400">
                        {money(i.totalQuantitySold)}
                      </td>
                      <td className="px-5 py-2.5 text-gray-700 dark:text-gray-200 font-medium">
                        {money(i.totalRevenue)} تومان
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------- سود ---------------- */
function ProfitTab() {
  const [from, setFrom] = useState(startOfMonthDate());
  const [to, setTo] = useState(todayDate());
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      // این endpoint طبق کنترلر LocalDate (بدون زمان) می‌گیرد
      const data = await getRangeProfit(dateOnly(from), dateOnly(to));
      setReport(data);
    } catch (err) {
      console.log(err.response ?? err);
      setError(err.response?.data?.message || "خطا در دریافت گزارش سود");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to]);

  const chartData =
    report?.orderCountByDay?.map((count, idx) => ({
      day: `روز ${idx + 1}`,
      تعداد: count,
      مبلغ: Number(report.orderPriceByDay?.[idx] ?? 0),
    })) ?? [];

  return (
    <div className="space-y-4">
      <DateRangePicker from={from} to={to} onFrom={setFrom} onTo={setTo} />

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 text-center">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/60 py-10">
          در حال بارگذاری...
        </p>
      ) : !report ? (
        <p className="text-center text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/60 py-10">
          داده‌ای یافت نشد
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="تعداد سفارش" value={money(report.totalOrderCount)} />
            <StatCard
              label="مبلغ فروش"
              value={`${money(report.saleAmount)} تومان`}
              accent="text-blue-600 dark:text-blue-400"
            />
            <StatCard
              label="مبلغ خرید"
              value={`${money(report.purchaseAmount)} تومان`}
              accent="text-amber-600 dark:text-amber-400"
            />
            <StatCard
              label="سود"
              value={`${money(report.profitAmount)} تومان`}
              accent="text-green-600 dark:text-green-400"
            />
          </div>

          {chartData.length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-5">
              <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4">
                روند فروش روزانه
              </h2>
              <div style={{ direction: "ltr" }} className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="تعداد"
                      stroke="#2563eb"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="مبلغ"
                      stroke="#16a34a"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ---------------- شیفت‌ها ---------------- */
function ShiftsTab() {
  const [from, setFrom] = useState(startOfMonthDate());
  const [to, setTo] = useState(todayDate());
  const [shifts, setShifts] = useState([]); // لیست پایه شیفت‌ها
  const [reportsById, setReportsById] = useState({}); // گزارش تفصیلی هر شیفت
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const shiftList = await getShifts({
        from: `${dateOnly(from)}T00:00:00`,
        to: `${dateOnly(to)}T23:59:59`,
      });
      setShifts(shiftList ?? []);
      // گزارش تفصیلی همه شیفت‌های این بازه را موازی می‌گیریم
      const entries = await Promise.all(
        (shiftList ?? []).map(async (s) => {
          try {
            const r = await getShiftReport(s.id ?? s.shiftId);
            return [s.id ?? s.shiftId, r];
          } catch {
            return [s.id ?? s.shiftId, null];
          }
        })
      );
      setReportsById(Object.fromEntries(entries));
    } catch (err) {
      console.log(err.response ?? err);
      setError(err.response?.data?.message || "خطا در دریافت لیست شیفت‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [from, to]);

  return (
    <div className="space-y-4">
      <DateRangePicker from={from} to={to} onFrom={setFrom} onTo={setTo} />

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 text-center">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/60 py-10">
          در حال بارگذاری...
        </p>
      ) : shifts.length === 0 ? (
        <p className="text-center text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/60 py-10">
          شیفتی در این بازه یافت نشد
        </p>
      ) : (
        <div className="space-y-3">
          {shifts.map((s) => {
            const id = s.id ?? s.shiftId;
            const report = reportsById[id];
            const isOpen = expandedId === id;
            return (
              <div
                key={id}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-md overflow-hidden animate-fade-in-up"
              >
                <button
                  onClick={() => setExpandedId(isOpen ? null : id)}
                  className="w-full flex items-center justify-between px-5 py-4"
                >
                  <div className="text-right">
                    <p className="font-medium text-gray-800 dark:text-gray-100">
                      {report?.userFullName ?? `شیفت ${id}`}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {report?.openedAt
                        ? new Date(report.openedAt).toLocaleString("fa-IR")
                        : ""}
                      {report?.closedAt
                        ? ` تا ${new Date(report.closedAt).toLocaleString("fa-IR")}`
                        : " (باز)"}
                    </p>
                  </div>
                  <svg
                    className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                    width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="border-t border-gray-100 dark:border-gray-800 p-5">
                    {!report ? (
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        گزارش این شیفت در دسترس نیست
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <StatCard label="موجودی ابتدای شیفت" value={`${money(report.openingCash)} تومان`} />
                        <StatCard label="فروش نقدی" value={`${money(report.cashSales)} تومان`} accent="text-green-600 dark:text-green-400" />
                        <StatCard label="فروش کارتی" value={`${money(report.cardSales)} تومان`} accent="text-blue-600 dark:text-blue-400" />
                        <StatCard label="موجودی پایان شیفت" value={`${money(report.closingCash)} تومان`} />
                        <StatCard
                          label="مغایرت صندوق"
                          value={`${money(report.discrepancy)} تومان`}
                          accent={
                            Number(report.discrepancy) === 0
                              ? "text-gray-800 dark:text-gray-100"
                              : "text-red-600 dark:text-red-400"
                          }
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}