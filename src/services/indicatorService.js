import {
  getIndicatorData,
  getIndicatorRegistry,
} from "../api/indicatorApi";

export const fetchIndicatorRegistry = async () => {
  const res = await getIndicatorRegistry();
  return res.data;
};

export const fetchIndicator = async (body) => {
  const res = await getIndicatorData(body);
  return res.data;
};