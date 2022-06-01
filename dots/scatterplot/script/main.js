// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  scatterplot
} from './chart.js';

const cars = await d3.csv('./data/mtcars.csv', d3.autoType);

const chart = scatterplot(cars, {
  x: d => d.mpg,
  y: d => d.hp,
  title: d => d.name,
  xLabel: 'Miles per gallon →',
  yLabel: '↑ Horsepower',
  stroke: 'steelblue',
  width: 1000,
  height: 600
});

d3.select('body').append(() => chart);