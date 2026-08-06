// import { useEffect, useRef } from "react";

// import { ChartEngine } from "../ChartEngine";

// import { useChart } from "../../../hooks/useChart";

// import useChartStore from "../../../store/chartStore";

// function VolumeChart() {

//     const ref = useRef(null);

//     const engine = useRef(null);

//     const exchange = useChartStore(s=>s.exchange);

//     const symbol = useChartStore(s=>s.symbol);

//     const timeframe = useChartStore(s=>s.timeframe);

//     const {data}=useChart(exchange,symbol,timeframe);

//     useEffect(()=>{

//         engine.current=new ChartEngine(

//             ref.current,

//             {

//                 type:"volume"

//             }

//         );

//         // engineRef.current = engine.current;
//         return ()=>engine.current.destroy();

//     },[]);

//     useEffect(()=>{

//         if(!engine.current)return;

//         const volume=data.map(candle=>({

//             time:candle.time,

//             value:candle.volume,

//             color:
//                 candle.close>=candle.open
//                 ? "#26A69A"
//                 : "#EF5350"

//         }));

//         engine.current.setData(volume);

//         // engine.current.fit();

//     },[data]);

//     return(

//         <div
//             ref={ref}
//             className="h-full w-full"
//         />

//     );

// }

// export default VolumeChart;