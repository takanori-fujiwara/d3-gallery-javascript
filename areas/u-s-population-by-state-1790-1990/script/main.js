/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2012–2020 Mike Bostock
// Released under the ISC license.
// https://observablehq.com/@mbostock/u-s-population-by-state-1790-1990

import {
  uSPopulationByState17901990
} from './chart.js';

import {
  swatches
} from './legend.js';

const regions = await d3.csv('https://raw.githubusercontent.com/cphalpert/census-regions/7bdc6aa1cb0892361e90ce9ad54983041c2ad015/us%20census%20bureau%20regions%20and%20divisions.csv');
const regionByState = new Map(regions.map(d => [d.State, d.Division]));
const regionRank = [
  'New England',
  'Middle Atlantic',
  'South Atlantic',
  'East South Central',
  'West South Central',
  'East North Central',
  'West North Central',
  'Mountain',
  'Pacific'
];

const years = d3.range(1790, 2000, 10);

const states = d3.tsvParse(await d3.text('./data/population.tsv'), (d, i) => i === 0 ? null : ({
  name: d[''],
  values: years.map(y => +d[y].replace(/,/g, '') || 0)
}));
states.sort((a, b) => d3.ascending(regionRank.indexOf(regionByState.get(a.name)), regionRank.indexOf(regionByState.get(b.name))) || d3.descending(d3.sum(a.values), d3.sum(b.values)));

const data = Object.assign(years.map((y, i) => Object.fromEntries([
  ['date', new Date(Date.UTC(y, 0, 1))]
].concat(states.map(s => [s.name, s.values[i]])))), {
  columns: ['date', ...states.map(s => s.name)]
});


const chart = uSPopulationByState17901990(data, regionRank, regionByState);

d3.select('body').append(() => chart);

swatches(chart.scales.color, {
  nColumns: 5,
  textWidth: 130
});