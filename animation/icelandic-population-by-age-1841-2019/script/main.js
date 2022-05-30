// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  icelandicPopulationByAge18412019
} from './chart.js';

import {
  scrubber
} from './scrubber.js';

import {
  swatches
} from './legend.js';

const data = Object.assign((await d3.csv('./data/icelandic-population.csv', d3.autoType)), {
  x: '← Age',
  y: 'Population ↑'
});

const delay = 250;
const chart = icelandicPopulationByAge18412019(data, {
  delay: delay
});

const years = Array.from(d3.group(data, d => d.year), ([key]) => key).sort(d3.ascending);

const scrubberForm = scrubber(years, {
  chartUpdate: index => chart.update(years[index]),
  delay: delay,
  loop: false
});

d3.select('body').append(() => scrubberForm.node());
d3.select('body').append(() => chart);

swatches(chart.scales.color, {
  format: x => ({
    M: "Male",
    F: "Female"
  } [x])
})