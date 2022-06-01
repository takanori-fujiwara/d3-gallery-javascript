// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  mareysTrains
} from './chart.js';

const daysOptionsList = new Map([
  ['Weekdays', 'weekday'],
  ['Saturday', 'saturday'],
  ['Sunday', 'sunday']
]);
const daysDefault = 'Weekdays';

const directionOptionsList = new Map([
  ['Either direction', 'either'],
  ['Northbound', 'north'],
  ['Southbound', 'south']
]);
const directionDefault = 'Either direction';

const dropDownSelectDays = d3.select('body').append('div').append('select');
dropDownSelectDays.selectAll('option')
  .data(daysOptionsList)
  .enter()
  .append('option')
  .text(d => d[0])
  .attr('value', d => d[1])
  .property('selected', d => d[0] === daysDefault);

const dropDownSelectDirection = d3.select('body').append('div').append('select');
dropDownSelectDirection.selectAll('option')
  .data(directionOptionsList)
  .enter()
  .append('option')
  .text(d => d[0])
  .attr('value', d => d[1])
  .property('selected', d => d[0] === directionDefault);

const data = await d3.tsv('./data/schedule.tsv');

const updateChart = (daysKey, directionKey) => {
  d3.select('#mareys-trains').remove();

  const chart = mareysTrains(data, {
    svgId: 'mareys-trains',
    daysKey: daysKey,
    directionKey: directionKey
  });

  d3.select('body').append(() => chart);
}

// initial state
updateChart(
  dropDownSelectDays.property('value'),
  dropDownSelectDirection.property('value'));

// when updated
dropDownSelectDays.on('change', () => {
  const newDays = dropDownSelectDays.property('value');
  const currentDirection = dropDownSelectDirection.property('value');
  console.log(newDays, currentDirection);
  updateChart(newDays, currentDirection);
});
dropDownSelectDirection.on('change', () => {
  const currentDays = dropDownSelectDays.property('value');
  const newDirection = dropDownSelectDirection.property('value');
  updateChart(currentDays, newDirection);
});