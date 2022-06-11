/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2019–2020 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/web-mercator-tiles
// > ISC License
//
// >Permission to use, copy, modify, and/or distribute this software for any
// >purpose with or without fee is hereby granted, provided that the above
// >copyright notice and this permission notice appear in all copies.>
//
// >THE SOFTWARE IS PROVIDED 'AS IS' AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// >WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// >MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// >ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// >WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// >ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// >OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

export const webMercatorTiles1 = (land, {
  width = 512,
  height = width,
  projection = d3.geoMercator()
  .center([0, 0])
  .translate([width / 2, height / 2])
  .scale(width / (2 * Math.PI))
} = {}) => {
  const svg = d3.create('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height]);
  svg.append('path')
    .attr('d', `${d3.geoPath(projection)(land)}`);

  return svg.node();
}

const _mercatorSize = () => {
  return (
    scale => scale * (2 * Math.PI)
  )
}

const _mercatorScale = () => {
  return (
    size => size / (2 * Math.PI)
  )
}

export const webMercatorTiles2 = (url, {
    width = 256,
    height = width
  } = {}) => d3.create('img')
  .attr('width', width)
  .attr('height', height)
  .attr('src', `${url(0, 0, 0)}`).node();

export const webMercatorTiles3 = (url, {
  width = 512,
  height = width
} = {}) => {
  const div = d3.create('div')
    .style('position', 'relative')
    .style('width', width)
    .style('height', height);
  div.html(`
    <img src='${url(0, 0, 1)}' style='position: absolute; top: 0px; left: 0px;' width='${width/2}' height='${height/2}'>
    <img src='${url(1, 0, 1)}' style='position: absolute; top: 0px; left: ${width/2}px;' width='${width/2}' height='${height/2}'>
    <img src='${url(0, 1, 1)}' style='position: absolute; top: ${height/2}px; left: 0px;' width='${width/2}' height='${height/2}'>
    <img src='${url(1, 1, 1)}' style='position: absolute; top: ${height/2}px; left: ${width/2}px;' width='${width/2}' height='${height/2}'>`);

  return div.node();
}

export const webMercatorTiles4 = (land, url, {
  width = 512,
  height = width,
  projection = d3.geoMercator()
  .center([0, 0])
  .translate([width / 2, height / 2])
  .scale(width / (2 * Math.PI))
} = {}) => {
  const div = d3.create('div')
    .style('position', 'relative')
    .style('width', width)
    .style('height', height);
  div.html(`
    <img src='${url(0, 0, 1)}' style='position: absolute; top: 0px; left: 0px;' width='${width/2}' height='${height/2}'>
    <img src='${url(1, 0, 1)}' style='position: absolute; top: 0px; left: ${width/2}px;' width='${width/2}' height='${height/2}'>
    <img src='${url(0, 1, 1)}' style='position: absolute; top: ${height/2}px; left: 0px;' width='${width/2}' height='${height/2}'>
    <img src='${url(1, 1, 1)}' style='position: absolute; top: ${height/2}px; left: ${width/2}px;' width='${width/2}' height='${height/2}'>
    <svg width='${width}' height='${height}' style='position: relative;'>
      <path fill='none' stroke='red' d='${d3.geoPath(projection)(land)}' />
    </svg>`);

  return div.node();
}

export const webMercatorTiles5 = (detroit, url, {
  width = 720,
  height = Math.min(width, 720),
  projection = d3.geoMercator().fitSize([width, height], detroit),
  tile = d3.tile()
  .size([width, height])
  .scale(projection.scale() * 2 * Math.PI)
  .translate(projection([0, 0])),
  path = d3.geoPath(projection)
} = {}) => {
  const svg = d3.create('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height]);

  const images = tile().map(([x, y, z], i, {
    translate: [tx, ty],
    scale: k
  }) => `<image xlink:href='${url(x, y, z)}' x='${(x + tx) * k}' y='${(y + ty) * k}' width='${k}' height='${k}' />`);

  svg.html(images.join('') +
    `<path fill='none' stroke='red' d='${path(detroit)}'/>`);

  return svg.node();
}