/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright (ISC License)
// Copyright 2012–2020 Mike Bostock
//
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED 'AS IS' AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

export const musicChart = (data, {
  svgId = 'music-chart',
  width = 900,
  height = 500,
  marginTop = 20,
  marginRight = 30,
  marginBottom = 30,
  marginLeft = 30,
} = {}) => {
  const colors = new Map([
    ['LP/EP', '#2A5784'],
    ['Vinyl Single', '#43719F'],
    ['8 - Track', '#5B8DB8'],
    ['Cassette', '#7AAAD0'],
    ['Cassette Single', '#9BC7E4'],
    ['Other Tapes', '#BADDF1'],
    ['Kiosk', '#E1575A'],
    ['CD', '#EE7423'],
    ['CD Single', '#F59D3D'],
    ['SACD', '#FFC686'],
    ['DVD Audio', '#9D7760'],
    ['Music Video (Physical)', '#F1CF63'],
    ['Download Album', '#7C4D79'],
    ['Download Single', '#9B6A97'],
    ['Ringtones & Ringbacks', '#BE89AC'],
    ['Download Music Video', '#D5A5C4'],
    ['Other Digital', '#EFC9E6'],
    ['Synchronization', '#BBB1AC'],
    ['Paid Subscription', '#24693D'],
    ['On-Demand Streaming (Ad-Supported)', '#398949'],
    ['Other Ad-Supported Streaming', '#61AA57'],
    ['SoundExchange Distributions', '#7DC470'],
    ['Limited Tier Paid Subscription', '#B4E0A7']
  ]);

  const series = d3.stack()
    .keys(colors.keys())
    .value((group, key) => group.get(key).value)
    .order(d3.stackOrderReverse)
    (d3.rollup(data, ([d]) => d, d => d.year, d => d.name).values())
    .map(s => (s.forEach(d => d.data = d.data.get(s.key)), s));

  const X = d3.scaleBand()
    .domain(data.map(d => d.year))
    .rangeRound([marginLeft, width - marginRight]);
  const Y = d3.scaleLinear()
    .domain([0, d3.max(series, d => d3.max(d, d => d[1]))]).nice()
    .range([height - marginBottom, marginTop]);

  const formatRevenue = x => (+(x / 1e9).toFixed(2) >= 1) ?
    `${(x / 1e9).toFixed(2)}B` :
    `${(x / 1e6).toFixed(0)}M`;

  const xAxis = g => g
    .attr('transform', `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(X)
      .tickValues(d3.ticks(...d3.extent(X.domain()), width / 80))
      .tickSizeOuter(0));
  const yAxis = g => g
    .attr('transform', `translate(${marginLeft},0)`)
    .call(d3.axisLeft(Y)
      .tickFormat(x => (x / 1e9).toFixed(0)))
    .call(g => g.select('.domain').remove())
    .call(g => g.select('.tick:last-of-type text').clone()
      .attr('x', 3)
      .attr('text-anchor', 'start')
      .attr('font-weight', 'bold')
      .text(data.y));

  const color = d3.scaleOrdinal().domain(colors.keys()).range(colors.values());

  const format = () => {
    const f = d3.format(',d');
    return d => isNaN(d) ? 'N/A cases' :
      d === 0 ? '0 cases' :
      d < 1 ? '<1 case' :
      d < 1.5 ? '1 case' :
      `${f(d)} cases`;
  }

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('viewBox', [0, 0, width, height]);

  svg.append('g')
    .selectAll('g')
    .data(series)
    .join('g')
    .attr('fill', ({
      key
    }) => color(key))
    .call(g => g.selectAll('rect')
      .data(d => d)
      .join('rect')
      .attr('x', d => X(d.data.year))
      .attr('y', d => Y(d[1]))
      .attr('width', Math.max(0, X.bandwidth() - 1))
      .attr('height', d => Math.max(0, Y(d[0]) - Y(d[1])))
      .append('title')
      .text(d => `${d.data.name}, ${d.data.year}${formatRevenue(d.data.value)}`));

  svg.append('g')
    .call(xAxis);

  svg.append('g')
    .call(yAxis);

  return Object.assign(svg.node(), {
    scales: {
      color
    }
  });
}