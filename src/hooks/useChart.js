import { useEffect, useState } from "react";

import { fetchOHLCV } from "../services/chartService";

export function useChart(
  exchange,
  symbol,
  timeframe
) {

  const [data, setData] = useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    let mounted = true;

    async function loadChart() {

      try {

        setLoading(true);

        const candles =
          await fetchOHLCV(
            exchange,
            symbol,
            timeframe
          );

        if (mounted) {

          setData(candles);

        }

      }

      catch (err) {

        console.log(err);

      }

      finally {

        if (mounted) {

          setLoading(false);

        }

      }

    }

    loadChart();

    return () => {

      mounted = false;

    };

  }, [exchange, symbol, timeframe]);

  return {

    data,

    loading,

  };

}