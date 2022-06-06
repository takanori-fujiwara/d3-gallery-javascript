/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2019-2020 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/vector-field

import {
  context2d
} from './dom-context2d.js';

export const vectorField = (data, world, {
  svgId = 'vector-field',
  width = 975,
  margin = 10,
  projection = d3.geoEquirectangular(),
  color = d3.scaleSequential([0, 360], d3.interpolateRainbow)
} = {}) => {
  const land = topojson.feature(world, world.objects.land);
  const scale = d3.scaleSqrt([0, d3.max(data, d => d.speed)], [0, 2]);

  const fitWidth = () => {
    const points = {
      type: 'MultiPoint',
      coordinates: data.map(d => [d.longitude, d.latitude])
    };
    const [
      [x0, y0],
      [x1, y1]
    ] = d3.geoPath(projection.fitWidth(width - margin * 2, points)).bounds(points);
    const [tx, ty] = projection.translate();
    const height = Math.ceil(y1 - y0);
    projection.translate([tx + margin, ty + margin]);
    return height + margin * 2;
  }

  const height = fitWidth(width);

  const context = context2d(width, height);
  const path = d3.geoPath(projection, context);
  context.canvas.style.maxWidth = '100%';
  context.fillRect(0, 0, width, height);
  context.strokeStyle = '#eee';
  context.lineWidth = 1.5;
  context.lineJoin = 'round';
  context.beginPath(), path(land), context.stroke();

  for (const {
      longitude,
      latitude,
      speed,
      dir
    } of data) {
    context.save();
    context.translate(...projection([longitude, latitude]));
    context.scale(scale(speed), scale(speed));
    context.rotate(dir * Math.PI / 180);
    context.beginPath();
    context.moveTo(-2, -2);
    context.lineTo(2, -2);
    context.lineTo(0, 8);
    context.closePath();
    context.fillStyle = color(dir);
    context.fill();
    context.restore();
  }
  return context.canvas;
};