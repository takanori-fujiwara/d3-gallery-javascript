/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2018 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/zoomable-icicle

export const zoomableIcicle = (data, {
  svgId = 'zoomable-icicle',
  width = 600,
  height = 800,
  color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1)),
  format = d3.format(',d')
} = {}) => {
  const partition = data => {
    const root = d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.height - a.height || b.value - a.value);
    return d3.partition()
      .size([height, (root.height + 1) * width / 3])
      (root);
  }

  const rectHeight = d => d.x1 - d.x0 - Math.min(1, (d.x1 - d.x0) / 2);
  const labelVisible = d => d.y1 <= width && d.y0 >= 0 && d.x1 - d.x0 > 16;

  const root = partition(data);
  let focus = root;

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .style('font', '10px sans-serif');

  const cell = svg
    .selectAll('g')
    .data(root.descendants())
    .join('g')
    .attr('transform', d => `translate(${d.y0},${d.x0})`);

  const rect = cell.append('rect')
    .attr('width', d => d.y1 - d.y0 - 1)
    .attr('height', d => rectHeight(d))
    .attr('fill-opacity', 0.6)
    .attr('fill', d => {
      if (!d.depth) return '#ccc';
      while (d.depth > 1) d = d.parent;
      return color(d.data.name);
    })
    .style('cursor', 'pointer')

  const text = cell.append('text')
    .style('user-select', 'none')
    .attr('pointer-events', 'none')
    .attr('x', 4)
    .attr('y', 13)
    .attr('fill-opacity', d => +labelVisible(d));

  text.append('tspan')
    .text(d => d.data.name);

  const tspan = text.append('tspan')
    .attr('fill-opacity', d => labelVisible(d) * 0.7)
    .text(d => ` ${format(d.value)}`);

  cell.append('title')
    .text(d => `${d.ancestors().map(d => d.data.name).reverse().join('/')}\n${format(d.value)}`);

  const clicked = (event, p) => {
    focus = focus === p ? p = p.parent : p;

    root.each(d => d.target = {
      x0: (d.x0 - p.x0) / (p.x1 - p.x0) * height,
      x1: (d.x1 - p.x0) / (p.x1 - p.x0) * height,
      y0: d.y0 - p.y0,
      y1: d.y1 - p.y0
    });

    const t = cell.transition().duration(750)
      .attr('transform', d => `translate(${d.target.y0},${d.target.x0})`);

    rect.transition(t).attr('height', d => rectHeight(d.target));
    text.transition(t).attr('fill-opacity', d => +labelVisible(d.target));
    tspan.transition(t).attr('fill-opacity', d => labelVisible(d.target) * 0.7);
  }
  rect.on('click', clicked);

  return svg.node();
}