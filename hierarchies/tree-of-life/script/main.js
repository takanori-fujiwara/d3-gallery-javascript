// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2018 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/tree-of-life

import {
  treeOfLife
} from './chart.js';

import {
  swatches
} from './legend.js';

// This is the version used in https://observablehq.com/@d3/tree-of-life of https://github.com/jasondavies/newick.js
// The copyright of https://github.com/jasondavies/newick.js: Copyright (c) Jason Davies 2010.
const parseNewick = a => {
  for (var e = [], r = {}, s = a.split(/\s*(;|\(|\)|,|:)\s*/), t = 0; t < s.length; t++) {
    var n = s[t];
    switch (n) {
      case '(':
        var c = {};
        r.branchset = [c], e.push(r), r = c;
        break;
      case ',':
        var c = {};
        e[e.length - 1].branchset.push(c), r = c;
        break;
      case ')':
        r = e.pop();
        break;
      case ':':
        break;
      default:
        var h = s[t - 1];
        ')' == h || '(' == h || ',' == h ? r.name = n : ':' == h && (r.length = parseFloat(n))
    }
  }
  return r
}

const data = parseNewick(await d3.text('./data/life.txt', d3.autoType));

const form = d3.select('body').append('form');
form.append('input')
  .attr('type', 'checkbox')
  .attr('id', 'showLength')
  .style('float', 'left')
  .property('checked', true);
form.append('div')
  .style('float', 'left')
  .style('margin-top', 3)
  .text('Show branch length');

const chart = treeOfLife(data, {
  showLength: d3.select('input[id="showLength"]').property('checked')
});

d3.select('body').style('clear', 'both').append(() => chart);

swatches(chart.scales.color);

// when updated
form.on('change', () => {
  chart.update(d3.select('input[id="showLength"]').property('checked'));
});