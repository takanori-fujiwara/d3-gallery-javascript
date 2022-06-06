/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2018-2020 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/vector-tiles

export const vectorTiles = async ({
  apiKey,
  svgId = 'vector-tiles',
  width = 800,
  height = 600
} = {}) => {
  if (!apiKey) {
    const svg = d3.create('div').html('Set Nextzen\'s API Key in main.js. Get an API Key <a href="https://www.nextzen.org/">here</a>');
    return svg.node();
  }
  const projection = d3.geoMercator()
    .center([-122.4183, 37.7750])
    .scale(Math.pow(2, 21) / (2 * Math.PI))
    .translate([width / 2, height / 2]);
  const tile = d3.tile()
    .size([width, height])
    .scale(projection.scale() * 2 * Math.PI)
    .translate(projection([0, 0]));
  const tiles = await Promise.all(tile().map(async d => {
    d.data = await fetch(`https://tile.nextzen.org/tilezen/vector/v1/256/all/${d[2]}/${d[0]}/${d[1]}.json?api_key=${apiKey}`).then(response => response.json()); // Sign up for an API key: https://www.nextzen.org
    return d;
  }));

  const path = d3.geoPath(projection);
  const filter = ({
    features
  }, test) => {
    return {
      type: 'FeatureCollection',
      features: features.filter(test)
    };
  }

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('heght', height)
    .attr('viewBox', [0, 0, width, height]);

  svg.selectAll('.path-group')
    .data(tiles)
    .join(enter => {
      enter
        .append('path')
        .attr('fill', '#eee')
        .attr('d', d => path(filter(d.data.water, d => !d.properties.boundary)));
      enter
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', '#aaa')
        .attr('d', d => path(filter(d.data.water, d => d.properties.boundary)));
      enter
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('stroke-width', 0.75)
        .attr('d', d => path(d.data.roads));
    });

  return svg.node();
}