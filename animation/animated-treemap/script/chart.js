/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/animated-treemap

const genUid = () => {
  let count = 0;

  return name => {
    const name_ = name == null ? '' : name;
    const id = `O-${name}-${count}`;
    const href = new URL(`#${id}`, location);
    count++;

    return {
      id: id,
      href: href
    }
  }
}

const uid = genUid();

export const animatedTreemap = (data, {
  svgId = 'animated-treemap',
  timeIndex = 0,
  width = 600,
  height = 600,
  max = d3.max(data.keys.map((d, i) => d3.hierarchy(data.group).sum(d => d.values[i]).value)),
  formatNumber = d3.format(',d'),
  color = d3.scaleOrdinal(data.group.keys(), d3.schemeCategory10.map(d => d3.interpolateRgb(d, 'white')(0.5))),
  duration = 2500,
  parseNumber = string => +string.replace(/,/g, '')
} = {}) => {
  const treemap = d3.treemap()
    .tile(d3.treemapResquarify)
    .size([width, height])
    .padding(d => d.height === 1 ? 1 : 0)
    .round(true);

  // Compute the structure using the average value.
  const root = treemap(d3.hierarchy(data.group)
    .sum(d => Array.isArray(d.values) ? d3.sum(d.values) : 0)
    .sort((a, b) => b.value - a.value));

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 -20 ${width} ${height + 20}`)
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)
    .style('overflow', 'visible');

  const box = svg.append('g')
    .selectAll('g')
    .data(data.keys.map((key, i) => {
      const value = root.sum(d => d.values[i]).value;
      return {
        key,
        value,
        i,
        k: Math.sqrt(value / max)
      };
    }).reverse())
    .join('g')
    .attr('transform', ({
      k
    }) => `translate(${(1 - k) / 2 * width},${(1 - k) / 2 * height})`)
    .attr('opacity', ({
      i
    }) => i >= timeIndex ? 1 : 0)
    .call(g => g.append('text')
      .attr('y', -6)
      .attr('fill', '#777')
      .selectAll('tspan')
      .data(({
        key,
        value
      }) => [key, ` ${formatNumber(value)}`])
      .join('tspan')
      .attr('font-weight', (d, i) => i === 0 ? 'bold' : null)
      .text(d => d))
    .call(g => g.append('rect')
      .attr('fill', 'none')
      .attr('stroke', '#ccc')
      .attr('width', ({
        k
      }) => k * width)
      .attr('height', ({
        k
      }) => k * height));

  const layout = index => {
    const k = Math.sqrt(root.sum(d => d.values[index]).value / max);
    const x = (1 - k) / 2 * width;
    const y = (1 - k) / 2 * height;
    return treemap.size([width * k, height * k])(root)
      .each(d => (d.x0 += x, d.x1 += x, d.y0 += y, d.y1 += y))
      .leaves();
  }
  const leaf = svg.append('g')
    .selectAll('g')
    .data(layout(timeIndex))
    .join('g')
    .attr('transform', d => `translate(${d.x0},${d.y0})`);

  leaf.append("rect")
    .attr("id", d => (d.leafUid = uid("leaf")).id)
    .attr("fill", d => {
      while (d.depth > 1) d = d.parent;
      return color(d.data[0]);
    })
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0);

  leaf.append("clipPath")
    .attr("id", d => (d.clipUid = uid("clip")).id)
    .append("use")
    .attr("xlink:href", d => d.leafUid.href);

  leaf.append("text")
    .attr("clip-path", d => d.clipUid)
    .selectAll("tspan")
    .data(d => [d.data.name, formatNumber(d.value)])
    .join("tspan")
    .attr("x", 3)
    .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
    .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
    .text(d => d);

  leaf.append("title")
    .text(d => d.data.name);

  return Object.assign(svg.node(), {
    update(index) {
      box.transition()
        .duration(duration)
        .attr("opacity", ({
          i
        }) => i >= index ? 1 : 0);

      leaf.data(layout(index)).transition()
        .duration(duration)
        .ease(d3.easeLinear)
        .attr("transform", d => `translate(${d.x0},${d.y0})`)
        .call(leaf => leaf.select("rect")
          .attr("width", d => d.x1 - d.x0)
          .attr("height", d => d.y1 - d.y0))
        .call(leaf => leaf.select("text tspan:last-child")
          .tween("text", (d, idx, nodes) => {
            const node = nodes[idx];
            const i = d3.interpolate(parseNumber(node.textContent), d.value);
            return t => {
              node.textContent = formatNumber(i(t));
            };
          }));
    }
  });
}