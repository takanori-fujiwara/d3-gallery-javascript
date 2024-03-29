/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2018 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/chord-dependency-diagram

export const chordDependencyDiagram = (data, {
  svgId = 'chord-dependency-diagram',
  width = 954,
  height = width,
  innerRadius = Math.min(width, height) * 0.5 - 90,
  outerRadius = innerRadius + 10
} = {}) => {
  const names = Array.from(new Set(data.flatMap(d => [d.source, d.target]))).sort(d3.ascending);
  const index = new Map(names.map((name, i) => [name, i]));
  const matrix = Array.from(index, () => new Array(names.length).fill(0));
  for (const {
      source,
      target,
      value
    } of data) {
    matrix[index.get(source)][index.get(target)] += value
  };

  const color = d3.scaleOrdinal(names, d3.quantize(d3.interpolateRainbow, names.length));

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [-width / 2, -height / 2, width, height]);

  const chord = d3.chordDirected()
    .padAngle(10 / innerRadius)
    .sortSubgroups(d3.descending)
    .sortChords(d3.descending);

  const chords = chord(matrix);

  const group = svg.append('g')
    .attr('font-size', 10)
    .attr('font-family', 'sans-serif')
    .selectAll('g')
    .data(chords.groups)
    .join('g');

  const arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  group.append('path')
    .attr('fill', d => color(names[d.index]))
    .attr('d', arc);

  group.append('text')
    .each(d => (d.angle = (d.startAngle + d.endAngle) / 2))
    .attr('dy', '0.35em')
    .attr('transform', d => `
        rotate(${(d.angle * 180 / Math.PI - 90)})
        translate(${outerRadius + 5})
        ${d.angle > Math.PI ? 'rotate(180)' : ''}
      `)
    .attr('text-anchor', d => d.angle > Math.PI ? 'end' : null)
    .text(d => names[d.index]);

  group.append('title')
    .text(d => `${names[d.index]}
${d3.sum(chords, c => (c.source.index === d.index) * c.source.value)} outgoing →
${d3.sum(chords, c => (c.target.index === d.index) * c.source.value)} incoming ←`);

  const ribbon = d3.ribbonArrow()
    .radius(innerRadius - 1)
    .padAngle(1 / innerRadius);

  svg.append('g')
    .attr('fill-opacity', 0.75)
    .selectAll('path')
    .data(chords)
    .join('path')
    .style('mix-blend-mode', 'multiply')
    .attr('fill', d => color(names[d.target.index]))
    .attr('d', ribbon)
    .append('title')
    .text(d => `${names[d.source.index]} → ${names[d.target.index]} ${d.source.value}`);

  return svg.node();
}