// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2018 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@mbostock/walmarts-growth

import {
  walmartsGrowth
} from './chart.js';

import {
  scrubber
} from './scrubber.js';


const projection = d3.geoAlbersUsa().scale(1280).translate([480, 300]);
const parseDate = d3.utcParse("%m/%d/%Y");

const data = (await d3.tsv('./data/walmart.tsv')).map(d => {
    const p = projection(d);
    p.date = parseDate(d.date);
    return p;
  })
  .sort((a, b) => a.date - b.date);

const us = await d3.json('https://cdn.jsdelivr.net/npm/us-atlas@1/us/10m.json');
us.objects.lower48 = {
  type: 'GeometryCollection',
  geometries: us.objects.states.geometries.filter(d => d.id !== '02' && d.id !== '15')
};

const chart = walmartsGrowth(data, us);

const dates = d3.utcWeek.every(2).range(...d3.extent(data, d => d.date));

const scrubberForm = scrubber(dates, {
  chartUpdate: index => chart.update(dates[index]),
  loop: false,
  format: d3.utcFormat("%Y %b %-d")
});

d3.select('body').append(() => scrubberForm.node());
d3.select('body').append(() => chart);