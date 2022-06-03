import {
  barChart
} from './chart.js';

const data = await d3.csv('./data/alphabet.csv');

const chart = barChart(data, {
  x: d => d.letter,
  y: d => d.frequency,
  xDomain: d3.groupSort(data, ([d]) => -d.frequency, d => d.letter), // sort by descending frequency
  yFormat: '%',
  yLabel: 'Frequency',
  color: 'steelblue'
});

d3.select('body').append(() => chart);