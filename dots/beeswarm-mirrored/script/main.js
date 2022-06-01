// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  beeswarmChart
} from './chart.js';

const cars = await d3.csv('./data/cars.csv', d3.autoType);

const chart = beeswarmChart(cars, {
  x: d => d.Weight_in_lbs,
  xLabel: 'Weight (lbs.) →',
  title: d => d.Name,
  width: 800
});

d3.select('body').append(() => chart);