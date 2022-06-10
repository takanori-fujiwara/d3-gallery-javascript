/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2020 Harry Stevens
// Released under the ISC license.
// https://observablehq.com/@harrystevens/directly-labelling-lines
// For drawing line charts
// Source code in https://observablehq.com/@d3/inline-labels is used.
// Copyright 2019–2021 Observable, Inc. Released under the ISC license.
// > ISC License
// >
// > Permission to use, copy, modify, and/or distribute this software for any
// > purpose with or without fee is hereby granted, provided that the above
// > copyright notice and this permission notice appear in all copies.>
//
// > THE SOFTWARE IS PROVIDED 'AS IS' AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// > WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// > MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// > ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// > WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// > ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// > OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

export const inlineChart = (data, {
  svgId = 'inline-chart',
  x = d => d.date,
  y = d => d.value,
  z = d => d.fruit,
  defined, // for gaps in data
  curve = d3.curveLinear, // method of interpolation between points
  marginTop = 20, // top margin, in pixels
  marginRight = 60, // right margin, in pixels
  marginBottom = 20, // bottom margin, in pixels
  marginLeft = 20, // left margin, in pixels
  width = 640, // outer width, in pixels
  height = 400, // outer height, in pixels
  xType = d3.scaleUtc, // type of x-scale
  xDomain, // [xmin, xmax]
  xRange = [marginLeft, width - marginRight], // [left, right]
  yType = d3.scaleLinear, // type of y-scale
  yDomain, // [ymin, ymax]
  yRange = [height - marginBottom, marginTop], // [bottom, top]
  zDomain, // array of z-values
  colors = d3.schemeCategory10, // stroke color of line
  strokeLinecap = 'round', // stroke line cap of the line
  strokeLinejoin = 'round', // stroke line join of the line
  strokeWidth = 1.5, // stroke width of line, in pixels
  strokeOpacity = 1, // stroke opacity of line
  halo = '#fff', // color of label halo
  haloWidth = 6 // padding around the labels
} = {}) => {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const Z = d3.map(data, z);
  if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
  const D = d3.map(data, defined);

  // Compute default domains, and unique the z-domain.
  if (xDomain === undefined) xDomain = d3.extent(X);
  if (yDomain === undefined) yDomain = [0, d3.max(Y)];
  if (zDomain === undefined) zDomain = Z;
  zDomain = new d3.InternSet(zDomain);

  // Omit any data not present in the z-domain.
  const I = d3.range(X.length).filter(i => zDomain.has(Z[i]));

  // Construct scales and axes.
  const xScale = xType(xDomain, xRange);
  const yScale = yType(yDomain, yRange);
  const color = d3.scaleOrdinal(zDomain, colors);
  const xAxis = d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale).tickValues(d3.range(0, 30, 5));

  // Construct a line generator.
  const line = d3.line()
    .defined(i => D[i])
    .curve(curve)
    .x(i => xScale(X[i]))
    .y(i => yScale(Y[i]));

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

  svg.append('g')
    .attr('transform', `translate(0,${height - marginBottom})`)
    .call(xAxis);
  svg.append('g')
    .attr('transform', `translate(${marginLeft},0)`)
    .call(yAxis);

  const serie = svg.append('g')
    .selectAll('g')
    .data(d3.group(I, i => Z[i]))
    .join('g');

  const path = serie.append('path')
    .attr('fill', 'none')
    .attr('stroke', ([key]) => color(key))
    .attr('stroke-width', strokeWidth)
    .attr('stroke-linecap', strokeLinecap)
    .attr('stroke-linejoin', strokeLinejoin)
    .attr('stroke-opacity', strokeOpacity)
    .style('mix-blend-mode', 'multiply')
    .attr('d', ([, I]) => line(I));

  const lastDate = xDomain[1];
  const lastDateData = [];
  for (const d of data) {
    if (d.date === lastDate) {
      lastDateData.push(d);
    }
  }

  const valueLabel = serie.selectAll('.label')
    .data(lastDateData)
    .enter().append('g')
    .attr('class', 'label')
    .attr('transform', d => `translate(${xScale(x(d))}, ${yScale(y(d))})`);
  valueLabel.append('circle')
    .attr('r', 4)
    .style('stroke', 'white')
    .style('fill', d => color(z(d)));
  valueLabel.append('text')
    .text(d => y(d))
    .attr('dy', 5)
    .attr('dx', 10)
    .style('font-family', 'monospace')
    .style('fill', d => color(z(d)));

  // voronoi related code
  const voronoiData = [...d3.Delaunay
    .from(I, i => xScale(X[i]), i => yScale(Y[i]))
    .voronoi([0, 0, width, height])
    .cellPolygons()
  ];
  // for (let i = 0; i < voronoiData.length; ++i) {
  //   voronoiData[i].data = data[i];
  // }

  const parseLargestVoronoi = (data, voronoiData) => {
    // initialization
    const output = {};
    const maxAreaSize = {};
    for (const key of zDomain) {
      output[key] = {}; // prepare initialized output
      maxAreaSize[key] = 0; // set initial area size 0
    }
    // check area size and update the info
    for (const [i, d] of data.entries()) {
      const key = z(d);
      const cell = voronoiData[i];
      const area = geometric.polygonArea(cell);
      if (area > maxAreaSize[key]) {
        maxAreaSize[key] = area;
        output[key].key = key;
        output[key].point = [xScale(x(d)), yScale(y(d))];
        output[key].angle = geometric.lineAngle([output[key].point, geometric.polygonCentroid(cell)]);
      }
    }
    // return output as an array
    return Object.keys(output).map(key => output[key]);
  }

  const largestVoronoiData = parseLargestVoronoi(data, voronoiData);

  // This is temporarily generate html to know the label width and height
  const labelSize = {};
  d3.select('body').append('div')
    .attr('id', 'dummy')
    .selectAll('text')
    .data(largestVoronoiData)
    .enter().append('text')
    .text(d => d.key)
    .style('font-family', 'sans-serif')
    .style('font-weight', '600')
    .each((d, i, e) => {
      labelSize[d.key] = {
        width: e[i].getBoundingClientRect().width,
        height: e[i].getBoundingClientRect().height
      };
    });
  d3.select('#dummy').remove();

  serie.selectAll('.line-label')
    .data(largestVoronoiData)
    .enter().append('text')
    .text(d => d.key)
    .attr('transform', d => `translate(${d.point})`)
    .style('font-family', 'sans-serif')
    .style('text-anchor', 'middle')
    .style('font-weight', '600')
    .style('fill', d => color(d.key))
    .each((d, i, e) => {
      const newD = Object.assign({}, d);
      const somePointsInLine = () => {
        const labelWidth = labelSize[d.key].width;
        const labelHeight = labelSize[d.key].height;
        const labelPadding = 5;

        const labelLeft = -labelPadding + newD.point[0] - labelWidth / 2;
        const labelRight = labelPadding + newD.point[0] + labelWidth / 2;
        const labelTop = -6 - labelPadding + newD.point[1] - labelHeight / 2;
        const labelBottom = -6 + labelPadding + newD.point[1] + labelHeight / 2;
        const labelRect = [
          [labelLeft, labelTop],
          [labelRight, labelTop],
          [labelRight, labelBottom],
          [labelLeft, labelBottom]
        ];

        return data.some(d0 => geometric.pointInPolygon([xScale(x(d0)), yScale(y(d0))], labelRect));
      }

      let iter = 1;
      const iMax = 50;
      while (somePointsInLine() && iter < iMax) {
        newD.point = geometric.pointTranslate(d.point, d.angle, iter);
        d3.select(e[i]).attr('transform', `translate(${newD.point})`);
        iter++;
      }
    });

  return Object.assign(svg.node(), {
    scales: {
      color
    }
  });
}