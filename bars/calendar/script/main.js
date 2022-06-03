// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  calendar
} from './chart.js';

import {
  legend
} from './legend.js';

const dropdownData = new Map([
  ['Weekdays only', 'weekday'],
  ['Sunday-based weeks', 'sunday'],
  ['Monday-based weeks', 'monday'],
]);

const select = d3.select('body').append('div').append('select');
select.attr('id', 'weekday-selection')

const options = select.selectAll('option')
  .data(dropdownData)
  .enter()
  .append('option')
  .text(d => d[0])
  .attr('value', d => d[1]);

const data = await d3.csv('./data/^DJI@2.csv', d3.autoType);

const updateCalendar1 = (weekday) => {
  const chart = calendar(data, {
    svgId: 'calendar1',
    x: d => d.Date,
    y: (d, i, data) => i > 0 ? (d.Close - data[i - 1].Close) / data[i - 1].Close : NaN, // relative change
    yFormat: '+%', // show percent change on hover
    weekday: weekday,
  });

  const chartLegend = legend(chart.scales.color, {
    svgId: 'chart-legend',
    title: 'Daily change',
    tickFormat: '+%',
    marginLeft: 40
  });

  d3.select('#calendar1').remove();
  d3.select('#chart-legend').remove();
  d3.select('body').append(() => chart);
  d3.select('body').append(() => chartLegend);

  return chart;
}

const updateCalendar2 = (weekday) => {
  const chart = calendar(data, {
    svgId: 'calendar2',
    x: d => d.Date,
    y: d => d.Volume,
    weekday: weekday,
  });

  d3.select('#calendar2').remove();
  d3.select('body').append(() => chart);

  return chart;
}

// initial state
updateCalendar1(d3.select('#weekday-selection').node().value);
updateCalendar2(d3.select('#weekday-selection').node().value);

// when updated
select.on('change', () => {
  updateCalendar1(d3.select('#weekday-selection').node().value);
  updateCalendar2(d3.select('#weekday-selection').node().value);
});