// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  scatterplotMatrix
} from './chart.js';

import {
  swatches
} from './legend.js';

const penguins = await d3.csv('./data/penguins.csv', d3.autoType);

const chart = scatterplotMatrix(penguins, {
  columns: [
    'culmen_length_mm',
    'culmen_depth_mm',
    'flipper_length_mm',
    'body_mass_g'
  ],
  z: d => d.species
});

const chartSwatches = swatches(chart.scales.color)

d3.select('body').append(() => chart);
d3.select('body').append(() => chartSwatches);