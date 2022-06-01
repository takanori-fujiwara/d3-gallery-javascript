/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2018-2020 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/ridgeline-plot

import {
  ridgelinePlot
} from './chart.js';

const csvData = await d3.csv('./data/traffic.csv', d3.autoType);
const dates = Array.from(d3.group(csvData, d => +d.date).keys()).sort(d3.ascending);
const data = {
  dates: dates.map(d => new Date(d)),
  series: d3.groups(csvData, d => d.name).map(([name, values]) => {
    const value = new Map(values.map(d => [+d.date, d.value]));
    return {
      name,
      values: dates.map(d => value.get(d))
    };
  })
};

const chart = ridgelinePlot(data);

d3.select('body').append(() => chart);