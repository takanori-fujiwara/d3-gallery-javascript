/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/marimekko-chart

export const marimekkoChart = (data, {
  svgId = 'marimekko-chart',
  width = 1000,
  height = 800,
  marginTop = 40,
  marginRight = -1,
  marginBottom = -1,
  marginLeft = 1,
  color = d3.scaleOrdinal(d3.schemeCategory10).domain(data.map(d => d.y)),
  format = d => d.toLocaleString()
} = {}) => {
  const treemap = data => d3.treemap()
    .round(true)
    .tile(d3.treemapSliceDice)
    .size([
      width - marginLeft - marginRight,
      height - marginTop - marginBottom
    ])
    (d3.hierarchy(d3.group(data, d => d.x, d => d.y)).sum(d => d.value))
    .each(d => {
      d.x0 += marginLeft;
      d.x1 += marginLeft;
      d.y0 += marginTop;
      d.y1 += marginTop;
    });

  const root = treemap(data);

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

  const node = svg.selectAll('g')
    .data(root.descendants())
    .join('g')
    .attr('transform', d => `translate(${d.x0},${d.y0})`);

  const column = node.filter(d => d.depth === 1);

  column.append('text')
    .attr('x', 3)
    .attr('y', '-1.7em')
    .style('font-weight', 'bold')
    .text(d => d.data[0]);

  column.append('text')
    .attr('x', 3)
    .attr('y', '-0.5em')
    .attr('fill-opacity', 0.7)
    .text(d => format(d.value));

  column.append('line')
    .attr('x1', -0.5)
    .attr('x2', -0.5)
    .attr('y1', -30)
    .attr('y2', d => d.y1 - d.y0)
    .attr('stroke', '#000')

  const cell = node.filter(d => d.depth === 2);

  cell.append('rect')
    .attr('fill', d => color(d.data[0]))
    .attr('fill-opacity', (d, i) => d.value / d.parent.value)
    .attr('width', d => d.x1 - d.x0 - 1)
    .attr('height', d => d.y1 - d.y0 - 1);

  cell.append('text')
    .attr('x', 3)
    .attr('y', '1.1em')
    .text(d => d.data[0]);

  cell.append('text')
    .attr('x', 3)
    .attr('y', '2.3em')
    .attr('fill-opacity', 0.7)
    .text(d => format(d.value));

  return svg.node();
}