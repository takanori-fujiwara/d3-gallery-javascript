// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  brushableScatterplotMatrix
} from './chart.js';

const data = await d3.csv('./data/penguins.csv', d3.autoType);

const chart = brushableScatterplotMatrix(data);

d3.select('body').append(() => chart);