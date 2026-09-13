import { useState, useEffect } from "react";
import { createTable, getTables, updateTableStatus } from "../services/tableService";
import { getReservations, createReservation, cancelReservation } from "../services/reservationService";
import TableModal from "../components/tables/TableModal";
import TableDetailModal from "../components/tables/TableDetailModal";
import { useAuth } from "../context/AuthContext";

export default function TablesPage() {
  const { user } = useAuth();

  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [addTableOpen, setAddTableOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const [selectedTableId, setSelectedTableId] = useState('');

  const selectedTable = tables.find(
    (table) => table.id === selectedTableId
  );

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [tablesData, reservationsData] = await Promise.all([
        getTables(),
        getReservations(),
      ]);
      setTables(tablesData);
      setReservations(reservationsData);
    } catch (err) {
      console.log(err.response ?? err);
      setError(err.response?.data.message || "خطا در دریافت اطلاعات میزها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getReservationForTable = (tableId) =>
    reservations.find((r) => r.tableId === tableId  && r.status !== "CANCELED");

  const handleOpenAddTable = () => {
    setAddTableOpen(true);
  };

  const handleAddTable = async (payload) => {
    setLoading(true);
    setError('');

    try {
        await createTable(payload);
        await loadData();
    } catch (err) {
      console.log(err.response ?? err);
      setError(err.response?.data.message || "خطا در ایجاد میز جدید");
    } finally {
        setLoading(false);
    }
  }

  const handleTableClick = (table) => {
    setSelectedTableId(table.id);
    setDetailOpen(true);
  }


  const statusStyles = {
    EMPTY: "bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400",
    OCCUPIED: "bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-700 dark:text-red-400",
    RESERVED: "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-400",
  };

  const statusLabels = {
    EMPTY: "خالی",
    OCCUPIED: "اشغال",
    RESERVED: "رزرو شده",
  };

  if (loading) {
    return (
      <p className="text-center text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/60 py-10">
        در حال بارگذاری...
      </p>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-100 dark:bg-gray-950 p-6 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">میزها و رزروها</h1>

          {user.role === 'MANAGER' && (
              <button
              onClick={handleOpenAddTable}
              className="bg-blue-600 text-white rounded-lg px-5 py-2.5 font-medium hover:bg-blue-800 transition-all duration-300"
            >
            + افزودن میز جدید
            </button>
          )}
        </div>
        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {tables.map((table) => {
            const reservation = getReservationForTable(table.id);
            return (
              <button
                key={table.id}
                onClick={() => handleTableClick(table)}
                className={`border-2 rounded-xl p-4 text-center hover:-translate-y-2 transition-all duration-5q00 hover:shadow-md ${
                  statusStyles[table.status] || ""
                } animate-fade-in-up`}
              >
                <p className="font-bold text-lg">میز {table.tableNumber}</p>
                <p className="text-xs mt-1">{statusLabels[table.status]}</p>
                <p className="text-xs mt-1">ظرفیت: {table.capacity}</p>
                {reservation && (
                  <p className="text-[10px] mt-2 opacity-80">
                    رزرو: {reservation.customerName}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <TableModal
        open={addTableOpen}
        onClose={() => setAddTableOpen(false)}
        onSubmit={handleAddTable}
      />

      <TableDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        table={selectedTable}
        reservation={selectedTableId ? getReservationForTable(selectedTableId) : null}
        onStatusChange={async (newStatus) => {
          await updateTableStatus(selectedTableId, { status: newStatus });
          await loadData();
        }}
        onReserve={async (payload) => {
          await createReservation(selectedTableId, payload);
          await loadData();
        }}
        onCancelReservation={async (reservationId) => {
          await cancelReservation(reservationId);
          await loadData();
        }}
      />
    </div>
  );
}