/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2012–2020 Mike Bostock
// Released under the ISC license.
// https://observablehq.com/@mbostock/epicyclic-gearing

export const epicyclicGearing = (gears, {
  svgId = 'epicyclic-gearing',
  toothRadius = 0.008,
  holeRadius = 0.02,
  speed = 0.08,
  angle = 0,
  frameAngle = 0,
  frameRadius = 0.5
} = {}) => {
  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('viewBox', [-0.53, -0.53, 1.06, 1.06])
    .attr('stroke', 'black')
    .attr('stroke-width', 1 / 640)
    .style('max-width', '640px')
    .style('display', 'block')
    .style('margin', 'auto');

  const frame = svg.append('g');

  const gear = ({
    teeth,
    radius,
    annulus
  }) => {
    const n = teeth;
    let r2 = Math.abs(radius);
    let r0 = r2 - toothRadius;
    let r1 = r2 + toothRadius;
    let r3 = holeRadius;
    if (annulus) r3 = r0, r0 = r1, r1 = r3, r3 = r2 + toothRadius * 3;
    const da = Math.PI / n;
    let a0 = -Math.PI / 2 + (annulus ? Math.PI / n : 0);
    const path = ['M', r0 * Math.cos(a0), ',', r0 * Math.sin(a0)];
    let i = -1;
    while (++i < n) {
      path.push(
        'A', r0, ',', r0, ' 0 0,1 ', r0 * Math.cos(a0 += da), ',', r0 * Math.sin(a0),
        'L', r2 * Math.cos(a0), ',', r2 * Math.sin(a0),
        'L', r1 * Math.cos(a0 += da / 3), ',', r1 * Math.sin(a0),
        'A', r1, ',', r1, ' 0 0,1 ', r1 * Math.cos(a0 += da / 3), ',', r1 * Math.sin(a0),
        'L', r2 * Math.cos(a0 += da / 3), ',', r2 * Math.sin(a0),
        'L', r0 * Math.cos(a0), ',', r0 * Math.sin(a0)
      );
    }
    path.push('M0,', -r3, 'A', r3, ',', r3, ' 0 0,0 0,', r3, 'A', r3, ',', r3, ' 0 0,0 0,', -r3, 'Z');
    return path.join('');
  }

  const path = frame.selectAll('path')
    .data(gears)
    .join('path')
    .attr('fill', d => d.fill)
    .attr('d', gear);

  return Object.assign(svg.node(), {
    update() {
      angle += speed;
      frameAngle += speed / frameRadius;
      path.attr('transform', d => `translate(${d.origin}) rotate(${(angle / d.radius) % 360})`);
      frame.attr('transform', `rotate(${frameAngle % 360})`);
    }
  });
}