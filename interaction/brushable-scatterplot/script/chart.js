/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2017 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/brushable-scatterplot

export const brushableScatterplot = (data, {
  width = 800,
  height = 600,
  marginTop = 20,
  marginRight = 30,
  marginBottom = 30,
  marginLeft = 40
} = {}) => {
  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.x)).nice()
    .range([marginLeft, width - marginRight]);

  const y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.y)).nice()
    .range([height - marginBottom, marginTop]);

  const xAxis = g => g
    .attr('transform', `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x))
    .call(g => g.select('.domain').remove())
    .call(g => g.append('text')
      .attr('x', width - marginRight)
      .attr('y', -4)
      .attr('fill', '#000')
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'end')
      .text(data.x));

  const yAxis = g => g
    .attr('transform', `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select('.domain').remove())
    .call(g => g.select('.tick:last-of-type text').clone()
      .attr('x', 4)
      .attr('text-anchor', 'start')
      .attr('font-weight', 'bold')
      .text(data.y));

  const svg = d3.create('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .property('value', []);

  svg.append('g')
    .call(xAxis);
  svg.append('g')
    .call(yAxis);

  const dot = svg.append('g')
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.5)
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('transform', d => `translate(${x(d.x)},${y(d.y)})`)
    .attr('r', 3);

  const brushed = ({
    selection
  }) => {
    if (selection) {
      const [
        [x0, y0],
        [x1, y1]
      ] = selection;
      // Note: by checking stroke style or assigning attr('selected', false/true),
      // we can easily find selected elements
      const value = dot
        .style('stroke', 'gray')
        .filter(d => x0 <= x(d.x) && x(d.x) < x1 && y0 <= y(d.y) && y(d.y) < y1)
        .style('stroke', 'steelblue')
        .data();
      svg.property('value', value).dispatch('input');
    } else {
      dot.style('stroke', 'steelblue');
    }
  }

  const brush = d3.brush()
    .on('start brush end', brushed);

  svg.call(brush);

  return svg.node();
}