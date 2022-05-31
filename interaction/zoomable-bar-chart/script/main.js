// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  zoomableBarChart
} from './chart.js';

const data = d3.csvParse(await d3.text('./data/alphabet.csv'), ({
  letter,
  frequency
}) => ({
  name: letter,
  value: +frequency
})).sort((a, b) => b.value - a.value);

const chart = zoomableBarChart(data);

d3.select('body').append(() => chart);