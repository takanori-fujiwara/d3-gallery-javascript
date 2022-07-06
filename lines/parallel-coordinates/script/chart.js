/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2019 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/parallel-coordinates

export const parallelCoordinates = (data, {
  svgId = 'parallel-coordinates',
  keyz = 'weight (lb)',
  width = 800,
  height = (data.columns.length - 1) * 100,
  marginTop = 20,
  marginRight = 10,
  marginBottom = 20,
  marginLeft = 10
} = {}) => {
  const keys = data.columns.slice(1);

  const x = new Map(Array.from(keys, key => [key, d3.scaleLinear(d3.extent(data, d => d[key]),
    [marginLeft, width - marginRight])]));
  const y = d3.scalePoint(keys, [marginTop, height - marginBottom]);
  const z = d3.scaleSequential(x.get(keyz).domain(), t => d3.interpolateBrBG(1 - t));

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height]);

  const line = d3.line()
    .defined(([, value]) => value != null)
    .x(([key, value]) => x.get(key)(value))
    .y(([key]) => y(key));

  svg.append('g')
    .attr('fill', 'none')
    .attr('stroke-width', 1.5)
    .attr('stroke-opacity', 0.4)
    .selectAll('path')
    .data(data.slice().sort((a, b) => d3.ascending(a[keyz], b[keyz])))
    .join('path')
    .attr('stroke', d => z(d[keyz]))
    .attr('d', d => line(d3.cross(keys, [d], (key, d) => [key, d[key]])))
    .append('title')
    .text(d => d.name);

  svg.append('g')
    .selectAll('g')
    .data(keys)
    .join('g')
    .attr('transform', d => `translate(0,${y(d)})`)
    .each(
      function(d) {
        d3.select(this).call(d3.axisBottom(x.get(d)));
      })
    .call(g => g.append('text')
      .attr('x', marginLeft)
      .attr('y', -6)
      .attr('text-anchor', 'start')
      .attr('fill', 'currentColor')
      .text(d => d))
    .call(g => g.selectAll('text')
      .clone(true).lower()
      .attr('fill', 'none')
      .attr('stroke-width', 5)
      .attr('stroke-linejoin', 'round')
      .attr('stroke', 'white'));

  return Object.assign(svg.node(), {
    scales: {
      z
    }
  });
}