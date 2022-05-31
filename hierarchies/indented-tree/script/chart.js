/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2020 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/indented-tree

export const indentedTree = (data, {
  svgId = 'indented-tree',
  width = 800,
  nodeSize = 17,
  format = d3.format(',')
} = {}) => {
  const root = d3.hierarchy(data).eachBefore((d, i) => d.index = i);
  const nodes = root.descendants();

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('viewBox', [-nodeSize / 2, -nodeSize * 3 / 2, width, (nodes.length + 1) * nodeSize])
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)
    .style('overflow', 'visible');

  const link = svg.append('g')
    .attr('fill', 'none')
    .attr('stroke', '#999')
    .selectAll('path')
    .data(root.links())
    .join('path')
    .attr('d', d => `
        M${d.source.depth * nodeSize},${d.source.index * nodeSize}
        V${d.target.index * nodeSize}
        h${nodeSize}
      `);

  const node = svg.append('g')
    .selectAll('g')
    .data(nodes)
    .join('g')
    .attr('transform', d => `translate(0,${d.index * nodeSize})`);

  node.append('circle')
    .attr('cx', d => d.depth * nodeSize)
    .attr('r', 2.5)
    .attr('fill', d => d.children ? null : '#999');

  node.append('text')
    .attr('dy', '0.32em')
    .attr('x', d => d.depth * nodeSize + 6)
    .text(d => d.data.name);

  node.append('title')
    .text(d => d.ancestors().reverse().map(d => d.data.name).join('/'));

  const columns = [{
    label: 'Size',
    value: d => d.value,
    format,
    x: 280
  }, {
    label: 'Count',
    value: d => d.children ? 0 : 1,
    format: (value, d) => d.children ? format(value) : '-',
    x: 340
  }];

  for (const {
      label,
      value,
      format,
      x
    } of columns) {
    svg.append('text')
      .attr('dy', '0.32em')
      .attr('y', -nodeSize)
      .attr('x', x)
      .attr('text-anchor', 'end')
      .attr('font-weight', 'bold')
      .text(label);

    node.append('text')
      .attr('dy', '0.32em')
      .attr('x', x)
      .attr('text-anchor', 'end')
      .attr('fill', d => d.children ? null : '#555')
      .data(root.copy().sum(value).descendants())
      .text(d => format(d.value, d));
  }

  return svg.node();
}