/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2018–2020 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/realtime-horizon-chart

import {
  context2d
} from './dom-context2d.js';

function* _update(data, Promises, walk, x, width, chart) {
  const period = 250,
    m = data[0].length;
  const tail = data.map(d => d.subarray(m - 1, m));
  while (true) {
    const then = new Date(Math.ceil((Date.now() + 1) / period) * period);
    yield Promises.when(then, then);
    for (const d of data) d.copyWithin(0, 1, m), d[m - 1] = walk(d[m - 1]);
    x.domain([then - period * width, then]);
    chart.update(tail);
  }
}

export const realtimeHorizonChart = (data, {
  chartId = 'realtime-horizon-chart',
  step = 29,
  marginTop = 30,
  marginRight = 10,
  marginBottom = 0,
  marginLeft = 10,
  width = 800,
  height = data.length * (step + 1) + marginTop + marginBottom,
  overlap = 7,
  scheme = 'schemeGreens'
} = {}) => {
  const color = i => d3[scheme][Math.max(3, overlap)][i + Math.max(0, 3 - overlap)];

  const x = d3.scaleTime()
    .range([0, width]);
  const y = d3.scaleLinear()
    .rangeRound([0, -overlap * step]);

  const xAxis = g => g
    .attr('transform', `translate(0,${marginTop})`)
    .call(d3.axisTop(x).ticks(width / 80).tickSizeOuter(0))
    .call(g => g.selectAll('.tick').filter(d => x(d) < marginLeft || x(d) >= width - marginRight).remove())
    .call(g => g.select('.domain').remove());

  const div = d3.create('div')
    .attr('id', chartId)
    .style('position', 'relative').node();

  const canvas = d3.select(div)
    .selectAll('canvas')
    .data(data)
    .enter().append(() => context2d(width, step, 1).canvas)
    .style('position', 'absolute')
    .style('image-rendering', 'pixelated')
    .style('top', (d, i) => `${i * (step + 1) + marginTop}px`)
    .property('context',
      function() {
        return this.getContext('2d');
      })
    .each(horizon);

  const svg = d3.select(div).append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .style('position', 'relative')
    .style('font', '10px sans-serif');

  const gX = svg.append('g');

  svg.append('g')
    .selectAll('text')
    .data(data)
    .join('text')
    .attr('x', 4)
    .attr('y', (d, i) => (i + 0.5) * (step + 1) + marginTop)
    .attr('dy', '0.35em')
    .text((d, i) => i);

  const rule = svg.append('line')
    .attr('stroke', '#000')
    .attr('y1', marginTop - 6)
    .attr('y2', height - marginBottom - 1)
    .attr('x1', 0.5)
    .attr('x2', 0.5);

  svg.on('mousemove touchmove', (event) => {
    const x = d3.pointer(event, svg.node())[0] + 0.5;
    rule.attr('x1', x).attr('x2', x);
  });

  function horizon(d) {
    const {
      context
    } = this;
    const {
      length: k
    } = d;
    if (k < width) context.drawImage(this, k, 0, width - k, step, 0, 0, width - k, step);
    context.fillStyle = '#fff';
    context.fillRect(width - k, 0, k, step);
    for (let i = 0; i < overlap; ++i) {
      context.save();
      context.translate(width - k, (i + 1) * step);
      context.fillStyle = color(i);
      for (let j = 0; j < k; ++j) {
        context.fillRect(j, y(d[j]), 1, -y(d[j]));
      }
      context.restore();
    }
  }

  div.update = (data, then, period) => {
    x.domain([then - period * width, then]);
    canvas.data(data).each(horizon);
    gX.call(xAxis);
  };

  return div;
}