import { useEffect } from "react";

import useChartStore from "../store/chartStore";

import {
  fetchExchanges,
  fetchSymbols,
} from "../services/chartService";

export function useMarkets() {

  const exchange = useChartStore(
    (s) => s.exchange
  );

  const setExchanges = useChartStore(
    (s) => s.setExchanges
  );

  const setSymbols = useChartStore(
    (s) => s.setSymbols
  );

  const setSymbol = useChartStore(
    (s) => s.setSymbol
  );

  useEffect(() => {

    async function load() {

      try {
        const exchanges = await fetchExchanges();
        setExchanges(Array.isArray(exchanges) ? exchanges : []);
      } catch (error) {
        console.error("Failed to load exchanges:", error);
      }

    }

    load();

  }, [setExchanges]);

  useEffect(() => {

    if (!exchange) return;

    async function loadSymbols() {

      try {
        const response = await fetchSymbols(exchange);
        const nextSymbols = Array.isArray(response) ? response : response?.symbols || [];

        setSymbols(nextSymbols);

        if (nextSymbols.length) {
          setSymbol(nextSymbols[0]);
        }
      } catch (error) {
        console.error("Failed to load symbols:", error);
      }

    }

    loadSymbols();

  }, [exchange, setSymbol, setSymbols]);

}
