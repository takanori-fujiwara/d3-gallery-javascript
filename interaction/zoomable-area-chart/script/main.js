// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  zoomableAreaChart
} from './chart.js';

const data = Object.assign(await d3.csv('./data/flights.csv', d3.autoType), {
  y: 'Flights'
})

const chart = zoomableAreaChart(data);

d3.select('body').append(() => chart);