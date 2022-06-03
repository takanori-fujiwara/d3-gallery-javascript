// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  styledAxes
} from './chart.js';

const chart = styledAxes();

d3.select('body').append(() => chart);