/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2019 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/radial-area-chart

import {
  uid
} from './dom-uid.js';

export const radialAreaChart = (data, {
  svgId = 'radial-area-chart',
  width = 954,
  height = width,
  margin = 10,
  innerRadius = width / 5,
  outerRadius = width / 2 - margin
} = {}) => {
  const x = d3.scaleUtc()
    .domain([Date.UTC(2000, 0, 1), Date.UTC(2001, 0, 1) - 1])
    .range([0, 2 * Math.PI]);
  const y = d3.scaleLinear()
    .domain([d3.min(data, d => d.minmin), d3.max(data, d => d.maxmax)])
    .range([innerRadius, outerRadius]);

  const xAxis = g => g
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)
    .call(g => g.selectAll('g')
      .data(x.ticks())
      .join('g')
      .each((d, i) => d.id = uid('month'))
      .call(g => g.append('path')
        .attr('stroke', '#000')
        .attr('stroke-opacity', 0.2)
        .attr('d', d => `
                M${d3.pointRadial(x(d), innerRadius)}
                L${d3.pointRadial(x(d), outerRadius)}
              `))
      .call(g => g.append('path')
        .attr('id', d => d.id.id)
        .datum(d => [d, d3.utcMonth.offset(d, 1)])
        .attr('fill', 'none')
        .attr('d', ([a, b]) => `
                M${d3.pointRadial(x(a), innerRadius)}
                A${innerRadius},${innerRadius} 0,0,1 ${d3.pointRadial(x(b), innerRadius)}
              `))
      .call(g => g.append('text')
        .append('textPath')
        .attr('startOffset', 6)
        .attr('xlink:href', d => d.id.href)
        .text(d3.utcFormat('%B'))));
  const yAxis = g => g
    .attr('text-anchor', 'middle')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)
    .call(g => g.selectAll('g')
      .data(y.ticks().reverse())
      .join('g')
      .attr('fill', 'none')
      .call(g => g.append('circle')
        .attr('stroke', '#000')
        .attr('stroke-opacity', 0.2)
        .attr('r', y))
      .call(g => g.append('text')
        .attr('y', d => -y(d))
        .attr('dy', '0.35em')
        .attr('stroke', '#fff')
        .attr('stroke-width', 5)
        .text((x, i) => `${x.toFixed(0)}${i ? '' : '°F'}`)
        .clone(true)
        .attr('y', d => y(d))
        .selectAll(function() {
          return [this, this.previousSibling];
        })
        .clone(true)
        .attr('fill', 'currentColor')
        .attr('stroke', 'none')));

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [-width / 2, -height / 2, width, height])
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round');

  const area = d3.areaRadial()
    .curve(d3.curveLinearClosed)
    .angle(d => x(d.date));

  svg.append('path')
    .attr('fill', 'lightsteelblue')
    .attr('fill-opacity', 0.2)
    .attr('d', area
      .innerRadius(d => y(d.minmin))
      .outerRadius(d => y(d.maxmax))
      (data));

  svg.append('path')
    .attr('fill', 'steelblue')
    .attr('fill-opacity', 0.2)
    .attr('d', area
      .innerRadius(d => y(d.min))
      .outerRadius(d => y(d.max))
      (data));

  const line = d3.lineRadial()
    .curve(d3.curveLinearClosed)
    .angle(d => x(d.date));

  svg.append('path')
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.5)
    .attr('d', line
      .radius(d => y(d.avg))
      (data));

  svg.append('g')
    .call(xAxis);

  svg.append('g')
    .call(yAxis);

  return svg.node();
}