// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  scatterplotTour
} from './chart.js';

const prepareData = () => {
  const random = d3.randomNormal(0, 0.2);
  const sqrt3 = Math.sqrt(3);
  return [].concat(
    Array.from({
      length: 300
    }, () => [random() + sqrt3, random() + 1, 0]),
    Array.from({
      length: 300
    }, () => [random() - sqrt3, random() + 1, 1]),
    Array.from({
      length: 300
    }, () => [random(), random() - 1, 2])
  );
}


const data = prepareData();

const chart = scatterplotTour(data);

const radioButtonData = [
  ['Overview', -1],
  ['Cluster 0', 0],
  ['Cluster 1', 1],
  ['Cluster 2', 2]
];

const form = d3.select('body').append('form');

const buttons = form.selectAll('span')
  .data(radioButtonData)
  .enter()
  .append('span');

buttons.append('input')
  .attr('type', 'radio')
  .attr('name', 'zoom')
  .attr('id', (d, i) => `radio${i}`)
  .attr('value', d => d[1])
  .property('checked', d => d[0] === 'Overview');

buttons.append('label')
  .text(d => d[0]);

const interval = setInterval(() => {
    const radioId = d3.select('input[name="zoom"]:checked').node().id;
    const currentIdx = parseInt(radioId.split('radio')[1]);
    const newIdx = (currentIdx + 1) % radioButtonData.length;
    d3.select(`#radio${newIdx}`).property('checked', true);
    chart.update(parseInt(d3.select('input[name="zoom"]:checked').node().value));
  },
  2500);

// initial plot
d3.select('body').append(() => chart);

// when updated
buttons.on('change', () => {
  chart.update(parseInt(d3.select('input[name="zoom"]:checked').node().value));
  clearInterval(interval);
});