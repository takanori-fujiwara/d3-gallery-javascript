/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2020 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/zoomable-area-chart

const genUid = () => {
  let count = 0;

  return name => {
    const name_ = name == null ? '' : name;
    const id = `O-${name}-${count}`;
    const href = new URL(`#${id}`, location);
    count++;

    return {
      id: id,
      href: href
    }
  }
}

const uid = genUid();

export const zoomableAreaChart = (data, {
  svgId = 'zoomable-area-chart',
  marginTop = 20,
  marginRight = 20,
  marginBottom = 30,
  marginLeft = 30,
  width = 800,
  height = 500
} = {}) => {
  const x = d3.scaleUtc()
    .domain(d3.extent(data, d => d.date))
    .range([marginLeft, width - marginRight]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)]).nice()
    .range([height - marginBottom, marginTop]);

  const xAxis = (g, x) => g
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

  const yAxis = (g, y) => g
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).ticks(null, "s"))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
      .attr("x", 3)
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text(data.y));

  const area = (data, x) => d3.area()
    .curve(d3.curveStepAfter)
    .x(d => x(d.date))
    .y0(y(0))
    .y1(d => y(d.value))
    (data);

  const zoomed = event => {
    const xz = event.transform.rescaleX(x);
    path.attr('d', area(data, xz));
    gx.call(xAxis, xz);
  }
  const zoom = d3.zoom()
    .scaleExtent([1, 32])
    .extent([
      [marginLeft, 0],
      [width - marginRight, height]
    ])
    .translateExtent([
      [marginLeft, -Infinity],
      [width - marginRight, Infinity]
    ])
    .on('zoom', zoomed);

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height]);

  const clip = uid('clip');

  svg.append('clipPath')
    .attr('id', clip.id)
    .append('rect')
    .attr('x', marginLeft)
    .attr('y', marginTop)
    .attr('width', width - marginLeft - marginRight)
    .attr('height', height - marginTop - marginBottom);

  const path = svg.append('path')
    .attr('clip-path', clip)
    .attr('fill', 'steelblue')
    .attr('d', area(data, x));

  const gx = svg.append('g')
    .call(xAxis, x);

  svg.append('g')
    .call(yAxis, y);

  svg.call(zoom)
    .transition()
    .duration(750)
    .call(zoom.scaleTo, 4, [x(Date.UTC(2001, 8, 1)), 0]);

  return svg.node();
}