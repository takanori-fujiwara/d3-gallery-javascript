/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2019 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/radial-stacked-bar-chart

export const radialStackedBarChart = (data, {
  svgId = 'radial-stacked-bar-chart',
  width = 975,
  height = width,
  innerRadius = 180,
  outerRadius = Math.min(width, height) / 2
} = {}) => {
  const x = d3.scaleBand()
    .domain(data.map(d => d.State))
    .range([0, 2 * Math.PI])
    .align(0);
  const y = d3.scaleRadial()
    .domain([0, d3.max(data, d => d.total)])
    .range([innerRadius, outerRadius]);

  const z = d3.scaleOrdinal()
    .domain(data.columns.slice(1))
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  const xAxis = g => g
    .attr("text-anchor", "middle")
    .call(g => g.selectAll("g")
      .data(data)
      .join("g")
      .attr("transform", d => `
            rotate(${((x(d.State) + x.bandwidth() / 2) * 180 / Math.PI - 90)})
            translate(${innerRadius},0)
          `)
      .call(g => g.append("line")
        .attr("x2", -5)
        .attr("stroke", "#000"))
      .call(g => g.append("text")
        .attr("transform", d => (x(d.State) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ?
          "rotate(90)translate(0,16)" :
          "rotate(-90)translate(0,-9)")
        .text(d => d.State)));
  const yAxis = g => g
    .attr("text-anchor", "middle")
    .call(g => g.append("text")
      .attr("y", d => -y(y.ticks(5).pop()))
      .attr("dy", "-1em")
      .text("Population"))
    .call(g => g.selectAll("g")
      .data(y.ticks(5).slice(1))
      .join("g")
      .attr("fill", "none")
      .call(g => g.append("circle")
        .attr("stroke", "#000")
        .attr("stroke-opacity", 0.5)
        .attr("r", y))
      .call(g => g.append("text")
        .attr("y", d => -y(d))
        .attr("dy", "0.35em")
        .attr("stroke", "#fff")
        .attr("stroke-width", 5)
        .text(y.tickFormat(5, "s"))
        .clone(true)
        .attr("fill", "#000")
        .attr("stroke", "none")));

  const svg = d3.create('svg')
    .attr('width', width)
    .attr('heigth', height)
    .attr('viewBox', `${-width / 2} ${-height / 2} ${width} ${height}`)
    .style('font', '10px sans-serif');

  const arc = d3.arc()
    .innerRadius(d => y(d[0]))
    .outerRadius(d => y(d[1]))
    .startAngle(d => x(d.data.State))
    .endAngle(d => x(d.data.State) + x.bandwidth())
    .padAngle(0.01)
    .padRadius(innerRadius);

  svg.append('g')
    .selectAll('g')
    .data(d3.stack().keys(data.columns.slice(1))(data))
    .join('g')
    .attr('fill', d => z(d.key))
    .selectAll('path')
    .data(d => d)
    .join('path')
    .attr('d', arc);

  svg.append('g')
    .call(xAxis);
  svg.append('g')
    .call(yAxis);

  const legend = g => g.append("g")
    .selectAll("g")
    .data(data.columns.slice(1).reverse())
    .join("g")
    .attr("transform", (d, i) => `translate(-40,${(i - (data.columns.length - 1) / 2) * 20})`)
    .call(g => g.append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", z))
    .call(g => g.append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", "0.35em")
      .text(d => d));

  svg.append('g')
    .call(legend);

  return svg.node();
}