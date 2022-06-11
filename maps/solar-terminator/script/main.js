// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  solarTerminator
} from './chart.js';

const world = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/land-50m.json')
  .then(response => response.json());

const chart = solarTerminator(world);

d3.select('body').append(() => chart);