// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  lineChart
} from './chart.js';

const unemployment = await d3.csv('./data/bls-metro-unemployment.csv', d3.autoType);

const form = d3.select('body').append('form').text('Show voronoi');
form.append('input')
  .attr('type', 'checkbox')
  .attr('id', 'voronoi')
  .property('checked', false);

const updateChart = (voronoi) => {
  lineChart(unemployment, {
    x: d => d.date,
    y: d => d.unemployment,
    z: d => d.division,
    yLabel: "↑ Unemployment (%)",
    width: 800,
    height: 500,
    color: "steelblue",
    voronoi: voronoi // if true, show Voronoi overlay
  })
}

// initial state
updateChart(d3.select('input[id="voronoi"]').property("checked"));

// when updated
form.on('change', () => {
  updateChart(d3.select('input[id="voronoi"]').property("checked"));
});