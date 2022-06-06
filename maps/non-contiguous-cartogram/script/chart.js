/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2012–2020 Mike Bostock
// Released under the ISC license.
// https://observablehq.com/@d3/non-contiguous-cartogram

export const nonContiguousCartogram = (data, us, {
  svgId = 'non-contiguous-cartogram',
  width = 975,
  height = 610,
  format = d3.format('.1%')
} = {}) => {
  const color = d3.scaleSequential(d3.extent(Array.from(data.values()).flat()), d3.interpolateReds).nice();

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round');

  const path = d3.geoPath();
  svg.append('path')
    .datum(topojson.mesh(us, us.objects.states))
    .attr('fill', 'none')
    .attr('stroke', '#ccc')
    .attr('d', path);

  const transform = (d, year) => {
    const [x, y] = path.centroid(d);
    return `
  translate(${x},${y})
  scale(${Math.sqrt(data.get(d.id)[year])})
  translate(${-x},${-y})
`;
  }
  const state = svg.append('g')
    .attr('stroke', '#000')
    .selectAll('path')
    .data(topojson.feature(us, us.objects.states).features.filter(d => data.has(d.id)))
    .join('path')
    .attr('vector-effect', 'non-scaling-stroke')
    .attr('d', path)
    .attr('fill', d => color(data.get(d.id)[0]))
    .attr('transform', d => transform(d, 0));

  state.append('title')
    .text(d => `${d.properties.name}
${format(data.get(d.id)[0])} in 2008
${format(data.get(d.id)[1])} in 2018`);

  return Object.assign(svg.node(), {
    update(year) {
      state.transition()
        .duration(750)
        .attr('fill', d => color(data.get(d.id)[year]))
        .attr('transform', d => transform(d, year));
    },
    scales: {
      color
    }
  });
}