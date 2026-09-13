import { useEffect, useState } from "react";
import FormField from "../ui/FormField";
import DateTimeField from "../ui/DateTimeField";
import TextAreaField from "../ui/TextAreaField";

export default function TableDetailModal({
  open,
  onClose,
  table,
  reservation,
  onStatusChange,
  onReserve,
  onCancelReservation,
}) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [note, setNote] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getDefaultReservationTime = () => {
    const now = new Date();
    now.setHours(20, 0, 0, 0);

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    if (!open) return;

    setCustomerName("");
    setCustomerPhone("");
    setReservationTime(getDefaultReservationTime());
    setNote("");
    setError("");
  }, [open, table]);

  if (!open || !table) return null;

  const statusLabels = {
    EMPTY: "خالی",
    OCCUPIED: "اشغال",
    RESERVED: "رزرو شده",
  };

  const handleStatusChange = async (newStatus) => {
    setError("");
    setLoading(true);

    try {
      await onStatusChange(newStatus);
      onClose();
    } catch (err) {
      console.log(err);
      setError("خطا در تغییر وضعیت میز");
    } finally {
      setLoading(false);
    }
  };

  const handleReserveSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!customerName.trim() || !reservationTime) {
      setError("نام مشتری و زمان رزرو الزامی هستن");
      return;
    }

    setLoading(true);

    try {
      await onReserve({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim() || null,
        reservationTime,
        note: note.trim() || null,
      });

      onClose();
    } catch (err) {
      console.log(err);
      setError("خطا در ثبت رزرو");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async () => {
    if (!reservation) return;

    if (!window.confirm("رزرو لغو بشه؟")) return;

    setError("");
    setLoading(true);

    try {
      await onCancelReservation(reservation.id);
      onClose();
    } catch (err) {
      console.log(err);
      setError("خطا در لغو رزرو");
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
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full
          max-w-2xl
          max-h-[90vh]
          overflow-y-auto

          bg-white dark:bg-gray-900
          rounded-2xl
          shadow-xl

          p-8 md:p-10
          space-y-6

          transition-colors duration-300
        "
      >
        {/* Header */}
        <div className="text-center">
          <h2
            className="
              text-2xl
              font-bold
              text-gray-800 dark:text-gray-100
            "
          >
            میز {table.tableNumber}
          </h2>

          <p
            className="
              text-sm
              text-gray-500 dark:text-gray-400
              mt-2
            "
          >
            وضعیت فعلی:{" "}
            <span className="font-medium">
              {statusLabels[table.status]}
            </span>
          </p>

          <p
            className="
              text-sm
              text-gray-500 dark:text-gray-400
              mt-1
            "
          >
            ظرفیت میز: {table.capacity} نفر
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="
              bg-red-50 dark:bg-red-900/20
              border border-red-200 dark:border-red-800
              text-red-600 dark:text-red-400
              text-sm
              rounded-lg
              px-4 py-3
              text-center
            "
          >
            {error}
          </div>
        )}

        {/* Table Status */}
        {table.status !== "EMPTY" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleStatusChange("EMPTY")}
              disabled={loading}
              className="
                bg-blue-600
                text-white
                rounded-lg
                py-2.5
                font-medium
                hover:bg-blue-800
                transition-all duration-300
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              خالی شدن میز
            </button>
          </div>
        )}

        {/* Reservation */}
        {reservation ? (
          <div
            className="
              bg-gray-50 dark:bg-gray-800
              rounded-xl
              p-5
              space-y-4
            "
          >
            <h3
              className="
                text-lg
                font-bold
                text-gray-800 dark:text-gray-100
              "
            >
              اطلاعات رزرو
            </h3>

            <div className="space-y-3">
              <div className="flex gap-2">
                <p className="text-base text-gray-600 dark:text-gray-300">
                  <span className="font-medium text-gray-800 dark:text-gray-100">
                    نام مشتری:
                  </span>{" "}
                  {reservation.customerName}
                </p>

                <p className="text-base text-gray-600 dark:text-gray-300">
                  <span className="font-medium text-gray-800 dark:text-gray-100">
                    تلفن مشتری:
                  </span>{" "}
                  {reservation.customerPhone || "ثبت نشده"}
                </p>
              </div>

              <p className="text-base text-gray-600 dark:text-gray-300">
                <span className="font-medium text-gray-800 dark:text-gray-100">
                  زمان رزرو:
                </span>{" "}
                {reservation.reservationTime}
              </p>

              {reservation.note && (
                <p className="text-base text-gray-600 dark:text-gray-300">
                  <span className="font-medium text-gray-800 dark:text-gray-100">
                    یادداشت:
                  </span>{" "}
                  {reservation.note}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleCancelReservation}
              disabled={loading}
              className="
                text-sm
                text-red-500
                hover:text-red-700
                dark:hover:text-red-400
                font-medium
                transition-colors
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {loading ? "در حال لغو..." : "لغو رزرو"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3
                className="
                  text-lg
                  font-bold
                  text-gray-800 dark:text-gray-100
                "
              >
                ثبت رزرو جدید
              </h3>

              <p
                className="
                  text-sm
                  text-gray-500 dark:text-gray-400
                  mt-1
                "
              >
                اطلاعات مشتری و زمان رزرو را وارد کنید.
              </p>
            </div>

            <form
              onSubmit={handleReserveSubmit}
              className="space-y-5"
            >
              <FormField
                label="نام مشتری"
                type="text"
                value={customerName}
                onChange={setCustomerName}
                required
              />

              <FormField
                label="شماره تماس"
                type="text"
                value={customerPhone}
                onChange={setCustomerPhone}
                required
              />

              <DateTimeField
                label="زمان رزرو"
                value={reservationTime}
                onChange={setReservationTime}
                required
              />

              <TextAreaField
                label="یادداشت"
                type="text"
                value={note}
                onChange={setNote}
              />

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  bg-blue-600
                  text-white
                  rounded-lg
                  py-3
                  font-medium
                  hover:bg-blue-800
                  transition-all duration-300
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                {loading ? "در حال ثبت..." : "ثبت رزرو"}
              </button>
            </form>
          </div>
        )}

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="
            w-full
            border
            border-gray-300 dark:border-gray-600
            text-gray-600 dark:text-gray-300
            rounded-lg
            py-2.5
            font-medium
            hover:bg-gray-50 dark:hover:bg-gray-800
            transition-all duration-300
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          بستن
        </button>
      </div>
    </div>
  );
}
