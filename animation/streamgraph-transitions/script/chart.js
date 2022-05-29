/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2018 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/streamgraph-transitions

export const streamgraphTransitions = (data, {
  svgId = 'streamgraph-transitions',
  offset = d3.stackOffsetWiggle,
  width = 800,
  height = 500
} = {}) => {
  const n = data.length;
  const m = n === 0 ? 0 : data[0].length;

  const x = d3.scaleLinear([0, m - 1], [0, width]);
  const y = d3.scaleLinear([0, 1], [height, 0]);
  const z = d3.interpolateCool;

  const prepareLayers = (data, offset) => {
    const stack = d3.stack()
      .keys(d3.range(n)).offset(offset).order(d3.stackOrderNone);

    // this part corresponds to randomize() in the original code
    const layers = stack(d3.transpose(data));
    y.domain([
      d3.min(layers, l => d3.min(l, d => d[0])),
      d3.max(layers, l => d3.max(l, d => d[1]))
    ]);

    return layers;
  }

  const area = d3.area()
    .x((d, i) => x(i))
    .y0(d => y(d[0]))
    .y1(d => y(d[1]));

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height]);

  let path = svg.selectAll('path')
    .data(prepareLayers(data, offset))
    .join('path')
    .attr('d', area)
    .attr('fill', () => z(Math.random()));

  return Object.assign(svg.node(), {
    async update(data, offset) {
      await path
        .data(prepareLayers(data, offset))
        .transition()
        .delay(1000)
        .duration(1500)
        .attr('d', area)
        .end();
    }
  });
}