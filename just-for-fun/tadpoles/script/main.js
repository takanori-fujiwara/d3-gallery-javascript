// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  tadpolesChart
} from './chart.js';

const chart = tadpolesChart();

d3.select('body').append(() => chart);

const interval = setInterval(() => {
    chart.update();
  },
  20);