/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2019 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/normal-quantile-plot

export const normalQuantilePlot = (data, {
  svgId = 'normal-quantile-plot',
  width = 800,
  height = width,
  marginTop = 20,
  marginRight = 40,
  marginBottom = 30,
  marginLeft = 40
} = {}) => {
  const qy = Float64Array.from(data).sort(d3.ascending);
  const n = qy.length;

  const erfinv = x => {
    const a = 8 * (Math.PI - 3) / (3 * Math.PI * (4 - Math.PI));
    const b = Math.log(1 - x * x);
    const c = b / 2 + (2 / (Math.PI * a));
    return Math.sign(x) * Math.sqrt(Math.sqrt((c * c) - b / a) - c);
  }
  const qnorm = p => Math.SQRT2 * erfinv(2 * p - 1);
  const a = n <= 10 ? 5 / 8 : 0.5;

  const x = d3.scaleLinear()
    .domain([-3, 3])
    .range([marginLeft, width - marginRight]);

  const z = i => qnorm((i + a) / (n + 1 - 2 * a));
  const regression = x.domain().map(ss.linearRegressionLine(ss.linearRegression(Array.from(qy, (d, i) => ([z(i), d])))));

  const y = d3.scaleLinear()
    .domain(regression).nice()
    .range([height - marginBottom, marginTop]);

  const xAxis = g => g
    .attr("transform", `translate(0,${height - marginBottom + 6})`)
    .call(d3.axisBottom(x.copy().interpolate(d3.interpolateRound)).ticks(null, "+f"))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
      .attr("stroke-opacity", 0.1)
      .attr("y1", -height))
    .call(g => g.append("text")
      .attr("x", width - marginRight)
      .attr("y", -3)
      .attr("fill", "currentColor")
      .attr("font-weight", "bold")
      .text("z"));
  const yAxis = g => g
    .attr("transform", `translate(${marginLeft - 6},0)`)
    .call(d3.axisLeft(y.copy().interpolate(d3.interpolateRound)))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
      .attr("stroke-opacity", 0.1)
      .attr("x1", width))
    .call(g => g.select(".tick:last-of-type text").clone()
      .attr("x", 3)
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text(data.title));

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .style('max-width', `${width}px`);

  svg.append('g')
    .call(xAxis);

  svg.append('g')
    .call(yAxis);

  svg.append('line')
    .attr('stroke', 'currentColor')
    .attr('stroke-opacity', 0.3)
    .attr('x1', x.range()[0])
    .attr('x2', x.range()[1])
    .attr('y1', y(regression[0]))
    .attr('y2', y(regression[1]));

  svg.append('g')
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.5)
    .selectAll('circle')
    .data(d3.range(n))
    .join('circle')
    .attr('cx', i => x(z(i)))
    .attr('cy', i => y(qy[i]))
    .attr('r', 3);

  return svg.node();
}