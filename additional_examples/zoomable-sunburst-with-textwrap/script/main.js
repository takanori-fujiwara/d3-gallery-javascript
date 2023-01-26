// Copyright 2023 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  zoomableSunburst
} from './chart.js';

const data = await d3.json('./data/flare-2.json');

// To demonstrate space-based wrapping, convert uppercase sep to space sep
// (e.g., QuantitativeScale => Quantitative Scale)
// utilizing the fact that d3.hierarchy sum traverses all nodes
d3.hierarchy(data).sum(d => d.name = d.name.split(/(?=[A-Z])/).join(" "));

const chart = zoomableSunburst(data, {
  fontSize: 10,
  charsPerLine: 10,
  wrapStyle: 'space'
});

d3.select('body').append(() => chart);