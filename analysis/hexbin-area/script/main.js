// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  hexbinArea
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
})

const updateChart = (newRadius, shape) => {
  const chart = hexbinArea(data, {
    radius: newRadius,
    shape: shape
  });
  d3.select(`svg#${chart.svgId}`).remove();
  d3.select('body').append('div').style('clear', 'both').append(() => chart);
}

const select = d3.select('body').append('div').append('select');
select.selectAll('option')
  .data([
    ['Hexagons', 'path'],
    ['Circles', 'circle']
  ])
  .enter()
  .append('option')
  .text(d => d[0])
  .attr('value', d => d[1]);

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

// initial chart
updateChart(sliderInput.property('value'), select.node().value);

// when updated
select.on('change', () => {
  updateChart(sliderInput.property('value'), select.node().value);
});
sliderInput.on('input', () => {
  const newRadius = sliderInput.property('value');
  if (newRadius >= 2) updateChart(newRadius, select.node().value);
  sliderInput.property('value', newRadius);
  sliderText.text(`${newRadius}px radius`)
});