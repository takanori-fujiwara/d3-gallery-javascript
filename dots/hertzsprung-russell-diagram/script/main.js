// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  hertzsprungRussellDiagram
} from './chart.js';

const data = await d3.csv('./data/catalog.csv', d3.autoType);

const chart = hertzsprungRussellDiagram(data);

d3.select('body').append(() => chart);