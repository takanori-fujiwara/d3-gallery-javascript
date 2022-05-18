// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  treemap
} from './chart.js';

import {
  swatches
} from './legend.js';

const flare = await d3.csv('./data/flare-2.csv', d3.autoType);

const dropdownData = new Map([
  ['binary', d3.treemapBinary],
  ['squarify', d3.treemapSquarify],
  ['slice-dice', d3.treemapSliceDice],
  ['slice', d3.treemapSlice],
  ['dice', d3.treemapDice]
]);

const dropDownSelect = d3.select('body').append('div').text('Tiling method ').append('select');
dropDownSelect.attr('id', 'dropDownSelect')
dropDownSelect.selectAll('option')
  .data(dropdownData)
  .enter()
  .append('option')
  .text(d => d[0])
  .attr('value', d => d[0]);

const updateChart = (tile) => {
  const chart = treemap(flare, {
    path: d => d.name.replace(/\./g, '/'), // e.g., 'flare/animate/Easing'
    value: d => d?.size, // size of each node (file); null for internal nodes (folders)
    group: d => d.name.split('.')[1], // e.g., 'animate' in 'flare.animate.Easing'; for color
    label: (d, n) => [...d.name.split('.').pop().split(/(?=[A-Z][a-z])/g), n.value.toLocaleString('en')].join('\n'),
    title: (d, n) => `${d.name}\n${n.value.toLocaleString('en')}`, // text to show on hover
    link: (d, n) => `https://github.com/prefuse/Flare/blob/master/flare/src${n.id}.as`,
    tile: tile, // e.g., d3.treemapBinary; set by input above
    width: 1152,
    height: 1152
  });

  return chart
}

// initial state
const chart = updateChart(dropdownData[0]);
swatches(chart.scales.color, {
  textWidth: 60
});

// when updated
dropDownSelect.on('change', () => {
  const newTile = dropdownData.get(d3.select('select[id="dropDownSelect"]').property('value'));
  updateChart(newTile);
});