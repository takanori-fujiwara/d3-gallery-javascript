/// Moridied source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/diverging-stacked-bar-chart

import {
  chart
} from './chart.js';

const data = (await d3.dsv(',', '../data/sales.csv')).map(({
  market,
  segment,
  value
}) => ({
  x: market,
  y: segment,
  value: value
}));

chart(data);