// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  barChart
} from './chart.js';

const alphabet = await d3.csv('./data/alphabet.csv', d3.autoType);

const dropdownData = new Map([
  ['Alphabetical', (a, b) => d3.ascending(a.letter, b.letter)],
  ['Frequency, ascending', (a, b) => d3.ascending(a.frequency, b.frequency)],
  ['Frequency, descending', (a, b) => d3.descending(a.frequency, b.frequency)]
]);

const dropDownSelect = d3.select('body').append('div').text('Order ').append('select');
dropDownSelect.attr('id', 'dropDownSelect')

const options = dropDownSelect.selectAll('option')
  .data(dropdownData)
  .enter()
  .append('option')
  .text(d => d[0])
  .attr('value', d => d[0]);

const chart = barChart(alphabet, {
  x: d => d.letter,
  y: d => d.frequency,
  yFormat: '%',
  yLabel: '↑ Frequency',
  width: 1000,
  height: 500,
  color: 'steelblue',
  duration: 750 // slow transition for demonstration
});

const updateChart = () => {
  const order = dropdownData.get(d3.select('select[id="dropDownSelect"]').property('value'));
  chart.update(d3.sort(alphabet, order));
}

dropDownSelect.on('change', () => {
  clearInterval(interval);
  updateChart();
});

// trigger
const genInterval = () => {
  let i = 0;
  return setInterval(() => {
    i = (i + 1) % Array.from(dropdownData.keys()).length;
    const key = Array.from(dropdownData.keys())[i];

    d3.select('select[id="dropDownSelect"]').property('value', key);
    updateChart();
  }, 4000);
}

const interval = genInterval();