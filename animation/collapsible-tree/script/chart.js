/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2018 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/collapsible-tree

export const collapsibleTree = (data, {
  svgId = 'collapsible-tree',
  marginTop = 10,
  width = 800,
  marginRight = 120,
  marginBottom = 10,
  marginLeft = 40,
  dx = 10,
  dy = width / 6
} = {}) => {

  const root = d3.hierarchy(data);

  root.x0 = dy / 2;
  root.y0 = 0;
  root.descendants().forEach((d, i) => {
    d.id = i;
    d._children = d.children;
    if (d.depth && d.data.name.length !== 7) d.children = null;
  });

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('viewBox', [-marginLeft, -marginTop, width, dx])
    .style('font', '10px sans-serif')
    .style('user-select', 'none');

  const gLink = svg.append('g')
    .attr('fill', 'none')
    .attr('stroke', '#555')
    .attr('stroke-opacity', 0.4)
    .attr('stroke-width', 1.5);

  const gNode = svg.append('g')
    .attr('cursor', 'pointer')
    .attr('pointer-events', 'all');

  const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);
  const tree = d3.tree().nodeSize([dx, dy]);

  const update = source => {
    const duration = d3.event && d3.event.altKey ? 2500 : 250;
    const nodes = root.descendants().reverse();
    const links = root.links();

    // Compute the new tree layout.
    tree(root);

    let left = root;
    let right = root;
    root.eachBefore(node => {
      if (node.x < left.x) left = node;
      if (node.x > right.x) right = node;
    });

    const height = right.x - left.x + marginTop + marginBottom;

    const transition = svg.transition()
      .duration(duration)
      .attr('viewBox', [-marginLeft, left.x - marginTop, width, height])
      .tween('resize', window.ResizeObserver ? null : () => () => svg.dispatch('toggle'));

    // Update the nodes…
    const node = gNode.selectAll('g')
      .data(nodes, d => d.id);

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node.enter().append('g')
      .attr('transform', d => `translate(${source.y0},${source.x0})`)
      .attr('fill-opacity', 0)
      .attr('stroke-opacity', 0)
      .on('click', (event, d) => {
        d.children = d.children ? null : d._children;
        update(d);
      });

    nodeEnter.append('circle')
      .attr('r', 2.5)
      .attr('fill', d => d._children ? '#555' : '#999')
      .attr('stroke-width', 10);

    nodeEnter.append('text')
      .attr('dy', '0.31em')
      .attr('x', d => d._children ? -6 : 6)
      .attr('text-anchor', d => d._children ? 'end' : 'start')
      .text(d => d.data.name)
      .clone(true).lower()
      .attr('stroke-linejoin', 'round')
      .attr('stroke-width', 3)
      .attr('stroke', 'white');

    // Transition nodes to their new position.
    const nodeUpdate = node.merge(nodeEnter).transition(transition)
      .attr('transform', d => `translate(${d.y},${d.x})`)
      .attr('fill-opacity', 1)
      .attr('stroke-opacity', 1);

    // Transition exiting nodes to the parent's new position.
    const nodeExit = node.exit().transition(transition).remove()
      .attr('transform', d => `translate(${source.y},${source.x})`)
      .attr('fill-opacity', 0)
      .attr('stroke-opacity', 0);

    // Update the links…
    const link = gLink.selectAll('path')
      .data(links, d => d.target.id);

    // Enter any new links at the parent's previous position.
    const linkEnter = link.enter().append('path')
      .attr('d', d => {
        const o = {
          x: source.x0,
          y: source.y0
        };
        return diagonal({
          source: o,
          target: o
        });
      });

    // Transition links to their new position.
    link.merge(linkEnter).transition(transition)
      .attr('d', diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition(transition).remove()
      .attr('d', d => {
        const o = {
          x: source.x,
          y: source.y
        };
        return diagonal({
          source: o,
          target: o
        });
      });

    // Stash the old positions for transition.
    root.eachBefore(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  update(root);

  return svg.node();
}