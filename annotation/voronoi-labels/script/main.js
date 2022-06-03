// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  voronoiLabels
} from './chart.js';


const width = 800;
const height = 600;
const randomX = d3.randomNormal(width / 2, 80);
const randomY = d3.randomNormal(height / 2, 80);
const data = d3.range(200)
  .map(() => ([randomX(), randomY()]))
  .filter(d => 0 <= d[0] && d[0] <= width && 0 <= d[1] && d[1] <= height);

const chart = voronoiLabels(data, {
  width: width,
  height: height
});

d3.select('body').append(() => chart);