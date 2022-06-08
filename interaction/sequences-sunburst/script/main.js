// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  sunburst,
  breadcrumb
} from './chart.js';

const data = d3.csvParseRows(await d3.text('./data/visit-sequences@1.csv'));

const breadcrumbChart = breadcrumb();
const chart = sunburst(data, breadcrumbChart);

d3.select('body').append(() => breadcrumbChart);
d3.select('body').append(() => chart);