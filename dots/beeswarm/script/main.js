// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  beeswarmChart
} from './chart.js';

const cars = await d3.csv('./data/cars-2.csv', d3.autoType);

const chart = beeswarmChart(cars, {
  x: d => d.Weight_in_lbs,
  label: 'Weight (lbs.) →',
  type: d3.scaleLinear, // try d3.scaleLog
  title: d => `${d.Origin}: ${d.Name}\n${d.Weight_in_lbs.toLocaleString('en')} lbs.`,
  width: 800
});

d3.select('body').append(() => chart);