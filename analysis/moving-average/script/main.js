// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  movingAverage
} from './chart.js';

const data = d3.csvParse(await d3.text('./data/chicago-homicide-dates.csv'), ({
  date
}) => d3.timeParse('%m/%d/%Y %I:%M:%S %p')(date));

const inputArea = d3.select('body').append('div').style('float', 'left');
const textInput = inputArea.insert('input').style('float', 'left')
  .attr('type', 'number')
  .attr('id', 'textInput')
  .attr('min', 1)
  .attr('max', 365)
  .attr('value', 100)
  .attr('step', 1);
inputArea.append('div').text('days (N)').style('float', 'left')
  .style('margin-left', 3)
  .style('margin-top', 3);

const updateChart = newN => {
  const chart = movingAverage(data, {
    N: newN
  });
  d3.select(`svg#${chart.svgId}`).remove();
  d3.select('body').append('div').style('clear', 'both').append(() => chart);
}

// initial chart
updateChart(textInput.property('value'));

// when updated
textInput.on('input', () => {
  const newN = textInput.property('value');
  if (newN >= 1) updateChart(newN);
  textInput.property('value', newN);
});