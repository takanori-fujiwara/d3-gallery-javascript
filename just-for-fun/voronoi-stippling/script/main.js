// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  voronoiStippling
} from './chart.js';

const image = await d3.image('./data/obama.png');

const chart = voronoiStippling(image);

d3.select('body').append(() => chart);