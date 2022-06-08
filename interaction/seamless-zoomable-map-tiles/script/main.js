// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  seamlessZoomableMapTiles
} from './chart.js';

const chart = seamlessZoomableMapTiles();

d3.select('body').append(() => chart);