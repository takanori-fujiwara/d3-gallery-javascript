// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  areaChart
} from './chart.js';

const aapl = await d3.csv('./data/aapl.csv', d3.autoType);

areaChart(aapl, {
  x: d => d.date,
  y: d => d.close,
  yLabel: "↑ Daily close ($)",
  width: 1000,
  height: 500,
  color: "steelblue"
});