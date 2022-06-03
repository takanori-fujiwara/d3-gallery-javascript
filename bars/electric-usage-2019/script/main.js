// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  electricChart
} from './chart.js';

import {
  legend
} from './legend.js';

const electricData = await fetch('./data/pge-electric-data.csv')
  .then(response => response.text())
  .then(csvText => d3.csvParse(csvText, d => ({
    date: d3.timeParse("%Y-%m-%dT%H:%M")(`${d["DATE"]}T${d["START TIME"]}`),
    usage: +d["USAGE"]
  })));

const chart = electricChart(electricData);

const chartLegend = legend(
  chart.scales.color, {
    title: "Net power consumption (kW)",
    tickFormat: "+d",
    width: 360,
    marginLeft: 30
  });

d3.select('body').append(() => chart);
d3.select('body').append(() => chartLegend);