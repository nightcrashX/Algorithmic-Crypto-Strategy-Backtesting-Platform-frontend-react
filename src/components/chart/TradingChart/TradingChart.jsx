import ChartHeader from "../ChartHeader";
import ChartCanvas from "../ChartCanvas";
import LiveChartCanvas from "../liveChartCanvas";
import CopyLiveChart from "../copyLivechart";

function TradingChart() {
  // // 1.  dynamic dropdown / input states
  // const [exchange, setExchange] = useState('binance');
  // const [symbol, setSymbol] = useState('BTCUSDT');
  // const [timeframe, setTimeframe] = useState('1m');

  // // 2. Consume the live stream data hook
  // const incomingCandle = useLiveCandleStream({ exchange, symbol, timeframe });

  // // 3. Pipe incoming data straight into  existing update system
  // useEffect(() => {
  //   if (incomingCandle) {
  //     // REPLACE THE LINE BELOW with  chart's actual update function
  //     // e.g., CandleSeriesRef.current.update(incomingCandle)
  //     console.log("Ready to update  chart with:", incomingCandle);
  //   }
  // }, [incomingCandle]);
  // console.log("hello")
  return (
    // UI CHANGE: Made chart the visual focus with stable responsive height.
    <div className=" flex min-h-[360px] flex-col rounded-lg xl:rounded-none xl:border-y-0 ">

      <ChartHeader/>
  
        <div className="flex-1 flex flex-col h-1 ">
          
          {/* <LiveChartCanvas/> */}
          <ChartCanvas/>
          {/* <CopyLiveChart /> */}
  
        </div>
  
    </div>
  );
}

export default TradingChart;
