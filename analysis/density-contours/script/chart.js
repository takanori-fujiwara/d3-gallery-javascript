/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2018 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/density-contours

export const densityContours = (data, {
  width = 800,
  height = 600,
  marginTop = 20,
  marginRight = 30,
  marginBottom = 30,
  marginLeft = 40
} = {}) => {
  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.x)).nice()
    .rangeRound([marginLeft, width - marginRight]);
  const y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.y)).nice()
    .rangeRound([height - marginBottom, marginTop]);

  const xAxis = g => g.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
      .attr("y", -3)
      .attr("dy", null)
      .attr("font-weight", "bold")
      .text(data.x));
  const yAxis = g => g.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).tickSizeOuter(0))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
      .attr("x", 3)
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text(data.y));

  const svg = d3.create("svg")
    .attr('width', width)
    .attr('height', height)
    .attr("viewBox", [0, 0, width, height]);

  svg.append("g")
    .call(xAxis);
  svg.append("g")
    .call(yAxis);

  const contours = d3.contourDensity()
    .x(d => x(d.x))
    .y(d => y(d.y))
    .size([width, height])
    .bandwidth(30)
    .thresholds(30)
    (data);

  svg.append("g")
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .selectAll("path")
    .data(contours)
    .join("path")
    .attr("stroke-width", (d, i) => i % 5 ? 0.25 : 1)
    .attr("d", d3.geoPath());

  svg.append("g")
    .attr("stroke", "white")
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", d => x(d.x))
    .attr("cy", d => y(d.y))
    .attr("r", 2);

  return svg.node();
}