import {
  MousePointer2,
  ChartCandlestick,
  TrendingUp,
  Crosshair,
  Pencil,
  Brush,
  Settings,
  SquareDashedMousePointer,
} from "lucide-react";

const tools = [
  {
    icon: MousePointer2,
    name: "Cursor",
  },
  {
    icon: ChartCandlestick,
    name: "Chart",
  },
  {
    icon: Pencil,
    name: "Trend Line",
  },
  {
    icon: TrendingUp,
    name: "Indicators",
  },
  {
    icon: SquareDashedMousePointer,
    name: "Fibonacci",
  },
  {
    icon: Brush,
    name: "Brush",
  },
  {
    icon: Crosshair,
    name: "Crosshair",
  },
];

function Sidebar() {
  return (
    <aside className="w-[60px] bg-[#131722] border-r border-[#2A2E39] flex flex-col justify-between">

      {/* Top Tools */}

      <div className="flex flex-col items-center gap-2 py-3">

        {tools.map((tool) => {

          const Icon = tool.icon;

          return (

            <button
              key={tool.name}
              title={tool.name}
              className="
                group
                h-11
                w-11
                rounded-xl
                flex
                items-center
                justify-center
                text-[#9CA3AF]
                hover:text-white
                hover:bg-[#1C2330]
                transition-all
                duration-200
              "
            >

              <Icon
                size={20}
                strokeWidth={2}
              />

            </button>

          );

        })}

      </div>

      {/* Bottom */}

      <div className="flex justify-center py-4">

        <button
          title="Settings"
          className="
            h-11
            w-11
            rounded-xl
            flex
            items-center
            justify-center
            text-[#9CA3AF]
            hover:text-white
            hover:bg-[#1C2330]
            transition-all
            duration-200
          "
        >

          <Settings
            size={20}
            strokeWidth={2}
          />

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;