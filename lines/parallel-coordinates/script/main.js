// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  parallelCoordinates
} from './chart.js';

import {
  legend
} from './legend.js';

const data = await d3.csv('./data/cars.csv', d3.autoType);
const keys = data.columns.slice(1);
const keysDefault = 'weight (lb)';

const dropDownSelect = d3.select('body').append('div').append('select');
dropDownSelect.selectAll('option')
  .data(keys)
  .enter()
  .append('option')
  .text(d => d)
  .attr('value', d => d)
  .property('selected', d => d === keysDefault);

const updateChart = keyz => {
  const chart = parallelCoordinates(data, {
    svgId: 'parallel-coordinates',
    keyz: keyz
  });

  const chartLegend = legend(chart.scales.z, {
    svgId: 'chart-legend',
    title: keyz
  });

  d3.select('#parallel-coordinates').remove();
  d3.select('#chart-legend').remove();

  d3.select('body').append(() => chartLegend);
  d3.select('body').append(() => chart);
}

// initial state
updateChart(dropDownSelect.property('value'));

// when updated
dropDownSelect.on('change', () => {
  updateChart(dropDownSelect.property('value'));
})