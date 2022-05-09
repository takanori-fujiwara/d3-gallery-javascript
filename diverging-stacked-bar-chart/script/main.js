/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/diverging-stacked-bar-chart

import {
  stackedBarChart
} from './chart.js';

import {
  legend
} from './legend.js';

// A map to convert PoltiFact codes into readable names, and whether
// the codes represent lies (negative) or truths (positive).
const rulings = {
  'pants-fire': {
    name: 'Pants on fire!',
    sign: -1
  },
  'false': {
    name: 'False',
    sign: -1
  },
  'mostly-false': {
    name: 'Mostly false',
    sign: -1
  },
  'barely-true': {
    name: 'Mostly false',
    sign: -1
  }, // pessimistic
  'half-true': {
    name: 'Half true',
    sign: 1
  },
  'mostly-true': {
    name: 'Mostly true',
    sign: 1
  },
  'true': {
    name: 'True',
    sign: 1
  }
};

// The PoltiFact data includes categories we don’t want to consider (namely
// full-flop, which isn’t really true or false), so filter.
const data = (await d3.csv('../data/politifact.csv')).filter(d => d.ruling in rulings);;

// Compute the total number of rulings for each speaker.
const total = d3.rollup(data, D => d3.sum(D, d => d.count), d => d.speaker);

// Lastly, convert the counts to signed counts (negative for lies, positive for
// truths), and compute the normalized counts (bias; -1 for all lies, +1 for all
// truths). The returned array has an extra “rulings” property which we use to
// see the z-domain of the chart for stable ordering and color.
const politifact = Object.assign(data.map(d => ({
  speaker: d.speaker,
  ruling: rulings[d.ruling].name,
  count: d.count * rulings[d.ruling].sign,
  proportion: d.count / total.get(d.speaker) * rulings[d.ruling].sign
})), {
  rulings: [...d3.union(Object.values(rulings).map(d => d.name))]
});

const chart = stackedBarChart(politifact, {
  x: d => d.proportion,
  y: d => d.speaker,
  z: d => d.ruling,
  xFormat: '+%',
  xLabel: '← more lies · Truthiness · more truths →',
  yDomain: d3.groupSort(politifact, D => d3.sum(D, d => -Math.min(0, d.proportion)), d => d.speaker),
  zDomain: politifact.rulings,
  colors: d3.schemeSpectral[politifact.rulings.length],
  marginLeft: 70
});

// TODO: implement "swatches"
legend(chart.scales.color)