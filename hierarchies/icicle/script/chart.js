/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/icicle

export const icicle = (data, { // data is either tabular (array of objects) or hierarchy (nested objects)
  svgId = 'icicle',
  path, // as an alternative to id and parentId, returns an array identifier, imputing internal nodes
  id = Array.isArray(data) ? d => d.id : null, // if tabular data, given a d in data, returns a unique identifier (string)
  parentId = Array.isArray(data) ? d => d.parentId : null, // if tabular data, given a node d, returns its parent’s identifier
  children, // if hierarchical data, given a d in data, returns its children
  format = ',', // format specifier string or function for values
  value, // given a node d, returns a quantitative value (for area encoding; null for count)
  sort = (a, b) => d3.descending(a.value, b.value), // how to sort nodes prior to layout
  label, // given a node d, returns the name to display on the rectangle
  title, // given a node d, returns its hover text
  link, // given a node d, its link (if any)
  linkTarget = '_blank', // the target attribute for links (if any)
  width = 640, // outer width, in pixels
  height = 400, // outer height, in pixels
  margin = 0, // shorthand for margins
  marginTop = margin, // top margin, in pixels
  marginRight = margin, // right margin, in pixels
  marginBottom = margin, // bottom margin, in pixels
  marginLeft = margin, // left margin, in pixels
  padding = 1, // cell padding, in pixels
  round = false, // whether to round to exact pixels
  color = d3.interpolateRainbow, // color scheme, if any
  fill = '#ccc', // fill for node rects (if no color encoding)
  fillOpacity = 0.6, // fill opacity for node rects
} = {}) => {

  // If id and parentId options are specified, or the path option, use d3.stratify
  // to convert tabular data to a hierarchy; otherwise we assume that the data is
  // specified as an object {children} with nested objects (a.k.a. the “flare.json”
  // format), and use d3.hierarchy.
  const root = path != null ? d3.stratify().path(path)(data) :
    id != null || parentId != null ? d3.stratify().id(id).parentId(parentId)(data) :
    d3.hierarchy(data, children);

  // Compute the values of internal nodes by aggregating from the leaves.
  value == null ? root.count() : root.sum(d => Math.max(0, value(d)));

  // Compute formats.
  if (typeof format !== 'function') format = d3.format(format);

  // Sort the leaves (typically by descending value for a pleasing layout).
  if (sort != null) root.sort(sort);

  // Compute the partition layout. Note that x and y are swapped!
  d3.partition()
    .size([height - marginTop - marginBottom, width - marginLeft - marginRight])
    .padding(padding)
    .round(round)
    (root);

  // Construct a color scale.
  if (color != null) {
    color = d3.scaleSequential([0, root.children.length - 1], color).unknown(fill);
    root.children.forEach((child, i) => child.index = i);
  }

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('viewBox', [-marginLeft, -marginTop, width, height])
    .attr('width', width)
    .attr('height', height)
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10);

  const cell = svg
    .selectAll('a')
    .data(root.descendants())
    .join('a')
    .attr('xlink:href', link == null ? null : d => link(d.data, d))
    .attr('target', link == null ? null : linkTarget)
    .attr('transform', d => `translate(${d.y0},${d.x0})`);

  cell.append('rect')
    .attr('width', d => d.y1 - d.y0)
    .attr('height', d => d.x1 - d.x0)
    .attr('fill', color ? d => color(d.ancestors().reverse()[1]?.index) : fill)
    .attr('fill-opacity', fillOpacity);

  const text = cell.filter(d => d.x1 - d.x0 > 10).append('text')
    .attr('x', 4)
    .attr('y', d => Math.min(9, (d.x1 - d.x0) / 2))
    .attr('dy', '0.32em');

  if (label != null) text.append('tspan')
    .text(d => label(d.data, d));

  text.append('tspan')
    .attr('fill-opacity', 0.7)
    .attr('dx', label == null ? null : 3)
    .text(d => format(d.value));

  if (title != null) cell.append('title')
    .text(d => title(d.data, d));

  return svg.node();
}