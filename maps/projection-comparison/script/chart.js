/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2019-2020 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/projection-comparison

import {
  context2d
} from './dom-context2d.js';

import {
  projections
} from './map-projections.js';

export const projectionComparison = (world, {
  canvasId = 'projection-comparison',
  width = 800,
  redProjectionKey = 'American polyconic',
  blueProjectionKey = 'rectangular polyconic'
} = {}) => {
  const red = projections[redProjectionKey](); // need () to call a function
  const blue = projections[blueProjectionKey](); // need () to call a function

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

  const render = (projection, color) => {
    const path = d3.geoPath(projection, context);
    context.fillStyle = context.strokeStyle = color;
    context.save();
    context.beginPath(), path(outline), context.clip();
    context.beginPath(), path(graticule), context.globalAlpha = 0.3, context.stroke();
    context.beginPath(), path(land), context.globalAlpha = 1.0, context.fill();
    context.restore();
    context.beginPath(), path(outline), context.stroke();
  }

  const heightRed = fitWidth(red);
  const heightBlue = fitWidth(blue);

  const height = Math.max(heightRed, heightBlue);
  const context = context2d(width, height);
  context.canvas.id = canvasId;

  context.fillStyle = '#fff';
  context.fillRect(0, 0, width, height);

  context.save();
  context.translate(0, (height - heightRed) / 2);
  render(red, '#f00');
  context.restore();

  context.save();
  context.globalCompositeOperation = 'multiply';
  context.translate(0, (height - heightBlue) / 2);
  render(blue, '#00f');
  context.restore();

  return context.canvas;
}