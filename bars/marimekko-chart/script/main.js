// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  marimekkoChart
} from './chart.js';

const data = (await d3.csv('./data/sales.csv')).map(({
  market,
  segment,
  value
}) => ({
  x: market,
  y: segment,
  value: value
}));

const chart = marimekkoChart(data);

d3.select('body').append(() => chart);