// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  polarClock
} from './chart.js';

const chart = polarClock();

d3.select('body').append(() => chart);

setInterval(() => {
  chart.update(Math.floor((Date.now() + 1) / 1000) * 1000);
}, 150);