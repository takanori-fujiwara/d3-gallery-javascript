// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  seaIceExtent19782017
} from './chart.js';

const data = Object.assign(await d3.csvParse(await d3.text('./data/sea-ice-extent.csv'), ({
  date,
  extent
}) => ({
  date: new Date(date),
  value: 1e6 * extent
})).sort((a, b) => a.date - b.date), {
  y: 'km²'
})

// console.log(data);
const play = () => {
  const chart = seaIceExtent19782017(data, {
    svgId: 'sea-ice-extent-19782017'
  });

  d3.select('#sea-ice-extent-19782017').remove();
  d3.select('body').append(() => chart);
  chart.play();
}

const button = d3.select('body').append('div').append('button')
  .attr('type', 'button').text('Replay');

// initial play
play();

// replay
button.on('click', () => {
  play();
});