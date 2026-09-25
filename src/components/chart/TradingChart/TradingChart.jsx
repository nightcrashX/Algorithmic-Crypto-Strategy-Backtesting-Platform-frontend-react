// import ChartHeader from "../ChartHeader";
// import ChartCanvas from "../ChartCanvas";
// import { useFullscreen } from "../../../hooks/useFullScreen";

// function TradingChart() {
//   const { elementRef, isFullscreen, toggleFullscreen, error } = useFullscreen();
//   return (
//     <div ref={elementRef} className="flex h-full min-h-[360px] flex-1 flex-col overflow-hidden bg-transparent"
//       style={{
//           width: '100%',
//           minHeight: '400px', // Give it a height
//           background: '#0a0f16'
//         }}>
//       <ChartHeader />
//       <div className="relative min-h-0 flex-1 flex flex-col">
//         <ChartCanvas />
//       </div>
//     </div>
//   );
// }

// export default TradingChart;

import ChartHeader from "../ChartHeader";
import ChartCanvas from "../ChartCanvas";
import { useFullscreen } from "../../../hooks/useFullScreen";
import { Expand, Shrink } from 'lucide-react'; // Import icons

function TradingChart() {
  const { elementRef, isFullscreen, toggleFullscreen, error } = useFullscreen();

  return (
    <div 
      ref={elementRef} 
      className="flex h-full min-h-[360px] flex-1 flex-col overflow-hidden bg-transparent relative"
      style={{
        width: '100%',
        minHeight: '400px',
        background: '#0a0f16',
        // Add these for better fullscreen display
        ...(isFullscreen && {
          width: '100vw',
          height: '100vh',
          minHeight: '100vh',
          padding: '20px',
          overflow: 'auto'
        })
      }}
    >
      <ChartHeader />
      <div className="relative min-h-0 flex-1 flex flex-col">
        <ChartCanvas />
      </div>

      {/* Add fullscreen button inside the component */}
      <button
        type="button"
        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        className="absolute top-4 right-4 z-50 grid h-8 w-8 place-items-center rounded-lg border border-white/[0.08] bg-[#0c121e] text-slate-400 shadow-sm transition hover:border-cyan-400/50 hover:text-cyan-300"
        onClick={toggleFullscreen}
      >
        {isFullscreen ? <Shrink size={15} /> : <Expand size={15} />}
      </button>

      {/* Show error if any */}
      {error && (
        <div className="absolute bottom-4 left-4 text-red-500 text-sm bg-red-500/10 px-3 py-1 rounded">
          Error: {error}
        </div>
      )}
    </div>
  );
}

export default TradingChart;
