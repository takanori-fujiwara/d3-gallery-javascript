// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  starMap
} from './chart.js';

const data = (d3.csvParse(await d3.text('./data/stars.csv'), d => {
  d3.autoType(d);
  d[0] = (d.RA_hour + d.RA_min / 60 + d.RA_sec / 3600) * 15; // longitude
  d[1] = d.dec_deg + d.dec_min / 60 + d.dec_sec / 3600; // latitude
  return d;
})).sort((a, b) => d3.ascending(a.magnitude, b.magnitude));

const chart = starMap(data);

d3.select('body').append(() => chart);