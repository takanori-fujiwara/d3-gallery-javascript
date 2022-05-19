/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/world-choropleth

import {
  choropleth
} from './chart.js';

import {
  legend
} from './legend.js';

const rename = new Map([
  ["Antigua and Barbuda", "Antigua and Barb."],
  ["Bolivia (Plurinational State of)", "Bolivia"],
  ["Bosnia and Herzegovina", "Bosnia and Herz."],
  ["Brunei Darussalam", "Brunei"],
  ["Central African Republic", "Central African Rep."],
  ["Cook Islands", "Cook Is."],
  ["Democratic People's Republic of Korea", "North Korea"],
  ["Democratic Republic of the Congo", "Dem. Rep. Congo"],
  ["Dominican Republic", "Dominican Rep."],
  ["Equatorial Guinea", "Eq. Guinea"],
  ["Iran (Islamic Republic of)", "Iran"],
  ["Lao People's Democratic Republic", "Laos"],
  ["Marshall Islands", "Marshall Is."],
  ["Micronesia (Federated States of)", "Micronesia"],
  ["Republic of Korea", "South Korea"],
  ["Republic of Moldova", "Moldova"],
  ["Russian Federation", "Russia"],
  ["Saint Kitts and Nevis", "St. Kitts and Nevis"],
  ["Saint Vincent and the Grenadines", "St. Vin. and Gren."],
  ["Sao Tome and Principe", "São Tomé and Principe"],
  ["Solomon Islands", "Solomon Is."],
  ["South Sudan", "S. Sudan"],
  ["Swaziland", "eSwatini"],
  ["Syrian Arab Republic", "Syria"],
  ["The former Yugoslav Republic of Macedonia", "Macedonia"],
  // ["Tuvalu", ?],
  ["United Republic of Tanzania", "Tanzania"],
  ["Venezuela (Bolivarian Republic of)", "Venezuela"],
  ["Viet Nam", "Vietnam"]
]);

const hale = (await d3.csv('./data/hale.csv')).map(d => ({
  name: rename.get(d.country) || d.country,
  hale: +d.hale
}));

const world = await d3.json('./data/countries-50m.json');
const countries = topojson.feature(world, world.objects.countries);
const countrymesh = topojson.mesh(world, world.objects.countries, (a, b) => a !== b);

const chart = choropleth(hale, {
  id: d => d.name, // country name, e.g. Zimbabwe
  value: d => d.hale, // health-adjusted life expectancy
  range: d3.interpolateYlGnBu,
  features: countries,
  featureId: d => d.properties.name, // i.e., not ISO 3166-1 numeric
  borders: countrymesh,
  projection: d3.geoEqualEarth()
});

legend(chart.scales.color, {
  title: 'Healthy life expectancy (years)'
});