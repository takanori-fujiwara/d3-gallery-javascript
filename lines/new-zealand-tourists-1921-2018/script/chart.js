/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2012–2020 Mike Bostock
// Released under the ISC license.
// https://observablehq.com/@mbostock/new-zealand-tourists-1921-2018

export const newZealandTourists19212018 = (data, {
  svgId = 'new-zealand-tourists19212018',
  width = 800,
  height = 500,
  marginTop = 20,
  marginRight = 30,
  marginBottom = 30,
  marginLeft = 50
} = {}) => {
  const x = d3.scaleUtc()
    .domain(d3.extent(data, d => d.date))
    .range([marginLeft, width - marginRight]);
  const yLinear = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)]).nice()
    .rangeRound([height - marginBottom, marginTop]);
  const yLog = d3.scaleLog()
    .domain(d3.extent(data, d => d.value))
    .rangeRound([height - marginBottom, marginTop]);

  const xAxis = g => g
    .attr('transform', `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
    .call(g => g.select('.domain').remove());
  const yAxis = (g, y, format) => g
    .attr('transform', `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).ticks(height / 80, format))
    .call(g => g.selectAll('.tick line').clone()
      .attr('stroke-opacity', 0.2)
      .attr('x2', width - marginLeft - marginRight))
    .call(g => g.select('.domain').remove())
    .call(g => g.append('text')
      .attr('x', -marginLeft)
      .attr('y', 10)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'start')
      .text(data.y));

  const yTickPosition = (g, y) => g.selectAll('.tick')
    .attr('transform', d => `translate(0,${(isNaN(y(d)) ? yLinear(d) : y(d)) + 0.5})`);

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height]);

  svg.append('g')
    .call(xAxis);

  const axisLinear = svg.append('g')
    .style('opacity', 1)
    .call(yAxis, yLinear);

  const axisLog = svg.append('g')
    .style('opacity', 0)
    .call(yAxis, yLog, ',')
    .call(yTickPosition, yLinear);

  const line = y => d3.line()
    .x(d => x(d.date))
    .y(d => y(d.value));

  const path = svg.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.5)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('d', line(yLinear));

  return Object.assign(svg.node(), {
    update(yType) {
      const y = yType === 'linear' ? yLinear : yLog;
      const t = svg.transition().duration(750);
      axisLinear.transition(t).style('opacity', y === yLinear ? 1 : 0).call(yTickPosition, y);
      axisLog.transition(t).style('opacity', y === yLog ? 1 : 0).call(yTickPosition, y);
      path.transition(t).attr('d', line(y));
    }
  });
}