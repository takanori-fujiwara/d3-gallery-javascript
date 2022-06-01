/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2018–2020 Mike Bostock
// Released under the ISC license.
// https://observablehq.com/@mbostock/global-temperature-trends

export const globalTemperatureTrends = (data, {
  svgId = 'global-temperature-trends',
  width = 800,
  height = 600,
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
  const maxVal = d3.max(data, d => Math.abs(d.value));
  const z = d3.scaleSequential(d3.interpolateRdBu).domain([maxVal, -maxVal]);

  const xAxis = g => g
    .attr('transform', `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).ticks(width / 80))
    .call(g => g.select('.domain').remove());
  const yAxis = g => g
    .attr('transform', `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).ticks(null, '+'))
    .call(g => g.select('.domain').remove())
    .call(g => g.selectAll('.tick line')
      .filter(d => d === 0)
      .clone()
      .attr('x2', width - marginRight - marginLeft)
      .attr('stroke', '#ccc'))
    .call(g => g.append('text')
      .attr('fill', '#000')
      .attr('x', 5)
      .attr('y', marginTop)
      .attr('dy', '0.32em')
      .attr('text-anchor', 'start')
      .attr('font-weight', 'bold')
      .text('Anomaly (°C)'));

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
    .attr('stroke', '#000')
    .attr('stroke-opacity', 0.2)
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cx', d => x(d.date))
    .attr('cy', d => y(d.value))
    .attr('fill', d => z(d.value))
    .attr('r', 2.5);

  return svg.node();
}