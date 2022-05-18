// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  forceGraph
} from './chart.js';

const graph = await d3.json('./data/graph.json', d3.autoType);

// simulation will be stopped after 8 sec
const simulationTimeout = () => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve();
  }, 8000);
});

forceGraph(graph, {
  nodeId: d => d.id,
  nodeGroup: d => d.group,
  nodeTitle: d => `${d.id} (${d.group})`,
  width: 1000,
  height: 680,
  invalidation: simulationTimeout // a promise to stop the simulation when the cell is re-run
});