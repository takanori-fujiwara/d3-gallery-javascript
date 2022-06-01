/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2018–2020 Mike Bostock
// Released under the ISC license.
// https://observablehq.com/@mbostock/global-temperature-trends

import {
  globalTemperatureTrends
} from './chart.js';

const data = [];
// https://data.giss.nasa.gov/gistemp/tabledata_v3/GLB.Ts+dSST.csv
await d3.csvParse(await d3.text('./data/temperatures.csv'), (d, _, columns) => {
  for (let i = 1; i < 13; ++i) {
    data.push({
      date: new Date(Date.UTC(d.Year, i - 1, 1)),
      value: +d[columns[i]]
    });
  }
});

const chart = globalTemperatureTrends(data);

d3.select('body').append(() => chart);