/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2019 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/hexbin-map

export const hexbinMap = (data, us, {
  svgId = 'hexbin-map',
  width = 975,
  height = 610
} = {}) => {
  const hexbin = d3.hexbin()
    .extent([
      [0, 0],
      [width, height]
    ]).radius(10);
  const projection = d3.geoAlbersUsa().scale(1300).translate([width / 2, height / 2]);
  const parseDate = d3.utcParse('%m/%d/%Y');

  const processedData = Object.assign(
    hexbin(data.map(d => {
      const p = projection(d);
      p.date = parseDate(d.date);
      return p;
    }))
    .map(d => (d.date = new Date(d3.median(d, d => d.date)), d))
    .sort((a, b) => b.length - a.length));

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height]);

  svg.append('path')
    .datum(topojson.mesh(us, us.objects.states))
    .attr('fill', 'none')
    .attr('stroke', '#777')
    .attr('stroke-width', 0.5)
    .attr('stroke-linejoin', 'round')
    .attr('d', d3.geoPath());

  const radius = d3.scaleSqrt([0, d3.max(processedData, d => d.length)], [0, hexbin.radius() * Math.SQRT2]);
  const color = d3.scaleSequential(d3.extent(processedData, d => d.date), d3.interpolateSpectral);

  svg.append('g')
    .selectAll('path')
    .data(processedData)
    .join('path')
    .attr('transform', d => `translate(${d.x},${d.y})`)
    .attr('d', d => hexbin.hexagon(radius(d.length)))
    .attr('fill', d => color(d.date))
    .attr('stroke', d => d3.lab(color(d.date)).darker())
    .append('title')
    .text(d => `${d.length.toLocaleString()} stores
${d.date.getFullYear()} median opening`);

  return Object.assign(svg.node(), {
    scales: {
      color
    }
  });
}