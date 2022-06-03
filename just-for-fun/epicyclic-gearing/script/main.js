/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2012–2020 Mike Bostock
// Released under the ISC license.
// https://observablehq.com/@mbostock/epicyclic-gearing

import {
  epicyclicGearing
} from './chart.js';

const x = Math.sin(2 * Math.PI / 3);
const y = Math.cos(2 * Math.PI / 3);
const gears = [{
    fill: '#c6dbef',
    teeth: 80,
    radius: -0.5,
    origin: [0, 0],
    annulus: true
  },
  {
    fill: '#6baed6',
    teeth: 16,
    radius: +0.1,
    origin: [0, 0]
  },
  {
    fill: '#9ecae1',
    teeth: 32,
    radius: -0.2,
    origin: [0, -0.3]
  },
  {
    fill: '#9ecae1',
    teeth: 32,
    radius: -0.2,
    origin: [-0.3 * x, -0.3 * y]
  },
  {
    fill: '#9ecae1',
    teeth: 32,
    radius: -0.2,
    origin: [0.3 * x, -0.3 * y]
  }
];

const dropdownData = new Map([
  ['Annulus', 0.5],
  ['Planets', Infinity],
  ['Sun', -0.1],
]);

const select = d3.select('body').append('div').append('select');
select.attr('id', 'frame-radius')

const options = select.selectAll('option')
  .data(dropdownData)
  .enter()
  .append('option')
  .text(d => d[0])
  .attr('value', d => d[1])
  .attr('selected', d => d[0] === 'Planets' ? 'selected' : null);

let interval = null;
const updateFrameRadius = frameRaius => {
  clearInterval(interval);

  const chart = epicyclicGearing(gears, {
    svgId: 'epicyclic-gearing',
    frameRadius: frameRaius
  });
  d3.select('#epicyclic-gearing').remove();
  d3.select('body').append(() => chart);

  chart.update();
  interval = setInterval(() => {
      chart.update();
    },
    20);

  return chart;
}

// initial state
updateFrameRadius(d3.select('#frame-radius').node().value);

// when updated
select.on('change', () => {
  updateFrameRadius(d3.select('#frame-radius').node().value);
});