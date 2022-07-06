/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/diverging-stacked-bar-chart

export const stackedBarChart = (data, {
  svgId = 'stacked-bar-chart',
  x = d => d, // given d in data, returns the (quantitative) x-value
  y = (d, i) => i, // given d in data, returns the (ordinal) y-value
  z = () => 1, // given d in data, returns the (categorical) z-value
  title, // given d in data, returns the title text
  marginTop = 30, // top margin, in pixels
  marginRight = 0, // right margin, in pixels
  marginBottom = 0, // bottom margin, in pixels
  marginLeft = 40, // left margin, in pixels
  width = 640, // outer width, in pixels
  height, // outer height, in pixels
  xType = d3.scaleLinear, // type of x-scale
  xDomain, // [xmin, xmax]
  xRange = [marginLeft, width - marginRight], // [left, right]
  yDomain, // array of y-values
  yRange, // [bottom, top]
  yPadding = 0.1, // amount of y-range to reserve to separate bars
  zDomain, // array of z-values
  offset = d3.stackOffsetDiverging, // stack offset method
  order = (series) => { // stack order method; try also d3.stackOffsetNone
    return [ // by default, stack negative series in reverse order
      ...series.map((S, i) => S.some(([, y]) => y < 0) ? i : null).reverse(),
      ...series.map((S, i) => S.some(([, y]) => y < 0) ? null : i)
    ].filter(i => i !== null);
  },
  xFormat, // a format specifier string for the x-axis
  xLabel, // a label for the x-axis
  colors = d3.schemeTableau10, // array of colors
} = {}) => {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const Z = d3.map(data, z);

  // Compute default y- and z-domains, and unique them.
  if (yDomain === undefined) yDomain = Y;
  if (zDomain === undefined) zDomain = Z;
  yDomain = new d3.InternSet(yDomain);
  zDomain = new d3.InternSet(zDomain);

  // Omit any data not present in the y- and z-domains.
  const I = d3.range(X.length).filter(i => yDomain.has(Y[i]) && zDomain.has(Z[i]));

  // If the height is not specified, derive it from the y-domain.
  if (height === undefined) height = yDomain.size * 25 + marginTop + marginBottom;
  if (yRange === undefined) yRange = [height - marginBottom, marginTop];

  // Compute a nested array of series where each series is [[x1, x2], [x1, x2],
  // [x1, x2], …] representing the x-extent of each stacked rect. In addition,
  // each tuple has an i (index) property so that we can refer back to the
  // original data point (data[i]). This code assumes that there is only one
  // data point for a given unique y- and z-value.
  const series = d3.stack()
    .keys(zDomain)
    .value(([, I], z) => X[I.get(z)])
    .order(order)
    .offset(offset)
    (d3.rollup(I, ([i]) => i, i => Y[i], i => Z[i]))
    .map(s => s.map(d => Object.assign(d, {
      i: d.data[1].get(s.key)
    })));

  // Compute the default y-domain. Note: diverging stacks can be negative.
  if (xDomain === undefined) xDomain = d3.extent(series.flat(2));

  // Construct scales, axes, and formats.
  const xScale = xType(xDomain, xRange);
  const yScale = d3.scaleBand(yDomain, yRange).paddingInner(yPadding);
  const color = d3.scaleOrdinal(zDomain, colors);
  const xAxis = d3.axisTop(xScale).ticks(width / 80, xFormat);
  const yAxis = d3.axisLeft(yScale).tickSize(0);

  // Compute titles.
  if (title === undefined) {
    const formatValue = xScale.tickFormat(100, xFormat);
    title = i => `${Y[i]}\n${Z[i]}\n${formatValue(X[i])}`;
  } else {
    const O = d3.map(data, d => d);
    const T = title;
    title = i => T(O[i], i, data);
  }

  const svg = d3.create('svg')
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
      .attr('text-anchor', 'middle')
      .text(xLabel));

  const bar = svg.append('g')
    .selectAll('g')
    .data(series)
    .join('g')
    .attr('fill', ([{
      i
    }]) => color(Z[i]))
    .selectAll('rect')
    .data(d => d)
    .join('rect')
    .attr('x', ([x1, x2]) => Math.min(xScale(x1), xScale(x2)) ? Math.min(xScale(x1), xScale(x2)) : 0)
    .attr('y', ({
      i
    }) => yScale(Y[i]))
    .attr('width', ([x1, x2]) => Math.abs(xScale(x1) - xScale(x2)) ? Math.abs(xScale(x1) - xScale(x2)) : 0)
    .attr('height', yScale.bandwidth());

  if (title) bar.append('title')
    .text(({
      i
    }) => title(i));

  svg.append('g')
    .attr('transform', `translate(${xScale(0)},0)`)
    .call(yAxis)
    .call(g => g.selectAll('.tick text')
      .attr('dx', -3)
      .attr('x', y => { // Find the minimum x-value for the corresponding y-value.
        const x = d3.min(series, S => S.find(d => Y[d.i] === y)?. [0]);
        return xScale(x) - xScale(0);
      }));

  return Object.assign(svg.node(), {
    scales: {
      color
    }
  });
}