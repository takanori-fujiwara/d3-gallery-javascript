// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  collapsibleTree
} from './chart.js';

const data = await d3.json('./data/flare-2.json');

const chart = collapsibleTree(data);

d3.select('body').append(() => chart);