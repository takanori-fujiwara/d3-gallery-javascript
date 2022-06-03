// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  graticuleLabelsStereographic
} from './chart.js';

const world = await d3.json('./data/land-50m.json');

const chart = graticuleLabelsStereographic(world);

d3.select('body').append(() => chart);