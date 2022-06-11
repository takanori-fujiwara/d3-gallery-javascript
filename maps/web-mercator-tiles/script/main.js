// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  webMercatorTiles1,
  webMercatorTiles2,
  webMercatorTiles3,
  webMercatorTiles4,
  webMercatorTiles5
} from './chart.js';

const mapboxAccessToken = '';
const url = (x, y, z) => `https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/${z}/${x}/${y}${devicePixelRatio > 1 ? '@2x' : ''}?access_token=${mapboxAccessToken}`;

const land = await d3.json('./data/land-50m.json')
  .then(topology => topojson.feature(topology, topology.objects.land));
const detroit = await d3.json('./data/detroit.json')
  .then(topology => topojson.feature(topology, topology.objects.detroit));

const chart1 = webMercatorTiles1(land);
d3.select('body').append('div').style('margin-bottom', 10).append(() => chart1);

if (!mapboxAccessToken) {
  d3.select('body').append('div').html('<p>To show other charts, get an access token from <a href="https://mapbox.com/">https://mapbox.com/</a> and set it into "mapboxAccessToken" in main.js.</p>');
} else {
  const chart2 = webMercatorTiles2(url);
  const chart3 = webMercatorTiles3(url);
  const chart4 = webMercatorTiles4(land, url);
  const chart5 = webMercatorTiles5(detroit, url);
  d3.select('body').append('div').style('margin-bottom', 10).append(() => chart2);
  d3.select('body').append('div').style('margin-bottom', 10).append(() => chart3);
  d3.select('body').append('div').style('margin-bottom', 10).append(() => chart4);
  d3.select('body').append('div').style('margin-bottom', 10).append(() => chart5);
}