/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2012–2020 Mike Bostock
// Released under the ISC license.
// https://observablehq.com/@d3/solar-terminator
// > ISC License
// >Permission to use, copy, modify, and/or distribute this software for any
// >purpose with or without fee is hereby granted, provided that the above
// >copyright notice and this permission notice appear in all copies.>
//
// >THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// >WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// >MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// >ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// >WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// >ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// >OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

import {
  context2d
} from './dom-context2d.js';

import * as solar from './solar-calculator.js';

export const solarTerminator = (world, {
  width = 800,
  projection = d3.geoNaturalEarth1(),
  graticule = d3.geoGraticule10(),
  sphere = {
    type: 'Sphere'
  }
} = {}) => {
  const fitWidth = width => {
    const [
      [x0, y0],
      [x1, y1]
    ] = d3.geoPath(projection.fitWidth(width, sphere)).bounds(sphere);
    const dy = Math.ceil(y1 - y0),
      l = Math.min(Math.ceil(x1 - x0), dy);
    projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
    return dy;
  }

  const height = fitWidth(width);

  const now = new Date;
  const day = new Date(+now).setUTCHours(0, 0, 0, 0);
  const t = solar.century(now);
  const longitude = (day - now) / 864e5 * 360 - 180;
  const antipode = ([longitude, latitude]) => [longitude + 180, -latitude];
  const sun = [longitude - solar.equationOfTime(t) / 4, solar.declination(t)];
  const night = d3.geoCircle()
    .radius(90)
    .center(antipode(sun))();

  const land = topojson.feature(world, world.objects.land);

  const context = context2d(width, height);
  const path = d3.geoPath(projection, context);
  context.beginPath(), path(graticule), context.strokeStyle = '#ccc', context.stroke();
  context.beginPath(), path(land), context.fillStyle = '#000', context.fill();
  context.beginPath(), path(night), context.fillStyle = 'rgba(0,0,255,0.3)', context.fill();
  context.beginPath(), path(sphere), context.strokeStyle = '#000', context.stroke();

  return context.canvas;
}