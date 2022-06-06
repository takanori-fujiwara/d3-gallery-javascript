// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  vectorTiles
} from './chart.js';

const chart = await vectorTiles({
  apiKey: null // Set your API Key string
});

d3.select('body').append(() => chart);