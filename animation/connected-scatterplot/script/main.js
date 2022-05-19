// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  connectedScatterplot
} from './chart.js';

const driving = await d3.csv('./data/driving.csv', d3.autoType);

const button = d3.select('body').append('div').append('button').attr('type', 'button').text('Replay');

const play = () => {
  connectedScatterplot(driving, {
    x: d => d.miles,
    y: d => d.gas,
    title: d => d.year,
    orient: d => d.side,
    yFormat: '.2f',
    xLabel: 'Miles driven (per capita per year) →',
    yLabel: '↑ Price of gas (per gallon, adjusted average $)',
    width: 1000,
    height: 720,
    duration: 5000 // for the intro animation; 0 to disable
  });
}

play();

// replay
button.on('click', () => {
  play();
});