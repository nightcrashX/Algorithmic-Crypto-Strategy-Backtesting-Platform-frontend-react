
import { 
  createChart, 
  CandlestickSeries, 
  HistogramSeries, 
  LineSeries, 
  CrosshairMode 
} from "lightweight-charts";
import { IndicatorManager } from "./IndicatorManager";

export class ChartEngine {
  constructor(container) {
    this.container = container; // DOM element reference
    this.indicatorManager = new IndicatorManager(this);

    // Data & Trendline State Variables
    this.klines = [];
    this.xspan = 0;
    this.startPoint = null;
    this.isUpdatingLine = false;
    this.isHovered = false;
    this.isDragging = false;
    this.dragStartPoint = null;
    this.dragStartLineData = null;
    this.lastCrosshairPosition = null;
    this.selectedPoint = null; // null | 0 | 1
    this.hoverThreshold = 0.01;

    // 1. Initialize Chart
    this.chart = createChart(container, {
      addDefaultPane: true,
      autoSize: true,
      handleScale: true,
      handleScroll: true,
      localization: {
        locale: "en-US",
      },
      layout: {
        background: { color: "#080c12" },
        textColor: "#94a3b8",
      },
      grid: {
        vertLines: { color: "#111927" },
        horzLines: { color: "#111927" },
      },
      rightPriceScale: {
        borderColor: "#202938",
        scaleMargins: { 
          top: 0.05,
          bottom: 0.25,
        }
      },
      timeScale: {
        borderColor: "#202938",
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 8,
        barSpacing: 8,
        minBarSpacing: 6,
        fixLeftEdge: false,
        fixRightEdge: false,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      }
    });

    // 2. Add Candle & Volume Series
    this.candleSeries = this.chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderUpColor: "#22c55e",
      borderDownColor: "#ef4444",
      wickUpColor: "#86efac",
      wickDownColor: "#fca5a5",
    });

    this.volumeSeries = this.chart.addSeries(
      HistogramSeries,
      {
        priceFormat: {
          type: "volume"
        },
        priceScaleId: "",
        priceLineVisible: false,
        lastValueVisible: false,
      }
    );

    this.volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.78,
        bottom: 0,
      },
    });

    // 3. Add Line Series for Trendline Drawing (Lightweight Charts v5 Syntax)
    this.lineSeries = this.chart.addSeries(LineSeries, {
      color: "dodgerblue",
      lineWidth: 2,
    });

    // 4. Initialize Event Listeners
    this.initTrendlineEvents();
  }

  // Set Candlestick Data & calculate time gap (xspan)
  setData(data) {
    this.klines = data;
    if (data && data.length > 1) {
      // Time difference between consecutive bars
      this.xspan = data[1].time - data[0].time;
    }
    this.candleSeries.setData(data);
  }

  setVolume(data) {
    this.volumeSeries.setData(data);
  }

  updateCandle(candle) {
    this.candleSeries.update(candle);
  }

  updateVolume(volume) {
    this.volumeSeries.update(volume)
  }
  // ==========================================
  // TRENDLINE INTERACTION 
  // ==========================================

  initTrendlineEvents() {
    // Bind event functions to keep correct 'this' context
    this.boundChartClick = this.handleChartClick.bind(this);
    this.boundCrosshairMove = this.handleCrosshairMove.bind(this);
    this.boundMouseDown = this.handleMouseDown.bind(this);
    this.boundMouseUp = this.handleMouseUp.bind(this);

    // Chart Events
    this.chart.subscribeClick(this.boundChartClick);
    this.chart.subscribeCrosshairMove(this.boundCrosshairMove);

    // DOM Events
    if (this.container) {
      this.container.addEventListener("mousedown", this.boundMouseDown);
      this.container.addEventListener("mouseup", this.boundMouseUp);
    }
  }

  handleChartClick(param) {
    if (this.isUpdatingLine || this.isDragging || !this.klines.length || !param.point) return;

    const xTs = param.time
      ? param.time
      : this.klines[0].time + param.logical * this.xspan;
    const yPrice = this.candleSeries.coordinateToPrice(param.point.y);

    if (this.isHovered) {
      this.startDrag(xTs, yPrice);
    } else {
      this.handleLineDrawing(xTs, yPrice);
    }
  }

  handleCrosshairMove(param) {
    if (this.isUpdatingLine || !param.point || !this.klines.length) return;

    const xTs = param.time
      ? param.time
      : this.klines[0].time + param.logical * this.xspan;
    const yPrice = this.candleSeries.coordinateToPrice(param.point.y);

    this.lastCrosshairPosition = { x: xTs, y: yPrice };

    if (this.startPoint) {
      this.updateLine(xTs, yPrice);
    } else {
      this.handleHoverEffect(xTs, yPrice);
    }

    if (this.isDragging) {
      const deltaX = xTs - this.dragStartPoint.x;
      const deltaY = yPrice - this.dragStartPoint.y;

      const newLineData = this.dragStartLineData.map((point, i) =>
        this.selectedPoint !== null
          ? i === this.selectedPoint
            ? { time: point.time + deltaX, value: point.value + deltaY }
            : point
          : { time: point.time + deltaX, value: point.value + deltaY }
      );

      this.dragLine(newLineData);
    }
  }

  handleMouseDown() {
    if (!this.lastCrosshairPosition) return;
    if (this.isHovered) {
      this.startDrag(
        this.lastCrosshairPosition.x,
        this.lastCrosshairPosition.y
      );
    }
  }

  handleMouseUp() {
    this.endDrag();
  }

  handleLineDrawing(xTs, yPrice) {
    if (!this.startPoint) {
      this.startPoint = { time: xTs, price: yPrice };
    } else {
      this.lineSeries.setData([
        { time: this.startPoint.time, value: this.startPoint.price },
        { time: xTs, value: yPrice },
      ]);
      this.startPoint = null;
      this.selectedPoint = null;
    }
  }

  handleHoverEffect(xTs, yPrice) {
    const lineData = this.lineSeries.data();
    if (!lineData.length) return;

    const hoverStatus = this.isLineHovered(
      xTs,
      yPrice,
      lineData[0],
      lineData[1]
    );

    if (hoverStatus && !this.isHovered) {
      this.startHover();
    }

    if (!hoverStatus && this.isHovered && !this.isDragging) {
      this.endHover();
    }
  }

  startHover() {
    this.isHovered = true;
    this.lineSeries.applyOptions({ color: "orange" });
    if (this.container) this.container.style.cursor = "pointer";
    this.chart.applyOptions({ handleScroll: false, handleScale: false });
  }

  endHover() {
    this.isHovered = false;
    this.lineSeries.applyOptions({ color: "dodgerblue" });
    if (this.container) this.container.style.cursor = "default";
    this.chart.applyOptions({ handleScroll: true, handleScale: true });
  }

  startDrag(xTs, yPrice) {
    this.isDragging = true;
    this.dragStartPoint = { x: xTs, y: yPrice };
    this.dragStartLineData = [...this.lineSeries.data()];
  }

  endDrag() {
    this.isDragging = false;
    this.dragStartPoint = null;
    this.dragStartLineData = null;
    this.selectedPoint = null;
  }

  updateLine(xTs, yPrice) {
    this.isUpdatingLine = true;
    this.lineSeries.setData([
      { time: this.startPoint.time, value: this.startPoint.price },
      { time: xTs, value: yPrice },
    ]);
    this.selectedPoint = null;
    this.isUpdatingLine = false;
  }

  dragLine(newCoords) {
    this.isUpdatingLine = true;
    this.lineSeries.setData(newCoords);
    this.isUpdatingLine = false;
  }

  isLineHovered(xTs, yPrice, point1, point2) {
    if (this.isDragging) return true;

    // Check Start Point hover
    const isPoint1 =
      xTs === point1.time &&
      (Math.abs(yPrice - point1.value) * 100) / yPrice < this.hoverThreshold;
    if (isPoint1) {
      this.selectedPoint = 0;
      return true;
    }

    // Check End Point hover
    const isPoint2 =
      xTs === point2.time &&
      (Math.abs(yPrice - point2.value) * 100) / yPrice < this.hoverThreshold;
    if (isPoint2) {
      this.selectedPoint = 1;
      return true;
    }

    // Check Line Body hover
    this.selectedPoint = null;
    const m = (point2.value - point1.value) / (point2.time - point1.time);
    const c = point1.value - m * point1.time;
    const estimatedY = m * xTs + c;
    return (Math.abs(yPrice - estimatedY) * 100) / yPrice < this.hoverThreshold;
  }

  fit() {
    this.chart.timeScale().fitContent();
  }

  // Cleanup chart & event listeners when destroyed
  destroy() {
    if (this.chart) {
      this.chart.unsubscribeClick(this.boundChartClick);
      this.chart.unsubscribeCrosshairMove(this.boundCrosshairMove);
    }
    if (this.container) {
      this.container.removeEventListener("mousedown", this.boundMouseDown);
      this.container.removeEventListener("mouseup", this.boundMouseUp);
    }
    this.chart.remove();
  }
}
