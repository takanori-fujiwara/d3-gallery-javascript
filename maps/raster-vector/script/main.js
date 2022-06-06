// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  rasterVector
} from './chart.js';

const topology = await d3.json('./data/detroit.json');

const chart = rasterVector(topology, {
  accessToken: null // set mapbox's access token here
});

d3.select('body').append(() => chart);