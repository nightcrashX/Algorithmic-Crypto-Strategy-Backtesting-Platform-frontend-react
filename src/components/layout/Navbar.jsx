import {
  Search,
  Bell,
  Moon,
  ChevronDown,
  CandlestickChart,
  ChartNoAxesCombined,
} from "lucide-react";

const timeframes = ["1m", "5m", "15m", "1H", "4H", "1D"];

function Navbar() {
  return (
    <header className="h-14 bg-[#131722] border-b border-[#2A2E39] px-5 flex items-center justify-between">

      {/* ---------- Left ---------- */}

      <div className="flex items-center gap-8">

        {/* Logo */}

        <div className="flex items-center gap-5 cursor-pointer">

          <CandlestickChart
            size={24}
            className="text-blue-500"
          />

          <h1 className="text-white text-lg font-semibold tracking-wide gap-">
            AlgoTrade
          </h1>
          

        </div>

        <h2 className="
          flex
          items-center
          gap-4
          rounded-lg
          px-3
          py-2
          text-sm
          text-white
          hover:border-blue-500
          transition
          font-semibold">About</h2>

        <h2 className="
          flex
          items-center
          gap-4
          rounded-lg
          px-3
          py-2
          text-sm
          text-white
          hover:border-blue-500
          transition
          font-semibold">Backtesting</h2>

        
        {/* Exchange */}

        {/* <button
          className="
          flex
          items-center
          gap-2
          rounded-lg
          border
          border-[#2A2E39]
          bg-[#1C2330]
          px-3
          py-2
          text-sm
          text-white
          hover:border-blue-500
          transition"
        >

          Binance

          <ChevronDown size={16} />

        </button>

        {/* Symbol */}

        {/* <button
          className="
          flex
          items-center
          gap-2
          rounded-lg
          border
          border-[#2A2E39]
          bg-[#1C2330]
          px-3
          py-2
          text-sm
          font-semibold
          text-green-400
          hover:border-blue-500
          transition"
        >

          BTC / USDT

          <ChevronDown size={16} />

        </button>  */}

      </div>

      {/* ---------- Center ---------- */}

      {/* <div className="flex items-center gap-1">

        {timeframes.map((item) => (

          <button
            key={item}
            className={`
            rounded-md
            px-3
            py-1.5
            text-sm
            transition-all

            ${
              item === "15m"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-[#1C2330] hover:text-white"
            }
          `}
          >

            {item}

          </button>

        ))}

      </div> */}

      {/* ---------- Right ---------- */}

      <div className="flex items-center gap-3">

        {/* Indicators */}

        {/* <button
          className="
          flex
          items-center
          gap-2
          rounded-lg
          bg-[#1C2330]
          px-3
          py-2
          text-sm
          text-gray-300
          hover:text-white"
        >

          <ChartNoAxesCombined size={17} />

          Indicators

        </button> */}

        {/* Search */}

        <button
          className="
          rounded-lg
          p-2
          text-gray-400
          hover:bg-[#1C2330]
          hover:text-white"
        >

          <Search size={18} />

        </button>

        {/* Notification */}

        <button
          className="
          rounded-lg
          p-2
          text-gray-400
          hover:bg-[#1C2330]
          hover:text-white"
        >

          <Bell size={18} />

        </button>

        {/* Theme */}

        <button
          className="
          rounded-lg
          p-2
          text-gray-400
          hover:bg-[#1C2330]
          hover:text-white"
        >

          <Moon size={18} />

        </button>

        {/* Profile */}

        <button
          className="
          h-10
          w-10
          rounded-full
          bg-blue-600
          text-white
          flex
          items-center
          justify-center
          font-semibold"
        >

          P

        </button>

      </div>

    </header>
  );
}

export default Navbar;

// import {
//   FiSearch,
//   FiMoon,
//   FiUser,
//   FiChevronDown,
// } from "react-icons/fi";

// import { RiExchangeDollarLine } from "react-icons/ri";
// import { BsGraphUpArrow } from "react-icons/bs";

// const timeframes = ["1m", "5m", "15m", "1H", "4H", "1D"];

// function Navbar() {
//   return (
//     <header className="h-14 border-b border-[#2a2e39] bg-[#131722] px-5 flex items-center justify-between">

//       {/* Left */}
//       <div className="flex items-center gap-6">

//         <div className="flex items-center gap-2">

//           <BsGraphUpArrow className="text-blue-500 text-xl"/>

//           <h1 className="text-white text-lg font-bold tracking-wide">
//             AlgoTrade
//           </h1>

//         </div>

//         {/* Exchange */}

//         <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1c2330] hover:bg-[#252c3a] transition">

//           <RiExchangeDollarLine className="text-gray-400"/>

//           <span className="text-sm text-white">
//             Binance
//           </span>

//           <FiChevronDown className="text-gray-400"/>

//         </button>

//         {/* Symbol */}

//         <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1c2330] hover:bg-[#252c3a] transition">

//           <span className="text-sm font-semibold text-green-400">
//             BTC/USDT
//           </span>

//           <FiChevronDown className="text-gray-400"/>

//         </button>

//       </div>

//       {/* Center */}

//       <div className="flex items-center gap-2">

//         {timeframes.map((item) => (

//           <button
//             key={item}
//             className={`px-3 py-1 rounded-md text-sm transition
//             ${
//               item === "15m"
//                 ? "bg-blue-600 text-white"
//                 : "text-gray-400 hover:bg-[#1c2330] hover:text-white"
//             }`}
//           >
//             {item}
//           </button>

//         ))}

//       </div>

//       {/* Right */}

//       <div className="flex items-center gap-3">

//         <button className="px-3 py-1.5 rounded-lg bg-[#1c2330] text-gray-300 hover:bg-[#252c3a]">

//           Indicators

//         </button>

//         <button className="p-2 rounded-lg hover:bg-[#1c2330]">

//           <FiSearch className="text-gray-300"/>

//         </button>

//         <button className="p-2 rounded-lg hover:bg-[#1c2330]">

//           <FiMoon className="text-gray-300"/>

//         </button>

//         <button className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center">

//           <FiUser className="text-white"/>

//         </button>

//       </div>

//     </header>
//   );
// }

// export default Navbar;