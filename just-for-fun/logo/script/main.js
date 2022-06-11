// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  logo,
  playLogo,
  colorLogo
} from './chart.js';

//
// First Logo
//
const chart1 = logo();
d3.select('body').append(() => chart1);

//
// Second Logo
//
const play = () => {
  const chart2 = playLogo({
    svgId: 'play-logo'
  });

  d3.select('#play-logo').remove();
  d3.select('body').append(() => chart2);
  chart2.play();
}

const button = d3.select('body').append('div').append('button')
  .attr('type', 'button').text('Replay');

// initial play
play();
// replay
button.on('click', () => {
  play();
});

//
// Third Logo
//
const colorForm = d3.select('body').append('form').style('font', '12px var(--sans-serif)')
  .html(`
  <div>
    <input name=a0 type=color value='#f9a03c'>
    <input name=a1 type=color value='#f7974e'> gradient 1
  </div>
  <div>
    <input name=b0 type=color value='#f26d58'>
    <input name=b1 type=color value='#f9a03c'> gradient 2
  </div>
  <div>
    <input name=c0 type=color value='#b84e51'>
    <input name=c1 type=color value='#f68e48'> gradient 3
  </div>`);

const chart3 = colorLogo();
d3.select('body').append(() => chart3).style('margin-left', 300);

colorForm.on('input', () => {
  const names = ['a0', 'a1', 'b0', 'b1', 'c0', 'c1'];

  const color = {};
  for (const name of names) {
    const value = d3.select(`input[name='${name}']`).property('value');
    color[name] = value;
  }

  chart3.update(color);
});