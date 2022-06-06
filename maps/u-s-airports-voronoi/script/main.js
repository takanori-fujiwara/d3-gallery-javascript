// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  usAirportsVoronoi
} from './chart.js';

const data = d3.csvParse(await d3.text('./data/airports.csv'), d => ({
  type: 'Feature',
  properties: d,
  geometry: {
    type: 'Point',
    coordinates: [+d.longitude, +d.latitude]
  }
}));

const us = await d3.json('./data/states-albers-10m.json');

const chart = usAirportsVoronoi(data, us);

d3.select('body').append(() => chart);