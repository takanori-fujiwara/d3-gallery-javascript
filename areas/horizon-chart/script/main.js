// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  horizonChart
} from './chart.js';

const traffic = d3.sort(await d3.csv('./data/traffic.csv', d3.autoType), d => d.date);

const initScheme = d3.schemeBlues;
const initBands = 7;

const dropdownData = new Map([
  ['Blues', d3.schemeBlues],
  ['Greens', d3.schemeGreens],
  ['Greys', d3.schemeGreys],
  ['Oranges', d3.schemeOranges],
  ['Purples', d3.schemePurples],
  ['Reds', d3.schemeReds],
  ['BuGn', d3.schemeBuGn],
  ['BuPu', d3.schemeBuPu],
  ['GnBu', d3.schemeGnBu],
  ['OrRd', d3.schemeOrRd],
  ['PuBu', d3.schemePuBu],
  ['PuBuGn', d3.schemePuBuGn],
  ['PuRd', d3.schemePuRd],
  ['RdPu', d3.schemeRdPu],
  ['YlGn', d3.schemeYlGn],
  ['YlGnBu', d3.schemeYlGnBu],
  ['YlOrBr', d3.schemeYlOrBr],
  ['YlOrRd', d3.schemeYlOrRd]
]);

const dropDownSelect = d3.select('body').append('div').text('Color scheme ').append('select');
dropDownSelect.attr('id', 'dropDownSelect')

const options = dropDownSelect.selectAll('option')
  .data(dropdownData)
  .enter()
  .append('option')
  .text(d => d[0])
  .attr('value', d => d[0]);

const inputArea = d3.select('body').append('div').text('Bands ');
const textInput = inputArea.insert('input')
  .attr('type', 'number')
  .attr('id', 'textInput')
  .attr('value', initBands)
  .attr('min', 1)
  .attr('max', 9)
  .attr('step', 1);
const sliderInput = inputArea.insert('input')
  .attr('type', 'range')
  .attr('id', 'sliderInput')
  .attr('min', 1)
  .attr('max', 9)
  .attr('step', 1)
  .attr('value', initBands)
sliderInput
  .on('input', () => d3.select('input[id="sliderInput"]').attr('value'));

const updateChart = (bands, scheme) => {
  horizonChart(traffic, {
    x: d => d.date,
    y: d => d.value,
    z: d => d.name,
    bands: bands,
    width: 1000,
    scheme: scheme
  });
}

// initial state
updateChart(initBands, initScheme);

// when updated
textInput.on('input', () => {
  const newBands = parseInt(d3.select('input[id="textInput"]').property('value'));
  const currentScheme = dropdownData.get(d3.select('select[id="dropDownSelect"]').property('value'));

  if (newBands) {
    updateChart(newBands, currentScheme);
    d3.select('input[id="textInput"]').property('value', newBands.toString());
    d3.select('input[id="sliderInput"]').property('value', newBands.toString());
  }
});

sliderInput.on('input', () => {
  const newBands = parseInt(d3.select('input[id="sliderInput"]').property('value'));
  const currentScheme = dropdownData.get(d3.select('select[id="dropDownSelect"]').property('value'));

  if (newBands) {
    updateChart(newBands, currentScheme);
    d3.select('input[id="textInput"]').property('value', newBands.toString());
    d3.select('input[id="sliderInput"]').property('value', newBands.toString());
  }
});

dropDownSelect.on('change', () => {
  const currentBands = parseInt(d3.select('input[id="sliderInput"]').property('value'));
  const newScheme = dropdownData.get(d3.select('select[id="dropDownSelect"]').property('value'));

  updateChart(currentBands, newScheme);
});