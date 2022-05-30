/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2019 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/smooth-zooming

export const smoothZooming = ({
  svgId = 'smooth-zooming',
  width = 800,
  height = 500,
  radius = 6,
  step = radius * 2,
  theta = Math.PI * (3 - Math.sqrt(5)),
} = {}) => {
  const data = Array.from({
    length: 2000
  }, (_, i) => {
    const r = step * Math.sqrt(i += 0.5);
    const a = theta * i;
    return [
      width / 2 + r * Math.cos(a),
      height / 2 + r * Math.sin(a)
    ];
  });

  let currentTransform = [width / 2, height / 2, height];

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])

  const g = svg.append('g');

  g.selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cx', ([x]) => x)
    .attr('cy', ([, y]) => y)
    .attr('r', radius)
    .attr('fill', (d, i) => d3.interpolateRainbow(i / 360))

  const transition = () => {
    const d = data[Math.floor(Math.random() * data.length)];
    const i = d3.interpolateZoom(currentTransform, [...d, radius * 2 + 1]);

    g.transition()
      .delay(250)
      .duration(i.duration)
      .attrTween('transform', () => t => transform(currentTransform = i(t)))
      .on('end', transition);
  }

  const transform = ([x, y, r]) => {
    return `
      translate(${width / 2}, ${height / 2})
      scale(${height / r})
      translate(${-x}, ${-y})
    `;
  }

  return svg.call(transition).node();
}