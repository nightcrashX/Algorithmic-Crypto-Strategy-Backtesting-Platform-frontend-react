import api from "./client";

export const orders = (body) => {
  return api.post("/trade/trade", body);
};

export const getDemoAccount = () => {
  return api.get("/trade/account");
};

export const updatebalance = (body) => {
  return api.post("/trade/account/updatebalance", body);
};

export const getTradeHistory = ({
  page = 1,
  limit = 10,
  fromDate = "",
  toDate = "",
}) => {
  return api.get("/trade/history", {
    params: {
      page,
      limit,
      from_date: fromDate || undefined,
      to_date: toDate || undefined,
    },
  });
};