/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2019 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/zoom-to-bounding-box

export const zoomToBoundingBox = (data, {
  svgId = 'zoom-to-bounding-box',
  width = 975,
  height = 610
} = {}) => {
  const path = d3.geoPath();

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height]);

  const g = svg.append('g');

  const states = g.append('g')
    .attr('fill', '#444')
    .attr('cursor', 'pointer')
    .selectAll('path')
    .data(topojson.feature(data, data.objects.states).features)
    .join('path')
    .attr('d', path);

  states.append('title')
    .text(d => d.properties.name);

  g.append('path')
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('stroke-linejoin', 'round')
    .attr('d', path(topojson.mesh(data, data.objects.states, (a, b) => a !== b)));

  const zoomed = event => {
    const {
      transform
    } = event;
    g.attr('transform', transform);
    g.attr('stroke-width', 1 / transform.k);
  }
  const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on('zoom', zoomed);
  svg.call(zoom);

  const reset = () => {
    states.transition().style('fill', null);
    svg.transition().duration(750).call(
      zoom.transform,
      d3.zoomIdentity,
      d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
    );
  }
  svg.on('click', reset);

  function clicked(event, d, i, node) {
    const [
      [x0, y0],
      [x1, y1]
    ] = path.bounds(d);
    event.stopPropagation();
    states.transition().style('fill', null);
    d3.select(this).transition().style('fill', 'red');
    svg.transition().duration(750).call(
      zoom.transform,
      d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
      .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
      d3.pointer(event, svg.node())
    );
  }
  states.on('click', clicked);

  return svg.node();
}