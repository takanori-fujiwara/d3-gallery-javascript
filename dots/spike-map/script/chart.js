/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/spike-map

export const spikeMap = (data, {
  svgId = 'spike-map',
  position = d => d, // given d in data, returns the [longitude, latitude]
  value = () => undefined, // given d in data, returns the quantitative value
  title, // given a datum d, returns the hover text
  scale = d3.scaleLinear, // type of length scale
  domain, // [0, max] values; input of length scale; must start at zero
  maxLength = 200, // maximum length of spikes
  width = 640, // outer width, in pixels
  height, // outer height, in pixels
  projection, // a D3 projection; null for pre-projected geometry
  features, // a GeoJSON feature collection for the background
  borders, // a GeoJSON object for stroking borders
  spike = (length, width = 7) => `M${-width / 2},0L0,${-length}L${width / 2},0`,
  outline = projection && projection.rotate ? {
    type: 'Sphere'
  } : null, // a GeoJSON object for the background
  backgroundFill = '#e0e0e0', // fill color for background
  backgroundStroke = 'white', // stroke color for borders
  backgroundStrokeWidth, // stroke width for borders
  backgroundStrokeOpacity, // stroke width for borders
  backgroundStrokeLinecap = 'round', // stroke line cap for borders
  backgroundStrokeLinejoin = 'round', // stroke line join for borders
  fill = 'red', // fill color for spikes
  fillOpacity = 0.3, // fill opacity for spikes
  stroke = 'red', // stroke color for spikes
  strokeWidth, // stroke width for spikes
  strokeOpacity, // stroke opacity for spikes
  legendX = width - 20,
  legendY = height - 20,
} = {}) => {
  // Compute values.
  const I = d3.map(data, (_, i) => i);
  const V = d3.map(data, value).map(d => d == null ? NaN : +d);
  const P = d3.map(data, position);
  const T = title == null ? null : d3.map(data, title);

  // Compute default domains.
  if (domain === undefined) domain = [0, d3.max(V)];

  // Construct scales.
  const length = scale(domain, [0, maxLength]);

  // Compute the default height. If an outline object is specified, scale the projection to fit
  // the width, and then compute the corresponding height.
  if (height === undefined) {
    if (outline === undefined) {
      height = 400;
    } else {
      const [
        [x0, y0],
        [x1, y1]
      ] = d3.geoPath(projection.fitWidth(width, outline)).bounds(outline);
      const dy = Math.ceil(y1 - y0),
        l = Math.min(Math.ceil(x1 - x0), dy);
      projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
      height = dy;
    }
  }

  // Construct a path generator.
  const path = d3.geoPath(projection);

  d3.select('body').select(`svg#${svgId}`).remove();

  const svg = d3.select('body').append('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .attr('style', 'width: 100%; height: auto; height: intrinsic;');

  if (outline != null) svg.append('path')
    .attr('fill', 'white')
    .attr('stroke', 'currentColor')
    .attr('d', path(outline));

  svg.append('path')
    .datum(features)
    .attr('fill', backgroundFill)
    .attr('d', path);

  if (borders != null) svg.append('path')
    .attr('pointer-events', 'none')
    .attr('fill', 'none')
    .attr('stroke', backgroundStroke)
    .attr('stroke-linecap', backgroundStrokeLinecap)
    .attr('stroke-linejoin', backgroundStrokeLinejoin)
    .attr('stroke-width', backgroundStrokeWidth)
    .attr('stroke-opacity', backgroundStrokeOpacity)
    .attr('d', path(borders));

  const legend = svg.append('g')
    .attr('fill', '#777')
    .attr('text-anchor', 'middle')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)
    .selectAll('g')
    .data(length.ticks(4).slice(1).reverse())
    .join('g')
    .attr('transform', (d, i) => `translate(${legendX - i * 18},${legendY})`);

  legend.append('path')
    .attr('fill', 'red')
    .attr('fill-opacity', 0.3)
    .attr('stroke', 'red')
    .attr('d', d => spike(length(d)));

  legend.append('text')
    .attr('dy', '1.3em')
    .text(length.tickFormat(4, 's'));

  svg.append('g')
    .attr('fill', fill)
    .attr('fill-opacity', fillOpacity)
    .attr('stroke', stroke)
    .attr('stroke-width', strokeWidth)
    .attr('stroke-opacity', strokeOpacity)
    .selectAll('path')
    .data(d3.range(data.length)
      .filter(i => P[i])
      .sort((i, j) => d3.ascending(P[i][1], P[j][1]) || d3.ascending(P[i][0], P[j][0])))
    .join('path')
    .attr('transform', projection == null ?
      i => `translate(${P[i]})` :
      i => `translate(${projection(P[i])})`)
    .attr('d', i => spike(length(V[i])))
    .call(T ? path => path.append('title').text(i => T[i]) : () => {});

  return svg.node();
}