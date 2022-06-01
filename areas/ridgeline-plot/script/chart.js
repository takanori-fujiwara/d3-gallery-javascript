/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2018-2020 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/ridgeline-plot

export const ridgelinePlot = (data, {
  svgId = 'ridgeline-plot',
  width = 900,
  height = data.series.length * 17,
  marginTop = 40,
  marginRight = 20,
  marginBottom = 30,
  marginLeft = 120,
  overlap = 8
} = {}) => {
  const x = d3.scaleTime()
    .domain(d3.extent(data.dates))
    .range([marginLeft, width - marginRight]);
  const y = d3.scalePoint()
    .domain(data.series.map(d => d.name))
    .range([marginTop, height - marginBottom]);
  const z = d3.scaleLinear()
    .domain([0, d3.max(data.series, d => d3.max(d.values))]).nice()
    .range([0, -overlap * y.step()]);

  const xAxis = g => g
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x)
      .ticks(width / 80)
      .tickSizeOuter(0));
  const yAxis = g => g
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).tickSize(0).tickPadding(4))
    .call(g => g.select(".domain").remove());

  const svg = d3.create('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height]);

  svg.append('g')
    .call(xAxis);
  svg.append('g')
    .call(yAxis);

  const group = svg.append('g')
    .selectAll('g')
    .data(data.series)
    .join('g')
    .attr('transform', d => `translate(0,${y(d.name) + 1})`);

  const area = d3.area()
    .curve(d3.curveBasis)
    .defined(d => !isNaN(d))
    .x((d, i) => x(data.dates[i]))
    .y0(0)
    .y1(d => z(d));

  group.append('path')
    .attr('fill', '#ddd')
    .attr('d', d => area(d.values));

  const line = area.lineY1();

  group.append('path')
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('d', d => line(d.values));

  return svg.node();
}