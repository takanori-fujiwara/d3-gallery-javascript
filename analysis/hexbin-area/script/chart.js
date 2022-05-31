/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2018 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/hexbin-area
export const hexbinArea = (data, {
  svgId = 'hexbin-area',
  radius = 8,
  shape = 'path',
  width = 640,
  height = Math.max(640, width),
  marginTop = 20,
  marginRight = 20,
  marginBottom = 30,
  marginLeft = 40
} = {}) => {
  const x = d3.scaleLog()
    .domain(d3.extent(data, d => d.x))
    .range([marginLeft, width - marginRight]);
  const y = d3.scaleLog()
    .domain(d3.extent(data, d => d.y))
    .rangeRound([height - marginBottom, marginTop]);

  const xAxis = g => g
    .attr('transform', `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).ticks(width / 80, ''))
    .call(g => g.select('.domain').remove())
    .call(g => g.append('text')
      .attr('x', width - marginRight)
      .attr('y', -4)
      .attr('fill', 'currentColor')
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'end')
      .text(data.x));
  const yAxis = g => g
    .attr('transform', `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).ticks(null, '.1s'))
    .call(g => g.select('.domain').remove())
    .call(g => g.append('text')
      .attr('x', 4)
      .attr('y', marginTop)
      .attr('dy', '.71em')
      .attr('fill', 'currentColor')
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'start')
      .text(data.y));

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height]);

  svg.append('g')
    .call(xAxis);
  svg.append('g')
    .call(yAxis);

  const hexbin = d3.hexbin()
    .x(d => x(d.x))
    .y(d => y(d.y))
    .radius(radius * width / 954)
    .extent([
      [marginLeft, marginTop],
      [width - marginRight, height - marginBottom]
    ]);
  const bins = hexbin(data);
  const r = d3.scaleSqrt()
    .domain([0, d3.max(bins, d => d.length)])
    .range([0, hexbin.radius() * Math.SQRT2]);

  svg.append('g')
    .attr('fill', '#ddd')
    .attr('stroke', 'black')
    .selectAll('path')
    .data(bins)
    .enter().append(shape)
    .attr('transform', d => `translate(${d.x},${d.y})`)
    .call(shape === 'path' ?
      path => path.attr('d', d => hexbin.hexagon(r(d.length))) :
      circle => circle.attr('r', d => r(d.length)));

  return Object.assign(svg.node(), {
    svgId: svgId
  });
}