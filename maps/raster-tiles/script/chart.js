/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2019-2020 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/raster-tiles

export const tileUrls = {
  'CartoDB Voyager': (x, y, z) => `https://${'abc'[Math.abs(x + y) % 3]}.basemaps.cartocdn.com/rastertiles/voyager/${z}/${x}/${y}${devicePixelRatio > 1 ? '@2x' : ''}.png`,
  'Stamen Terrain': (x, y, z) => `https://stamen-tiles-${'abc'[Math.abs(x + y) % 3]}.a.ssl.fastly.net/terrain/${z}/${x}/${y}${devicePixelRatio > 1 ? '@2x' : ''}.png`,
  'Stamen Toner': (x, y, z) => `https://stamen-tiles-${'abc'[Math.abs(x + y) % 3]}.a.ssl.fastly.net/toner/${z}/${x}/${y}${devicePixelRatio > 1 ? '@2x' : ''}.png`,
  'Stamen Toner (hybrid)': (x, y, z) => `https://stamen-tiles-${'abc'[Math.abs(x + y) % 3]}.a.ssl.fastly.net/toner-hybrid/${z}/${x}/${y}${devicePixelRatio > 1 ? '@2x' : ''}.png`,
  'Stamen Toner (lite)': (x, y, z) => `https://stamen-tiles-${'abc'[Math.abs(x + y) % 3]}.a.ssl.fastly.net/toner-lite/${z}/${x}/${y}${devicePixelRatio > 1 ? '@2x' : ''}.png`,
  'Stamen Watercolor': (x, y, z) => `https://stamen-tiles-${'abc'[Math.abs(x + y) % 3]}.a.ssl.fastly.net/watercolor/${z}/${x}/${y}.png`,
  'OSM Mapnik': (x, y, z) => `https://${'abc'[Math.abs(x + y) % 3]}.tile.osm.org/${z}/${x}/${y}.png`,
  'Wikimedia Maps': (x, y, z) => `https://maps.wikimedia.org/osm-intl/${z}/${x}/${y}.png`
};

export const rasterTiles = ({
  svgId = 'raster-tiles',
  width = 800,
  height = 600,
  tileUrlKey = 'Stamen Toner (lite)'
} = {}) => {
  const url = tileUrls[tileUrlKey];

  const projection = d3.geoMercator()
    .center([-122.4183, 37.7750])
    .scale(Math.pow(2, 21) / (2 * Math.PI))
    .translate([width / 2, height / 2]);

  const tile = d3.tile()
    .size([width, height])
    .scale(projection.scale() * 2 * Math.PI)
    .translate(projection([0, 0]));

  const tiles = tile();

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height]);

  svg.selectAll('image')
    .data(tiles)
    .join('image')
    .attr('xlink:href', d => url(d[0], d[1], d[2]))
    .attr('x', d => Math.round((d[0] + tiles.translate[0]) * tiles.scale))
    .attr('y', d => Math.round((d[1] + tiles.translate[1]) * tiles.scale))
    .attr('width', tiles.scale)
    .attr('height', tiles.scale);

  return svg.node();
}