/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/streamgraph

export const streamgraph = (data, {
  svgId = 'streamgraph',
  x = ([x]) => x, // given d in data, returns the (ordinal) x-value
  y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
  z = () => 1, // given d in data, returns the (categorical) z-value
  marginTop = 20, // top margin, in pixels
  marginRight = 30, // right margin, in pixels
  marginBottom = 30, // bottom margin, in pixels
  marginLeft = 20, // left margin, in pixels
  width = 640, // outer width, in pixels
  height = 400, // outer height, in pixels
  xType = d3.scaleUtc, // type of x-scale
  xDomain, // [xmin, xmax]
  xRange = [marginLeft, width - marginRight], // [left, right]
  yType = d3.scaleLinear, // type of y-scale
  yDomain, // [ymin, ymax]
  yRange = [height - marginBottom, marginTop], // [bottom, top]
  zDomain, // array of z-values
  offset = d3.stackOffsetWiggle, // stack offset method
  order = d3.stackOrderInsideOut, // stack order method
  xFormat, // a format specifier string for the x-axis
  yFormat, // a format specifier string for the y-axis
  yLabel, // a label for the y-axis
  colors = d3.schemeTableau10,
} = {}) => {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const Z = d3.map(data, z);

  // Compute default x- and z-domains, and unique the z-domain.
  if (xDomain === undefined) xDomain = d3.extent(X);
  if (zDomain === undefined) zDomain = Z;
  zDomain = new d3.InternSet(zDomain);

  // Omit any data not present in the z-domain.
  const I = d3.range(X.length).filter(i => zDomain.has(Z[i]));

  // Compute a nested array of series where each series is [[y1, y2], [y1, y2],
  // [y1, y2], …] representing the y-extent of each stacked rect. In addition,
  // each tuple has an i (index) property so that we can refer back to the
  // original data point (data[i]). This code assumes that there is only one
  // data point for a given unique x- and z-value.
  const series = d3.stack()
    .keys(zDomain)
    .value(([x, I], z) => Y[I.get(z)])
    .order(order)
    .offset(offset)
    (d3.rollup(I, ([i]) => i, i => X[i], i => Z[i]))
    .map(s => s.map(d => Object.assign(d, {
      i: d.data[1].get(s.key)
    })));

  // Compute the default y-domain. Note: diverging stacks can be negative.
  if (yDomain === undefined) yDomain = d3.extent(series.flat(2));

  // Construct scales and axes.
  const xScale = xType(xDomain, xRange);
  const yScale = yType(yDomain, yRange);
  const color = d3.scaleOrdinal(zDomain, colors);
  const xAxis = d3.axisBottom(xScale).ticks(width / 80, xFormat).tickSizeOuter(0);

  const area = d3.area()
    .x(({
      i
    }) => xScale(X[i]))
    .y0(([y1]) => yScale(y1))
    .y1(([, y2]) => yScale(y2));

  d3.select('body').select(`svg#${svgId}`).remove();

  const svg = d3.select('body').append('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

  svg.append('g')
    .selectAll('path')
    .data(series)
    .join('path')
    .attr('fill', ([{
      i
    }]) => color(Z[i]))
    .attr('d', area)
    .append('title')
    .text(([{
      i
    }]) => Z[i]);

  svg.append('g')
    .attr('transform', `translate(0,${height - marginBottom})`)
    .call(xAxis)
    .call(g => g.select('.domain').remove());

  svg.append('g')
    .attr('transform', `translate(${marginLeft},0)`)
    .call(g => g.append('text')
      .attr('x', -marginLeft)
      .attr('y', 10)
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .text(yLabel));

  return Object.assign(svg.node(), {
    scales: {
      color
    }
  });
}