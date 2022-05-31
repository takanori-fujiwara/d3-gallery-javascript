// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  kernelDensityEstimation
} from './chart.js';

const data = Object.assign(await d3.json('./data/faithful.json'), {
  title: 'Time between eruptions (min.)'
})

const minVal = 1;
const maxVal = 20;
const value = 7;
const step = 0.1;

const inputArea = d3.select('body').append('div').text('Bandwidth');
const textInput = inputArea.insert('input')
  .attr('type', 'number')
  .attr('id', 'textInput')
  .attr('min', minVal)
  .attr('max', maxVal)
  .attr('value', value)
  .attr('step', step);
const sliderInput = inputArea.insert('input')
  .attr('type', 'range')
  .attr('id', 'sliderInput')
  .attr('min', minVal)
  .attr('max', maxVal)
  .attr('value', value)
  .attr('step', step);
sliderInput
  .on('input', () => d3.select('input[id="sliderInput"]').attr('value'));

const updateChart = newBandwidth => {
  const chart = kernelDensityEstimation(data, {
    bandwidth: newBandwidth
  });
  d3.select(`svg#${chart.svgId}`).remove();
  d3.select('body').append('div').append(() => chart);
}

// initial chart
updateChart(textInput.property('value'));

// when updated
textInput.on('input', () => {
  const newBandwidth = textInput.property('value');
  if (newBandwidth >= 1) updateChart(newBandwidth);
  textInput.property('value', newBandwidth);
  sliderInput.property('value', newBandwidth);
});
sliderInput.on('input', () => {
  const newBandwidth = sliderInput.property('value');
  if (newBandwidth >= 1) updateChart(newBandwidth);
  textInput.property('value', newBandwidth);
  sliderInput.property('value', newBandwidth);
});