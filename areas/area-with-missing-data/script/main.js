// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  areaChart
} from './chart.js';

const aaplMissing = (await d3.csv('./data/aapl.csv', d3.autoType)).map(d => ({
  ...d,
  close: d.date.getUTCMonth() < 3 ? NaN : d.close
})) // simulate gaps;

const chart = areaChart(aaplMissing, {
  x: d => d.date,
  y: d => d.close,
  yLabel: "↑ Daily close ($)",
  width: 1000,
  height: 500,
  color: "steelblue"
});

d3.select('body').append(() => chart);