// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  histogram
} from './chart.js';

const unemployment = await d3.csv('./data/unemployment-x.csv', d3.autoType);

histogram(unemployment, {
  value: d => d.rate,
  label: "Unemployment rate (%) →",
  width: 1000,
  height: 500,
  color: "steelblue"
});