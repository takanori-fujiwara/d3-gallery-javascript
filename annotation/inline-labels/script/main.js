// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  inlineChart
} from './chart.js';

const sales = await d3.csv('./data/fruit-sales.csv', d3.autoType);

const chart = inlineChart(sales, {
  x: d => d.date,
  y: d => d.sales,
  z: d => d.fruit,
  width: 1000,
  height: 500
});

d3.select('body').append(() => chart);