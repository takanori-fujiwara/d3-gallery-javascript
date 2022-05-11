// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  changeLineChart
} from './chart.js';

const aapl = await d3.csv('./data/aapl.csv', d3.autoType);

const minMax = d3.extent(aapl, d => d.close);
const initVal = aapl[0].close;

const inputArea = d3.select('body').append('div').text('Basis');
const textInput = inputArea.insert('input')
  .attr('type', 'text')
  .attr('id', 'textInput')
  .attr('value', aapl[0].close);
const sliderInput = inputArea.insert('input')
  .attr('type', 'range')
  .attr('id', 'sliderInput')
  .attr('min', minMax[0])
  .attr('max', minMax[1])
  .attr('step', 0.1)
  .attr('value', aapl[0].close)
sliderInput
  .on('input', () => d3.select('input[id="sliderInput"]').attr('value'));

const updateChart = (basis) => {
  changeLineChart(aapl, {
    x: d => d.date,
    y: d => d.close,
    basis: basis,
    yLabel: "↑ Change in price (%)",
    width: 800,
    height: 500,
    color: "steelblue"
  })
}

// initial state
updateChart(initVal);

// when updated
textInput.on('input', () => {
  const newVal = d3.select('input[id="textInput"]').property('value');
  updateChart(newVal);
  d3.select('input[id="textInput"]').attr('value', newVal);
  d3.select('input[id="sliderInput"]').attr('value', newVal);
});
sliderInput.on('input', () => {
  const newVal = d3.select('input[id="sliderInput"]').property('value');
  updateChart(newVal);
  d3.select('input[id="textInput"]').attr('value', newVal);
  d3.select('input[id="sliderInput"]').attr('value', newVal);
});