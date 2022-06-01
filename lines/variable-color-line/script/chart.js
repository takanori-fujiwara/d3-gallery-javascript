/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2019 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/variable-color-line

import {
  uid
} from './dom-uid.js';

export const variableColorLine = (data, {
  svgId = 'variable-color-line',
  width = 800,
  height = 500,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 30,
  marginLeft = 40
} = {}) => {
  const color = d3.scaleOrdinal(
    data.conditions === undefined ? data.map(d => d.condition) : data.conditions,
    data.colors === undefined ? d3.schemeCategory10 : data.colors
  ).unknown('black');

  const x = d3.scaleUtc()
    .domain(d3.extent(data, d => d.date))
    .rangeRound([marginLeft, width - marginRight]);
  const y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.value)).nice()
    .rangeRound([height - marginBottom, marginTop]);

  const xAxis = g => g
    .attr('transform', `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
    .call(g => g.select('.domain').remove());
  const yAxis = g => g
    .attr('transform', `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select('.domain').remove())
    .call(g => g.select('.tick:last-of-type text').append('tspan').text(data.y));

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height]);

  svg.append('g')
    .call(xAxis);
  svg.append('g')
    .call(yAxis);

  const grid = g => g
    .attr('stroke', 'currentColor')
    .attr('stroke-opacity', 0.1)
    .call(g => g.append('g')
      .selectAll('line')
      .data(x.ticks())
      .join('line')
      .attr('x1', d => 0.5 + x(d))
      .attr('x2', d => 0.5 + x(d))
      .attr('y1', marginTop)
      .attr('y2', height - marginBottom))
    .call(g => g.append('g')
      .selectAll('line')
      .data(y.ticks())
      .join('line')
      .attr('y1', d => 0.5 + y(d))
      .attr('y2', d => 0.5 + y(d))
      .attr('x1', marginLeft)
      .attr('x2', width - marginRight));

  svg.append('g')
    .call(grid);

  const colorId = uid('color');

  svg.append('linearGradient')
    .attr('id', colorId.id)
    .attr('gradientUnits', 'userSpaceOnUse')
    .attr('x1', 0)
    .attr('x2', width)
    .selectAll('stop')
    .data(data)
    .join('stop')
    .attr('offset', d => x(d.date) / width)
    .attr('stop-color', d => color(d.condition));

  const line = d3.line()
    .curve(d3.curveStep)
    .x(d => x(d.date))
    .y(d => y(d.value));

  svg.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', `url(#${colorId.id})`)
    .attr('stroke-width', 2)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('d', line);

  return Object.assign(svg.node(), {
    scales: {
      color
    }
  });
}