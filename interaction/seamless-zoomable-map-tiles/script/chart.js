/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2019–2020 Observable, Inc.
// Released under the ISC license.
// > ISC License
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
// https://observablehq.com/@d3/seamless-zoomable-map-tiles

export const seamlessZoomableMapTiles = ({
  width = 900,
  height = 600,
  deltas = [-100, -4, -1, 0],
  showlayers = false
} = {}) => {
  const url = (x, y, z) => `https://tile.opentopomap.org/${z}/${x}/${y}.png`;

  const svg = d3.create('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height]);

  const tile = d3.tile()
    .extent([
      [0, 0],
      [width, height]
    ])
    .tileSize(512)
    .clampX(false);

  const zoomed = transform => {
    levels.each(function(delta) {
      const tiles = tile.zoomDelta(delta)(transform);

      d3.select(this)
        .selectAll('image')
        .data(tiles, d => d)
        .join('image')
        .attr('xlink:href', d => url(...d3.tileWrap(d)))
        .attr('x', ([x]) => (x + tiles.translate[0]) * tiles.scale)
        .attr('y', ([, y]) => (y + tiles.translate[1]) * tiles.scale)
        .attr('width', tiles.scale)
        .attr('height', tiles.scale);
    });
  }

  const zoom = d3.zoom()
    .scaleExtent([1 << 8, 1 << 22])
    .extent([
      [0, 0],
      [width, height]
    ])
    .on('zoom', event => zoomed(event.transform));

  const levels = svg.append('g')
    .attr('pointer-events', 'none')
    .selectAll('g')
    .data(deltas)
    .join('g')
    .style('opacity', showlayers ? 0.3 : null);

  svg.call(zoom).call(zoom.transform,
    d3.zoomIdentity.translate(width >> 1, height >> 1).scale(1 << 12));

  return svg.node();
}