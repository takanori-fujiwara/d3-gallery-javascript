/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2012–2020 Mike Bostock
// Released under the ISC license.
// https://observablehq.com/@mbostock/u-s-population-by-state-1790-1990

import {
  uid
} from './dom-uid.js';

export const uSPopulationByState17901990 = (data, regionRank, regionByState, {
  svgId = 'u-s-population-by-state17901990',
  width = 900,
  height = 600,
  marginTop = 10,
  marginRight = 10,
  marginBottom = 30,
  marginLeft = 40
} = {}) => {
  const x = d3.scaleUtc()
    .domain(d3.extent(data, d => d.date))
    .range([marginLeft, width - marginRight]);
  const y = d3.scaleLinear()
    .range([height - marginBottom, marginTop]);

  const color = d3.scaleOrdinal()
    .domain(regionRank)
    .range(d3.schemeCategory10)
    .unknown('gray');

  const xAxis = g => g
    .attr('transform', `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));
  const yAxis = g => g
    .attr('transform', `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).ticks(10, '%'))
    .call(g => g.select('.domain').remove());

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height]);

  const series = d3.stack()
    .keys(data.columns.slice(1))
    .offset(d3.stackOffsetExpand)
    (data);

  const area = d3.area()
    .x(d => x(d.data.date))
    .y0(d => y(d[0]))
    .y1(d => y(d[1]));

  svg.append('g')
    .attr('fill-opacity', 0.8)
    .selectAll('path')
    .data(series)
    .join('path')
    .attr('fill', ({
      key
    }) => color(regionByState.get(key)))
    .attr('d', area)
    .append('title')
    .text(({
      key
    }) => key);

  svg.append('g')
    .attr('fill', 'none')
    .attr('stroke-width', 0.75)
    .selectAll('path')
    .data(series)
    .join('path')
    .attr('stroke', ({
      key
    }) => d3.lab(color(regionByState.get(key))).darker())
    .attr('d', area.lineY1());

  const midline = d3.line()
    .curve(d3.curveBasis)
    .x(d => x(d.data.date))
    .y(d => y((d[0] + d[1]) / 2));

  svg.append('defs')
    .selectAll('path')
    .data(series)
    .join('path')
    .attr('id', d => (d.id = uid('state')).id)
    .attr('d', midline);

  svg.append('g')
    .style('font', '10px sans-serif')
    .attr('text-anchor', 'middle')
    .selectAll('text')
    .data(series)
    .join('text')
    .attr('dy', '0.35em')
    .append('textPath')
    .attr('href', d => d.id.href)
    .attr('startOffset', d => `${Math.max(0.05, Math.min(0.95, d.offset = d3.maxIndex(d, d => d[1] - d[0]) / (d.length - 1))) * 100}%`)
    .text(d => d.key);

  svg.append('g')
    .call(xAxis);

  svg.append('g')
    .call(yAxis);

  return Object.assign(svg.node(), {
    scales: {
      color
    }
  });
}