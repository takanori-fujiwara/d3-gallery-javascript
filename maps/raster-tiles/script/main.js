// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  rasterTiles,
  tileUrls
} from './chart.js';

const dropdownData = Object.keys(tileUrls);

const select = d3.select('body').append('div').append('select');
select.attr('id', 'tile-url-key')

const options = select.selectAll('option')
  .data(dropdownData)
  .enter()
  .append('option')
  .text(d => d)
  .attr('value', d => d)
  .attr('selected', d => d === 'Stamen Toner (lite)' ? 'selected' : null);

const updateChart = tileUrlKey => {
  const chart = rasterTiles({
    svgId: 'raster-tiles',
    tileUrlKey: tileUrlKey,
  });

  d3.select('#raster-tiles').remove();
  d3.select('body').append(() => chart);

  return chart;
}

// initial state
updateChart(d3.select('#tile-url-key').node().value);

// when updated
select.on('change', () => {
  updateChart(d3.select('#tile-url-key').node().value);
});