// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  hierarchicalEdgeBundling
} from './chart.js';

const data = await d3.json('./data/flare.json');

const chart = hierarchicalEdgeBundling(data);

d3.select('body').append(() => chart);