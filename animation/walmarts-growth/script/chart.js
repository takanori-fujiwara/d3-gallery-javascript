/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2018 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@mbostock/walmarts-growth

export const walmartsGrowth = (data, us, {
  svgId = 'walmarts-growth',
  width = 960,
  height = 600
} = {}) => {
  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height]);

  svg.append('path')
    .datum(topojson.merge(us, us.objects.lower48.geometries))
    .attr('fill', '#ddd')
    .attr('d', d3.geoPath());

  svg.append('path')
    .datum(topojson.mesh(us, us.objects.lower48, (a, b) => a !== b))
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('stroke-linejoin', 'round')
    .attr('d', d3.geoPath());

  const g = svg.append('g')
    .attr('fill', 'none')
    .attr('stroke', 'black');

  const dot = g.selectAll('circle')
    .data(data)
    .join('circle')
    .attr('transform', d => `translate(${d})`);

  svg.append('circle')
    .attr('fill', 'blue')
    .attr('transform', `translate(${data[0]})`)
    .attr('r', 3);

  let previousDate = -Infinity;

  return Object.assign(svg.node(), {
    update(date) {
      dot // enter
        .filter(d => d.date > previousDate && d.date <= date)
        .transition().attr('r', 3);
      dot // exit
        .filter(d => d.date <= previousDate && d.date > date)
        .transition().attr('r', 0);
      previousDate = date;
    }
  });
}