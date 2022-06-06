/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2018-2020 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/world-airports-voronoi

import {
  context2d
} from './dom-context2d.js';

export const worldAirportsVoronoi = (points, {
  svgId = 'world-airports-voronoi',
  width = 700,
  height = width
} = {}) => {
  const mesh = d3.geoVoronoi(points).cellMesh();
  const graticule = d3.geoGraticule10();
  const sphere = {
    type: 'Sphere'
  };
  const projection = d3.geoOrthographic()
    .fitExtent([
      [1, 1],
      [width - 1, height - 1]
    ], sphere)
    .rotate([0, -30]);

  const context = context2d(width, height);
  const path = d3.geoPath(projection, context).pointRadius(1.5);

  const render = () => {
    context.clearRect(0, 0, width, height);

    context.beginPath();
    path(graticule);
    context.lineWidth = 0.5;
    context.strokeStyle = '#aaa';
    context.stroke();

    context.beginPath();
    path(mesh);
    context.lineWidth = 0.5;
    context.strokeStyle = '#000';
    context.stroke();

    context.beginPath();
    path(sphere);
    context.lineWidth = 1.5;
    context.strokeStyle = '#000';
    context.stroke();

    context.beginPath();
    path({
      type: 'MultiPoint',
      coordinates: points
    });
    context.fillStyle = '#f00';
    context.fill();
  }

  render();
  return context.canvas;
}