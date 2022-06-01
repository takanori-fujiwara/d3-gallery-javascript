// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2018 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/chord-dependency-diagram

import {
  chordDependencyDiagram
} from './chart.js';

const rename = name => name.substring(name.indexOf('.') + 1, name.lastIndexOf('.'));

const data = Array.from(d3.rollup((await d3.json('./data/flare.json'))
    .flatMap(({
      name: source,
      imports
    }) => imports.map(target => [rename(source), rename(target)])),
    ({
      0: [source, target],
      length: value
    }) => ({
      source,
      target,
      value
    }), link => link.join())
  .values());

const chart = chordDependencyDiagram(data);

d3.select('body').append(() => chart);