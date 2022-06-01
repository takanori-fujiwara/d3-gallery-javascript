// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  mobilePatentSuits
} from './chart.js';

import {
  swatches
} from './legend.js';

const links = await d3.csv('./data/suits.csv');
const data = {
  nodes: Array.from(new Set(links.flatMap(l => [l.source, l.target])), id => ({
    id
  })),
  links
};

const chart = mobilePatentSuits(data);

d3.select('body').append(() => chart);

console.log(chart.scales.color);
swatches(chart.scales.color);