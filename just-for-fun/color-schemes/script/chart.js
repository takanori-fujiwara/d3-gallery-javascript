/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2018–2020 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/color-schemes
// > ISC License
// > Permission to use, copy, modify, and/or distribute this software for any
// > purpose with or without fee is hereby granted, provided that the above
// > copyright notice and this permission notice appear in all copies.>
//
// > THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// > WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// > MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// > ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// > WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// > ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// > OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

const ramp = (name, n) => {
  let canvas;
  let colors;
  let dark;
  if (d3[`scheme${name}`] && d3[`scheme${name}`][n]) {
    colors = d3[`scheme${name}`][n];
    dark = d3.lab(colors[0]).l < 50;
  } else {
    const interpolate = d3[`interpolate${name}`];
    colors = [];
    dark = d3.lab(interpolate(0)).l < 50;
    for (let i = 0; i < n; ++i) {
      colors.push(d3.rgb(interpolate(i / (n - 1))).hex());
    }
  }
  if (n < 128) {
    const svg = d3.create('svg')
      .attr('viewBox', [0, 0, n, 1])
      .style('display', 'block')
      .style('shape-rendering', 'crispEdges')
      .style('width', n * 33)
      .style('height', 33)
      .style('margin', '0 -14px')
      .style('cursor', 'pointer')
      .style('preserveAspectRatio', 'none');
    svg.html(colors.map((c, i) => `<rect x=${i} width=1 height=1 fill=${c} />`).join(''));
    canvas = svg.node();
  } else {
    canvas = document.createElement('canvas');
    canvas.width = n;
    canvas.height = 1;
    const context = canvas.getContext('2d');
    canvas.style.margin = '0 -14px';
    canvas.style.width = 400;
    canvas.style.height = '33px';
    canvas.style.cursor = 'pointer';
    for (let i = 0; i < n; ++i) {
      context.fillStyle = colors[i];
      context.fillRect(i, 0, 1, 1);
    }
  }
  const label = document.createElement('DIV');
  label.textContent = name;
  label.style.position = 'relative';
  label.style.top = '-23px';
  label.style.color = dark ? `#fff` : `#000`;
  canvas.onclick = () => {
    label.textContent = 'Copied!';
    navigator.clipboard.writeText(JSON.stringify(colors));
    setTimeout(() => label.textContent = name, 2000);
  };

  return {
    canvas: canvas,
    label: label
  };
}

const swatches = name => {
  const colors = d3[`scheme${name}`];
  const n = colors.length;
  const dark = d3.lab(colors[0]).l < 50;;
  const svg = d3.create('svg')
    .attr('viewBox', [0, 0, n, 1])
    .style('display', 'block')
    .style('width', n * 33)
    .style('height', 33)
    .style('margin', '-2 -14px')
    .style('cursor', 'pointer');
  svg.html(colors.map((c, i) => `<rect x=${i} width=1 height=1 fill=${c} />`).join(''));
  const canvas = svg.node();

  const label = document.createElement('DIV');
  label.textContent = name;
  label.style.position = 'relative';
  label.style.top = '-22px';
  label.style.color = dark ? `#fff` : `#000`;
  canvas.onclick = () => {
    label.textContent = 'Copied!';
    navigator.clipboard.writeText(JSON.stringify(colors));
    setTimeout(() => label.textContent = name, 2000);
  };

  return {
    canvas: canvas,
    label: label
  };
}

const sequentialSingleHueSchemes = [
  'Blues',
  'Greens',
  'Greys',
  'Oranges',
  'Purples',
  'Reds'
];

const sequentialMultiHueSchemes = [
  'BuGn',
  'BuPu',
  'GnBu',
  'OrRd',
  'PuBuGn',
  'PuBu',
  'PuRd',
  'RdPu',
  'YlGnBu',
  'YlGn',
  'YlOrBr',
  'YlOrRd',
  'Cividis',
  'Viridis',
  'Inferno',
  'Magma',
  'Plasma',
  'Warm',
  'Cool',
  'CubehelixDefault',
  'Turbo'
];

const divergingSchemes = [
  'BrBG',
  'PRGn',
  'PiYG',
  'PuOr',
  'RdBu',
  'RdGy',
  'RdYlBu',
  'RdYlGn',
  'Spectral'
];

const cyclicalSchemes = [
  'Rainbow',
  'Sinebow'
];

const categoricalSchemes = [
  'Category10',
  'Accent',
  'Dark2',
  'Paired',
  'Pastel1',
  'Pastel2',
  'Set1',
  'Set2',
  'Set3',
  'Tableau10'
]

export const colorSchemes = ({
  svgId = 'color-schemes',
  n = 256
} = {}) => {
  const div = d3.create('div').attr('id', svgId);

  // Sequential (Single-Hue)
  div.append('h2').text('Sequential (Single-Hue)');
  for (const scheme of sequentialSingleHueSchemes) {
    const canvasLabel = ramp(scheme, n);
    div.append(() => canvasLabel.canvas);
    div.append(() => canvasLabel.label);
  }

  // Sequential (Multi-Hue)
  div.append('h2').text('Sequential (Multi-Hue)');
  for (const scheme of sequentialMultiHueSchemes) {
    const canvasLabel = ramp(scheme, n);
    div.append(() => canvasLabel.canvas);
    div.append(() => canvasLabel.label);
  }

  // Diverging
  div.append('h2').text('Diverging');
  for (const scheme of divergingSchemes) {
    const canvasLabel = ramp(scheme, n);
    div.append(() => canvasLabel.canvas);
    div.append(() => canvasLabel.label);
  }

  // Cyclical
  div.append('h2').text('Cyclical');
  for (const scheme of cyclicalSchemes) {
    const canvasLabel = ramp(scheme, n);
    div.append(() => canvasLabel.canvas);
    div.append(() => canvasLabel.label);
  }

  // Categorical
  div.append('h2').text('Categorical');
  for (const scheme of categoricalSchemes) {
    const canvasLabel = swatches(scheme);
    div.append(() => canvasLabel.canvas);
    div.append(() => canvasLabel.label);
  }

  return div.node();
}