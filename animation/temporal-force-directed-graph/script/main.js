/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2020 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/temporal-force-directed-graph

import {
  temporalForceDirectedGraph
} from './chart.js';

import {
  scrubber
} from './scrubber.js';

const data = JSON.parse(await d3.text('./data/sfhh@4.json'),
  (key, value) => key === 'start' || key === 'end' ? new Date(value) : value);

const chart = temporalForceDirectedGraph();

const contains = ({
  start,
  end
}, time) => start <= time && time < end;

const times =
  d3.scaleTime()
  .domain([d3.min(data.nodes, d => d.start), d3.max(data.nodes, d => d.end)])
  .ticks(1000)
  .filter(time => data.nodes.some(d => contains(d, time)));

const update = (index) => {
  const time = times[index];
  const nodes = data.nodes.filter(d => contains(d, time));
  const links = data.links.filter(d => contains(d, time));
  chart.update({
    nodes,
    links
  });
}

const scrubberForm = scrubber(times, {
  chartUpdate: update,
  loop: true,
  format: date => date.toLocaleString('en', {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'UTC'
  })
});

d3.select('body').append(() => scrubberForm.node());
d3.select('body').append(() => chart).attr('width', 750);