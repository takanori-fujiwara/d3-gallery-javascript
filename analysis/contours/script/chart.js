/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2018 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/contours

const prepareGrid = (width, height, x, y) => {
  const value = (x, y) =>
    (1 + (x + y + 1) ** 2 * (19 - 14 * x + 3 * x ** 2 - 14 * y + 6 * x * y + 3 * y ** 2)) *
    (30 + (2 * x - 3 * y) ** 2 * (18 - 32 * x + 12 * x * x + 48 * y - 36 * x * y + 27 * y ** 2));

  const q = 4; // The level of detail, e.g., sample every 4 pixels in x and y.
  const x0 = -q / 2,
    x1 = width + 28 + q;
  const y0 = -q / 2,
    y1 = height + q;
  const n = Math.ceil((x1 - x0) / q);
  const m = Math.ceil((y1 - y0) / q);
  const grid = new Array(n * m);
  for (let j = 0; j < m; ++j) {
    for (let i = 0; i < n; ++i) {
      grid[j * n + i] = value(x.invert(i * q + x0), y.invert(j * q + y0));
    }
  }
  grid.x = -q;
  grid.y = -q;
  grid.k = q;
  grid.n = n;
  grid.m = m;

  return grid;
}

export const contours = ({
  svgId = 'contours',
  width = 800,
  height = 600,
  thresholds = d3.range(1, 20).map(i => Math.pow(2, i)),
  color = d3.scaleSequentialLog(d3.extent(thresholds), d3.interpolateMagma)
} = {}) => {
  const x = d3.scaleLinear([-2, 2], [0, width + 28]);
  const y = d3.scaleLinear([-2, 1], [height, 0]);

  const xAxis = g => g
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisTop(x).ticks(width / height * 10))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick").filter(d => x.domain().includes(d)).remove());
  const yAxis = g => g
    .attr("transform", "translate(-1,0)")
    .call(d3.axisRight(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick").filter(d => y.domain().includes(d)).remove());

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width + 28, height])
    .style('display', 'block')
    .style('margin', '0 -14px')
    .style('width', 'calc(100% + 28px)');

  const grid = prepareGrid(width, height, x, y);

  // Converts from grid coordinates (indexes) to screen coordinates (pixels).
  const transform = ({
    type,
    value,
    coordinates
  }) => {
    return {
      type,
      value,
      coordinates: coordinates.map(rings => {
        return rings.map(points => {
          return points.map(([x, y]) => ([
            grid.x + grid.k * x,
            grid.y + grid.k * y
          ]));
        });
      })
    };
  }

  const contours = d3.contours()
    .size([grid.n, grid.m])
    .thresholds(thresholds)
    (grid)
    .map(transform);

  svg.append('g')
    .attr('fill', 'none')
    .attr('stroke', '#fff')
    .attr('stroke-opacity', 0.5)
    .selectAll('path')
    .data(contours)
    .join('path')
    .attr('fill', d => color(d.value))
    .attr('d', d3.geoPath());

  svg.append('g')
    .call(xAxis);
  svg.append('g')
    .call(yAxis);

  return svg.node();
}