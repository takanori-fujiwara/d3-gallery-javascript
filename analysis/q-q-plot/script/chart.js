/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2019 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/q-q-plot

export const qQPlot = (data, {
  svgId = 'q-q-plot',
  width = 800,
  height = width,
  marginTop = 20,
  marginRight = 40,
  marginBottom = 30,
  marginLeft = 40
} = {}) => {
  const qx = Float64Array.from(data.qx).sort(d3.ascending);
  const qy = Float64Array.from(data.qy).sort(d3.ascending);
  const qmin = Math.min(qx[0], qy[0]);
  const qmax = Math.max(qx[qx.length - 1], qy[qy.length - 1]);
  const n = Math.min(qx.length, qy.length);

  const x = d3.scaleLinear()
    .domain([qmin, qmax]).nice()
    .range([marginLeft, width - marginRight]);
  const y = d3.scaleLinear()
    .domain([qmin, qmax]).nice()
    .range([height - marginBottom, marginTop]);

  const xAxis = g => g
    .attr('transform', `translate(0,${height - marginBottom + 6})`)
    .call(d3.axisBottom(x.copy().interpolate(d3.interpolateRound)))
    .call(g => g.select('.domain').remove())
    .call(g => g.selectAll('.tick line').clone()
      .attr('stroke-opacity', 0.1)
      .attr('y1', -height))
    .call(g => g.append('text')
      .attr('x', width - marginRight)
      .attr('y', -3)
      .attr('fill', 'currentColor')
      .attr('font-weight', 'bold')
      .text(data.x));
  const yAxis = g => g
    .attr('transform', `translate(${marginLeft - 6},0)`)
    .call(d3.axisLeft(y.copy().interpolate(d3.interpolateRound)))
    .call(g => g.select('.domain').remove())
    .call(g => g.selectAll('.tick line').clone()
      .attr('stroke-opacity', 0.1)
      .attr('x1', width))
    .call(g => g.select('.tick:last-of-type text').clone()
      .attr('x', 3)
      .attr('text-anchor', 'start')
      .attr('font-weight', 'bold')
      .text(data.y));

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .style('max-width', `${width}px`);

  svg.append('g')
    .call(xAxis);
  svg.append('g')
    .call(yAxis);

  svg.append('line')
    .attr('stroke', 'currentColor')
    .attr('stroke-opacity', 0.3)
    .attr('x1', x(qmin))
    .attr('x2', x(qmax))
    .attr('y1', y(qmin))
    .attr('y2', y(qmax));

  const q = (Q, i) => {
    if (Q.length === n) return Q[i];
    const j = i / (n - 1) * (Q.length - 1);
    const j0 = Math.floor(j);
    const t = j - j0;
    return t ? Q[j0] * (1 - t) + Q[j0 + 1] * t : Q[j0];
  }
  svg.append('g')
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.5)
    .selectAll('circle')
    .data(d3.range(n))
    .join('circle')
    .attr('cx', i => x(q(qx, i)))
    .attr('cy', i => y(q(qy, i)))
    .attr('r', 3);

  return svg.node();
}