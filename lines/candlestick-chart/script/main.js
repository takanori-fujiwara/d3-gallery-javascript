// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  candlestickChart
} from './chart.js';

const aapl = await d3.csv('./data/aapl-2.csv', d3.autoType).then(data => data.slice(-120));

candlestickChart(aapl, {
  date: d => d.Date,
  high: d => d.High,
  low: d => d.Low,
  open: d => d.Open,
  close: d => d.Close,
  yLabel: "↑ Price ($)",
  width: 1000,
  height: 500
});