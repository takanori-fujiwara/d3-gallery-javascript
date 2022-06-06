/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2012-2020 Mike Bostock
// Released under the ISC license.
// https://observablehq.com/@d3/u-s-airports-voronoi

export const usAirportsVoronoi = (data, us, {
  svgId = 'u-s-airports-voronoi',
  width = 975,
  height = 610,
  projection = d3.geoAlbers().scale(1300).translate([487.5, 305])
} = {}) => {
  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height]);

  svg.append('path')
    .datum(topojson.merge(us, us.objects.states.geometries.filter(d => d.id !== '02' && d.id !== '15')))
    .attr('fill', '#ddd')
    .attr('d', d3.geoPath());

  svg.append('path')
    .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('stroke-linejoin', 'round')
    .attr('d', d3.geoPath());

  svg.append('g')
    .attr('fill', 'none')
    .attr('stroke', 'red')
    .attr('pointer-events', 'all')
    .selectAll('path')
    .data(d3.geoVoronoi().polygons(data).features)
    .join('path')
    .attr('d', d3.geoPath(projection))
    .append('title')
    .text(d => {
      const p = d.properties.site.properties;
      return `${p.name} Airport
${p.city}, ${p.state}`;
    });

  svg.append('path')
    .datum({
      type: 'FeatureCollection',
      features: data
    })
    .attr('d', d3.geoPath(projection).pointRadius(1.5));

  return svg.node();
}