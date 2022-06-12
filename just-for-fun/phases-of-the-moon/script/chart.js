/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2018–2020 Mike Bostock
// Released under the ISC license.
// https://observablehq.com/@mbostock/phases-of-the-moon
// > ISC License
// > Permission to use, copy, modify, and/or distribute this software for any
// > purpose with or without fee is hereby granted, provided that the above
// > copyright notice and this permission notice appear in all copies.>
//
// > THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// > WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// > MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// > ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// > WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// > ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// > OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

import * as suncalc from './suncalc.js';

export const phasesOfTheMoon = ({
  svgId = 'phases-of-the-moon',
  year = 2022,
  locale = undefined,
  width = 975,
  height = 480,
  marginTop = 0,
  marginRight = 0,
  marginBottom = 0,
  marginLeft = 60
} = {}) => {
  const now = new Date(year, 0, 1);
  const start = d3.timeYear(now);
  const months = d3.timeMonths(start, d3.timeYear.offset(start, 1));
  const days = d3.timeDays(start, d3.timeYear.offset(start, 1));

  const monthScale = d => d3.scalePoint()
    .domain(d3.range(12))
    .range([marginTop, height - marginBottom])
    .padding(1)(d.getMonth());
  const dayScale = d => d3.scalePoint()
    .domain(d3.range(1, 40))
    .range([marginLeft, width - marginRight])
    .padding(1)(d.getDate() + d3.timeMonth(d).getDay() || 7);

  const projection = d3.geoOrthographic().translate([0, 0]).scale(10);
  const path = d3.geoPath(projection);
  const hemisphere = d3.geoCircle()();

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .style('margin', '0 -14px')
    .style('display', 'block')
    .style('background', '#111');

  svg.html(`
  <g style='font: 10px sans-serif; text-transform: uppercase;'>
    ${months.map(d => `
      <g transform='translate(20,${monthScale(d)})'>
        <text fill='#fff' dy='0.32em'>${d.toLocaleString(locale, {month: 'long'})}</text>
      </g>`
    ).join('')}
  </g>
  <g text-anchor='middle' style='font: 5px sans-serif;'>
    ${days.map(d => {
      const noon = d3.timeHour.offset(d, 12);
      const illum = suncalc.getMoonIllumination(noon);
      const angle = 180 - illum.phase * 360;
      return `
      <g transform='translate(${dayScale(d)},${monthScale(d)})'>
        <circle r='10' fill='#333'></circle>
        <text fill='#fff' y='-10' dy='-0.4em'>${d.getDate()}</text>
        <path fill='#fff' d='${projection.rotate([angle, 0]), path(hemisphere)}'>
        <title>${d.toLocaleDateString()}</title>
      </g>`;
    }).join('')}
  </g>`);

  return svg.node();
}