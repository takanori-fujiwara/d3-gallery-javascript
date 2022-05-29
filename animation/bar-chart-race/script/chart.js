/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2019 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/bar-chart-race

const genRank = (data, n) => {
  const rank = value => {
    const names = new Set(data.map(d => d.name));
    const rankedData = Array.from(names, name => ({
      name,
      value: value(name)
    }));
    rankedData.sort((a, b) => d3.descending(a.value, b.value));
    for (let i = 0; i < rankedData.length; ++i) rankedData[i].rank = Math.min(n, i);

    return rankedData;
  }

  return rank;
}

export const barChartRace = (data, {
  svgId = 'bar-chart-race',
  n = 12,
  barSize = 48,
  marginTop = 16,
  marginRight = 6,
  marginBottom = 6,
  marginLeft = 5,
  width = 1200,
  height = marginTop + barSize * n + marginBottom,
  tickFormat = undefined,
  k = 10,
  duration = 250
} = {}) => {
  const rank = genRank(data, n);

  const dateVals = Array.from(d3.rollup(data, ([d]) => d.value, d => +d.date, d => d.name))
    .map(([date, val]) => [new Date(date), val])
    .sort(([date], [val]) => d3.ascending(date, val));

  const keyframes = [];
  for (let i = 0; i < dateVals.length; ++i) {
    const [dateStart, valStart] = dateVals[i];
    const [dateEnd, valEnd] = i + 1 < dateVals.length ? dateVals[i + 1] : dateVals[i];
    for (let j = 0; j < k; ++j) {
      const t = j / k;
      keyframes.push([
        new Date(dateStart * (1 - t) + dateEnd * t),
        rank(name => (valStart.get(name) || 0) * (1 - t) + (valEnd.get(name) || 0) * t)
      ]);
    }
  }

  const nameFrames = d3.groups(keyframes.flatMap(([, data]) => data), d => d.name);
  const prev = new Map(nameFrames.flatMap(([, data]) => d3.pairs(data, (a, b) => [b, a])));
  const next = new Map(nameFrames.flatMap(([, data]) => d3.pairs(data)));

  const x = d3.scaleLinear([0, 1], [marginLeft, width - marginRight]);
  const y = d3.scaleBand()
    .domain(d3.range(n + 1))
    .rangeRound([marginTop, marginTop + barSize * (n + 1 + 0.1)])
    .padding(0.1);

  const color = d => {
    const scale = d3.scaleOrdinal(d3.schemeTableau10);
    if (data.some(d => d.category !== undefined)) {
      const categoryByName = new Map(data.map(d => [d.name, d.category]))
      scale.domain(categoryByName.values());
      return scale(categoryByName.get(d.name));
    }
    return scale(d.name);
  }

  const bars = svg => {
    let bar = svg.append('g')
      .attr('fill-opacity', 0.6)
      .selectAll('rect');

    return ([date, data], transition) => bar = bar
      .data(data.slice(0, n), d => d.name)
      .join(
        enter => enter.append('rect')
        .attr('fill', d => color(d))
        .attr('height', y.bandwidth())
        .attr('x', x(0))
        .attr('y', d => y((prev.get(d) || d).rank))
        .attr('width', d => x((prev.get(d) || d).value) - x(0)),
        update => update,
        exit => exit.transition(transition).remove()
        .attr('y', d => y((next.get(d) || d).rank))
        .attr('width', d => x((next.get(d) || d).value) - x(0))
      )
      .call(bar => bar.transition(transition)
        .attr('y', d => y(d.rank))
        .attr('width', d => x(d.value) - x(0)));
  }

  const axis = svg => {
    const g = svg.append('g')
      .attr('transform', `translate(0,${marginTop})`);

    const axis = d3.axisTop(x)
      .ticks(width / 160, tickFormat)
      .tickSizeOuter(0)
      .tickSizeInner(-barSize * (n + y.padding()));

    return (_, transition) => {
      g.transition(transition).call(axis);
      g.select('.tick:first-of-type text').remove();
      g.selectAll('.tick:not(:first-of-type) line').attr('stroke', 'white');
      g.select('.domain').remove();
    };
  }

  const labels = svg => {
    const textTween = (a, b) => {
      const i = d3.interpolateNumber(a, b);
      return function(t) {
        this.textContent = d3.format(',d')(i(t));
      };
    }

    let label = svg.append('g')
      .style('font', 'bold 12px var(--sans-serif)')
      .style('font-variant-numeric', 'tabular-nums')
      .attr('text-anchor', 'end')
      .selectAll('text');

    return ([date, data], transition) => label = label
      .data(data.slice(0, n), d => d.name)
      .join(
        enter => enter.append('text')
        .attr('transform', d => `translate(${x((prev.get(d) || d).value)},${y((prev.get(d) || d).rank)})`)
        .attr('y', y.bandwidth() / 2)
        .attr('x', -6)
        .attr('dy', '-0.25em')
        .text(d => d.name)
        .call(text => text.append('tspan')
          .attr('fill-opacity', 0.7)
          .attr('font-weight', 'normal')
          .attr('x', -6)
          .attr('dy', '1.15em')),
        update => update,
        exit => exit.transition(transition).remove()
        .attr('transform', d => `translate(${x((next.get(d) || d).value)},${y((next.get(d) || d).rank)})`)
        .call(g => g.select('tspan').tween('text', d => textTween(d.value, (next.get(d) || d).value)))
      )
      .call(bar => bar.transition(transition)
        .attr('transform', d => `translate(${x(d.value)},${y(d.rank)})`)
        .call(g => g.select('tspan').tween('text', d => textTween((prev.get(d) || d).value, d.value))));
  }

  const ticker = svg => {
    const now = svg.append('text')
      .style('font', `bold ${barSize}px var(--sans-serif)`)
      .style('font-variant-numeric', 'tabular-nums')
      .attr('text-anchor', 'end')
      .attr('x', width - 6)
      .attr('y', marginTop + barSize * (n - 0.45))
      .attr('dy', '0.32em')
      .text(d3.utcFormat('%Y')(keyframes[0][0]));

    return ([date], transition) => {
      transition.end().then(() => now.text(d3.utcFormat('%Y')(date)));
    }
  }

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height]);

  const updateBars = bars(svg);
  const updateAxis = axis(svg);
  const updateLabels = labels(svg);
  const updateTicker = ticker(svg);

  return Object.assign(svg.node(), {
    async play() {
      for (const keyframe of keyframes) {
        const transition = svg.transition()
          .duration(duration)
          .ease(d3.easeLinear);

        // Extract the top bar’s value.
        x.domain([0, keyframe[1][0].value]);

        updateAxis(keyframe, transition);
        updateBars(keyframe, transition);
        updateLabels(keyframe, transition);
        updateTicker(keyframe, transition);

        await transition.end();
      }
    }
  });
}