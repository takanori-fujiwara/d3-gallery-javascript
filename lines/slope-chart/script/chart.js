/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/slope-chart

export const slopeChart = (data, {
  svgId = 'slope-chart',
  x = ([x]) => x, // given d in data, returns a (ordinal) column name
  y = ([, y]) => y, // given d in data, returns a (quantitative) value
  z = () => 1, // given d in data, returns a (categorical) series name
  defined, // for gaps in data
  curve = d3.curveLinear, // method of interpolation between points; try d3.curveBumpX
  marginTop = 20, // top margin, in pixels
  marginRight = 30, // right margin, in pixels
  marginBottom = 20, // bottom margin, in pixels
  marginLeft = 30, // left margin, in pixels
  inset, // additional margins
  insetTop = inset === undefined ? 20 : inset, // separation between y-axis and top line
  insetBottom = inset === undefined ? 0 : inset, // additional bottom margin
  labelPadding = 3, // padding from the start or end of the line to label, in pixels
  labelSeparation = 10, // separation in pixels for avoiding label collisions
  width = 640, // outer width, in pixels
  height = 400, // outer height, in pixels
  xDomain, // array of x-values
  xRange = [marginLeft, width - marginRight], // [left, right]
  xPadding = 0.5, // padding for the x-scale (for first and last column)
  yType = d3.scaleLinear, // type of y-scale
  yDomain, // [ymin, ymax]
  yRange = [height - marginBottom - insetBottom, marginTop + insetTop], // [bottom, top]
  yFormat, // a format for the value in the label
  zDomain, // array of z-values
  color = 'currentColor', // alias for stroke
  stroke = color, // stroke color of line
  strokeLinecap, // stroke line cap of line
  strokeLinejoin, // stroke line join of line
  strokeWidth, // stroke width of line
  strokeOpacity, // stroke opacity of line
  mixBlendMode, // blend mode of lines
  halo = '#fff', // color of label halo
  haloWidth = 4, // padding around the labels
} = {}) => {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const Z = d3.map(data, z);
  if (defined === undefined) defined = (d, i) => !isNaN(Y[i]);
  const D = d3.map(data, defined);

  // Compute default domains, and unique the x- and z-domains.
  if (xDomain === undefined) xDomain = X;
  if (yDomain === undefined) yDomain = d3.extent(Y);
  if (zDomain === undefined) zDomain = Z;
  xDomain = new d3.InternSet(xDomain);
  zDomain = new d3.InternSet(zDomain);

  // Omit any data not present in the x- and z-domain.
  const I = d3.range(X.length).filter(i => xDomain.has(X[i]) && zDomain.has(Z[i]));

  // Construct scales, axes, and formats.
  const xScale = d3.scalePoint(xDomain, xRange).padding(xPadding);
  const yScale = yType(yDomain, yRange);
  const xAxis = d3.axisTop(xScale).tickSizeOuter(0);
  yFormat = yScale.tickFormat(100, yFormat);

  // Construct a line generator.
  const line = d3.line()
    .defined(i => D[i])
    .curve(curve)
    .x(i => xScale(X[i]))
    .y(i => yScale(Y[i]));

  d3.select('body').select(`svg#${svgId}`).remove();

  const svg = d3.select('body').append('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10);

  svg.append('g')
    .attr('transform', `translate(0,${marginTop})`)
    .call(xAxis)
    .call(g => g.select('.domain').remove());

  svg.append('g')
    .attr('fill', 'none')
    .attr('stroke', stroke)
    .attr('stroke-linecap', strokeLinecap)
    .attr('stroke-linejoin', strokeLinejoin)
    .attr('stroke-width', strokeWidth)
    .attr('stroke-opacity', strokeOpacity)
    .selectAll('path')
    .data(d3.group(I, i => Z[i]))
    .join('path')
    .style('mix-blend-mode', mixBlendMode)
    .attr('d', ([, I]) => line(I));

  const Ix = d3.group(I, i => X[i]);

  // Given an array of positions V, offsets positions to ensure the given separation.
  const dodge = (V, separation, maxiter = 10, maxerror = 1e-1) => {
    const n = V.length;
    if (!V.every(isFinite)) throw new Error("invalid position");
    if (!(n > 1)) return V;
    let I = d3.range(V.length);
    for (let iter = 0; iter < maxiter; ++iter) {
      I.sort((i, j) => d3.ascending(V[i], V[j]));
      let error = 0;
      for (let i = 1; i < n; ++i) {
        let delta = V[I[i]] - V[I[i - 1]];
        if (delta < separation) {
          delta = (separation - delta) / 2;
          error = Math.max(error, delta);
          V[I[i - 1]] -= delta;
          V[I[i]] += delta;
        }
      }
      if (error < maxerror) break;
    }
    return V;
  }

  // Sets the specified named attribution on the given selection to the given values,
  // after applying the dodge heuristic to those values to ensure separation. Note
  // that this assumes the selection is not nested (only a single group).
  const dodgeAttr = (selection, name, value, separation) => {
    const V = dodge(selection.data().map(value), separation);
    selection.attr(name, (_, i) => V[i]);
  }

  // Iterates over each column, applying the dodge heuristic on inline labels.
  for (const [i, x] of [...xDomain].entries()) {
    const text = svg.append('g')
      .attr('text-anchor', i === 0 ? 'end' :
        i === xDomain.size - 1 ? 'start' :
        'middle')
      .selectAll('text')
      .data(Ix.get(x))
      .join('text')
      .attr('x', xScale(x))
      .call(dodgeAttr, 'y', i => yScale(Y[i]), labelSeparation)
      .attr('dy', '0.35em')
      .attr('dx', i === 0 ? -1 :
        i === xDomain.size - 1 ? 1 :
        0 * labelPadding)
      .text(i === 0 ? i => `${Z[i]} ${yFormat(Y[i])}` :
        i === xDomain.size - 1 ? i => `${yFormat(Y[i])} ${Z[i]}` :
        i => yFormat(Y[i]))
      .call(text => text.clone(true))
      .attr('fill', 'none')
      .attr('stroke', halo)
      .attr('stroke-width', haloWidth);
  }
}