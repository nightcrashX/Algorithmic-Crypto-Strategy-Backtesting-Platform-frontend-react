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
    if (this.series[name]) {
      this.series[name].setData(data);
      return;
    }

    // ===== Change Start =====
    // Ye change isliye kiya kyuki EMA/SMA/VWAP main pane me aur RSI/MACD separate pane me jana chahiye.
    // Lightweight Charts v5 me addSeries ka third argument paneIndex hota hai, isi se real pane create hota hai.
    // Agar ye nahi karenge to sab indicators candles ke upar same scale me aa jayenge.
    const line = this.engine.chart.addSeries(
      LineSeries,
      this.getSeriesOptions(options),
      this.getPaneIndex(options)
    );
    // ===== Change End =====

    line.setData(data);

    this.series[name] = line;

    // ===== Change Start =====
    // Ye change isliye kiya kyuki indicator add hone ke baad panes ko TradingView jaisa resize karna hai.
    // Iska effect ye hoga ki dynamic panes add/remove hone par chart layout automatically balance rahega.
    this.resizePanes();
    // ===== Change End =====
  }

  addHistogram(name, data, options = {}) {
    if (this.series[name]) {
      this.series[name].setData(data);
      return;
    }

    // ===== Change Start =====
    // Ye change isliye kiya kyuki histogram indicators bhi pane-aware hone chahiye.
    // MACD histogram ya ADX type data future me alag pane me clean render ho payega.
    const histogram = this.engine.chart.addSeries(
      HistogramSeries,
      this.getSeriesOptions(options),
      this.getPaneIndex(options)
    );
    // ===== Change End =====

    histogram.setData(data);

    this.series[name] = histogram;

    // ===== Change Start =====
    // Ye change isliye kiya kyuki histogram pane add hone ke baad remaining panes ko resize karna zaroori hai.
    // Iska effect ye hoga ki naye pane ke baad main chart aur indicator panes balanced height me rahenge.
    this.resizePanes();
    // ===== Change End =====
  }

  remove(name) {
    if (!this.series[name]) return;

    this.engine.chart.removeSeries(this.series[name]);

    delete this.series[name];

    // ===== Change Start =====
    // Ye change isliye kiya kyuki indicator remove hone ke baad empty pane ko hataana hai.
    // Agar ye nahi karenge to RSI/MACD remove ke baad blank pane screen par reh sakta hai.
    this.removeEmptyPanes();
    this.resizePanes();
    // ===== Change End =====
  }

  removeAll() {
    Object.values(this.series).forEach((series) => {
      this.engine.chart.removeSeries(series);
    });

    this.series = {};
    // ===== Change Start =====
    // Ye change isliye kiya kyuki MACD jaise multi-output indicators ko same pane reuse karna hota hai.
    // Agar pane index store nahi karenge to MACD line, signal aur histogram alag-alag panes bana denge.
    // Iska effect ye hoga ki ek pane key ke saare outputs same pane me render honge.
    this.paneIndexes = {};
    // ===== Change End =====

    // ===== Change Start =====
    // Ye change isliye kiya kyuki reload ke time purane indicator panes clean hone chahiye.
    // Iska effect ye hoga ki indicator list change hone par stale panes ya duplicate panes nahi rahenge.
    this.removeEmptyPanes();
    this.resizePanes();
    // ===== Change End =====
  }
}




