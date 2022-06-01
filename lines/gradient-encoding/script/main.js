// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  gradientEncoding
} from './chart.js';

import {
  legend
} from './legend.js';

const data = Object.assign(d3.csvParse(await d3.text('./data/temperature.csv'), d3.autoType).map(({
  date,
  temperature
}) => ({
  date,
  value: temperature
})), {
  title: 'Temperature °F',
  y: ' °F'
})

const chart = gradientEncoding(data);

d3.select('body').append(() => chart);

legend(chart.scales.color, {
  title: data.title === undefined ? data.y : data.title
});