// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2018 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/stacked-to-grouped-bars

import {
  stackedToGroupedBars
} from './chart.js';

// Returns an array of m psuedorandom, smoothly-varying non-negative numbers.
// Inspired by Lee Byron’s test data generator.
// http://leebyron.com/streamgraph/
const bumps = m => {
  // Initialize with uniform random values in [0.1, 0.2).
  const values = Array(m).fill(0).map(() => 0.1 + 0.1 * Math.random());

  // Add five random bumps.
  for (let j = 0; j < 5; ++j) {
    const x = 1 / (0.1 + Math.random());
    const y = 2 * Math.random() - 0.5;
    const z = 10 / (0.1 + Math.random());
    for (let i = 0; i < m; i++) {
      const w = (i / m - y) * z;
      values[i] += x * Math.exp(-w * w);
    }
  }

  // Ensure all values are positive.
  for (let i = 0; i < m; ++i) {
    values[i] = Math.max(0, values[i]);
  }

  return values;
}

const n = 5;
const m = 58;
const data = d3.range(n).map(() => bumps(m)); // the y-values of each of the n series
const chart = stackedToGroupedBars(data);

const radioButtonData = [
  ['Stacked', 'stacked'],
  ['Grouped', 'grouped']
];

const form = d3.select('body').append('form');

const buttons = form.selectAll('span')
  .data(radioButtonData)
  .enter()
  .append('span');

buttons.append('input')
  .attr('type', 'radio')
  .attr('name', 'barType')
  .attr('id', (d, i) => `radio${i}`)
  .attr('value', d => d[1])
  .property('checked', d => d[0] === 'Stacked');

buttons.append('label')
  .text(d => d[0]);

d3.select('body').append(() => chart);

// initial plot
chart.update(d3.select('input[name="barType"]:checked').node().value);

// when updated
buttons.on('change', () => {
  chart.update(d3.select('input[name="barType"]:checked').node().value);
});