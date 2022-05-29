// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2018 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/streamgraph-transitions

import {
  streamgraphTransitions
} from './chart.js';

// Inspired by Lee Byron’s test data generator.
const bumps = (m, k) => {
  const a = Array(m).fill(0);

  for (let i = 0; i < k; ++i) {
    const x = 1 / (0.1 + Math.random());
    const y = 2 * Math.random() - 0.5;
    const z = 10 / (0.1 + Math.random());
    for (let j = 0; j < m; ++j) {
      const w = (j / m - y) * z;
      a[j] += x * Math.exp(-w * w);
    }
  }

  return a;
}

const n = 20; // number of layers
const m = 200; // number of samples per layer
const k = 10 // number of bumps per layer

const genData = () => Array.from({
  length: n
}, () => bumps(m, k));

const chart = streamgraphTransitions(genData(), {
  offset: d3.stackOffsetWiggle
});

const dropdownData = new Map([
  ['d3.stackOffsetExpand', d3.stackOffsetExpand],
  ['d3.stackOffsetNone', d3.stackOffsetNone],
  ['d3.stackOffsetSilhouette', d3.stackOffsetSilhouette],
  ['d3.stackOffsetWiggle', d3.stackOffsetWiggle]
]);

const dropdownDefault = 'd3.stackOffsetWiggle';
const select = d3.select('body').append('div').append('select');
select.attr('id', 'offset-selection')

const options = select.selectAll('option')
  .data(dropdownData)
  .enter()
  .append('option')
  .text(d => d[0])
  .attr('value', d => d[0])
  .attr('selected', d => d[0] === dropdownDefault ? true : false);

d3.select('body').append(() => chart);

const genInterval = offset => {
  return setInterval(async () => {
    try {
      await chart.update(genData(), offset);
    } catch (e) {
      console.error('try longer interval');
    }
  }, 2000);
}

let interval = genInterval(dropdownData.get(dropdownDefault));

select.on('change', async () => {
  clearInterval(interval);
  const offset = dropdownData.get(d3.select('select[id="offset-selection"]').property('value'));
  interval = genInterval(offset);
});