/// Modified source copyright
// Copyright 2023 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2018 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/zoomable-sunburst

const breakText = (text, thresCounts, {
  style = 'space'
} = {}) => {
  // this is based on https://stackoverflow.com/a/51506718
  if (style === 'space') {
    // breaking by space
    return text.replace(new RegExp(`(?![^\\n]{1,${thresCounts}}$)([^\\n]{1,${thresCounts}})\\s`, 'g'), '$1\n')
  } else if (style === 'break-all') {
    // breking text whenever they reached thresCounts
    return text.replace(new RegExp(`(?![^\\n]{1,${thresCounts}}$)([^\\n]{1,${thresCounts}})`, 'g'), '$1\n')
  } else {
    // default: breking text whenever they reached thresCounts
    return text.replace(new RegExp(`(?![^\\n]{1,${thresCounts}}$)([^\\n]{1,${thresCounts}})`, 'g'), '$1\n')
  }
};

export const zoomableSunburst = (data, {
  svgId = 'zoomable-sunburst',
  width = 800,
  radius = width / 6,
  color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1)),
  format = d3.format(',d'),
  fontSize = 10,
  charsPerLine = 10,
  lineSpace = 12,
  wrapStyle = 'space'
} = {}) => {
  const partition = data => {
    const root = d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);
    return d3.partition()
      .size([2 * Math.PI, root.height + 1])
      (root);
  }

  const root = partition(data);
  root.each(d => d.current = d);

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', width)
    .attr('viewBox', [0, 0, width, width])
    .style('font', `${fontSize}px sans-serif`);

  const g = svg.append('g')
    .attr('transform', `translate(${width / 2},${width / 2})`);

  const arc = d3.arc()
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(radius * 1.5)
    .innerRadius(d => d.y0 * radius)
    .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));

  const arcVisible = d => d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
  // const labelVisible = d => d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
  const labelVisible = (d, nLines) => d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03 * nLines * fontSize / 10;

  const labelTransform = d => {
    const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
    const y = (d.y0 + d.y1) / 2 * radius;
    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
  }

  const clicked = (event, p) => {
    parent.datum(p.parent || root);

    root.each(d => d.target = {
      x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
      x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
      y0: Math.max(0, d.y0 - p.depth),
      y1: Math.max(0, d.y1 - p.depth)
    });

    const t = g.transition().duration(750);

    path.transition(t)
      .tween('data', d => {
        const i = d3.interpolate(d.current, d.target);
        return t => d.current = i(t);
      })
      .filter(
        function(d) {
          return +this.getAttribute('fill-opacity') || arcVisible(d.target);
        })
      .attr('fill-opacity', d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
      .attr('pointer-events', d => arcVisible(d.target) ? 'auto' : 'none')
      .attrTween('d', d => () => arc(d.current));

    // This part is edited to handle labelVisible 
    label.filter(
        function(d) {
          return +this.getAttribute('fill-opacity') || labelVisible(d.target, breakText(d.data.name, charsPerLine, {
            'style': wrapStyle
          }).split('\n').length);
        }).transition(t)
      .attr('fill-opacity', d => +labelVisible(d.target, breakText(d.data.name, charsPerLine, {
        'style': wrapStyle
      }).split('\n').length))
      .attrTween('transform', d => () => labelTransform(d.current));
  }

  const path = g.append('g')
    .selectAll('path')
    .data(root.descendants().slice(1))
    .join('path')
    .attr('fill', d => {
      while (d.depth > 1) d = d.parent;
      return color(d.data.name);
    })
    .attr('fill-opacity', d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
    .attr('pointer-events', d => arcVisible(d.current) ? 'auto' : 'none')
    .attr('d', d => arc(d.current));

  path.filter(d => d.children)
    .style('cursor', 'pointer')
    .on('click', clicked);

  path.append('title')
    .text(d => `${d.ancestors().map(d => d.data.name).reverse().join('/')}\n${format(d.value)}`);

  const labelContainer = g.append('g')
    .attr('pointer-events', 'none')
    .attr('text-anchor', 'middle')
    .style('user-select', 'none');
  const label = labelContainer.selectAll('text')
    .data(root.descendants().slice(1))
    .join('text')
    .attr('dy', '0.35em')
    .attr('fill-opacity', d =>
      // changing visibility based on the space and number of lines after wrapping
      +labelVisible(d.current, breakText(d.data.name, charsPerLine, {
        'style': wrapStyle
      }).split('\n').length))
    .attr('transform', d => labelTransform(d.current));

  // This part performs wrapping with tspan (instead of .text(d => d.data.name))
  label.selectAll('tspan')
    .data(d => {
      const textLines = breakText(d.data.name, charsPerLine, {
        'style': wrapStyle
      }).split('\n');
      return textLines.map(text => new Object({
        'text': text,
        'nLines': textLines.length
      }));
    })
    .join('tspan')
    .attr('x', 0)
    .attr('y', (line, i) => (i - (line.nLines - 1) * 0.5) * lineSpace)
    .text(line => line.text);

  const parent = g.append('circle')
    .datum(root)
    .attr('r', radius)
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .on('click', clicked);

  return svg.node();
}