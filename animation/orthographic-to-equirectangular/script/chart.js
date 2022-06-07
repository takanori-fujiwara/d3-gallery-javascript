/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2016–2020 Mike Bostock
// Released under the ISC license.
// https://observablehq.com/@d3/orthographic-to-equirectangular

import {
  context2d
} from './dom-context2d.js';

const interpolateProjection = (raw0, raw1) => {
  const mutate = d3.geoProjectionMutator(t => (x, y) => {
    const [x0, y0] = raw0(x, y), [x1, y1] = raw1(x, y);
    return [x0 + t * (x1 - x0), y0 + t * (y1 - y0)];
  });
  let t = 0;
  return Object.assign(mutate(t), {
    alpha(_) {
      return arguments.length ? mutate(t = +_) : t;
    }
  });
}

export const orthographicToEquirectangular = ({
  width = 800,
  height = width / 1.8,
} = {}) => {
  const rotate = d3.interpolate([10, -20], [0, 0]);
  const scale = d3.interpolate(width / 4, (width - 2) / (2 * Math.PI));

  const projection = interpolateProjection(d3.geoOrthographicRaw, d3.geoEquirectangularRaw)
    .scale(scale(0))
    .translate([width / 2, height / 2])
    .rotate(rotate(0))
    .precision(0.1);

  const equator = {
    type: "LineString",
    coordinates: [
      [-180, 0],
      [-90, 0],
      [0, 0],
      [90, 0],
      [180, 0]
    ]
  };

  const sphere = {
    type: "Sphere"
  };

  const graticule = d3.geoGraticule10();

  const context = context2d(width, height);
  const path = d3.geoPath(projection, context);

  const genUpdate = () => {
    let i = 0; // variable in closure
    const n = 480; // variable in closure
    const update = () => {
      const t = d3.easeCubic(2 * i > n ? 2 - 2 * i / n : 2 * i / n);
      projection.alpha(t).rotate(rotate(t)).scale(scale(t));
      context.clearRect(0, 0, width, height);
      context.beginPath();
      path(graticule);
      context.lineWidth = 1;
      context.strokeStyle = "#aaa";
      context.stroke();
      context.beginPath();
      path(sphere);
      context.lineWidth = 1.5;
      context.strokeStyle = "#000";
      context.stroke();
      context.beginPath();
      path(equator);
      context.lineWidth = 1.5;
      context.strokeStyle = "#f00";
      context.stroke();
      i = (i + 1) % n;
    }
    return update;
  }

  const update = genUpdate();
  return Object.assign(context.canvas, {
    update
  });
}