import {
  stackedBarChart
} from './chart.js';

import {
  legend
} from './legend.js';


const states = await d3.csv('./data/us-population-state-age.csv');
const ages = states.columns.slice(1);
const stateages = ages.flatMap(age => states.map(d => ({
  state: d.name,
  age,
  population: d[age]
}))); // pivot longer

const chart = stackedBarChart(stateages, {
  x: d => d.state,
  y: d => d.population / 1e6,
  z: d => d.age,
  xDomain: d3.groupSort(stateages, D => d3.sum(D, d => -d.population), d => d.state),
  yLabel: "↑ Population (millions)",
  zDomain: ages,
  colors: d3.schemeSpectral[ages.length],
  width: 1000,
  height: 500
});

const chartLegend = legend(chart.scales.color, {
  title: 'Age (years)'
})

d3.select('body').append(() => chart);
d3.select('body').append(() => chartLegend);