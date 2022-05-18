// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  tree
} from './chart.js';

const flare = await d3.json('./data/flare-2.json', d3.autoType);

tree(flare, {
  label: d => d.name,
  sort: (a, b) => d3.descending(a.height, b.height), // reduce link crossings
  tree: d3.cluster,
  title: (d, n) => `${n.ancestors().reverse().map(d => d.data.name).join(".")}`, // hover text
  link: (d, n) => n.children ?
    `https://github.com/prefuse/Flare/tree/master/flare/src/${n.ancestors().reverse().map(d => d.data.name).join("/")}` :
    `https://github.com/prefuse/Flare/blob/master/flare/src/${n.ancestors().reverse().map(d => d.data.name).join("/")}.as`,
  width: 1152,
  height: 1152,
  margin: 110
});