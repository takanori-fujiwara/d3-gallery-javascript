/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2018–2020 Mike Bostock
// Released under the ISC license.
// https://observablehq.com/@mbostock/psr-b1919-21

export const psrB191921 = (data, {
  svgId = 'psr-b191921',
  overlap = 16,
  width = 800,
  height = 720,
  marginTop = 60,
  marginRight = 10,
  marginBottom = 20,
  marginLeft = 10
} = {}) => {
  const x = d3.scaleLinear()
    .domain([0, data[0].length - 1])
    .range([marginLeft, width - marginRight]);
  const y = d3.scalePoint()
    .domain(data.map((d, i) => i))
    .range([marginTop, height - marginBottom]);
  const z = d3.scaleLinear()
    .domain([
      d3.min(data, d => d3.min(d)),
      d3.max(data, d => d3.max(d))
    ])
    .range([0, -overlap * y.step()]);

  const xAxis = g => g
    .attr('transform', `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x.copy().domain([0, 92])).ticks(width / 80))
    .call(g => g.select('.domain').remove())
    .call(g => g.select('.tick:first-of-type text').append('tspan').attr('x', 10).text(' ms'));

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height]);

  const serie = svg.append('g')
    .selectAll('g')
    .data(data)
    .join('g')
    .attr('transform', (d, i) => `translate(0,${y(i) + 1})`);

  const area = d3.area()
    .defined(d => !isNaN(d))
    .x((d, i) => x(i))
    .y0(0)
    .y1(z);

  serie.append('path')
    .attr('fill', '#fff')
    .attr('d', area);

  const line = area.lineY1();
  serie.append('path')
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('d', line);

  svg.append('g')
    .call(xAxis);

  return svg.node();
}