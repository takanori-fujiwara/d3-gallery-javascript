/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2020 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/scatterplot-tour

export const scatterplotTour = (data, {
  svgId = 'scatterplot-tour',
  width = 800,
  height = 600,
  transformClusterId
} = {}) => {
  const k = height / width;
  const x = d3.scaleLinear().domain([-4.5, 4.5]).range([0, width]);
  const y = d3.scaleLinear().domain([-4.5 * k, 4.5 * k]).range([height, 0]);
  const z = d3.scaleOrdinal().domain(data.map(d => d[2])).range(d3.schemeCategory10);

  const xAxis = (g, x) => g
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisTop(x).ticks(12))
    .call(g => g.select('.domain').attr('display', 'none'));
  const yAxis = (g, y) => g
    .call(d3.axisRight(y).ticks(12 * k))
    .call(g => g.select('.domain').attr('display', 'none'));

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('viewBox', [0, 0, width * 1.5, height * 1.5]);

  const g = svg.append('g')
    .attr('fill', 'none')
    .attr('stroke-linecap', 'round');

  g.selectAll('path')
    .data(data)
    .join('path')
    .attr('d', d => `M${x(d[0])},${y(d[1])}h0`)
    .attr('stroke', d => z(d[2]));

  const gx = svg.append('g');
  const gy = svg.append('g');

  const groupedData = d3.groups(data, d => d[2]);
  const clusterIds = groupedData.map(d => d[0]);

  const generateTransform = clusterId => {
    if (clusterIds.includes(clusterId)) {
      const idx = clusterIds.indexOf(clusterId);
      const data = groupedData[idx][1]

      const [x0, x1] = d3.extent(data, d => d[0]).map(x);
      const [y1, y0] = d3.extent(data, d => d[1]).map(y);
      const k = 0.9 * Math.min(width / (x1 - x0), height / (y1 - y0));
      const tx = (width - k * (x0 + x1)) / 2;
      const ty = (height - k * (y0 + y1)) / 2;

      return d3.zoomIdentity.translate(tx, ty).scale(k);
    } else {
      return d3.zoomIdentity;
    }
  }

  const zoomed = event => {
    const {
      transform
    } = event;
    g.attr('transform', transform).attr('stroke-width', 5 / transform.k);
    gx.call(xAxis, transform.rescaleX(x));
    gy.call(yAxis, transform.rescaleY(y));
  }
  const zoom = d3.zoom().on('zoom', zoomed);

  svg.call(zoom.transform, generateTransform(transformClusterId));

  return Object.assign(svg.node(), {
    update(transformClusterId) {
      svg.transition()
        .duration(1500)
        .call(zoom.transform, generateTransform(transformClusterId));
    }
  });
}