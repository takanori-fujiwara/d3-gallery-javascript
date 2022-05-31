// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

import {
  qQPlot
} from './chart.js';

const processedData = await d3.text('https://gist.githubusercontent.com/mbostock/f67e6aaae8b2c9151a659cd5e39aaeaa/raw/7893fef292c4507b555a1e0f76fa6ed30ed072ad/JAHANMI2.DAT')
  .then(text => {
    const lines = text.split('\r\n').slice(48, -1);
    const [header, , ...rows] = lines.map(l => l.trim().split(/\s+/g));
    const data = rows.map(r => Object.fromEntries(header.map((h, i) => [h, +r[i]])));
    return {
      y: 'Batch 1',
      x: 'Batch 2',
      qy: data.filter(d => d.Bat === 1).map(d => d.Y),
      qx: data.filter(d => d.Bat === 2).map(d => d.Y)
    };
  });

const chart = qQPlot(processedData);

d3.select('body').append(() => chart);