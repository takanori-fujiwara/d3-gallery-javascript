// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2017 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/brushable-scatterplot

import {
  brushableScatterplot
} from './chart.js';

const data = Object.assign(d3.csvParse(await d3.text('./data/cars-2.csv'), ({
  Name: name,
  Miles_per_Gallon: x,
  Horsepower: y
}) => ({
  name,
  x: +x,
  y: +y
})), {
  x: "Miles per Gallon",
  y: "Horsepower"
})

const chart = brushableScatterplot(data);

d3.select('body').append(() => chart);