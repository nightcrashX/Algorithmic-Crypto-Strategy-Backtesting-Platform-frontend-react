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

      const exchanges =
        await fetchExchanges();
    
        console.log("exchanges in usemarket", exchanges)
      setExchanges(exchanges);

    }

    load();

  }, []);

  useEffect(() => {

    async function loadSymbols() {

    //   const symbols =
    //     await fetchSymbols(exchange);

    //   setSymbols(symbols);
        const symbols = await fetchSymbols(exchange);
        
        console.log("symbols",symbols)
        setSymbols(symbols.symbols);
        setSymbol(symbols.symbols[0]);

      if (symbols.length)
        setSymbol(symbols[0]);

    }

    loadSymbols();

  }, [exchange]);

}