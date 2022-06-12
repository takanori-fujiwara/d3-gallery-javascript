// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  colorSchemes
} from './chart.js';

const dropdownData = new Map([
  ['continuous', 256],
  ...d3.range(11, 2, -1).map(n => [`discrete (${n})`, n])
]);

const select = d3.select('body').append('div').text('Scheme size ').append('select');
select.attr('id', 'scheme-size-selection')

const options = select.selectAll('option')
  .data(dropdownData)
  .enter()
  .append('option')
  .text(d => d[0])
  .attr('value', d => d[1]);

const updateChart = schemeSize => {
  const chart = colorSchemes({
    svgId: 'color-schemes',
    n: schemeSize
  });

  d3.select('#color-schemes').remove();
  d3.select('body').append(() => chart).style('margin-left', 30);
}

// initial state
updateChart(d3.select('#scheme-size-selection').node().value)

// when updated
select.on('change', () => {
  updateChart(d3.select('#scheme-size-selection').node().value)
});