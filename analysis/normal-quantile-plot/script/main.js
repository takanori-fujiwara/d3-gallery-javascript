// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  normalQuantilePlot
} from './chart.js';

const processedData = await d3.text('./data/JAHANMI2.DAT').then(text => {
  const lines = text.split('\r\n').slice(48, -1);
  const [header, , ...rows] = lines.map(l => l.trim().split(/\s+/g));
  const data = rows.map(r => Object.fromEntries(header.map((h, i) => [h, +r[i]])));
  return Object.assign(data.map(d => d.Y), {
    title: 'Strength'
  });
})

const chart = normalQuantilePlot(processedData);

d3.select('body').append(() => chart);