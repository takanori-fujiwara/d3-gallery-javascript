/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2018–2020 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/realtime-horizon-chart

import {
  realtimeHorizonChart
} from './chart.js';

const walk = v => Math.max(0, Math.min(1, v + (Math.random() - 0.5) * 0.05));

const generateData = (nRow, nCol) => {
  const data = new Array(nRow);
  for (let i = 0; i < nRow; ++i) {
    const d = data[i] = new Float64Array(nCol);
    for (let j = 0, v = 0; j < nCol; ++j) {
      d[j] = v = walk(v);
    }
  }
  return data;
}

const data = generateData(20, 964);

const dropdownData = new Map([
  ['Blues', 'schemeBlues'],
  ['Greens', 'schemeGreens'],
  ['Greys', 'schemeGreys'],
  ['Oranges', 'schemeOranges'],
  ['Purples', 'schemePurples'],
  ['Reds', 'schemeReds'],
  ['BuGn', 'schemeBuGn'],
  ['BuPu', 'schemeBuPu'],
  ['GnBu', 'schemeGnBu'],
  ['OrRd', 'schemeOrRd'],
  ['PuBu', 'schemePuBu'],
  ['PuBuGn', 'schemePuBuGn'],
  ['PuRd', 'schemePuRd'],
  ['RdPu', 'schemeRdPu'],
  ['YlGn', 'schemeYlGn'],
  ['YlGnBu', 'schemeYlGnBu'],
  ['YlOrBr', 'schemeYlOrBr'],
  ['YlOrRd', 'schemeYlOrRd']
]);

const select = d3.select('body').append('div').append('select');
select.attr('id', 'scheme-selection')

const options = select.selectAll('option')
  .data(dropdownData)
  .enter()
  .append('option')
  .text(d => d[0])
  .attr('value', d => d[1])
  .attr('selected', d => d[0] === 'Greens' ? 'selected' : null);

const inputArea = d3.select('body').append('div').style('float', 'left');
const sliderInput = inputArea.insert('input')
  .attr('type', 'range')
  .attr('id', 'sliderInput')
  .attr('min', 1)
  .attr('max', d3.schemeBlues.length - 1)
  .attr('step', 1)
  .attr('value', 7)
  .style('float', 'left');
sliderInput
  .on('input', () => d3.select('input[id="sliderInput"]').attr('value'));

const sliderText = inputArea.insert('div')
  .style('float', 'left')
  .text(`${d3.select('input[id="sliderInput"]').attr('value')} bands`);

const genUpdateChartTime = chart => {
  const updateChartTime = async (period, chart) => {
    const m = data[0].length;
    const then = Date.now();

    for (const d of data) d.copyWithin(0, 1, m), d[m - 1] = walk(d[m - 1]);

    await chart.update(data, then, period);
  }

  return updateChartTime;
}

const updateChart = (scheme, overlap, interval) => {
  if (interval) clearInterval(interval);

  const chart = realtimeHorizonChart(data, {
    chartId: 'realtime-horizon-chart',
    scheme: scheme,
    overlap: overlap
  });

  sliderText.text(`${overlap} bands`);
  d3.select('#realtime-horizon-chart').remove();
  d3.select('body').append('div').style('clear', 'both').append(() => chart);

  const updateChartTime = genUpdateChartTime(chart);
  return Object.assign(chart, {
    updateChartTime
  });
}

// initial state
let interval = null;
const period = 250;
const chart = updateChart(
  d3.select('#scheme-selection').node().value,
  parseInt(d3.select('input[id="sliderInput"]').property('value')),
  interval);
interval = setInterval(() => chart.updateChartTime(period, chart), period);

// when updated
select.on('change', () => {
  const chart = updateChart(
    d3.select('#scheme-selection').node().value,
    parseInt(d3.select('input[id="sliderInput"]').property('value')),
    interval);
  interval = setInterval(() => chart.updateChartTime(period, chart), period);
});

sliderInput.on('input', () => {
  const chart = updateChart(
    d3.select('#scheme-selection').node().value,
    parseInt(d3.select('input[id="sliderInput"]').property('value')),
    interval);
  interval = setInterval(() => chart.updateChartTime(period, chart), period);
});