/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/sankey

import {
  pack
} from './chart.js';

const flare = await d3.json('./data/flare.json', d3.autoType);

const chart = pack(flare, {
  value: d => d.size, // size of each node (file); null for internal nodes (folders)
  label: (d, n) => [...d.name.split(/(?=[A-Z][a-z])/g), n.value.toLocaleString('en')].join('\n'),
  title: (d, n) => `${n.ancestors().reverse().map(({data: d}) => d.name).join('.')}\n${n.value.toLocaleString('en')}`,
  link: (d, n) => n.children ?
    `https://github.com/prefuse/Flare/tree/master/flare/src/${n.ancestors().reverse().map(d => d.data.name).join('/')}` : `https://github.com/prefuse/Flare/blob/master/flare/src/${n.ancestors().reverse().map(d => d.data.name).join('/')}.as`,
  width: 1152,
  height: 1152
});

d3.select('body').append(() => chart);