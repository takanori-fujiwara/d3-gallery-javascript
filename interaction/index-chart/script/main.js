// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  indexChart
} from './chart.js';

import {
  swatches
} from './legend.js';

const indices = await d3.csv('./data/indices.csv', d3.autoType);

const chart = indexChart(indices, {
  x: d => d.Date,
  y: d => d.Close,
  z: d => d.Symbol,
  yLabel: '↑ Change in price (×)',
  width: 1000,
  height: 600
});

swatches(chart.scales.color)

// trigger
d3.select(chart)
  .on('pointerenter', () => d3.select(chart).interrupt())
  .transition()
  .ease(d3.easeCubicOut)
  .duration(2000)
  .tween('date', () => {
    const i = d3.interpolateDate(...d3.extent(indices, d => d.Date).reverse());
    return t => chart.update(i(t));
  });