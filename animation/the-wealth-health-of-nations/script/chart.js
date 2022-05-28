/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@mbostock/the-wealth-health-of-nations

export const theWealthHealthOfNations = (data, {
  svgId = 'the-wealth-health-of-nations',
  width = 800,
  height = 560,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 35,
  marginLeft = 40,
  radius = d3.scaleSqrt([0, 5e8], [0, width / 24]),
  color = d3.scaleOrdinal(data.map(d => d.region), d3.schemeCategory10).unknown('black')
} = {}) => {
  const bisectDate = d3.bisector(([date]) => date).left;

  const valueAt = (values, date) => {
    const i = bisectDate(values, date, 0, values.length - 1);
    const a = values[i];
    if (i > 0) {
      const b = values[i - 1];
      const t = (date - a[0]) / (b[0] - a[0]);
      return a[1] * (1 - t) + b[1] * t;
    }
    return a[1];
  }

  const dataAt = date => data.map(d => ({
    name: d.name,
    region: d.region,
    income: valueAt(d.income, date),
    population: valueAt(d.population, date),
    lifeExpectancy: valueAt(d.lifeExpectancy, date)
  }));

  const x = d3.scaleLog([200, 1e5], [marginLeft, width - marginRight]);
  const y = d3.scaleLinear([14, 86], [height - marginBottom, marginTop]);

  const xAxis = g => g
    .attr('transform', `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).ticks(width / 80, ','))
    .call(g => g.select('.domain').remove())
    .call(g => g.append('text')
      .attr('x', width)
      .attr('y', marginBottom - 4)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'end')
      .text('Income per capita (dollars) →'));

  const yAxis = g => g
    .attr('transform', `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select('.domain').remove())
    .call(g => g.append('text')
      .attr('x', -marginLeft)
      .attr('y', 10)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'start')
      .text('↑ Life expectancy (years)'));

  const grid = g => g
    .attr('stroke', 'currentColor')
    .attr('stroke-opacity', 0.1)
    .call(g => g.append('g')
      .selectAll('line')
      .data(x.ticks())
      .join('line')
      .attr('x1', d => 0.5 + x(d))
      .attr('x2', d => 0.5 + x(d))
      .attr('y1', marginTop)
      .attr('y2', height - marginBottom))
    .call(g => g.append('g')
      .selectAll('line')
      .data(y.ticks())
      .join('line')
      .attr('y1', d => 0.5 + y(d))
      .attr('y2', d => 0.5 + y(d))
      .attr('x1', marginLeft)
      .attr('x2', width - marginRight));

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height]);

  svg.append('g')
    .call(xAxis);

  svg.append('g')
    .call(yAxis);

  svg.append('g')
    .call(grid);

  const circle = svg.append('g')
    .attr('stroke', 'black')
    .selectAll('circle')
    .data(dataAt(1800), d => d.name)
    .join('circle')
    .sort((a, b) => d3.descending(a.population, b.population))
    .attr('cx', d => x(d.income))
    .attr('cy', d => y(d.lifeExpectancy))
    .attr('r', d => radius(d.population))
    .attr('fill', d => color(d.region))
    .call(circle => circle.append('title')
      .text(d => [d.name, d.region].join('\n')));

  return Object.assign(svg.node(), {
    update(date) {
      circle.data(dataAt(date), d => d.name)
        .sort((a, b) => d3.descending(a.population, b.population))
        .attr('cx', d => x(d.income))
        .attr('cy', d => y(d.lifeExpectancy))
        .attr('r', d => radius(d.population));
    },
    scales: {
      color
    }
  });
}