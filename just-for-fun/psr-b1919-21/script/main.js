// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  psrB191921
} from './chart.js';

const data = (await d3.text('./data/pulsar.csv')).split('\n')
  .map(row => row.split(',').map(d => parseFloat(d)));

const chart = psrB191921(data);

d3.select('body').append(() => chart);