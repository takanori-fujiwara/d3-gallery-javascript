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

export const vaccineChart = (data, {
  svgId = 'vaccine-chart',
  width = 900,
  height = 500,
  marginTop = 20,
  marginRight = 40,
  marginBottom = 40,
  marginLeft = 40,
  colors = d3.interpolatePuRd,
} = {}) => {
  const X = d3.scaleLinear()
    .domain([d3.min(data.years), d3.max(data.years) + 1])
    .rangeRound([marginLeft, width - marginRight]);

  const Y = d3.scaleBand()
    .domain(data.names)
    .rangeRound([marginTop, marginTop + height]);

  const xAxis = g => g
    .call(g => g.append('g')
      .attr('transform', `translate(0,${marginTop})`)
      .call(d3.axisTop(X).ticks(null, 'd'))
      .call(g => g.select('.domain').remove()))
    .call(g => g.append('g')
      .attr('transform', `translate(0,${height + marginTop + 4})`)
      .call(d3.axisBottom(X)
        .tickValues([data.year])
        .tickFormat(x => x)
        .tickSize(-height - 10))
      .call(g => g.select('.tick text')
        .clone()
        .attr('dy', '2em')
        .style('font-weight', 'bold')
        .text('Measles vaccine introduced'))
      .call(g => g.select('.domain').remove()));

  const yAxis = g => g
    .attr('transform', `translate(${marginLeft},0)`)
    .call(d3.axisLeft(Y).tickSize(0))
    .call(g => g.select('.domain').remove());

  const color = d3.scaleSequentialSqrt([0, d3.max(data.values, d => d3.max(d))], colors);

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
    .attr('viewBox', [0, 0, width, height + marginTop + marginBottom])
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10);

  svg.append('g')
    .call(xAxis);

  svg.append('g')
    .call(yAxis);

  svg.append('g')
    .selectAll('g')
    .data(data.values)
    .join('g')
    .attr('transform', (d, i) => `translate(0,${Y(data.names[i])})`)
    .selectAll('rect')
    .data(d => d)
    .join('rect')
    .attr('x', (d, i) => X(data.years[i]) + 1)
    .attr('width', (d, i) => X(data.years[i] + 1) - X(data.years[i]) - 1)
    .attr('height', Y.bandwidth() - 1)
    .attr('fill', d => isNaN(d) ? '#eee' : d === 0 ? '#fff' : color(d))
    .append('title')
    .text((d, i) => `${format(d)} per 100,000 people in ${data.years[i]}`);

  return Object.assign(svg.node(), {
    scales: {
      color
    }
  });
}