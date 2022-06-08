/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2022 Matteo Abrate - IIT CNR
// Released under the MIT license.
// > MIT License
// > Permission is hereby granted, free of charge, to any person obtaining a copy
// > of this software and associated documentation files (the "Software"), to deal
// > in the Software without restriction, including without limitation the rights
// > to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// > copies of the Software, and to permit persons to whom the Software is
// > furnished to do so, subject to the following conditions:>
//
// > The above copyright notice and this permission notice shall be included in all
// > copies or substantial portions of the Software.>
//
// > THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// > IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// > FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// > AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// > LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// > OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// > SOFTWARE.

const constructTangleLayout = (levels, {
  nodeWidth = 70,
  nodeHeight = 22,
  padding = 8,
  bundleWidth = 14,
  levelYPadding = 0,
  metroD = 4,
  minFamilyHeight = 10,
  c = 16,
  bigc = nodeWidth + c
} = {}) => {
  // precompute level depth
  levels.forEach((l, i) => l.forEach(n => (n.level = i)));

  const nodes = levels.reduce((a, x) => a.concat(x), []);
  const nodesIndex = {};
  for (const node of nodes) nodesIndex[node.id] = node;

  // objectification
  for (const node of nodes)
    node.parents = (node.parents === undefined ? [] : node.parents).map(p => nodesIndex[p]);

  // precompute bundles
  for (const [i, level] of levels.entries()) {
    const index = {};
    level.forEach(n => {
      if (n.parents.length == 0) {
        return;
      }
      const id = n.parents
        .map(d => d.id)
        .sort()
        .join('-X-');
      if (id in index) {
        index[id].parents = index[id].parents.concat(n.parents);
      } else {
        index[id] = {
          id: id,
          parents: n.parents.slice(),
          level: i,
          span: i - d3.min(n.parents, p => p.level)
        };
      }
      n.bundle = index[id];
    });
    level.bundles = Object.keys(index).map(key => index[key]);

    for (const [i, bundle] of level.bundles.entries()) bundle.i = i;
  }

  const links = [];
  for (const node of nodes) {
    for (const parent of node.parents) {
      links.push({
        source: node,
        bundle: node.bundle,
        target: parent
      });
    }
  }

  const bundles = levels.reduce((a, x) => a.concat(x.bundles), []);

  // reverse pointer from parent to bundles
  for (const bundle of bundles) {
    for (const parent of bundle.parents) {
      if (parent.bundlesIndex === undefined) {
        parent.bundlesIndex = {};
      }
      if (!(bundle.id in parent.bundlesIndex)) {
        parent.bundlesIndex[bundle.id] = [];
      }
      parent.bundlesIndex[bundle.id].push(bundle);
    }
  }

  for (const node of nodes) {
    if (node.bundlesIndex !== undefined) {
      node.bundles = Object.keys(node.bundlesIndex).map(key => node.bundlesIndex[key]);
    } else {
      node.bundlesIndex = {};
      node.bundles = [];
    }
    node.bundles.sort((a, b) => d3.descending(d3.max(a, d => d.span), d3.max(b, d => d.span)));
    for (const [i, bundle] of node.bundles.entries()) bundle.i = i;
  }

  for (const link of links) {
    if (link.bundle.links === undefined) {
      link.bundle.links = [];
    }
    link.bundle.links.push(link);
  }

  // layout
  for (const node of nodes) node.height = (Math.max(1, node.bundles.length) - 1) * metroD

  let xOffset = padding;
  let yOffset = padding;
  for (const level of levels) {
    xOffset += level.bundles.length * bundleWidth;
    yOffset += levelYPadding;
    for (const node of level) {
      node.x = node.level * nodeWidth + xOffset;
      node.y = nodeHeight + yOffset + node.height / 2;
      yOffset += nodeHeight + node.height;
    }
  }

  let totalLength = 0;
  for (const level of levels) {
    level.bundles.forEach(bundle => {
      bundle.x = d3.max(bundle.parents, d => d.x) + nodeWidth +
        (level.bundles.length - 1 - bundle.i) * bundleWidth;
      bundle.y = totalLength * nodeHeight;
    });
    totalLength += level.length;
  }

  for (const link of links) {
    link.xt = link.target.x;
    link.yt = link.target.y +
      link.target.bundlesIndex[link.bundle.id].i * metroD -
      (link.target.bundles.length * metroD) / 2 +
      metroD / 2;
    link.xb = link.bundle.x;
    link.yb = link.bundle.y;
    link.xs = link.source.x;
    link.ys = link.source.y;
  }

  // compress vertical space
  let yNegativeOffset = 0;
  for (const level of levels) {
    yNegativeOffset += -minFamilyHeight +
      d3.min(level.bundles, bundle =>
        d3.min(bundle.links, link => link.ys - 2 * c - (link.yt + c))
      ) || 0;
    for (const node of level) node.y -= yNegativeOffset;
  }

  for (const link of links) {
    link.yt = link.target.y +
      link.target.bundlesIndex[link.bundle.id].i * metroD -
      (link.target.bundles.length * metroD) / 2 +
      metroD / 2;
    link.ys = link.source.y;
    link.c1 = link.source.level - link.target.level > 1 ?
      Math.min(bigc, link.xb - link.xt, link.yb - link.yt) - c : c;
    link.c2 = c;
  }

  const layout = {
    width: d3.max(nodes, node => node.x) + nodeWidth + 2 * padding,
    height: d3.max(nodes, node => node.y) + nodeHeight / 2 + 2 * padding,
    nodeHeight,
    nodeWidth,
    bundleWidth,
    levelYPadding,
    metroD
  };

  return {
    levels,
    nodes,
    nodesIndex,
    links,
    bundles,
    layout
  };
}

export const tangledTreeVisualization = (data, {
  color = d3.scaleOrdinal(d3.schemeDark2),
  backgroundColor = 'white'
} = {}) => {
  const tangleLayout = constructTangleLayout(data, {
    color: color,
    backgroundColor: backgroundColor
  });

  return `
  <svg
    width="${tangleLayout.layout.width}"
    height="${tangleLayout.layout.height}"
    style="background-color: ${backgroundColor}"
  >
  <style>
    text {
      font-family: sans-serif;
      font-size: 10px;
    }
    .node {
      stroke-linecap: round;
    }
    .link {
      fill: none;
    }
  </style>

  ${tangleLayout.bundles.map((b, i) => {
    const d = b.links
      .map(
        l => `
      M${l.xt} ${l.yt}
      L${l.xb - l.c1} ${l.yt}
      A${l.c1} ${l.c1} 90 0 1 ${l.xb} ${l.yt + l.c1}
      L${l.xb} ${l.ys - l.c2}
      A${l.c2} ${l.c2} 90 0 0 ${l.xb + l.c2} ${l.ys}
      L${l.xs} ${l.ys}`
      )
      .join("");
    return `
      <path class="link" d="${d}" stroke="${backgroundColor}" stroke-width="5"/>
      <path class="link" d="${d}" stroke="${color(b, i)}" stroke-width="2"/>
    `;
  })}

  ${tangleLayout.nodes.map(
    node => `
    <path class="selectable node"
      data-id="${node.id}"
      stroke="black"
      stroke-width="8"
      d="M${node.x} ${node.y - node.height / 2} L${node.x} ${node.y + node.height / 2}"
    />

    <path class="node"
      stroke="white"
      stroke-width="4"
      d="M${node.x} ${node.y - node.height / 2} L${node.x} ${node.y + node.height / 2}"
    />

    <text class="selectable"
      data-id="${node.id}"
      x="${node.x + 4}"
      y="${node.y - node.height / 2 - 4}"
      stroke="${backgroundColor}"
      stroke-width="2"
    >
      ${node.id}
    </text>

    <text
      x="${node.x + 4}"
      y="${node.y - node.height / 2 - 4}"
      style="pointer-events: none;"
    >
      ${node.id}
    </text>
  `
  )}

  </svg>`;
}