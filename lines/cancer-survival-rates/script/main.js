// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2018 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/cancer-survival-rates

import {
  slopeChart
} from './chart.js';

const data = await d3.csv('./data/cancer@1.csv', d3.autoType);

const chart = slopeChart(data, {
  x: d => d.year,
  y: d => d.survival,
  z: d => d.name,
  xPadding: 1,
  width: 800,
  height: 720
});

d3.select('body').append(() => chart);