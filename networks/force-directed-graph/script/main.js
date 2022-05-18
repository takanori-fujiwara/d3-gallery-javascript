// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  forceGraph
} from './chart.js';

const miserables = await d3.json('./data/miserables.json');

// simulation will be stopped after 8 sec
const simulationTimeout = () => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve();
  }, 8000);
});

forceGraph(miserables, {
  nodeId: d => d.id,
  nodeGroup: d => d.group,
  nodeTitle: d => `${d.id}\n${d.group}`,
  linkStrokeWidth: l => Math.sqrt(l.value),
  width: 1000,
  height: 600,
  invalidation: simulationTimeout // a promise to stop the simulation when the cell is re-run
});