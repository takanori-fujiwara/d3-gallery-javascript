// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  variableColorLine
} from './chart.js';

import {
  swatches
} from './legend.js';

const data = Object.assign(d3.csvParse(await d3.text('./data/FCM.txt'), ({
  valid,
  tmpf,
  skyc1
}) => {
  return tmpf === 'M' ? null : {
    date: d3.utcParse('%Y-%m-%d %H:%M')(valid),
    value: +tmpf,
    condition: skyc1
  };
}), {
  y: ' °F',
  conditions: ['CLR', 'FEW', 'SCT', 'BKN', 'OVC', 'VV '],
  labels: ['Clear', 'Few clouds', 'Scattered clouds', 'Broken clouds', 'Overcast', 'Indefinite ceiling (vertical visibility)'],
  colors: ['deepskyblue', 'lightskyblue', 'lightblue', '#aaaaaa', '#666666', '#666666']
});

const chart = variableColorLine(data);

d3.select('body').append(() => chart);

swatches(chart.scales.color);