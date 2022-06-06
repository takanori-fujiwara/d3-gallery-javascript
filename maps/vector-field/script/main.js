// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  vectorField
} from './chart.js';

const data = await d3.csv('./data/wind.csv', d3.autoType);
const world = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/land-50m.json');

const chart = vectorField(data, world);

d3.select('body').append(() => chart);