// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  bollingerChart
} from './chart.js';

const aapl = await d3.csv('./data/aapl.csv', d3.autoType);

const defaultN = 20;
const defaultK = 2;

const inputAreaN = d3.select('body').append('div').text('Periods (N) ');
const textInputN = inputAreaN.insert('input')
  .attr('type', 'number')
  .attr('id', 'textInputN')
  .attr('min', 2)
  .attr('max', 100)
  .attr('step', 1)
  .attr('value', defaultN);
const sliderInputN = inputAreaN.insert('input')
  .attr('type', 'range')
  .attr('id', 'sliderInputN')
  .attr('min', 2)
  .attr('max', 100)
  .attr('step', 1)
  .attr('value', defaultN)
sliderInputN
  .on('input', () => d3.select('input[id="sliderInputN"]').attr('value'));

const inputAreaK = d3.select('body').append('div').text('Deviations (K) ');
const textInputK = inputAreaK.insert('input')
  .attr('type', 'number')
  .attr('id', 'textInputK')
  .attr('min', 2)
  .attr('max', 100)
  .attr('step', 1)
  .attr('value', defaultK);
const sliderInputK = inputAreaK.insert('input')
  .attr('type', 'range')
  .attr('id', 'sliderInputK')
  .attr('min', 0)
  .attr('max', 10)
  .attr('step', 0.1)
  .attr('value', defaultK)
sliderInputK
  .on('input', () => d3.select('input[id="sliderInputK"]').attr('value'));

const updateChart = (N, K) => {
  bollingerChart(aapl, {
    x: d => d.date,
    y: d => d.close,
    N: N, // number of periods, per input above
    K: K, // number of standard deviations, per input above
    yLabel: '↑ Daily close ($)',
    width: 1000,
    height: 600
  });
}

// initial state
updateChart(defaultN, defaultK);

// when updated
textInputN.on('input', () => {
  const newN = parseInt(d3.select('input[id="textInputN"]').property('value'));
  const currentK = parseFloat(d3.select('input[id="textInputK"]').property('value'));

  if (newN) {
    updateChart(newN, currentK);
    d3.select('input[id="textInputN"]').property('value', newN.toString());
    d3.select('input[id="sliderInputN"]').property('value', newN.toString());
  }
});

sliderInputN.on('input', () => {
  const newN = parseInt(d3.select('input[id="sliderInputN"]').property('value'));
  const currentK = parseFloat(d3.select('input[id="sliderInputK"]').property('value'));

  if (newN) {
    updateChart(newN, currentK);
    d3.select('input[id="textInputN"]').property('value', newN.toString());
    d3.select('input[id="sliderInputN"]').property('value', newN.toString());
  }
});

textInputK.on('input', () => {
  const currentN = parseInt(d3.select('input[id="textInputN"]').property('value'));
  const newK = parseFloat(d3.select('input[id="textInputK"]').property('value'));

  if (newK) {
    updateChart(currentN, newK);
    d3.select('input[id="textInputK"]').property('value', newK.toString());
    d3.select('input[id="sliderInputK"]').property('value', newK.toString());
  }
});

sliderInputK.on('input', () => {
  const currentN = parseInt(d3.select('input[id="sliderInputN"]').property('value'));
  const newK = parseFloat(d3.select('input[id="sliderInputK"]').property('value'));

  if (newK) {
    updateChart(currentN, newK);
    d3.select('input[id="textInputK"]').property('value', newK.toString());
    d3.select('input[id="sliderInputK"]').property('value', newK.toString());
  }
});