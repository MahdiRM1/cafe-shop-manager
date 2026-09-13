import api from "./api";

export const getDailyReport = async (date) => {
  const { data } = await api.get("/api/reports/sales/daily", {
    params: date ? { date } : {},
  });
  return data;
};

export const getRangeSales = async (from, to) => {
  const { data } = await api.get("/api/reports/sales/range", {
    params: { from, to },
  });
  return data;
};

export const getTopItems = async (from, to) => {
  const { data } = await api.get("/api/reports/top-items", {
    params: { from, to },
  });
  return data;
};

export const getRangeProfit = async (from, to) => {
  const { data } = await api.get("/api/reports/profit", {
    params: { from, to },
  });
  return data;
};

export const getShifts = async ({ from, to }) => {
  const { data } = await api.get("/api/shifts", {
    params: { from, to },
  });
  return data;
};

export const getShiftReport = async (shiftId) => {
  const { data } = await api.get(`/api/shifts/${shiftId}/report`);
  return data;
};