import {
  LineSeries,
  HistogramSeries,
} from "lightweight-charts";

export class IndicatorManager {
  constructor(engine) {
    this.engine = engine;
    this.series = {};
    // ===== Change Start =====
    // Ye change isliye kiya kyuki MACD jaise multi-output indicators ko same pane reuse karna hota hai.
    // Agar pane index store nahi karenge to MACD line, signal aur histogram alag-alag panes bana denge.
    // Iska effect ye hoga ki ek pane key ke saare outputs same pane me render honge.
    this.paneIndexes = {};
    this.seriesData = {};
    // ===== Change End =====
  }
  
  
  // ===== Change Start =====
  // Ye change isliye kiya kyuki indicator options me custom pane value aa rahi hai.
  // Lightweight Charts ko pane naam option ke andar nahi dena chahiye, warna series options dirty ho jate hain.
  // Iska effect ye hoga ki main indicators pane 0 par rahenge aur oscillator indicators apne pane me ja payenge.
  getSeriesOptions(options = {}) {
    const seriesOptions = { ...options };

    delete seriesOptions.pane;

    return seriesOptions;
  }

  getPaneIndex(options = {}) {
    const pane = options.pane || "main";

    // ===== Change Start =====
    // Ye change isliye kiya kyuki backend registry EMA/SMA/VWAP/Supertrend ke liye pane "overlay" bhejti hai.
    // Overlay ka matlab same candle chart hota hai, separate indicator pane nahi.
    // Iska effect ye hoga ki price indicators candle ke saath pane 0 me hi render honge.
    if (pane === "main" || pane === "price" || pane === "overlay") {
      return 0;
    }
    // ===== Change End =====
    // ===== Change Start =====
    // Ye change isliye kiya kyuki same pane name ke multiple series ko same pane me rehna chahiye.
    // Example: MACD, SIGNAL aur HISTOGRAM teeno "macd" pane me hi render honge.
    // Iska effect ye hoga ki multi-output indicators TradingView jaisa grouped pane use karenge.
    if (!this.paneIndexes[pane]) {
      this.paneIndexes[pane] = this.engine.chart.panes().length;
    }

    return this.paneIndexes[pane];
    // ===== Change End =====
  }

  resizePanes() {
    const panes = this.engine.chart.panes();

    if (panes.length <= 1) return;

    const totalHeight = panes.reduce(
      (height, pane) => height + pane.getHeight(),
      0
    );

    if (!totalHeight) return;

    const mainPaneHeight = Math.round(totalHeight * 0.7);

    const indicatorPaneHeight = Math.floor(
      (totalHeight - mainPaneHeight) / (panes.length - 1)
    );

    panes[0].setHeight(mainPaneHeight);

    panes.slice(1).forEach((pane) => {
      pane.setHeight(indicatorPaneHeight);
    });
  }

  removeEmptyPanes() {
    const panes = this.engine.chart.panes();

    for (let index = panes.length - 1; index > 0; index -= 1) {
      if (panes[index].getSeries().length === 0) {
        this.engine.chart.removePane(index);
      }
    }
  }
  // ===== Change End =====

  addSingle(name, data, options = {}) {
    this.seriesData[name] = Array.isArray(data) ? [...data] : [];

    if (this.series[name]) {
      this.series[name].setData(data);
      return;
    }

    const line = this.engine.chart.addSeries(
      LineSeries,
      this.getSeriesOptions(options),
      this.getPaneIndex(options)
    );

    line.setData(data);

    this.series[name] = line;

    this.resizePanes();
  }

  addHistogram(name, data, options = {}) {
    this.seriesData[name] = Array.isArray(data) ? [...data] : [];

    if (this.series[name]) {
      this.series[name].setData(data);
      return;
    }

    const histogram = this.engine.chart.addSeries(
      HistogramSeries,
      this.getSeriesOptions(options),
      this.getPaneIndex(options)
    );

    histogram.setData(data);

    this.series[name] = histogram;

    this.resizePanes();
  }

  prependSingle(name, olderPoints) {
    if (!this.series[name] || !olderPoints || olderPoints.length === 0) return;
    const current = this.seriesData[name] || [];
    const existingTimes = new Set(current.map((p) => p.time));
    const newPoints = olderPoints.filter(
      (p) => !existingTimes.has(p.time) && p.value !== null && !isNaN(p.value)
    );
    if (newPoints.length === 0) return;

    const merged = [...newPoints, ...current].sort((a, b) => a.time - b.time);
    this.seriesData[name] = merged;
    this.series[name].setData(merged);
  }

  prependHistogram(name, olderPoints) {
    if (!this.series[name] || !olderPoints || olderPoints.length === 0) return;
    const current = this.seriesData[name] || [];
    const existingTimes = new Set(current.map((p) => p.time));
    const newPoints = olderPoints.filter(
      (p) => !existingTimes.has(p.time) && p.value !== null && !isNaN(p.value)
    );
    if (newPoints.length === 0) return;

    const merged = [...newPoints, ...current].sort((a, b) => a.time - b.time);
    this.seriesData[name] = merged;
    this.series[name].setData(merged);
  }

  updateSingle(name, point) {
    if (
      this.series[name] &&
      point &&
      point.time !== undefined &&
      point.value !== null &&
      !isNaN(point.value)
    ) {
      try {
        this.series[name].update(point);
        const current = this.seriesData[name] || [];
        if (current.length > 0 && current[current.length - 1].time === point.time) {
          current[current.length - 1] = point;
        } else if (current.length === 0 || point.time > current[current.length - 1].time) {
          current.push(point);
        }
      } catch (err) {
        console.warn(`Failed to update series ${name}:`, err);
      }
    }
  }

  updateHistogram(name, point) {
    if (
      this.series[name] &&
      point &&
      point.time !== undefined &&
      point.value !== null &&
      !isNaN(point.value)
    ) {
      try {
        this.series[name].update(point);
        const current = this.seriesData[name] || [];
        if (current.length > 0 && current[current.length - 1].time === point.time) {
          current[current.length - 1] = point;
        } else if (current.length === 0 || point.time > current[current.length - 1].time) {
          current.push(point);
        }
      } catch (err) {
        console.warn(`Failed to update histogram series ${name}:`, err);
      }
    }
  }

  hasSeries(name) {
    return Boolean(this.series[name]);
  }

  remove(name) {
    if (!this.series[name]) return;

    this.engine.chart.removeSeries(this.series[name]);

    delete this.series[name];
    delete this.seriesData[name];

    this.removeEmptyPanes();
    this.resizePanes();
  }

  removeAll() {
    Object.values(this.series).forEach((series) => {
      this.engine.chart.removeSeries(series);
    });

    this.series = {};
    this.seriesData = {};
    this.paneIndexes = {};

    this.removeEmptyPanes();
    this.resizePanes();
  }
}




