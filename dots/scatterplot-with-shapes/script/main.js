// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  scatterplotWithShapes
} from './chart.js';

import {
  swatches
} from './legend.js';

const data = Object.assign(d3.csvParse(await d3.text('./data/iris.csv'), ({
  species: category,
  sepalLength: x,
  sepalWidth: y
}) => ({
  category,
  x: +x,
  y: +y
})), {
  x: 'Sepal length (cm) →',
  y: '↑ Sepal width (cm)'
});

const chart = scatterplotWithShapes(data);

const chartSwatches = swatches(chart.scales.color);

d3.select('body').append(() => chart);
d3.select('body').append(() => chartSwatches);