import { useEffect, useState } from "react";
import {
  fetchIndicatorRegistry,
  fetchIndicator,
} from "../services/indicatorService";

export function useIndicatorRegistry() {
  const [registry, setRegistry] = useState({});

  useEffect(() => {
    console.log("usereddfec");
    async function load() {
      const data = await fetchIndicatorRegistry();
      setRegistry(data);
    }

    load();
  }, []);

  return registry;
}

export async function loadIndicator(
  exchange,
  symbol,
  timeframe,
  indicator
) {
  //console.log("heelo");
  return await fetchIndicator({
    exchange,
    symbol,
    timeframe,
    indicators: [indicator],
  });
}