/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2019-2020 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/raster-vector

export const rasterVector = (topology, {
  accessToken,
  svgId = 'raster-vector',
  width = 800
} = {}) => {
  if (!accessToken) {
    const svg = d3.create('div').html('Set mapbox\'s Accesss Token in main.js. Get an Access Token <a href="https://www.mapbox.com/">here</a>');
    return svg.node();
  }

  const url = (x, y, z) => `https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/${z}/${x}/${y}${devicePixelRatio > 1 ? "@2x" : ""}?access_token=${accessToken}`;

  const projection = d3.geoMercator();

  const vectors = topojson.feature(topology, topology.objects.detroit);

  const fitWidth = width => {
    const [
      [x0, y0],
      [x1, y1]
    ] = d3.geoPath(projection.fitWidth(width, vectors)).bounds(vectors);
    const height = Math.ceil(y1 - y0);
    const scale = projection.scale() * (2 * Math.PI);
    projection.center(projection.invert([width / 2, height / 2]));
    projection.scale(Math.pow(2, Math.floor(Math.log2(scale))) / (2 * Math.PI));
    projection.translate([width / 2, height / 2]);
    return height;
  };

  const height = fitWidth(width);
  const path = d3.geoPath(projection);
  const tile = d3.tile()
    .size([width, height])
    .scale(projection.scale() * 2 * Math.PI)
    .translate(projection([0, 0]))
    .tileSize(512);

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
  svg.append('path')
    .attr('fill', 'none')
    .attr('stroke', 'red')
    .attr('d', path(vectors));

  return svg.node();
}