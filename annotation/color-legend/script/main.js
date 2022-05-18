/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2021, Observable Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/color-legend

import {
  legend,
  swatches
} from './legend.js';

legend(d3.scaleSequential([0, 100], d3.interpolateViridis), {
  id: 'legend-interpolateViridis',
  title: 'Temperature (°F)'
});

legend(d3.scaleSequentialSqrt([0, 1], d3.interpolateTurbo), {
  id: 'legend-interpolateTurbo',
  title: 'Speed (kts)'
});

legend(d3.scaleDiverging([-0.1, 0, 0.1], d3.interpolatePiYG), {
  id: 'legend-interpolatePiYG',
  title: 'Daily change',
  tickFormat: '+%'
});

legend(d3.scaleDivergingSqrt([-0.1, 0, 0.1], d3.interpolateRdBu), {
  id: 'legend-interpolateRdBu',
  title: 'Daily change',
  tickFormat: '+%'
});

legend(d3.scaleSequentialLog([1, 100], d3.interpolateBlues), {
  id: 'legend-interpolateBlues',
  title: 'Energy (joules)',
  ticks: 10
});

legend(d3.scaleSequentialQuantile(d3.range(100).map(() => Math.random() ** 2), d3.interpolateBlues), {
  id: 'legend-interpolateBlues2',
  title: 'Quantile',
  tickFormat: '.2f'
});

legend(d3.scaleSqrt([-100, 0, 100], ['blue', 'white', 'red']), {
  id: 'legend-bwr',
  title: 'Temperature (°C)'
});

legend(d3.scaleQuantize([1, 10], d3.schemePurples[9]), {
  id: 'legend-schemePurples',
  title: 'Unemployment rate (%)'
});

legend(d3.scaleQuantile(d3.range(1000).map(d3.randomNormal(100, 20)), d3.schemeSpectral[9]), {
  id: 'legend-schemeSpectral',
  title: 'Height (cm)',
  tickFormat: '.0f'
})

legend(d3.scaleThreshold([2.5, 3.1, 3.5, 3.9, 6, 7, 8, 9.5], d3.schemeRdBu[9]), {
  id: 'legend-schemeRdBu',
  title: 'Unemployment rate (%)',
  tickSize: 0
});

legend(d3.scaleOrdinal(['<10', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '≥80'], d3.schemeSpectral[10]), {
  id: 'legend-schemeSpectral-ordinal',
  title: 'Age (years)',
  tickSize: 0
});

swatches(d3.scaleOrdinal(['blueberries', 'oranges', 'apples'], d3.schemeCategory10), {
  id: 'swatches-schemeCategory10'
})

swatches(d3.scaleOrdinal(['Wholesale and Retail Trade', 'Manufacturing', 'Leisure and hospitality', 'Business services', 'Construction', 'Education and Health', 'Government', 'Finance', 'Self-employed', 'Other'], d3.schemeTableau10), {
  id: 'swatches-schemeTableau10',
  nColumns: 5,
  textWidth: 200
})