/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2019 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/brushable-scatterplot-matrix

export const brushableScatterplotMatrix = (data, {
  width = 800,
  padding = 28
} = {}) => {
  const columns = data.columns.filter(d => typeof data[0][d] === 'number');
  const size = (width - (columns.length + 1) * padding) / columns.length + padding;

  const x = columns.map(c => d3.scaleLinear()
    .domain(d3.extent(data, d => d[c]))
    .rangeRound([padding / 2, size - padding / 2]));
  const y = x.map(x => x.copy().range([size - padding / 2, padding / 2]));
  const z = d3.scaleOrdinal()
    .domain(data.map(d => d.species))
    .range(d3.schemeCategory10);

  const xAxis = g => g.selectAll('g').data(x).join('g')
    .attr('transform', (d, i) => `translate(${i * size},0)`)
    .each(function(d) {
      return d3.select(this).call(d3.axisBottom()
        .ticks(6)
        .tickSize(size * columns.length)
        .scale(d));
    })
    .call(g => g.select('.domain').remove())
    .call(g => g.selectAll('.tick line').attr('stroke', '#ddd'));
  const yAxis = g => g.selectAll('g').data(y).join('g')
    .attr('transform', (d, i) => `translate(0,${i * size})`)
    .each(function(d) {
      return d3.select(this).call(d3.axisLeft()
        .ticks(6)
        .tickSize(-size * columns.length)
        .scale(d));
    })
    .call(g => g.select('.domain').remove())
    .call(g => g.selectAll('.tick line').attr('stroke', '#ddd'));

  const svg = d3.create('svg')
    .attr('width', width)
    .attr('height', width)
    .attr('viewBox', [-padding, 0, width, width]);

  svg.append('style')
    .text(`circle.hidden { fill: #000; fill-opacity: 1; r: 1px; }`);
  svg.append('g')
    .call(xAxis);
  svg.append('g')
    .call(yAxis);

  const cell = svg.append('g')
    .selectAll('g')
    .data(d3.cross(d3.range(columns.length), d3.range(columns.length)))
    .join('g')
    .attr('transform', ([i, j]) => `translate(${i * size},${j * size})`);

  cell.append('rect')
    .attr('fill', 'none')
    .attr('stroke', '#aaa')
    .attr('x', padding / 2 + 0.5)
    .attr('y', padding / 2 + 0.5)
    .attr('width', size - padding)
    .attr('height', size - padding);

  cell.each(function([i, j]) {
    d3.select(this).selectAll('circle')
      .data(data.filter(d => !isNaN(d[columns[i]]) && !isNaN(d[columns[j]])))
      .join('circle')
      .attr('cx', d => x[i](d[columns[i]]))
      .attr('cy', d => y[j](d[columns[j]]));
  });

  const circle = cell.selectAll('circle')
    .attr('r', 3.5)
    .attr('fill-opacity', 0.7)
    .attr('fill', d => z(d.species));

  svg.append('g')
    .style('font', 'bold 10px sans-serif')
    .style('pointer-events', 'none')
    .selectAll('text')
    .data(columns)
    .join('text')
    .attr('transform', (d, i) => `translate(${i * size},${i * size})`)
    .attr('x', padding)
    .attr('y', padding)
    .attr('dy', '.71em')
    .text(d => d);
  svg.property('value', []);

  const brush = (cell, circle, svg) => {
    const brush = d3.brush()
      .extent([
        [padding / 2, padding / 2],
        [size - padding / 2, size - padding / 2]
      ])
      .on('start', brushstarted)
      .on('brush', brushed)
      .on('end', brushended);

    cell.call(brush);

    let brushCell;

    // Clear the previously-active brush, if any.
    function brushstarted() {
      if (brushCell !== this) {
        d3.select(brushCell).call(brush.move, null);
        brushCell = this;
      }
    }

    // Highlight the selected circles.
    function brushed({
      selection
    }, [i, j]) {
      let selected = [];
      if (selection) {
        const [
          [x0, y0],
          [x1, y1]
        ] = selection;
        circle.classed('hidden',
          d => x0 > x[i](d[columns[i]]) ||
          x1 < x[i](d[columns[i]]) ||
          y0 > y[j](d[columns[j]]) ||
          y1 < y[j](d[columns[j]]));
        selected = data.filter(
          d => x0 < x[i](d[columns[i]]) &&
          x1 > x[i](d[columns[i]]) &&
          y0 < y[j](d[columns[j]]) &&
          y1 > y[j](d[columns[j]]));
      }
      svg.property('value', selected).dispatch('input');
    }

    // If the brush is empty, select all circles.
    function brushended({
      selection
    }) {
      if (selection) return;
      svg.property('value', []).dispatch('input');
      circle.classed('hidden', false);
    }
  }

  cell.call(brush, circle, svg);

  return svg.node();
}