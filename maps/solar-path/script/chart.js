/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2019–2020 Mike Bostock
// Released under the ISC license.
// https://observablehq.com/@d3/solar-path
// > ISC License
// > Permission to use, copy, modify, and/or distribute this software for any
// > purpose with or without fee is hereby granted, provided that the above
// > copyright notice and this permission notice appear in all copies.>
//
// > THE SOFTWARE IS PROVIDED 'AS IS' AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// > WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// > MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// > ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// > WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// > ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// > OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

// This is an older ver of solar-calculator.
// But, noon function is different in ver 0.3 and position function is not implemented in ver 0.3
import solarCalculator from './solar-calculator-0.2.1.js';

export const solarPath = ({
  svgId = 'solar-path',
  location = Object.assign([-122.4194, 37.7749], {
    timeZone: 'America/Los_Angeles'
  }),
  width = 960 + 28,
  height = width,
  graticule = d3.geoGraticule().stepMinor([15, 10])(),
  outline = d3.geoCircle().radius(90).center([0, 90])(),
  projection = d3.geoStereographic()
  .reflectY(true)
  .scale((width - 120) * 0.5)
  .clipExtent([
    [0, 0],
    [width, height]
  ])
  .rotate([0, -90])
  .translate([width / 2, height / 2])
  .precision(0.1),
  formatHour = d => d.toLocaleString('en', {
    hour: 'numeric',
    timeZone: location.timeZone
  })
} = {}) => {
  console.log(location);
  const solar = solarCalculator(location);

  const xAxis = g => g
    .call(g => g.append('g')
      .attr('stroke', 'currentColor')
      .selectAll('line')
      .data(d3.range(360))
      .join('line')
      .datum(d => [
        projection([d, 0]),
        projection([d, d % 10 ? -1 : -2])
      ])
      .attr('x1', ([
        [x1]
      ]) => x1)
      .attr('x2', ([, [x2]]) => x2)
      .attr('y1', ([
        [, y1]
      ]) => y1)
      .attr('y2', ([, [, y2]]) => y2))
    .call(g => g.append('g')
      .selectAll('text')
      .data(d3.range(0, 360, 10))
      .join('text')
      .attr('dy', '0.35em')
      .text(d => d === 0 ? 'N' : d === 90 ? 'E' : d === 180 ? 'S' : d === 270 ? 'W' : `${d}°`)
      .attr('font-size', d => d % 90 ? null : 14)
      .attr('font-weight', d => d % 90 ? null : 'bold')
      .datum(d => projection([d, -4]))
      .attr('x', ([x]) => x)
      .attr('y', ([, y]) => y));
  const yAxis = g => g
    .call(g => g.append('g')
      .selectAll('text')
      .data(d3.range(10, 91, 10)) // every 10°
      .join('text')
      .attr('dy', '0.35em')
      .text(d => `${d}°`)
      .datum(d => projection([180, d]))
      .attr('x', ([x]) => x)
      .attr('y', ([, y]) => y));

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)
    .attr('text-anchor', 'middle')
    .attr('fill', 'currentColor')
    .style('margin', '0 -14px')
    .style('display', 'block');

  const path = d3.geoPath(projection);
  svg.append('path')
    .attr('d', path(graticule))
    .attr('fill', 'none')
    .attr('stroke', 'currentColor')
    .attr('stroke-opacity', 0.2);

  svg.append('path')
    .attr('d', path(outline))
    .attr('fill', 'none')
    .attr('stroke', 'currentColor');

  svg.append('g')
    .call(xAxis);
  svg.append('g')
    .call(yAxis);

  const sunPath = svg.append('path')
    .attr('fill', 'none')
    .attr('stroke', 'red')
    .attr('stroke-width', 2);

  const hour = svg.append('g')
    .selectAll('g')
    .data(d3.range(24))
    .join('g');

  hour.append('circle')
    .attr('fill', 'black')
    .attr('r', 2);

  hour.append('text')
    .attr('dy', '-0.4em')
    .attr('stroke', 'white')
    .attr('stroke-width', 4)
    .attr('stroke-linejoin', 'round')
    .attr('fill', 'none')
    .clone(true)
    .attr('stroke', null)
    .attr('fill', 'black');

  const update = date => {
    const start = d3.utcHour.offset(solar.noon(date), -12);
    const end = d3.utcHour.offset(start, 24);
    sunPath.attr('d', path({
      type: 'LineString',
      coordinates: d3.utcMinutes(start, end).map(solar.position)
    }));
    hour.data(d3.utcHours(start, end));
    hour.attr('transform', d => `translate(${projection(solar.position(d))})`);
    hour.select('text:first-of-type').text(formatHour);
    hour.select('text:last-of-type').text(formatHour);
  }

  return Object.assign(svg.node(), {
    update
  });
}