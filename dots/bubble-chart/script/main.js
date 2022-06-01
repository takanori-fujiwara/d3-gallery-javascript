/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/bubble-map

import {
  bubbleChart
} from './chart.js';

import {
  swatches
} from './legend.js';

const flare = await d3.csv('./data/flare.csv', d3.autoType);
const files = flare.filter(d => d.value !== null); // just the leaves

const chart = bubbleChart(files, {
  label: d => [...d.id.split('.').pop().split(/(?=[A-Z][a-z])/g), d.value.toLocaleString('en')].join('\n'),
  value: d => d.value,
  group: d => d.id.split('.')[1],
  title: d => `${d.id}\n${d.value.toLocaleString('en')}`,
  link: d => `https://github.com/prefuse/Flare/blob/master/flare/src/${d.id.replace(/\./g, '/')}.as`,
  width: 1152
});

d3.select('body').append(() => chart);

swatches(chart.scales.color, {
  textWidth: 60
})