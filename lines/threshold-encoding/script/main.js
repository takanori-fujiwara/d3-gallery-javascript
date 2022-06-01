// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  thresholdEncoding
} from './chart.js';

const data = Object.assign((await d3.csv('./data/temperature.csv', d3.autoType)).map(({
  date,
  temperature
}) => ({
  date,
  value: temperature
})), {
  y: '°F'
});

const chart = thresholdEncoding(data);

d3.select('body').append(() => chart);