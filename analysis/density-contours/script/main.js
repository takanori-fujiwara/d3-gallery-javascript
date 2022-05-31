// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  densityContours
} from './chart.js';

const data = Object.assign(d3.tsvParse(await d3.text('./data/faithful.tsv'), ({
  waiting: x,
  eruptions: y
}) => ({
  x: +x,
  y: +y
})), {
  x: 'Idle (min.)',
  y: 'Erupting (min.)'
})

const chart = densityContours(data);

d3.select('body').append(() => chart);