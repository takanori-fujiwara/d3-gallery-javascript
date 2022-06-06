// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  bivariateChoropleth,
  schemes
} from './chart.js';

const us = await d3.json('./data/counties-albers-10m.json');
const data = Object.assign(new Map(d3.csvParse(await d3.text('./data/cdc-diabetes-obesity.csv'), ({
  county,
  diabetes,
  obesity
}) => [county, [+diabetes, +obesity]])), {
  title: ['Diabetes', 'Obesity']
});

const dropdownData = Object.keys(schemes);

const select = d3.select('body').append('div').text('Color scheme').append('select');
select.attr('id', 'scheme-selection')

const options = select.selectAll('option')
  .data(dropdownData)
  .enter()
  .append('option')
  .text(d => d)
  .attr('value', d => d)
  .attr('selected', d => d === 'BuPu' ? 'selected' : null);

const updateChart = colorKey => {
  const chart = bivariateChoropleth(data, us, {
    svgId: 'bivariate-choropleth',
    colorKey: colorKey
  });

  d3.select('#bivariate-choropleth').remove();
  d3.select('body').append(() => chart);

  return chart;
}

// initial state
updateChart(d3.select('#scheme-selection').node().value);

// when updated
select.on('change', () => {
  updateChart(d3.select('#scheme-selection').node().value);
});