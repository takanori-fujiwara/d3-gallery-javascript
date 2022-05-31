/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2019 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/moving-average

export const movingAverage = (data, {
  svgId = 'moving-average',
  N = 100,
  width = 800,
  height = 500,
  marginTop = 20,
  marginRight = 12,
  marginBottom = 30,
  marginLeft = 30,
} = {}) => {
  const x = d3.scaleTime()
    .domain(d3.extent(data))
    .range([marginLeft, width - marginRight]);

  const movingAverage = (values, N) => {
    let i = 0;
    let sum = 0;
    const means = new Float64Array(values.length).fill(NaN);
    for (let n = Math.min(N - 1, values.length); i < n; ++i) {
      sum += values[i];
    }
    for (let n = values.length; i < n; ++i) {
      sum += values[i];
      means[i] = sum / N;
      sum -= values[i - N + 1];
    }
    return means;
  }

  const bins = d3.histogram()
    .domain(x.domain())
    .thresholds(x.ticks(d3.timeDay))
    (data);

  const values = movingAverage(bins.map(d => d.length), N);

  const y = d3.scaleLinear()
    .domain([0, d3.max(values)]).nice()
    .rangeRound([height - marginBottom, marginTop]);

  const xAxis = g => g
    .attr('transform', `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));

  const yAxis = g => g
    .attr('transform', `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select('.domain').remove())
    .call(g => g.selectAll('.tick line').clone()
      .attr('x2', width)
      .attr('stroke-opacity', 0.1));

  const area = d3.area()
    .defined(d => !isNaN(d))
    .x((d, i) => x(bins[i].x0))
    .y0(y(0))
    .y1(y);

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height]);

  svg.append('g')
    .call(xAxis);

  svg.append('g')
    .call(yAxis);

  svg.append('path')
    .attr('fill', 'steelblue')
    .attr('d', area(values));

  return Object.assign(svg.node(), {
    svgId: svgId
  });
}