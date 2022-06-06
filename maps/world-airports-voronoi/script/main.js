// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  worldAirportsVoronoi
} from './chart.js';

const points = (await d3.csv('./data/airports.csv', d3.autoType)).map(({
  longitude,
  latitude
}) => [longitude, latitude]);

const chart = worldAirportsVoronoi(points);

d3.select('body').append(() => chart);