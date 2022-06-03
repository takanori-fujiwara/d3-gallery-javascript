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
  x: d => d.population,
  y: d => d.state,
  z: d => d.age,
  yDomain: d3.groupSort(
    stateages,
    (D) => D[0].population / d3.sum(D, d => d.population), // proportion of first age group
    d => d.state // sort y by x
  ),
  zDomain: ages,
  colors: d3.schemeSpectral[ages.length],
  height: 800
});

const chartLegend = legend(chart.scales.color, {
  title: 'Age (years)'
});

d3.select('body').append(() => chart);
d3.select('body').append(() => chartLegend);