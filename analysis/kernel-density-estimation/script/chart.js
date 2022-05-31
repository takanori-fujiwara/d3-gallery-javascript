/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2019 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/kernel-density-estimation

const kde = (kernel, thresholds, data) =>
  thresholds.map(t => [t, d3.mean(data, d => kernel(t - d))]);

const epanechnikov = bandwidth =>
  x => Math.abs(x /= bandwidth) <= 1 ? 0.75 * (1 - x * x) / bandwidth : 0;

export const kernelDensityEstimation = (data, {
  svgId = 'kernel-density-estimation',
  bandwidth = 7,
  width = 800,
  height = 500,
  marginTop = 20,
  marginRight = 30,
  marginBottom = 30,
  marginLeft = 40
} = {}) => {
  const x = d3.scaleLinear()
    .domain(d3.extent(data)).nice()
    .range([marginLeft, width - marginRight]);

  const thresholds = x.ticks(40);
  const bins = d3.bin()
    .domain(x.domain())
    .thresholds(thresholds)
    (data);
  const density = kde(epanechnikov(bandwidth), thresholds, data);

  const y = d3.scaleLinear()
    .domain([0, d3.max(bins, d => d.length) / data.length])
    .range([height - marginBottom, marginTop]);

  const line = d3.line()
    .curve(d3.curveBasis)
    .x(d => x(d[0]))
    .y(d => y(d[1]));

  const xAxis = g => g
    .attr('transform', `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x))
    .call(g => g.append('text')
      .attr('x', width - marginRight)
      .attr('y', -6)
      .attr('fill', '#000')
      .attr('text-anchor', 'end')
      .attr('font-weight', 'bold')
      .text(data.title));
  const yAxis = g => g
    .attr('transform', `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).ticks(null, '%'))
    .call(g => g.select('.domain').remove());

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height]);

  svg.append('g')
    .attr('fill', '#bbb')
    .selectAll('rect')
    .data(bins)
    .join('rect')
    .attr('x', d => x(d.x0) + 1)
    .attr('y', d => y(d.length / data.length))
    .attr('width', d => Math.max(0, x(d.x1) - x(d.x0) - 1))
    .attr('height', d => Math.max(0, y(0) - y(d.length / data.length)));

  svg.append('path')
    .datum(density)
    .attr('fill', 'none')
    .attr('stroke', '#000')
    .attr('stroke-width', 1.5)
    .attr('stroke-linejoin', 'round')
    .attr('d', line);

  svg.append('g')
    .call(xAxis);

  svg.append('g')
    .call(yAxis);

  return Object.assign(svg.node(), {
    svgId: svgId
  });
}