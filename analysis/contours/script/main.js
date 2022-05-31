// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  contours
} from './chart.js';

const chart = contours();

d3.select('body').append(() => chart);