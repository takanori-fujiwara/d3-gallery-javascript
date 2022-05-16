// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  slopeChart
} from './chart.js';

const receipts = await d3.csv('./data/gdp-receipts.csv', d3.autoType);

slopeChart(receipts, {
  x: d => d.year,
  y: d => d.receipts,
  z: d => d.country,
  width: 800,
  height: 600
});