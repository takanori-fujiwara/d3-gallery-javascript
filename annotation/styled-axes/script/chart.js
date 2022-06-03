/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2019 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/styled-axes

export const styledAxes = ({
  svgId = 'styled-axes',
  width = 600,
  height = 400,
  marginTop = 20,
  marginRight = 0,
  marginBottom = 30,
  marginLeft = 0
} = {}) => {
  const x = d3.scaleTime()
    .domain([new Date(2010, 7, 1), new Date(2012, 7, 1)])
    .range([marginLeft, width - marginRight]);
  const y = d3.scaleLinear()
    .domain([0, 2e6])
    .range([height - marginBottom, marginTop]);

  function formatTick(d) {
    const s = (d / 1e6).toFixed(1);
    return this.parentNode.nextSibling ? `\xa0${s}` : `$${s} million`;
  }

  const xAxis = g => g
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x)
      .ticks(d3.timeMonth.every(3))
      .tickFormat(d => d <= d3.timeYear(d) ? d.getFullYear() : null))
    .call(g => g.select(".domain")
      .remove());
  const yAxis = g => g
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisRight(y)
      .tickSize(width - marginLeft - marginRight)
      .tickFormat(formatTick))
    .call(g => g.select(".domain")
      .remove())
    .call(g => g.selectAll(".tick:not(:first-of-type) line")
      .attr("stroke-opacity", 0.5)
      .attr("stroke-dasharray", "2,2"))
    .call(g => g.selectAll(".tick text")
      .attr("x", 4)
      .attr("dy", -4));

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height]);

  svg.append('g')
    .call(xAxis);
  svg.append('g')
    .call(yAxis);

  return svg.node();
}