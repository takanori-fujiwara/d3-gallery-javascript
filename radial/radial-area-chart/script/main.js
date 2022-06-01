/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2019 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/radial-area-chart

import {
  radialAreaChart
} from './chart.js';

const rawdata = await d3.csv('./data/sfo-temperature.csv', d3.autoType);
const data = Array.from(d3.rollup(
    rawdata,
    v => ({
      date: new Date(Date.UTC(2000, v[0].DATE.getUTCMonth(), v[0].DATE.getUTCDate())),
      avg: d3.mean(v, d => d.TAVG || NaN),
      min: d3.mean(v, d => d.TMIN || NaN),
      max: d3.mean(v, d => d.TMAX || NaN),
      minmin: d3.min(v, d => d.TMIN || NaN),
      maxmax: d3.max(v, d => d.TMAX || NaN)
    }),
    d => `${d.DATE.getUTCMonth()}-${d.DATE.getUTCDate()}`
  ).values())
  .sort((a, b) => d3.ascending(a.date, b.date));

const chart = radialAreaChart(data);

d3.select('body').append(() => chart);