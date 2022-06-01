/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2018 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/chord-diagram

export const chordDiagram = (data, {
  svgId = 'chord-diagram',
  width = 800,
  height = width,
  formatValue = d3.format(".1~%"),
  outerRadius = Math.min(width, height) * 0.5 - 60,
  innerRadius = outerRadius - 10
} = {}) => {
  const names = data.names === undefined ? d3.range(data.length) : data.names;
  const colors = data.colors === undefined ? d3.quantize(d3.interpolateRainbow, names.length) : data.colors;
  const color = d3.scaleOrdinal(names, colors);

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [-width / 2, -height / 2, width, height]);

  const chord = d3.chord()
    .padAngle(10 / innerRadius)
    .sortSubgroups(d3.descending)
    .sortChords(d3.descending);

  const chords = chord(data);

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

  group.append('title')
    .text(d => `${names[d.index]}
${formatValue(d.value)}`);

  const tickStep = d3.tickStep(0, d3.sum(data.flat()), 100);
  const ticks = ({
    startAngle,
    endAngle,
    value
  }) => {
    const k = (endAngle - startAngle) / value;
    return d3.range(0, value, tickStep).map(value => {
      return {
        value,
        angle: value * k + startAngle
      };
    });
  }

  const groupTick = group.append('g')
    .selectAll('g')
    .data(ticks)
    .join('g')
    .attr('transform', d => `rotate(${d.angle * 180 / Math.PI - 90}) translate(${outerRadius},0)`);

  groupTick.append('line')
    .attr('stroke', 'currentColor')
    .attr('x2', 6);

  groupTick.append('text')
    .attr('x', 8)
    .attr('dy', '0.35em')
    .attr('transform', d => d.angle > Math.PI ? 'rotate(180) translate(-16)' : null)
    .attr('text-anchor', d => d.angle > Math.PI ? 'end' : null)
    .text(d => formatValue(d.value));

  group.select('text')
    .attr('font-weight', 'bold')
    .text(
      function(d) {
        return this.getAttribute('text-anchor') === 'end' ?
          `↑ ${names[d.index]}` :
          `${names[d.index]} ↓`;
      });

  const ribbon = d3.ribbon()
    .radius(innerRadius - 1)
    .padAngle(1 / innerRadius);

  svg.append('g')
    .attr('fill-opacity', 0.8)
    .selectAll('path')
    .data(chords)
    .join('path')
    .style('mix-blend-mode', 'multiply')
    .attr('fill', d => color(names[d.source.index]))
    .attr('d', ribbon)
    .append('title')
    .text(d => `${formatValue(d.source.value)} ${names[d.target.index]} → ${names[d.source.index]}${d.source.index === d.target.index ? '' : `\n${formatValue(d.target.value)} ${names[d.source.index]} → ${names[d.target.index]}`}`);

  return svg.node();
}