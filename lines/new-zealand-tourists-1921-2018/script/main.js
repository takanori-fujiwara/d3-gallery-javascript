// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2012–2020 Mike Bostock
// Released under the ISC license.
// https://observablehq.com/@mbostock/new-zealand-tourists-1921-2018

import {
  newZealandTourists19212018
} from './chart.js';

const data = Object.assign((await d3.csv('./data/nz-tourists.csv', d3.autoType)).map(({
  Date,
  Close
}) => ({
  date: Date,
  value: Close
})), {
  y: '↑ Visitors per month'
});

const radioButtonData = new Map([
  ['Linear scale', 'linear'],
  ['Log scale', 'log']
]);

const form = d3.select('body').append('form');
const buttons = form.selectAll('span')
  .data(radioButtonData)
  .enter()
  .append('span');
buttons.append('input')
  .attr('type', 'radio')
  .attr('name', 'yType')
  .attr('value', d => d[1])
  .property('checked', d => d[0] === 'Linear scale');
buttons.append('label')
  .text(d => d[0]);

const chart = newZealandTourists19212018(data);

d3.select('body').append(() => chart);

const timeout = setTimeout(() => {
  d3.select('input[value="log"]').node().checked = true;
  chart.update(d3.select('input[name="yType"]:checked').node().value);
}, 2000);

// when updated
buttons.on('change', () => {
  clearTimeout(timeout);
  chart.update(d3.select('input[name="yType"]:checked').node().value);
});