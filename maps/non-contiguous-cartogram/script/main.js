// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  nonContiguousCartogram
} from './chart.js';

import {
  legend
} from './legend.js';

const us = await d3.json('./data/states-albers-10m.json');
const data = new Map(d3.csvParse(await d3.text('./data/obesity-2008-2018.csv'), ({
  id,
  obesity2008,
  obesity2018
}) => [id, [+obesity2008, +obesity2018]]));

const radioButtonData = [
  ['2008', 0],
  ['2018', 1]
];

const form = d3.select('body').append('form');
const buttons = form.selectAll('span')
  .data(radioButtonData)
  .enter()
  .append('span');
buttons.append('input')
  .attr('type', 'radio')
  .attr('name', 'year')
  .attr('id', (d, i) => `radio${i}`)
  .attr('value', d => d[1])
  .property('checked', d => d[0] === '2008');
buttons.append('label')
  .text(d => d[0]);

const chart = nonContiguousCartogram(data, us);

const chartLegend = legend(chart.scales.color, {
  title: 'Adult obesity (self-reported)',
  tickFormat: '%'
});

d3.select('body').append(() => chart);
d3.select('body').append(() => chartLegend);

const timeout = setTimeout(() => {
  d3.select(`#radio1`).property('checked', true);
  chart.update(d3.select('input[name="year"]:checked').node().value);
}, 2000);

// initial plot
chart.update(d3.select('input[name="year"]:checked').node().value);

// when updated
buttons.on('click', () => {
  chart.update(d3.select('input[name="year"]:checked').node().value);
  clearTimeout(timeout);
});