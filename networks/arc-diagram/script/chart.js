/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2019 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/arc-diagram

const prepareGraph = data => {
  const nodes = data.nodes.map(({
    id,
    group
  }) => ({
    id,
    sourceLinks: [],
    targetLinks: [],
    group
  }));

  const nodeById = new Map(nodes.map(d => [d.id, d]));

  const links = data.links.map(({
    source,
    target,
    value
  }) => ({
    source: nodeById.get(source),
    target: nodeById.get(target),
    value
  }));

  for (const link of links) {
    const {
      source,
      target,
      value
    } = link;
    source.sourceLinks.push(link);
    target.targetLinks.push(link);
  }

  return {
    nodes,
    links
  };
}

export const arcDiagram = (data, {
  svgId = 'arc-diagram',
  step = 14,
  order = (a, b) => a.group - b.group || d3.ascending(a.id, b.id),
  marginTop = 20,
  marginRight = 20,
  marginBottom = 20,
  marginLeft = 100,
  width = 800,
  height = (data.nodes.length - 1) * step + marginTop + marginBottom
} = {}) => {
  const graph = prepareGraph(data);

  const color = d3.scaleOrdinal(graph.nodes.map(d => d.group).sort(d3.ascending), d3.schemeCategory10);

  const y = d3.scalePoint(graph.nodes.map(d => d.id).sort(d3.ascending), [marginTop, height - marginBottom]);

  const arc = d => {
    const y1 = d.source.y;
    const y2 = d.target.y;
    const r = Math.abs(y2 - y1) / 2;
    return `M${marginLeft},${y1}A${r},${r} 0,0,${y1 < y2 ? 1 : 0} ${marginLeft},${y2}`;
  }

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height]);

  svg.append('style').text(`

.hover path {
  stroke: #ccc;
}

.hover text {
  fill: #ccc;
}

.hover g.primary text {
  fill: black;
  font-weight: bold;
}

.hover g.secondary text {
  fill: #333;
}

.hover path.primary {
  stroke: #333;
  stroke-opacity: 1;
}

`);

  const label = svg.append('g')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)
    .attr('text-anchor', 'end')
    .selectAll('g')
    .data(graph.nodes)
    .join('g')
    .attr('transform', d => `translate(${marginLeft},${d.y = y(d.id)})`)
    .call(g => g.append('text')
      .attr('x', -6)
      .attr('dy', '0.35em')
      .attr('fill', d => d3.lab(color(d.group)).darker(2))
      .text(d => d.id))
    .call(g => g.append('circle')
      .attr('r', 3)
      .attr('fill', d => color(d.group)));

  const path = svg.insert('g', '*')
    .attr('fill', 'none')
    .attr('stroke-opacity', 0.6)
    .attr('stroke-width', 1.5)
    .selectAll('path')
    .data(graph.links)
    .join('path')
    .attr('stroke', d => d.source.group === d.target.group ? color(d.source.group) : '#aaa')
    .attr('d', arc);

  const overlay = svg.append('g')
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .selectAll('rect')
    .data(graph.nodes)
    .join('rect')
    .attr('width', marginLeft + 40)
    .attr('height', step)
    .attr('y', d => y(d.id) - step / 2)
    .on('mouseover', d => {
      svg.classed('hover', true);
      label.classed('primary', n => n === d);
      label.classed('secondary', n => n.sourceLinks.some(l => l.target === d) || n.targetLinks.some(l => l.source === d));
      path.classed('primary', l => l.source === d || l.target === d).filter('.primary').raise();
    })
    .on('mouseout', d => {
      svg.classed('hover', false);
      label.classed('primary', false);
      label.classed('secondary', false);
      path.classed('primary', false).order();
    });

  const update = order => {
    y.domain(graph.nodes.sort(order).map(d => d.id));

    const t = svg.transition()
      .duration(750);

    label.transition(t)
      .delay((d, i) => i * 20)
      .attrTween('transform', d => {
        const i = d3.interpolateNumber(d.y, y(d.id));
        return t => `translate(${marginLeft},${d.y = i(t)})`;
      });

    path.transition(t)
      .duration(750 + graph.nodes.length * 20)
      .attrTween('d', d => () => arc(d));

    overlay.transition(t)
      .delay((d, i) => i * 20)
      .attr('y', d => y(d.id) - step / 2);
  }

  return Object.assign(svg.node(), {
    update
  });
}