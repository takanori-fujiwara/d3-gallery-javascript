// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  boxPlot
} from './chart.js';

const diamonds = await d3.csv('./data/diamonds.csv', d3.autoType);

boxPlot(diamonds, {
  x: d => d.carat,
  y: d => d.price,
  xLabel: 'Carats →',
  yLabel: '↑ Price ($)',
  width: 1000,
  height: 500
});