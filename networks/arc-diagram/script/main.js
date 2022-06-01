// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  arcDiagram
} from './chart.js';

const data = await d3.json('./data/miserables.json');

const chart = arcDiagram(data);

const options = [{
  name: 'Order by name',
  value: (a, b) => d3.ascending(a.id, b.id)
}, {
  name: 'Order by group',
  value: (a, b) => a.group - b.group || d3.ascending(a.id, b.id)
}, {
  name: 'Order by degree',
  value: (a, b) => d3.sum(b.sourceLinks, l => l.value) + d3.sum(b.targetLinks, l => l.value) - d3.sum(a.sourceLinks, l => l.value) - d3.sum(a.targetLinks, l => l.value) || d3.ascending(a.id, b.id)
}];
const optionsDefault = 'Order by group';

const dropDownSelect = d3.select('body').append('div').append('select');
dropDownSelect.selectAll('option')
  .data(options)
  .enter()
  .append('option')
  .text(d => d.name)
  .attr('value', (d, i) => i)
  .property('selected', d => d.name === optionsDefault);

d3.select('body').append(() => chart);

// initial selection
chart.update(options[dropDownSelect.property('value')].value);

// when updated
dropDownSelect.on('change', () => {
  chart.update(options[dropDownSelect.property('value')].value);
});