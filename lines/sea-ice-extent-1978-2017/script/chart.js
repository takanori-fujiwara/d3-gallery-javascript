/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2012–2020 Mike Bostock
// Released under the ISC license.
// https://observablehq.com/@mbostock/sea-ice-extent-1978-2017

const intrayear = date => {
  date = new Date(+date);
  date.setUTCFullYear(2000);
  return date;
}

export const seaIceExtent19782017 = (data, {
  svgId = 'sea-ice-extent19782017',
  width = 800,
  height = 600,
  marginTop = 20,
  marginRight = 30,
  marginBottom = 30,
  marginLeft = 40
} = {}) => {
  const x = d3.scaleUtc([Date.UTC(2000, 0, 1), Date.UTC(2001, 0, 0)], [marginLeft, width - marginRight]);
  const y = d3.scaleLinear([0, d3.max(data, d => d.value)], [height - marginBottom, marginTop]);
  const z = d3.scaleSequential(d3.extent(data, d => d.date.getUTCFullYear()), t => d3.interpolateSpectral(1 - t));

  const xAxis = g => g
    .attr('transform', `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x)
      .ticks(width / 80, '%B')
      .tickSizeOuter(0));
  const yAxis = g => g
    .attr('transform', `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).ticks(null, 's'))
    .call(g => g.select('.domain').remove())
    .call(g => g.selectAll('.tick:not(:first-of-type) line').clone()
      .attr('x2', width)
      .attr('stroke', '#ddd'))
    .call(g => g.select('.tick:last-of-type text').clone()
      .attr('x', 3)
      .attr('text-anchor', 'start')
      .attr('font-weight', 'bold')
      .text(data.y));

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height]);

  svg.append('g')
    .call(xAxis);

  svg.append('g')
    .call(yAxis);

  const g = svg.append('g')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)
    .attr('fill', 'none')
    .attr('stroke-width', 1.5)
    .attr('stroke-miterlimit', 1);

  const line = d3.line()
    .defined(d => !isNaN(d.value))
    .x(d => x(intrayear(d.date)))
    .y(d => y(d.value));

  function dashTween() {
    const length = this.getTotalLength();
    return d3.interpolate(`0,${length}`, `${length},${length}`);
  }

  return Object.assign(svg.node(), {
    async play() {
      for (const [key, values] of d3.group(data, d => d.date.getUTCFullYear())) {
        await g.append('path')
          .attr('d', line(values))
          .attr('stroke', z(key))
          .attr('stroke-dasharray', '0,1')
          .transition()
          .ease(d3.easeLinear)
          .attrTween('stroke-dasharray', dashTween)
          .end();

        if (!isNaN(values[values.length - 1].value)) {
          g.append('text')
            .attr('stroke', 'white')
            .attr('stroke-width', 3)
            .attr('dx', 4)
            .attr('dy', '0.32em')
            .attr('x', x(intrayear(values[values.length - 1].date)))
            .attr('y', y(values[values.length - 1].value))
            .text(key)
            .clone(true)
            .attr('fill', z(key))
            .attr('stroke', 'none');
        }
      }
    }
  });
}