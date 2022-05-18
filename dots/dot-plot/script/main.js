/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/bubble-map

import {
  dotPlot
} from './chart.js';

import {
  legend
} from './legend.js';

const stateage = await d3.csv('./data/us-distribution-state-age.csv', d3.autoType);

const dropdownData = ['state', ...d3.union(stateage.map(d => d.age))];
const dropDownSelect = d3.select('body').append('div').text('Order by ').append('select');
dropDownSelect.attr('id', 'dropDownSelect')

const options = dropDownSelect.selectAll('option')
  .data(dropdownData)
  .enter()
  .append('option')
  .text(d => d)
  .attr('value', d => d);

const chart = dotPlot(stateage, {
  x: d => d.population,
  y: d => d.state,
  z: d => d.age,
  xFormat: '%',
  xLabel: 'Population →',
  width: 1000
});

legend(chart.color, {
  title: 'Age (years)'
})

const updateChart = () => {
  const order = d3.select('select[id="dropDownSelect"]').property('value');
  chart.update(d3.groupSort(stateage, D => order === 'state' ?
    D[0].state :
    -D.find(d => d.age === order).population, d => d.state));
}

dropDownSelect.on('change', () => {
  clearInterval(interval);
  updateChart();
});

// trigger
const genInterval = () => {
  let i = 0;
  return setInterval(() => {
    i = (i + 1) % dropdownData.length;
    d3.select('select[id="dropDownSelect"]').property('value', dropdownData[i]);
    updateChart();
  }, 4000);
}

const interval = genInterval();