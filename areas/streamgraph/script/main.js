// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  streamgraph
} from './chart.js';

import {
  swatches
} from './legend.js';

const unemployment = await d3.csv('./data/unemployment.csv', d3.autoType);

// Note: using d3.schemeTableau10 is not appropriate for this data.
// For practical use, either reduce # of categories or
// use color palette having 14 distinguishable colors
const chart = streamgraph(unemployment, {
  x: d => d.date,
  y: d => d.unemployed,
  z: d => d.industry,
  yLabel: "↑ Unemployed persons",
  width: 1000,
  height: 600
});

d3.select('body').append(() => chart);

swatches(chart.scales.color, {
  textWidth: 200,
  nColumns: 5
});