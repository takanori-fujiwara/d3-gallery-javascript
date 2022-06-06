/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2019-2020 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/clipped-map-tiles

export const clippedMapTiles = (land, {
  accessToken,
  svgId = 'clipped-map-tiles',
  width = 975
} = {}) => {
  if (!accessToken) {
    const svg = d3.create('div').html('Set mapbox\'s Accesss Token in main.js. Get an Access Token <a href="https://www.mapbox.com/">here</a>');
    return svg.node();
  }

  const url = (x, y, z) => `https://${'abc'[Math.abs(x + y) % 3]}.tiles.mapbox.com/v4/mapbox.natural-earth-2/${z}/${x}/${y}${devicePixelRatio > 1 ? '@2x' : ''}.png?access_token=${accessToken}`;

  const projection = d3.geoMercator();
  const path = d3.geoPath(projection);

  const fitWidth = width => {
    const [
      [x0, y0],
      [x1, y1]
    ] = d3.geoPath(projection.fitWidth(width, land)).bounds(land);
    const dy = Math.ceil(y1 - y0),
      l = Math.min(Math.ceil(x1 - x0), dy);
    projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
    return dy;
  }

  const height = fitWidth(width);

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
  const defs = svg.append('defs');
  defs.append('path')
    .attr('id', 'land')
    .attr('d', path(land));
  defs.append('clippath')
    .attr('id', 'clip')
    .append('use')
    .attr('xlink:href', `${location}#land`);

  const clipPath = svg.append('g')
    .attr('clip-path', `url(${location}#clip)`);
  clipPath.selectAll('.images')
    .data(tiles)
    .join(enter => {
      enter
        .append('image')
        .attr('xlink:href', d => url(d[0], d[1], d[2]))
        .attr('x', d => Math.round((d[0] + tiles.translate[0]) * tiles.scale - 0.5))
        .attr('y', d => Math.round((d[1] + tiles.translate[1]) * tiles.scale - 0.5))
        .attr('width', tiles.scale + 1)
        .attr('height', tiles.scale + 1);
      enter
        .append('image')
        .attr('xlink:href', d => url(d[0], d[1], d[2]))
        .attr('x', d => Math.round((d[0] + tiles.translate[0]) * tiles.scale))
        .attr('y', d => Math.round((d[1] + tiles.translate[1]) * tiles.scale))
        .attr('width', tiles.scale)
        .attr('height', tiles.scale);
    });
  svg.append('use')
    .attr('xlink:href', `${location}#land`)
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', 0.5);

  return svg.node();
}