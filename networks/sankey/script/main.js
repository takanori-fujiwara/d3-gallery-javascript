// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  sankeyChart
} from './chart.js';

const energy = await d3.csv('./data/energy.csv', d3.autoType);

const linkColorOptions = new Map([
  ['static', '#aaa'],
  ['source-target', 'source-target'],
  ['source', 'source'],
  ['target', 'target'],
]);
const linkColorDefault = 'source-target';

const nodeAlignOptions = ['left', 'right', 'center', 'justify'];
const nodeAlignDefault = 'justify';

const dropDownSelectLinkColor = d3.select('body').append('div').text('Link color ').append('select');
dropDownSelectLinkColor.selectAll('option')
  .data(linkColorOptions)
  .enter()
  .append('option')
  .text(d => d[0])
  .attr('value', d => d[1])
  .property('selected', d => d[0] === linkColorDefault);

const dropDownSelectNodeAlign = d3.select('body').append('div').text('Node alignment ').append('select');
dropDownSelectNodeAlign.selectAll('option')
  .data(nodeAlignOptions)
  .enter()
  .append('option')
  .text(d => d)
  .attr('value', d => d)
  .property('selected', d => d === nodeAlignDefault);

const updateChart = (nodeAlign, linkColor) => {
  d3.select('#sankey-chart').remove();

  const chart = sankeyChart({
    links: energy
  }, {
    svgId: 'sankey-chart',
    nodeGroup: d => d.id.split(/\W/)[0], // take first word for color
    nodeAlign: nodeAlign, // e.g., d3.sankeyJustify; set by input above ##########
    linkColor: linkColor, // e.g., 'source' or 'target'; set by input above ##########
    format: (f => d => `${f(d)} TWh`)(d3.format(',.1~f')),
    width: 1000,
    height: 600
  });
  d3.select('body').append(() => chart);
}

// initial state
updateChart(nodeAlignDefault, linkColorDefault);

// when updated
dropDownSelectLinkColor.on('change', () => {
  const newLinkColor = dropDownSelectLinkColor.property('value');
  const currentNodeAlign = dropDownSelectNodeAlign.property('value');
  updateChart(currentNodeAlign, newLinkColor);
});

dropDownSelectNodeAlign.on('change', () => {
  const currentLinkColor = dropDownSelectLinkColor.property('value');
  const newNodeAlign = dropDownSelectNodeAlign.property('value');
  updateChart(newNodeAlign, currentLinkColor);
});