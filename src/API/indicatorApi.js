import api from "./client";

export const getIndicatorRegistry = () =>
  api.get("/indicator/registry");

export const getIndicatorData = (body) =>
  api.post("/indicator/", body);