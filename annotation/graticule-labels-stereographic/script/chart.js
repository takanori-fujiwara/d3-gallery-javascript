/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2019 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/graticule-labels-stereographic

import {
  uid
} from './dom-uid.js';

const formatLatitude = y => `${Math.abs(y)}°${y < 0 ? 'S' : 'N'}`;
const formatLongitude = x => `${Math.abs(x)}°${x < 0 ? 'W' : 'E'}`;

const computeHeight = (projection, width, outline, marginTop, marginRight, marginBottom, marginLeft) => {
  const [
    [x0, y0],
    [x1, y1]
  ] = d3.geoPath(projection.fitWidth(width, outline)).bounds(outline);
  const dx = x1 - x0;
  const k = (dx - marginLeft - marginRight) / dx;
  const dy = (y1 - y0) * k + marginBottom + marginTop;
  projection.scale(projection.scale() * k);
  projection.translate([(dx + marginLeft - marginRight) / 2, (dy + marginTop - marginBottom) / 2]);
  projection.precision(0.2);
  return Math.round(dy);
}

export const graticuleLabelsStereographic = (world, {
  width = 600,
  longitude = -100,
  marginTop = 30,
  marginRight = 40,
  marginBottom = 30,
  marginLeft = 40
} = {}) => {
  const land = topojson.feature(world, world.objects.land);
  const projection = d3.geoStereographic().rotate([-longitude, 0]);
  const outline = d3.geoCircle().radius(90).center([longitude, 0])();
  const graticule = d3.geoGraticule10();
  const path = d3.geoPath(projection);

  const height = computeHeight(projection, width, outline,
    marginTop, marginRight, marginBottom, marginLeft);

  const offset = ([x, y], k) => {
    const [cx, cy] = projection.translate();
    const dx = x - cx,
      dy = y - cy;
    k /= Math.hypot(dx, dy);
    return [x + dx * k, y + dy * k];
  }

  const clipIn = uid();
  const clipOut = uid();

  const svgHTML = `<svg width=${width} height=${height} viewBox='0 0 ${width} ${height}' style='display:block;'>
  <defs>
    <clipPath id='${clipIn.id}'><path d='${path(outline)}'></path></clipPath>
    <clipPath id='${clipOut.id}'><path d='M0,0V${height}H${width}V0Z${path(outline)}'></path></clipPath>
  </defs>
  <path d='${path(graticule)}' stroke='#ccc' fill='none'></path>
  <path clip-path='url(#${clipIn.id})' d='${path(land)}'></path>
  <path fill-opacity='0.1' clip-path='url(#${clipOut.id})' d='${path(land)}'></path>
  <path d='${path(outline)}' stroke='#000' fill='none'></path>
  <g font-size='10' font-family='sans-serif' text-anchor='middle'>
    ${d3.range(-80, 80 + 1, 10).map(y => `
    <text transform='translate(${offset(projection([longitude + 90, y]), 10) + ''})' dy='0.35em' x='6'>${formatLatitude(y)}</text>
    <text transform='translate(${offset(projection([longitude - 90, y]), 10) + ''})' dy='0.35em' x='-6'>${formatLatitude(y)}</text>`)}
  </g>
</svg>`;

  const svg = d3.create('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .html(svgHTML);

  return svg.node();
}