// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  cascadedTreemap
} from './chart.js';

const data = await d3.json('./data/flare-2.json');

const chart = cascadedTreemap(data);

d3.select('body').append(() => chart);