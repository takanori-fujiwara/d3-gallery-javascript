/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/bubble-map

import {
  bubbleMap
} from './chart.js';

const population = await d3.json('./data/population.json');

const us = await d3.json('./data/counties-albers-10m.json');
const nation = topojson.feature(us, us.objects.nation);
const statemap = new Map(topojson.feature(us, us.objects.states).features.map(d => [d.id, d]));
const countymap = new Map(topojson.feature(us, us.objects.counties).features.map(d => [d.id, d]));
const statemesh = topojson.mesh(us, us.objects.states, (a, b) => a !== b);

const chart = bubbleMap(population, {
  value: ([population]) => +population,
  position([, stateid, countyid]) {
    const county = countymap.get(stateid + countyid);
    return county && d3.geoPath().centroid(county);
  },
  title([population, stateid, countyid]) {
    const state = statemap.get(stateid);
    const county = countymap.get(stateid + countyid);
    return `${county?.properties.name}, ${state?.properties.name}\n${(+population).toLocaleString('en')}`;
  },
  features: nation,
  borders: statemesh,
  width: 975,
  height: 610
});

d3.select('body').append(() => chart);