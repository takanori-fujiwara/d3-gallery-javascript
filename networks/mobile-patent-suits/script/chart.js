/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2020 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/mobile-patent-suits

const linkArc = d => {
  const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
  return `
    M${d.source.x},${d.source.y}
    A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
  `;
}

const drag = simulation => {
  const dragstarted = (event, d) => {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  const dragged = (event, d) => {
    d.fx = event.x;
    d.fy = event.y;
  }
  const dragended = (event, d) => {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3.drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended);
}

export const mobilePatentSuits = (data, {
  svgId = 'mobile-patent-suits',
  width = 800,
  height = 600,
  invalidation = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 8000);
  })
} = {}) => {
  const links = data.links.map(d => Object.create(d));
  const nodes = data.nodes.map(d => Object.create(d));

  const types = Array.from(new Set(data.links.map(d => d.type)));
  const color = d3.scaleOrdinal(types, d3.schemeCategory10);

  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id))
    .force('charge', d3.forceManyBody().strength(-400))
    .force('x', d3.forceX())
    .force('y', d3.forceY());

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [-width / 2, -height / 2, width, height])
    .style('font', '12px sans-serif');

  // Per-type markers, as they don't inherit styles.
  svg.append('defs').selectAll('marker')
    .data(types)
    .join('marker')
    .attr('id', d => `arrow-${d}`)
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 15)
    .attr('refY', -0.5)
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('orient', 'auto')
    .append('path')
    .attr('fill', color)
    .attr('d', 'M0,-5L10,0L0,5');

  const link = svg.append('g')
    .attr('fill', 'none')
    .attr('stroke-width', 1.5)
    .selectAll('path')
    .data(links)
    .join('path')
    .attr('stroke', d => color(d.type))
    .attr('marker-end', d => `url(${new URL(`#arrow-${d.type}`, location)})`);

  const node = svg.append('g')
    .attr('fill', 'currentColor')
    .attr('stroke-linecap', 'round')
    .attr('stroke-linejoin', 'round')
    .selectAll('g')
    .data(nodes)
    .join('g')
    .call(drag(simulation));

  node.append('circle')
    .attr('stroke', 'white')
    .attr('stroke-width', 1.5)
    .attr('r', 4);

  node.append('text')
    .attr('x', 8)
    .attr('y', '0.31em')
    .text(d => d.id)
    .clone(true).lower()
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('stroke-width', 3);

  simulation.on('tick', () => {
    link.attr('d', linkArc);
    node.attr('transform', d => `translate(${d.x},${d.y})`);
  });

  invalidation.then(() => simulation.stop());

  return Object.assign(svg.node(), {
    scales: {
      color
    }
  });
}