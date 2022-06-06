// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  projectionComparison
} from './chart.js';

import {
  projections
} from './map-projections.js';

const world = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/land-50m.json').then(response => response.json())

const dropdownData = Object.keys(projections);

const selectRed = d3.select('body').append('div').text('red').append('select');
selectRed.attr('id', 'red-projection-key')

const optionsRed = selectRed.selectAll('option')
  .data(dropdownData)
  .enter()
  .append('option')
  .text(d => d)
  .attr('value', d => d)
  .attr('selected', d => d === 'American polyconic' ? 'selected' : null);

const selectBlue = d3.select('body').append('div').text('blue').append('select');
selectBlue.attr('id', 'blue-projection-key')

const optionsBlue = selectBlue.selectAll('option')
  .data(dropdownData)
  .enter()
  .append('option')
  .text(d => d)
  .attr('value', d => d)
  .attr('selected', d => d === 'rectangular polyconic' ? 'selected' : null);

const updateChart = (redProjectionKey, blueProjectionKey) => {
  const chart = projectionComparison(world, {
    canvasId: 'projection-comparison',
    redProjectionKey: redProjectionKey,
    blueProjectionKey: blueProjectionKey
  });

  d3.select('#projection-comparison').remove();
  d3.select('body').append(() => chart);

  return chart;
}

// initial state
updateChart(
  d3.select('#red-projection-key').node().value,
  d3.select('#blue-projection-key').node().value);

// when updated
selectRed.on('change', () => {
  updateChart(
    d3.select('#red-projection-key').node().value,
    d3.select('#blue-projection-key').node().value);
});
selectBlue.on('change', () => {
  updateChart(
    d3.select('#red-projection-key').node().value,
    d3.select('#blue-projection-key').node().value);
});