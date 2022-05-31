// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  parallelSets
} from './chart.js';

const data = await d3.csv('./data/titanic.csv', d3.autoType);

const chart = parallelSets(data);

d3.select('body').append(() => chart);