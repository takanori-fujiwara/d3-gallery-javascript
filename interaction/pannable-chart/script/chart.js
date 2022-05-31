/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2019 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/pannable-chart

export const pannableChart = (data, {
  width = 800,
  height = 420,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 30,
  marginLeft = 30
} = {}) => {
  const x = d3.scaleUtc()
    .domain(d3.extent(data, d => d.date))
    .range([marginLeft, width * 6 - marginRight]);
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)]).nice(6)
    .range([height - marginBottom, marginTop]);

  const xAxis = g => g
    .attr('transform', `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).ticks(d3.utcMonth.every(1200 / width)).tickSizeOuter(0));
  const yAxis = g => g
    .attr('transform', `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).ticks(6))
    .call(g => g.select('.domain').remove())
    .call(g => g.select('.tick:last-of-type text').clone()
      .attr('x', 3)
      .attr('text-anchor', 'start')
      .attr('font-weight', 'bold')
      .text(data.y));

  const area = d3.area()
    .curve(d3.curveStep)
    .x(d => x(d.date))
    .y0(y(0))
    .y1(d => y(d.value));

  const minX = x(data[0].date);
  const maxX = x(data[data.length - 1].date);
  const overwidth = maxX - minX + marginLeft + marginRight;

  const parent = d3.create('div');

  parent.append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .style('position', 'absolute')
    .style('pointer-events', 'none')
    .style('z-index', 1)
    .call(svg => svg.append('g').call(yAxis));

  const body = parent.append('div')
    .style('width', width)
    .style('height', height)
    .style('overflow-x', 'scroll')
    .style('-webkit-overflow-scrolling', 'touch');

  body.append('svg')
    .attr('width', overwidth)
    .attr('height', height)
    .style('display', 'block')
    .call(svg => svg.append('g').call(xAxis))
    .append('path')
    .datum(data)
    .attr('fill', 'steelblue')
    .attr('d', area);

  // body.node().scrollBy(overwidth, 0);
  return Object.assign(parent.node(), {
    setScrollToEnd() {
      body.node().scrollBy(overwidth, 0);
    }
  });

  // Initialize the scroll offset after yielding the chart to the DOM.
}