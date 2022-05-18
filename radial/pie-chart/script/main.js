// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  pieChart
} from './chart.js';

const population = await d3.csv('./data/population-by-age.csv', d3.autoType);

pieChart(population, {
  name: d => d.name,
  value: d => d.value,
  width: 1000,
  height: 500
});