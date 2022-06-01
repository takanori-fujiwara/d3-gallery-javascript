// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  differenceChart
} from './chart.js';

const weather = await d3.csv('./data/weather.csv', d3.autoType);

const chart = differenceChart(weather, {
  x: d => d.date,
  y1: d => d["New York"],
  y2: d => d["San Francisco"],
  yLabel: "↑ Temperature (°F)",
  colors: d3.reverse(d3.schemeRdBu[3]),
  curve: d3.curveStep,
  width: 1000,
  height: 600
});

d3.select('body').append(() => chart);