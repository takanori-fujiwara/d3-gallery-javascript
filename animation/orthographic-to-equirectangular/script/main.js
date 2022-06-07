// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  orthographicToEquirectangular
} from './chart.js';

const chart = orthographicToEquirectangular();

d3.select('body').append(() => chart);

setInterval(() => {
  chart.update();
}, 15);