// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  tissotsIndicatrix
} from './chart.js';

import {
  projections
} from './map-projections.js';

const world = await d3.json('./data/land-50m.json');

const dropdownData = Object.keys(projections);

const select = d3.select('body').append('div').text('projection').append('select');
select.attr('id', 'projection-key')

const options = select.selectAll('option')
  .data(dropdownData)
  .enter()
  .append('option')
  .text(d => d)
  .attr('value', d => d)
  .attr('selected', d => d === 'American polyconic' ? 'selected' : null);

const updateChart = projectionKey => {
  const chart = tissotsIndicatrix(world, {
    canvasId: 'tissots-indicatrix',
    projectionKey: projectionKey,
  });

  d3.select('#world-map').remove();
  d3.select('body').append(() => chart);

  return chart;
}

// initial state
updateChart(d3.select('#projection-key').node().value);

// when updated
select.on('change', () => {
  updateChart(d3.select('#projection-key').node().value);
});