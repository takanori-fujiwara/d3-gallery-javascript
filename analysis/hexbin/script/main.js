// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  hexbin
} from './chart.js';

const data = Object.assign(d3.csvParse(await d3.text('./data/diamonds.csv'), ({
  carat,
  price
}) => ({
  x: +carat,
  y: +price
})), {
  x: 'Carats',
  y: '$ Price'
});

const updateChart = newRadius => {
  const chart = hexbin(data, {
    radius: newRadius
  });
  d3.select(`svg#${chart.svgId}`).remove();
  d3.select('body').append('div').style('clear', 'both').append(() => chart);
}

const inputArea = d3.select('body').append('div').style('float', 'left');
const sliderInput = inputArea.insert('input').style('float', 'left')
  .attr('type', 'range')
  .attr('id', 'sliderInput')
  .attr('min', 2)
  .attr('max', 20)
  .attr('value', 8)
  .attr('step', 1);
const sliderText = inputArea.append('div')
  .style('float', 'left')
  .style('margin-top', 3)
  .style('margin-left', 3)
  .text(`${sliderInput.property('value')}px radius`);
sliderInput
  .on('input', () => sliderInput.attr('value'));

updateChart(sliderInput.property('value'));

sliderInput.on('input', () => {
  const newRadius = sliderInput.property('value');
  if (newRadius >= 2) updateChart(newRadius);
  sliderInput.property('value', newRadius);
  sliderText.text(`${newRadius}px radius`)
});