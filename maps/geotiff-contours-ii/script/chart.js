/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2019-2020 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/geotiff-contours-ii

const invert = (d, n, m) => {
  const shared = {};

  let p = {
    type: 'Polygon',
    coordinates: d3.merge(d.coordinates.map(polygon => {
      return polygon.map(ring => {
        return ring.map(point => {
          return [point[0] / n * 360 - 180, 90 - point[1] / m * 180];
        }).reverse();
      });
    }))
  };

  // Record the y-intersections with the antimeridian.
  p.coordinates.forEach(ring => {
    ring.forEach(p => {
      if (p[0] === -180) shared[p[1]] |= 1;
      else if (p[0] === 180) shared[p[1]] |= 2;
    });
  });

  // Offset any unshared antimeridian points to prevent their stitching.
  p.coordinates.forEach(ring => {
    ring.forEach(p => {
      if ((p[0] === -180 || p[0] === 180) && shared[p[1]] !== 3) {
        p[0] = p[0] === -180 ? -179.9995 : 179.9995;
      }
    });
  });

  p = d3.geoStitch(p);

  // If the MultiPolygon is empty, treat it as the Sphere.
  return p.coordinates.length ? {
    type: 'Polygon',
    coordinates: p.coordinates
  } : {
    type: 'Sphere'
  };
}

const rotate = (values, n, m) => {
  let l = n >> 1;
  for (let j = 0, k = 0; j < m; ++j, k += n) {
    values.subarray(k, k + l).reverse();
    values.subarray(k + l, k + n).reverse();
    values.subarray(k, k + n).reverse();
  }
  return values;
}

export const geotiffContours = async (tiff, {
  svgId = 'geotiff-contours',
  width = 960,
  height = 500,
  projection = d3.geoNaturalEarth1().precision(0.1),
} = {}) => {
  const image = await tiff.getImage();
  const n = image.getWidth();
  const m = image.getHeight();

  const values = rotate((await image.readRasters())[0], n, m)

  const color = d3.scaleSequential(d3.extent(values), d3.interpolateMagma);
  const path = d3.geoPath(projection);
  const contours = d3.contours().size([n, m]);

  const svg = d3.create('svg')
    .attr('viewBox', [0, 0, width, height])
    .style('width', '100%')
    .style('height', 'auto')
    .style('display', 'block');
  svg.append('g')
    .attr('stroke', '#000')
    .attr('stroke-width', 0.5)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .selectAll('path')
    .data(Array.from(contours(values)))
    .join('path')
    .attr('d', d => path(invert(d, n, m)))
    .attr('fill', d => color(d.value));

  return svg.node();
}