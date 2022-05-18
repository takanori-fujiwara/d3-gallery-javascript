/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/dot-plot

export const dotPlot = (data, {
  id = 'dot-plot',
  x = ([x]) => x, // given d in data, returns the (quantitative) value x
  y = ([, y]) => y, // given d in data, returns the (categorical) value y
  z = () => 1, // given d in data, returns the (categorical) value z
  r = 3.5, // (fixed) radius of dots, in pixels
  xFormat, // a format specifier for the x-axis
  marginTop = 30, // top margin, in pixels
  marginRight = 30, // right margin, in pixels
  marginBottom = 10, // bottom margin, in pixels
  marginLeft = 30, // left margin, in pixels
  width = 640, // outer width, in pixels
  height, // outer height, in pixels, defaults to heuristic
  xType = d3.scaleLinear, // type of x-scale
  xDomain, // [xmin, xmax]
  xRange = [marginLeft, width - marginRight], // [left, right]
  xLabel, // a label for the x-axis
  yDomain, // an array of (ordinal) y-values
  yRange, // [top, bottom]
  yPadding = 1, // separation for first and last dots from axis
  zDomain, // array of z-values
  colors, // color scheme
  stroke = 'currentColor', // stroke of rule connecting dots
  strokeWidth, // stroke width of rule connecting dots
  strokeLinecap, // stroke line cap of rule connecting dots
  strokeOpacity, // stroke opacity of rule connecting dots
  duration: initialDuration = 250, // duration of transition, if any
  delay: initialDelay = (_, i) => i * 10, // delay of transition, if any
} = {}) => {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const Z = d3.map(data, z);

  // Compute default domains, and unique them as needed.
  if (xDomain === undefined) xDomain = d3.extent(X);
  if (yDomain === undefined) yDomain = Y;
  if (zDomain === undefined) zDomain = Z;
  yDomain = new d3.InternSet(yDomain);
  zDomain = new d3.InternSet(zDomain);

  // Omit any data not present in the y- and z-domains.
  const I = d3.range(X.length).filter(i => yDomain.has(Y[i]) && zDomain.has(Z[i]));

  // Compute the default height.
  if (height === undefined) height = Math.ceil((yDomain.size + yPadding) * 16) + marginTop + marginBottom;
  if (yRange === undefined) yRange = [marginTop, height - marginBottom];

  // Chose a default color scheme based on cardinality.
  if (colors === undefined) colors = d3.schemeSpectral[zDomain.size];
  if (colors === undefined) colors = d3.quantize(d3.interpolateSpectral, zDomain.size);

  // Construct scales and axes.
  const xScale = xType(xDomain, xRange);
  const yScale = d3.scalePoint(yDomain, yRange).round(true).padding(yPadding);
  const color = d3.scaleOrdinal(zDomain, colors);
  const xAxis = d3.axisTop(xScale).ticks(width / 80, xFormat);

  d3.select('body').select(`svg#${id}`).remove();

  const svg = d3.select('body').append('svg')
    .attr('id', id)
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
      .attr('x', width - marginRight)
      .attr('y', -22)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'end')
      .text(xLabel));

  const g = svg.append('g')
    .attr('text-anchor', 'end')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)
    .selectAll()
    .data(d3.group(I, i => Y[i]))
    .join('g')
    .attr('transform', ([y]) => `translate(0,${yScale(y)})`);

  g.append('line')
    .attr('stroke', stroke)
    .attr('stroke-width', strokeWidth)
    .attr('stroke-linecap', strokeLinecap)
    .attr('stroke-opacity', strokeOpacity)
    .attr('x1', ([, I]) => xScale(d3.min(I, i => X[i])))
    .attr('x2', ([, I]) => xScale(d3.max(I, i => X[i])));

  g.selectAll('circle')
    .data(([, I]) => I)
    .join('circle')
    .attr('cx', i => xScale(X[i]))
    .attr('fill', i => color(Z[i]))
    .attr('r', r);

  g.append('text')
    .attr('dy', '0.35em')
    .attr('x', ([, I]) => xScale(d3.min(I, i => X[i])) - 6)
    .text(([y]) => y);

  return Object.assign(svg.node(), {
    color,
    update(yDomain, {
      duration = initialDuration, // duration of transition
      delay = initialDelay, // delay of transition
    } = {}) {
      yScale.domain(yDomain);
      const t = g.transition().duration(duration).delay(delay);
      t.attr("transform", ([y]) => `translate(0,${yScale(y)})`);
    }
  });
}