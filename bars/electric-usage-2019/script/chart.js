/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright (ISC License)
// Copyright 2012–2020 Mike Bostock
//
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED 'AS IS' AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

export const electricChart = (data, {
  svgId = 'electric-chart',
  width = 900,
  height = 3700,
  marginTop = 30,
  marginRight = 40,
  marginBottom = 10,
  marginLeft = 40,
  colors,
} = {}) => {
  const dateExtent = d3.extent(data, d => d.date);
  const X = d3.scaleBand(d3.range(24), [marginLeft, width - marginRight]).round(true);
  const Y = d3.scaleBand(d3.timeDays(...dateExtent), [marginTop, height - marginBottom]).round(true);

  const formatHour = d => d === 0 ? "12 AM" : d === 12 ? "12 PM" : (d % 12) + "";
  const formatDay = d => (d.getDate() === 1 ? d3.timeFormat("%b %-d") : d3.timeFormat("%-d"))(d);
  const formatDate = d3.timeFormat("%B %-d, %-I %p");
  const formatUsage = d3.format(".2f");

  const xAxis = g => g
    .attr("transform", `translate(0,${marginTop})`)
    .call(d3.axisTop(X).tickFormat(formatHour))
    .call(g => g.select(".domain").remove())
  const yAxis = g => g
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(Y).tickFormat(formatDay))
    .call(g => g.select(".domain").remove())

  const [min, max] = d3.extent(data, d => d.usage);
  if (colors === undefined) {
    colors = min < 0 ? d3.interpolateRdBu : d3.interpolateReds;
  }
  const color = min < 0 ?
    d3.scaleDiverging([-max, 0, max], t => colors(1 - t)) :
    d3.scaleSequential([0, max], colors);

  const format = () => {
    const f = d3.format(',d');
    return d => isNaN(d) ? 'N/A cases' :
      d === 0 ? '0 cases' :
      d < 1 ? '<1 case' :
      d < 1.5 ? '1 case' :
      `${f(d)} cases`;
  }

  d3.select('body').select(`svg#${svgId}`).remove();

  const svg = d3.select('body').append('svg')
    .attr('id', svgId)
    .attr("viewBox", [0, 0, width, height])
    .style("background", "white");

  svg.append("g")
    .call(xAxis);

  svg.append("g")
    .call(yAxis);

  svg.append("g")
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", d => X(d.date.getHours()))
    .attr("y", d => Y(d3.timeDay(d.date)))
    .attr("width", X.bandwidth() - 1)
    .attr("height", Y.bandwidth() - 1)
    .attr("fill", d => color(d.usage))
    .append("title")
    .text(d => `${formatDate(d.date)}${formatUsage(d.usage)} kW`);

  return Object.assign(svg.node(), {
    scales: {
      color
    }
  });
}