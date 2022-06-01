/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2019 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/gradient-encoding

import {
  uid
} from './dom-uid.js';

export const gradientEncoding = (data, {
  svgId = 'gradient-encoding',
  width = 800,
  height = 500,
  marginTop = 20,
  marginRight = 30,
  marginBottom = 30,
  marginLeft = 40
} = {}) => {
  const x = d3.scaleUtc()
    .domain(d3.extent(data, d => d.date))
    .range([marginLeft, width - marginRight]);
  const y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.value)).nice()
    .range([height - marginBottom, marginTop]);

  const color = d3.scaleSequential(y.domain(), d3.interpolateTurbo);

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

  const gradient = uid();

  svg.append('linearGradient')
    .attr('id', gradient.id)
    .attr('gradientUnits', 'userSpaceOnUse')
    .attr('x1', 0)
    .attr('y1', height - marginBottom)
    .attr('x2', 0)
    .attr('y2', marginTop)
    .selectAll('stop')
    .data(d3.ticks(0, 1, 10))
    .join('stop')
    .attr('offset', d => d)
    .attr('stop-color', color.interpolator());

  const line = d3.line()
    .curve(d3.curveStep)
    .defined(d => !isNaN(d.value))
    .x(d => x(d.date))
    .y(d => y(d.value));

  svg.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', `url(#${gradient.id}`)
    .attr('stroke-width', 1.5)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('d', line);

  return Object.assign(svg.node(), {
    scales: {
      color
    }
  });
}