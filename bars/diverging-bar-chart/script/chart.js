/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/diverging-bar-chart

export const barChart = (data, {
  svgId = 'bar-chart',
  x = d => d, // given d in data, returns the (quantitative) x-value
  y = (d, i) => i, // given d in data, returns the (ordinal) y-value
  title, // given d in data, returns the title text
  marginTop = 30, // top margin, in pixels
  marginRight = 40, // right margin, in pixels
  marginBottom = 10, // bottom margin, in pixels
  marginLeft = 40, // left margin, in pixels
  width = 640, // outer width of chart, in pixels
  height, // the outer height of the chart, in pixels
  xType = d3.scaleLinear, // type of x-scale
  xDomain, // [xmin, xmax]
  xRange = [marginLeft, width - marginRight], // [left, right]
  xFormat, // a format specifier string for the x-axis
  xLabel, // a label for the x-axis
  yPadding = 0.1, // amount of y-range to reserve to separate bars
  yDomain, // an array of (ordinal) y-values
  yRange, // [top, bottom]
  colors = d3.schemePiYG[3] // [negative, …, positive] colors
} = {}) => {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);

  // Compute default domains, and unique the y-domain.
  if (xDomain === undefined) xDomain = d3.extent(X);
  if (yDomain === undefined) yDomain = Y;
  yDomain = new d3.InternSet(yDomain);

  // Omit any data not present in the y-domain.
  // Lookup the x-value for a given y-value.
  const I = d3.range(X.length).filter(i => yDomain.has(Y[i]));
  const YX = d3.rollup(I, ([i]) => X[i], i => Y[i]);

  // Compute the default height.
  if (height === undefined) height = Math.ceil((yDomain.size + yPadding) * 25) + marginTop + marginBottom;
  if (yRange === undefined) yRange = [marginTop, height - marginBottom];

  // Construct scales, axes, and formats.
  const xScale = xType(xDomain, xRange);
  const yScale = d3.scaleBand(yDomain, yRange).padding(yPadding);
  const xAxis = d3.axisTop(xScale).ticks(width / 80, xFormat);
  const yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(6);
  const format = xScale.tickFormat(100, xFormat);

  // Compute titles.
  if (title === undefined) {
    title = i => `${Y[i]}\n${format(X[i])}`;
  } else if (title !== null) {
    const O = d3.map(data, d => d);
    const T = title;
    title = i => T(O[i], i, data);
  }

  d3.select('body').select(`svg#${svgId}`).remove();

  const svg = d3.select('body').append('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

  svg.append('g')
    .attr('transform', `translate(0,${marginTop})`)
    .call(xAxis)
    .call(g => g.select('.domain').remove())
    .call(g => g.selectAll('.tick line').clone()
      .attr('y2', height - marginTop - marginBottom)
      .attr('stroke-opacity', 0.1))
    .call(g => g.append('text')
      .attr('x', xScale(0))
      .attr('y', -22)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'center')
      .text(xLabel));

  const bar = svg.append('g')
    .selectAll('rect')
    .data(I)
    .join('rect')
    .attr('fill', i => colors[X[i] > 0 ? colors.length - 1 : 0])
    .attr('x', i => Math.min(xScale(0), xScale(X[i])))
    .attr('y', i => yScale(Y[i]))
    .attr('width', i => Math.abs(xScale(X[i]) - xScale(0)))
    .attr('height', yScale.bandwidth());

  if (title) bar.append('title')
    .text(title);

  svg.append('g')
    .attr('text-anchor', 'end')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)
    .selectAll('text')
    .data(I)
    .join('text')
    .attr('text-anchor', i => X[i] < 0 ? 'end' : 'start')
    .attr('x', i => xScale(X[i]) + Math.sign(X[i] - 0) * 4)
    .attr('y', i => yScale(Y[i]) + yScale.bandwidth() / 2)
    .attr('dy', '0.35em')
    .text(i => format(X[i]));

  svg.append('g')
    .attr('transform', `translate(${xScale(0)},0)`)
    .call(yAxis)
    .call(g => g.selectAll('.tick text')
      .filter(y => YX.get(y) < 0)
      .attr('text-anchor', 'start')
      .attr('x', 6));

  return svg.node();
}