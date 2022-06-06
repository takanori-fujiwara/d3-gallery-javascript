// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  clippedMapTiles
} from './chart.js';

const land = await d3.json('./data/us.json')
  .then(topology => topojson.feature(topology, topology.objects.land))
  .then(land => ({
    type: 'Polygon',
    coordinates: land.geometry.coordinates[0]
  }));

const chart = clippedMapTiles(land, {
  accessToken: null // set mapbox's access token here
});

d3.select('body').append(() => chart);