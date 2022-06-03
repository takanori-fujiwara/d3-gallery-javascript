// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  hexbinMap
} from './chart.js';

import {
  legend
} from './legend.js';

const us = await d3.json('./data/states-albers-10m.json');
const data = await d3.tsv('./data/walmart.tsv')

const chart = hexbinMap(data, us);

const chartLegend = legend(chart.scales.color, {
  title: 'Median opening year',
  tickValues: d3.utcYear.every(5).range(...chart.scales.color.domain()),
  tickFormat: d3.utcFormat('%Y')
});

d3.select('body').append(() => chart);
d3.select('body').append(() => chartLegend);