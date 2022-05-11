// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  musicChart
} from './chart.js';

import {
  legend
} from './legend.js';

const musicData = await fetch('./data/music.csv')
  .then(response => response.text())
  .then(csvText => Object.assign(d3.csvParse(csvText, ({
    Format,
    Year,
    ["Revenue (Inflation Adjusted)"]: Revenue
  }) => ({
    name: Format,
    year: +Year,
    value: +Revenue
  })), {
    y: "Revenue (billions, adj.)"
  }));

const chart = musicChart(musicData);

// TODO: implement swatches
legend(
  chart.scales.color, {
    width: 4000,
    marginLeft: 30
  })