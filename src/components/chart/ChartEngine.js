//ChartEngine.jsx
import { createChart, CandlestickSeries ,HistogramSeries ,CrosshairMode } from "lightweight-charts";
import { IndicatorManager } from "./IndicatorManager";

export class ChartEngine {
  // ===== Change Start =====
  // Ye change isliye kiya kyuki constructor me options parameter use nahi ho raha tha.
  // Unused parameter lint error de raha tha, aur ChartEngine ab one-chart mode me fixed config use kar raha hai.
  // Iska effect ye hoga ki file lint clean rahegi without chart behavior change.
  constructor(container) {
  // ===== Change End =====

    // this.type = options.type ?? "price";   //isko commentout kiya h volume ka chart htaen ke liye 
    
    this.indicatorManager = new IndicatorManager(this);

    this.chart = createChart(container, {
      // ===== Change Start =====
      // Ye change isliye kiya kyuki Lightweight Charts v5 me addDefaultPane boolean hota hai.
      // Main candle pane ko clearly create rakhna zaroori hai, kyuki candles, volume aur overlay indicators pane 0 use karte hain.
      // Agar yaha 0 rakhenge to chart default pane ko false jaisa treat kar sakta hai aur pane behavior unstable ho sakta hai.
      // Iska effect ye hoga ki one-main-chart architecture ka base pane stable rahega.
      addDefaultPane: true,
      // ===== Change End =====
      autoSize: true,
      handleScale:true,
      handleScroll:true,
      localization:{
        locale:"en-US",
      },

      layout: {
        background: { color: "#0D1117" },
        textColor: "#9CA3AF",
      },

      grid: {
        vertLines: { color: "#1F2937" },
        horzLines: { color: "#1F2937" },
      },

      rightPriceScale: {
        borderColor: "#2A2E39",
        scaleMargins:{ top:0.05,
          bottom:0.25,
        }
      },

      timeScale: {
        borderColor: "#2A2E39",
        timeVisible: true,

        secondsVisible: false,

        rightOffset: 8,

        barSpacing: 8,

        minBarSpacing: 6,

        fixLeftEdge: false,

        fixRightEdge: false,
      },
      crosshair :{
        mode: CrosshairMode.Normal,
      }
    });

  //  if(this.type==="price"){
  //     this.series =
  //       this.chart.addSeries(CandlestickSeries);
        
  //   }

  //   if(this.type==="volume"){

  //       this.series = this.chart.addSeries(
  //           HistogramSeries,
  //           {
  //               priceFormat:{
  //                   type:"volume"
  //               },

  //               priceScaleId:"",

  //               priceLineVisible:false,

  //               lastValueVisible:false,

  //               scaleMargins:{
  //                   top:0,
  //                   bottom:0,
  //               }
  //           }
  //       );

  //   }

  this.candleSeries = this.chart.addSeries(
    CandlestickSeries 
  );

  this.volumeSeries = this.chart.addSeries(
      HistogramSeries,
      {
          priceFormat:{
              type:"volume"
          },
          // addDefaultPane:2,
  
          priceScaleId:"",
  
          priceLineVisible:false,
  
          lastValueVisible:false,
          
        }
    );

  // ===== Change Start =====
  // Ye change isliye kiya kyuki Volume ko same chart ke overlay price scale par render karna hai.
  // Lightweight Charts v5 me overlay scale ke margins series ke priceScale() se apply karne chahiye.
  // Agar ye nahi karenge to Volume full chart height le sakta hai aur Candles visually dab jati hain.
  // Iska effect ye hoga ki Candlestick right price scale par rahegi aur Volume bottom me 20-25% area use karega.
  this.volumeSeries.priceScale().applyOptions({
    scaleMargins: {
      top: 0.78,
      bottom: 0,
    },
  });
  // ===== Change End =====
  }

  // setCandles(data) {
  //   this.series.setData(data);
  // }

  setData(data){

    this.candleSeries.setData(data);

  }

  setVolume(data){                         // add this function 
    this.volumeSeries.setData(data);
  }


  updateCandle(candle) {
    // this.candleSeries.update(candle);
    this.mainSeries.update(candle);
    
  }

  // addVolume(data) {

  //   this.indicatorManager.addHistogram(
  //       "Volume",
  //       data,
  //       {
  //           priceFormat: {
  //               type: "volume",
  //           },

  //           priceScaleId: "",

  //           scaleMargins: {
  //               top: 0.5,
  //               bottom: 0,
  //           },
  //       }
  //   );

  // }

 

  fit() {
    this.chart.timeScale().fitContent();
  }

  destroy() {
    this.chart.remove();
  }
}






