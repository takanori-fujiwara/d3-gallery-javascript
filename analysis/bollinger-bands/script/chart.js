/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/bollinger-bands

export const bollingerChart = (data, {
  svgId = 'bollinger-chart',
  x = ([x]) => x, // given d in data, returns the (temporal) x-value
  y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
  N = 20, // number of periods for rolling mean
  K = 2, // number of standard deviations to offset each band
  curve = d3.curveLinear, // method of interpolation between points
  marginTop = 20, // top margin, in pixels
  marginRight = 30, // right margin, in pixels
  marginBottom = 30, // bottom margin, in pixels
  marginLeft = 40, // left margin, in pixels
  width = 640, // outer width, in pixels
  height = 400, // outer height, in pixels
  xDomain, // [xmin, xmax]
  xRange = [marginLeft, width - marginRight], // [left, right]
  yDomain, // [ymin, ymax]
  yRange = [height - marginBottom, marginTop], // [bottom, top]
  yFormat, // a format specifier string for the y-axis
  yLabel, // a label for the y-axis
  colors = ['#aaa', 'green', 'blue', 'red'], // color of the 4 lines
  strokeWidth = 1.5, // width of lines, in pixels
  strokeLinecap = 'round', // stroke line cap of lines
  strokeLinejoin = 'round' // stroke line join of lines
} = {}) => {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const I = d3.range(X.length);

  // Compute default domains.
  if (xDomain === undefined) xDomain = d3.extent(X);
  if (yDomain === undefined) yDomain = [0, d3.max(Y)];

  // Construct scales and axes.
  const xScale = d3.scaleUtc(xDomain, xRange);
  const yScale = d3.scaleLinear(yDomain, yRange);
  const xAxis = d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale).ticks(null, yFormat);

  // Construct a line generator.
  const line = d3.line()
    .defined((y, i) => !isNaN(X[i]) && !isNaN(y))
    .curve(curve)
    .x((y, i) => xScale(X[i]))
    .y((y, i) => yScale(y));

  const bollinger = (N, K) => {
    return values => {
      let i = 0;
      let sum = 0;
      let sum2 = 0;
      const Y = new Float64Array(values.length).fill(NaN);
      for (let n = Math.min(N - 1, values.length); i < n; ++i) {
        const value = values[i];
        sum += value, sum2 += value ** 2;
      }
      for (let n = values.length; i < n; ++i) {
        const value = values[i];
        sum += value, sum2 += value ** 2;
        const mean = sum / N;
        const deviation = Math.sqrt((sum2 - sum ** 2 / N) / (N - 1));
        Y[i] = mean + deviation * K;
        const value0 = values[i - N + 1];
        sum -= value0, sum2 -= value0 ** 2;
      }
      return Y;
    };
  }

  d3.select('body').select(`svg#${svgId}`).remove();

  const svg = d3.select('body').append('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic; overflow: visible;');

  svg.append('g')
    .attr('transform', `translate(0,${height - marginBottom})`)
    .call(xAxis);

  svg.append('g')
    .attr('transform', `translate(${marginLeft},0)`)
    .call(yAxis)
    .call(g => g.select('.domain').remove())
    .call(g => g.selectAll('.tick line').clone()
      .attr('x2', width - marginLeft - marginRight)
      .attr('stroke-opacity', 0.1))
    .call(g => g.append('text')
      .attr('x', -marginLeft)
      .attr('y', 10)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'start')
      .text(yLabel));

  svg.append('g')
    .attr('fill', 'none')
    .attr('stroke-width', strokeWidth)
    .attr('stroke-linejoin', strokeLinejoin)
    .attr('stroke-linecap', strokeLinecap)
    .selectAll()
    .data([Y, ...[-K, 0, +K].map(K => bollinger(N, K)(Y))])
    .join('path')
    .attr('stroke', (d, i) => colors[i])
    .attr('d', line);

  return svg.node();
}