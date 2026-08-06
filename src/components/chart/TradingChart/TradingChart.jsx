import { useEffect, useRef } from "react";
import { ChartSync } from "../ChartSync";
import ChartHeader from "../ChartHeader";
import PriceChart from "./PriceChart";
// import VolumeChart from "./VolumeChart";
import ChartCanvas from "../ChartCanvas";

function TradingChart() {
  
  return (
    <div className="flex flex-col h-full">

      <ChartHeader/>
  
        <div className="flex-1 flex flex-col">
  
          <div className="">
  
              <PriceChart />
  
          </div>
  
          {/* <div className="border-t border-[#2A2E39]">
  
              <ChartCanvas />
  
          </div> */}
  
        </div>
  
    </div>
    // <div className="flex flex-col h-full bg-[#0D1117]">

    //   <ChartHeader />

    //   {/* Price Chart */}
    //   <div className="h-[78%]">
    //     <PriceChart />
    //   </div>

    //   {/* Volume */}
    //   <div className="h-[22%] border-t border-[#2A2E39]">
    //     {/* <VolumeChart /> */}
    //   </div>

    // </div>
  );
}

export default TradingChart;

// import ChartHeader from "../ChartHeader";
// import ChartCanvas from "../ChartCanvas";

// function TradingChart() {
//   return (
//     <div className="flex flex-col h-full">

//       <ChartHeader />

//       <ChartCanvas />

//     </div>
//   );
// }

// export default TradingChart;