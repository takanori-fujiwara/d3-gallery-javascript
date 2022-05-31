/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/zoomable-bar-chart

export const zoomableBarChart = (data, {
  svgId = 'zoomable-bar-chart',
  width = 800,
  height = 500,
  marginTop = 20,
  marginRight = 0,
  marginBottom = 30,
  marginLeft = 40
} = {}) => {
  const x = d3.scaleBand()
    .domain(data.map(d => d.name))
    .range([marginLeft, width - marginRight])
    .padding(0.1);
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)]).nice()
    .range([height - marginBottom, marginTop]);

  const xAxis = g => g
    .attr('transform', `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));
  const yAxis = g => g
    .attr('transform', `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select('.domain').remove());

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height]);

  svg.append('g')
    .attr('class', 'bars')
    .attr('fill', 'steelblue')
    .selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', d => x(d.name))
    .attr('y', d => y(d.value))
    .attr('height', d => y(0) - y(d.value))
    .attr('width', x.bandwidth());

  svg.append('g')
    .attr('class', 'x-axis')
    .call(xAxis);

  svg.append('g')
    .attr('class', 'y-axis')
    .call(yAxis);

  const zoom = svg => {
    const extent = [
      [marginLeft, marginTop],
      [width - marginRight, height - marginTop]
    ];

    const zoomed = event => {
      x.range([marginLeft, width - marginRight].map(d => event.transform.applyX(d)));
      svg.selectAll('.bars rect').attr('x', d => x(d.name)).attr('width', x.bandwidth());
      svg.selectAll('.x-axis').call(xAxis);
    }

    svg.call(d3.zoom()
      .scaleExtent([1, 8])
      .translateExtent(extent)
      .extent(extent)
      .on('zoom', zoomed));
  }

  svg.call(zoom);

  return svg.node();
}