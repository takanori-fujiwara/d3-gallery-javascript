/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2019-2020 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/world-map

import {
  context2d
} from './dom-context2d.js';

import {
  projections
} from './map-projections.js';

export const worldMap = (world, {
  canvasId = 'world-map',
  width = 600,
  projectionKey = 'orthographic'
} = {}) => {
  const projection = projections[projectionKey](); // need () to call a function

  const land = topojson.feature(world, world.objects.land);
  const graticule = d3.geoGraticule10();
  const outline = {
    type: 'Sphere'
  };

  const fitWidth = projection => {
    const [
      [x0, y0],
      [x1, y1]
    ] = d3.geoPath(projection.fitWidth(width, outline)).bounds(outline);
    const dy = Math.ceil(y1 - y0),
      l = Math.min(Math.ceil(x1 - x0), dy);
    projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
    return dy;
  }

  const render = projection => {
    const path = d3.geoPath(projection, context);
    context.save();
    context.beginPath(), path(outline), context.clip(), context.fillStyle = '#fff', context.fillRect(0, 0, width, height);
    context.beginPath(), path(graticule), context.strokeStyle = '#ccc', context.stroke();
    context.beginPath(), path(land), context.fillStyle = '#000', context.fill();
    context.restore();
    context.beginPath(), path(outline), context.strokeStyle = '#000', context.stroke();
    return context.canvas;
  }

  const height = fitWidth(projection);
  const context = context2d(width, height);
  context.canvas.id = canvasId;

  render(projection);

  return context.canvas;
}