// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  tree
} from './chart.js';

const flare = await d3.json('./data/flare.json', d3.autoType);

tree(flare, {
  label: d => d.name,
  title: (d, n) => `${n.ancestors().reverse().map(d => d.data.name).join(".")}`, // hover text
  link: (d, n) => `https://github.com/prefuse/Flare/${n.children ? "tree" : "blob"}/master/flare/src/${n.ancestors().reverse().map(d => d.data.name).join("/")}${n.children ? "" : ".as"}`,
  sort: (a, b) => d3.descending(a.height, b.height), // reduce link crossings
  tree: d3.cluster,
  width: 1152
});