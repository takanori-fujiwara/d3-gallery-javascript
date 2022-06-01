// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  radialStackedBarChartIi
} from './chart.js';

const data = d3.csvParse(await d3.text('./data/data-2.csv'), (d, _, columns) => {
  let total = 0;
  for (let i = 1; i < columns.length; ++i) {
    total += d[columns[i]] = +d[columns[i]]
  };
  d.total = total;
  return d;
}).sort((a, b) => b.total - a.total)

const chart = radialStackedBarChartIi(data);

d3.select('body').append(() => chart);