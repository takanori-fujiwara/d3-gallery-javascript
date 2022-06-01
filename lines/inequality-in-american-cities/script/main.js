// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2012–2020 Mike Bostock
// Released under the ISC license.
// https://observablehq.com/@mbostock/inequality-in-american-cities

import {
  inequalityInAmericanCities
} from './chart.js';

import {
  uid
} from './dom-uid.js';

const data = Object.assign(await d3.csv('./data/metros.csv', d3.autoType), {
  x: 'Population →',
  y: '↑ Inequality'
});

const chart = inequalityInAmericanCities(data);

const generateLegendHTLM = (startColor, endColor, arc) => {
  const arrowId = uid('arrow-legend');
  const gradientId = uid('gradient-legend');
  return `<svg width='180' height='33' style='display: block; font: 10px sans-serif;'>
  <defs>
    <marker id='${arrowId.id}' markerHeight='10' markerWidth='10' refX='5' refY='2.5' orient='auto'>
      <path fill='${endColor}' d='M0,0v5l7,-2.5Z'></path>
    </marker>
    <linearGradient id='${gradientId.id}' gradientUnits='userSpaceOnUse' x1='33' x2='149'>
      <stop stop-color='${startColor}' stop-opacity='0.5'></stop>
      <stop stop-color='${endColor}' offset='100%'></stop>
    </linearGradient>
  </defs>
  <path fill='none' stroke='url(#${gradientId.id})' marker-end='url(#${arrowId.id})' d='${arc(33, 16.5, 149, 16.5)}'></path>
  <circle cx='33' cy='16.5' r='2.5'></circle>
  <text x='4' y='16.5' dy='0.36em' text-anchor='start'>1980</text>
  <text x='176' y='16.5' dy='0.36em' text-anchor='end'>2015</text>
</svg>`;
}

const legendHTML = generateLegendHTLM(chart.startColor, chart.endColor, chart.arc);

d3.select('body').append('div').html(legendHTML);
d3.select('body').append(() => chart);