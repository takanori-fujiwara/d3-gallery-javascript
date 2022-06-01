// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  forceGraph
} from './chart.js';

const graph = await d3.json('./data/graph.json', d3.autoType);

const chart = forceGraph(graph, {
  nodeId: d => d.id,
  nodeGroup: d => d.group,
  nodeTitle: d => `${d.id} (${d.group})`,
  width: 1000,
  height: 680
});

d3.select('body').append(() => chart);