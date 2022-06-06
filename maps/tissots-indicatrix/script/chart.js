/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/tissots-indicatrix

import {
  context2d
} from './dom-context2d.js';

import {
  projections
} from './map-projections.js';

export const tissotsIndicatrix = (world, {
  canvasId = 'tissots-indicatrix',
  width = 800,
  projectionKey = 'American polyconic'
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

  const prepareCircles = () => {
    const step = 10;
    const circle = d3.geoCircle().center(d => d).radius(step / 4).precision(10);
    const coordinates = [];
    for (let y = -80; y <= 80; y += step) {
      for (let x = -180; x < 180; x += step) {
        coordinates.push(circle([x, y]).coordinates);
      }
    }
    return {
      type: 'MultiPolygon',
      coordinates
    };
  }

  const circles = prepareCircles();

  const render = projection => {
    const path = d3.geoPath(projection, context);
    context.save();
    context.beginPath(), path(outline), context.clip(), context.fillStyle = '#fff', context.fillRect(0, 0, width, height);
    context.beginPath(), path(graticule), context.strokeStyle = '#ccc', context.stroke();
    context.beginPath(), path(land), context.fillStyle = '#000', context.fill();
    context.beginPath(), path(circles), context.strokeStyle = '#f00', context.stroke();
    context.restore();
    context.beginPath(), path(outline), context.strokeStyle = '#000', context.stroke();
  }

  const height = fitWidth(projection);
  const context = context2d(width, height);
  context.canvas.id = canvasId;

  render(projection);

  return context.canvas;
};