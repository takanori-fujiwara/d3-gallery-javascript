/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2018 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/stacked-to-grouped-bars
export const stackedToGroupedBars = (data, {
  svgId = 'stacked-to-grouped-bars',
  width = 800,
  height = 500,
  marginTop = 0,
  marginRight = 0,
  marginBottom = 10,
  marginLeft = 0
} = {}) => {
  const n = data.length;
  const m = n === 0 ? 0 : data[0].length;

  const y01z = d3.stack().keys(d3.range(n))(d3.transpose(data)) // stacked yz
    .map((data, i) => data.map(([y0, y1]) => [y0, y1, i]));
  const yMax = d3.max(data, y => d3.max(y));
  const y1Max = d3.max(y01z, y => d3.max(y, d => d[1]));

  const x = d3.scaleBand()
    .domain(d3.range(m))
    .rangeRound([marginLeft, width - marginRight])
    .padding(0.08);
  const y = d3.scaleLinear()
    .domain([0, y1Max])
    .range([height - marginBottom, marginTop])
  const z = d3.scaleSequential(d3.interpolateBlues)
    .domain([-0.5 * n, 1.5 * n]);

  const xAxis = svg => svg.append('g')
    .attr('transform', `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0).tickFormat(() => ''));

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height]);

  const rect = svg.selectAll('g')
    .data(y01z)
    .join('g')
    .attr('fill', (d, i) => z(i))
    .selectAll('rect')
    .data(d => d)
    .join('rect')
    .attr('x', (d, i) => x(i))
    .attr('y', height - marginBottom)
    .attr('width', x.bandwidth())
    .attr('height', 0);

  svg.append('g')
    .call(xAxis);

  const transitionGrouped = () => {
    y.domain([0, yMax]);
    rect.transition()
      .duration(500)
      .delay((d, i) => i * 20)
      .attr('x', (d, i) => x(i) + x.bandwidth() / n * d[2])
      .attr('width', x.bandwidth() / n)
      .transition()
      .attr('y', d => y(d[1] - d[0]))
      .attr('height', d => y(0) - y(d[1] - d[0]));
  }

  const transitionStacked = () => {
    y.domain([0, y1Max]);

    rect.transition()
      .duration(500)
      .delay((d, i) => i * 20)
      .attr('y', d => y(d[1]))
      .attr('height', d => y(d[0]) - y(d[1]))
      .transition()
      .attr('x', (d, i) => x(i))
      .attr('width', x.bandwidth());
  }

  const update = layout => {
    if (layout === 'stacked') transitionStacked();
    else transitionGrouped();
  }

  return Object.assign(svg.node(), {
    update
  });
}