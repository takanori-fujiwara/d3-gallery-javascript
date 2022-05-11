import {
  barChart
} from './chart.js';

const data = await d3.csv('./data/alphabet.csv');

barChart(data, {
  x: d => d.frequency,
  y: d => d.letter,
  yDomain: d3.groupSort(data, ([d]) => -d.frequency, d => d.letter), // sort by descending frequency
  xFormat: '%',
  xLabel: 'Frequency',
  color: 'steelblue'
});