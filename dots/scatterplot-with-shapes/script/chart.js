/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2019 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/scatterplot-with-shapes

export const scatterplotWithShapes = (data, {
  svgId = 'scatterplot-with-shapes',
  width = 800,
  height = 600,
  marginTop = 25,
  marginRight = 20,
  marginBottom = 35,
  marginLeft = 40
} = {}) => {
  const color = d3.scaleOrdinal(data.map(d => d.category), d3.schemeCategory10);
  const shape = d3.scaleOrdinal(data.map(d => d.category), d3.symbols.map(s => d3.symbol().type(s)()));

  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.x)).nice()
    .range([marginLeft, width - marginRight]);
  const y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.y)).nice()
    .range([height - marginBottom, marginTop]);

  const xAxis = g => g
    .attr('transform', `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).ticks(width / 80))
    .call(g => g.select('.domain').remove())
    .call(g => g.append('text')
      .attr('x', width)
      .attr('y', marginBottom - 4)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'end')
      .text(data.x));
  const yAxis = g => g
    .attr('transform', `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select('.domain').remove())
    .call(g => g.append('text')
      .attr('x', -marginLeft)
      .attr('y', 10)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'start')
      .text(data.y));
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

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height]);

  svg.append('g')
    .call(xAxis);
  svg.append('g')
    .call(yAxis);
  svg.append('g')
    .call(grid);

  svg.append('g')
    .attr('stroke-width', 1.5)
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)
    .selectAll('path')
    .data(data)
    .join('path')
    .attr('transform', d => `translate(${x(d.x)},${y(d.y)})`)
    .attr('fill', d => color(d.category))
    .attr('d', d => shape(d.category));

  return Object.assign(svg.node(), {
    scales: {
      color
    }
  });
}