// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  phasesOfTheMoon
} from './chart.js';

const chartArea = d3.select('body').append('div');

const yearInput = d3.select('body').append('input')
  .style('width', 120)
  .attr('type', 'number')
  .attr('placeholder', 'year')
  .attr('min', 1900)
  .attr('max', 2100)
  .attr('step', 1)
  .attr('value', +new URLSearchParams(new URL(document.baseURI).search).get('year') || new Date().getFullYear());

const localeForm = d3.select('body').append('form')
const localeInput = localeForm.append('input')
  .style('width', 120)
  .attr('name', 'input')
  .attr('type', 'text')
  .attr('placeholder', 'Enter a locale (optional)')
localeForm.append('i')
  .style('font-size', 'smaller')
  .style('margin-left', 5)
  .html('<a href="https://en.wikipedia.org/wiki/ISO_639-1">language</a>-<a href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2">country</a> code');


const getLocale = () => {
  const value = localeInput.property('value');
  if (value) {
    try {
      (new Date).toLocaleString(value);
      return value
    } catch (error) {
      return undefined;
    }
  }

  return undefined;
}

const updateChart = (year, locale) => {
  const chart = phasesOfTheMoon({
    svgId: 'phases-of-the-moon',
    year: year,
    locale: locale
  });
  d3.select('#phases-of-the-moon').remove();
  chartArea.append(() => chart);
}

// initial state
updateChart(+yearInput.property('value'), getLocale());

yearInput.on('input', () => {
  updateChart(+yearInput.property('value'), getLocale());
});

localeInput.on('input', () => {
  updateChart(+yearInput.property('value'), getLocale());
});