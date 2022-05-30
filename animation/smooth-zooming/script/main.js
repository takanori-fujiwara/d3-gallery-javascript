// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  smoothZooming
} from './chart.js';

const chart = smoothZooming();

d3.select('body').append(() => chart);