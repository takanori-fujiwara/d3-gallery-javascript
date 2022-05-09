import {
  barChart
} from './chart.js';

const data = await d3.tsv('../data/state-population-2010-2019.tsv');
const radio_button_data = ['absolute', 'relative'];

const form = d3.select('body').append('form').text('Change');

const buttons = form.selectAll('span')
  .data(radio_button_data)
  .enter()
  .append('span');

buttons.append('input')
  .attr('type', 'radio')
  .attr('name', 'metric')
  .attr('value', d => d)
  .property('checked', d => d === 'absolute');

buttons.append('label')
  .text(d => d);

const updateChart = (metric) => {
  barChart(data, {
    x: metric === 'absolute' ? d => d[2019] - d[2010] : d => d[2019] / d[2010] - 1,
    y: d => d.State,
    yDomain: d3.groupSort(data, ([d]) => d[2019] - d[2010], d => d.State),
    xFormat: metric === 'absolute' ? '+,d' : '+%',
    xLabel: '← decrease · Change in population · increase →',
    marginRight: 70,
    marginLeft: 70,
    height: 800,
    colors: d3.schemeRdBu[3]
  });
}

// initial state
updateChart(d3.select('input[name="metric"]:checked').node().value);

// when updated
buttons.on('change', () => {
  updateChart(d3.select('input[name="metric"]:checked').node().value);
});