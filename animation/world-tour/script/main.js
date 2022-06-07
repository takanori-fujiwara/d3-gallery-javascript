// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  worldTour
} from './chart.js';

const world = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')

const chartWidth = 800;
const chart = worldTour(world, {
  width: chartWidth
});

const countryNameInfo = d3.select('body').append('b')
  .style('display', 'block')
  .style('width', chartWidth)
  .style('text-align', 'center');

d3.select('body').append(() => chart);


const updateChart = async () => {
  const countryAndName = chart.updateCountry();
  const name = countryAndName.name;
  const country = countryAndName.country;

  if (name) {
    countryNameInfo.text(name);
    await chart.updateRender(country);
  }
}

updateChart();
const interval = setInterval(updateChart, 3000);