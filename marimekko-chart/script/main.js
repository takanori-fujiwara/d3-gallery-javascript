// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  chart
} from './chart.js';

const data = (await d3.csv('./data/sales.csv')).map(({
  market,
  segment,
  value
}) => ({
  x: market,
  y: segment,
  value: value
}));

chart(data);