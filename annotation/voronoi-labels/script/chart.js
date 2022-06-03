/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2018 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/voronoi-labels

export const voronoiLabels = (data, {
  svgId = 'voronoi-labels',
  width = 800,
  height = 600
} = {}) => {
  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height]);

  const delaunay = d3.Delaunay.from(data);
  const voronoi = delaunay.voronoi([-1, -1, width + 1, height + 1]);
  const cells = data.map((d, i) => [d, voronoi.cellPolygon(i)]);

  svg.append('g')
    .attr('stroke', 'orange')
    .selectAll('path')
    .data(cells)
    .join('path')
    .attr('d', ([d, cell]) => `M${d3.polygonCentroid(cell)}L${d}`);

  svg.append('path')
    .attr('fill', 'none')
    .attr('stroke', '#ccc')
    .attr('d', voronoi.render());

  svg.append('path')
    .attr('d', delaunay.renderPoints(null, 2));

  const orient = {
    top: text => text.attr('text-anchor', 'middle').attr('y', -6),
    right: text => text.attr('text-anchor', 'start').attr('dy', '0.35em').attr('x', 6),
    bottom: text => text.attr('text-anchor', 'middle').attr('dy', '0.71em').attr('y', 6),
    left: text => text.attr('text-anchor', 'end').attr('dy', '0.35em').attr('x', -6)
  };

  svg.append('g')
    .style('font', '10px sans-serif')
    .selectAll('text')
    .data(cells)
    .join('text')
    .each(
      function([
        [x, y], cell
      ]) {
        const [cx, cy] = d3.polygonCentroid(cell);
        const angle = (Math.round(Math.atan2(cy - y, cx - x) / Math.PI * 2) + 4) % 4;
        d3.select(this).call(angle === 0 ? orient.right :
          angle === 3 ? orient.top :
          angle === 1 ? orient.bottom :
          orient.left);
      })
    .attr('transform', ([d]) => `translate(${d})`)
    .attr('display', ([, cell]) => -d3.polygonArea(cell) > 2000 ? null : 'none')
    .text((d, i) => i);

  return svg.node();
}