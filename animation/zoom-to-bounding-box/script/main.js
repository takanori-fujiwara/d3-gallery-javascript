// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  zoomToBoundingBox
} from './chart.js';

const us = await d3.json('./data/states-albers-10m.json');

const chart = zoomToBoundingBox(us);

d3.select('body').append(() => chart);