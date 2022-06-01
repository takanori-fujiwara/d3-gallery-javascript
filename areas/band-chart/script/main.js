// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  bandChart
} from './chart.js';

const temperatures = await d3.csv('./data/temperatures.csv', d3.autoType);

const chart = bandChart(temperatures, {
  x: d => d.date,
  y1: d => d.low,
  y2: d => d.high,
  color: "steelblue",
  curve: d3.curveStep,
  yLabel: "↑ Temperature (°F)",
  width: 1000,
  height: 600
});

d3.select('body').append(() => chart);