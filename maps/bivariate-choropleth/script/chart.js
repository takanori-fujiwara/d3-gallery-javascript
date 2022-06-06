/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2019-2020 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/bivariate-choropleth

import {
  uid
} from './dom-uid.js';

export const schemes = {
  'RdBu': [
    '#e8e8e8', '#e4acac', '#c85a5a',
    '#b0d5df', '#ad9ea5', '#985356',
    '#64acbe', '#627f8c', '#574249'
  ],
  'BuPu': [
    '#e8e8e8', '#ace4e4', '#5ac8c8',
    '#dfb0d6', '#a5add3', '#5698b9',
    '#be64ac', '#8c62aa', '#3b4994'
  ],
  'GnBu': [
    '#e8e8e8', '#b5c0da', '#6c83b5',
    '#b8d6be', '#90b2b3', '#567994',
    '#73ae80', '#5a9178', '#2a5a5b'
  ],
  'PuOr': [
    '#e8e8e8', '#e4d9ac', '#c8b35a',
    '#cbb8d7', '#c8ada0', '#af8e53',
    '#9972af', '#976b82', '#804d36'
  ]
};

export const bivariateChoropleth = (data, us, {
  svgId = 'bivariate-choropleth',
  colorKey = 'BuPu',
  width = 800,
  height = 600
} = {}) => {
  const states = new Map(us.objects.states.geometries.map(d => [d.id, d.properties]));
  const labels = ['low', '', 'high'];

  const colors = schemes[colorKey];
  const n = Math.floor(Math.sqrt(colors.length));

  const x = d3.scaleQuantile(Array.from(data.values(), d => d[0]), d3.range(n));
  const y = d3.scaleQuantile(Array.from(data.values(), d => d[1]), d3.range(n));

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, 975, 610]);

  const path = d3.geoPath();
  const color = value => {
    if (!value) return '#ccc';
    let [a, b] = value;
    return colors[y(b) + x(a) * n];
  }
  const format = value => {
    if (!value) return 'N/A';
    let [a, b] = value;
    return `${a}% ${data.title[0]}${labels[x(a)] && ` (${labels[x(a)]})`}
  ${b}% ${data.title[1]}${labels[y(b)] && ` (${labels[y(b)]})`}`
  };

  svg.append('g')
    .selectAll('path')
    .data(topojson.feature(us, us.objects.counties).features)
    .join('path')
    .attr('fill', d => color(data.get(d.id)))
    .attr('d', path)
    .append('title')
    .text(d => `${d.properties.name}, ${states.get(d.id.slice(0, 2)).name}
${format(data.get(d.id))}`);

  svg.append('path')
    .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('stroke-linejoin', 'round')
    .attr('d', path);

  const prepareLegendHTML = (translteX, translteY) => {
    const k = 24;
    const arrow = uid();
    return `<g font-family=sans-serif font-size=10 transform=translate(${translteX},${translteY})>
      <g transform='translate(-${k * n / 2},-${k * n / 2}) rotate(-45 ${k * n / 2},${k * n / 2})'>
        <marker id='${arrow.id}' markerHeight=10 markerWidth=10 refX=6 refY=3 orient=auto>
          <path d='M0,0L9,3L0,6Z' />
        </marker>
        ${d3.cross(d3.range(n), d3.range(n)).map(([i, j]) => `<rect width=${k} height=${k} x=${i * k} y=${(n - 1 - j) * k} fill=${colors[j * n + i]}>
          <title>${data.title[0]}${labels[j] && ` (${labels[j]})`}
    ${data.title[1]}${labels[i] && ` (${labels[i]})`}</title>
        </rect>`)}
        <line marker-end='${arrow}' x1=0 x2=${n * k} y1=${n * k} y2=${n * k} stroke=black stroke-width=1.5 />
        <line marker-end='${arrow}' y2=0 y1=${n * k} stroke=black stroke-width=1.5 />
        <text font-weight='bold' dy='0.71em' transform='rotate(90) translate(${n / 2 * k},6)' text-anchor='middle'>${data.title[0]}</text>
        <text font-weight='bold' dy='0.71em' transform='translate(${n / 2 * k},${n * k + 6})' text-anchor='middle'>${data.title[1]}</text>
      </g>
    </g>`;
  }

  svg.append('svg')
    .html(prepareLegendHTML(870, 450));

  return svg.node();
}