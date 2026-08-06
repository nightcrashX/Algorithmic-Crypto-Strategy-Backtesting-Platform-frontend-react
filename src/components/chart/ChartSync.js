export class ChartSync {
  constructor(priceEngine, volumeEngine) {
    this.priceEngine = priceEngine;
    this.volumeEngine = volumeEngine;

    this.sync();
  }

  sync() {
    const priceTimeScale = this.priceEngine.chart.timeScale();
    const volumeTimeScale = this.volumeEngine.chart.timeScale();

    let syncing = false;

    priceTimeScale.subscribeVisibleLogicalRangeChange((range) => {
      if (!range || syncing) return;

      syncing = true;
      volumeTimeScale.setVisibleLogicalRange(range);
      syncing = false;
    });

    volumeTimeScale.subscribeVisibleLogicalRangeChange((range) => {
      if (!range || syncing) return;

      syncing = true;
      priceTimeScale.setVisibleLogicalRange(range);
      syncing = false;
    });

    this.priceEngine.chart.subscribeCrosshairMove((param) => {
      if (!param.point) return;

      volumeTimeScale.setVisibleLogicalRange(
        priceTimeScale.getVisibleLogicalRange()
      );
    });

    this.volumeEngine.chart.subscribeCrosshairMove((param) => {
      if (!param.point) return;

      priceTimeScale.setVisibleLogicalRange(
        volumeTimeScale.getVisibleLogicalRange()
      );
    });
  }
}