/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright https://observablehq.com/@kerryrodden/sequences-sunburst
// Copyright 2020 Kerry Rodden
// Released under the Apache 2.0 license: http://www.apache.org/licenses/
// Also, Kerry Rodden stated the following license notice:
// > This notebook reuses much of the `buildHierarchy` function from my original [Sequences sunburst](https://gist.github.com/kerryrodden/7090426) gist, which was published when I worked at Google, with the following [license](https://gist.github.com/kerryrodden/7090426#file-license):
//
// > Copyright 2013 Google Inc. All Rights Reserved.
// >
// > Licensed under the Apache License, Version 2.0 (the "License");
// > you may not use this file except in compliance with the License.
// > You may obtain a copy of the License at
// >
// >    http://www.apache.org/licenses/LICENSE-2.0
// >
// > Unless required by applicable law or agreed to in writing, software
// > distributed under the License is distributed on an "AS IS" BASIS,
// > WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// > See the License for the specific language governing permissions and
// > limitations under the License.

const buildHierarchy = csv => {
  // Helper function that transforms the given CSV into a hierarchical format.
  const root = {
    name: 'root',
    children: []
  };
  for (const row of csv) {
    const sequence = row[0];
    const size = +row[1];
    if (isNaN(size)) {
      // e.g. if this is a header row
      continue;
    }
    const parts = sequence.split('-');
    let currentNode = root;

    for (const [i, part] of parts.entries()) {
      const children = currentNode['children'];
      const nodeName = part;
      let childNode = null;
      if (i < parts.length - 1) {
        // Not yet at the end of the sequence; move down the tree.
        let foundChild = false;
        for (const child of children) {
          if (child['name'] == nodeName) {
            childNode = child;
            foundChild = true;
            break;
          }
        }
        // If we don't already have a child node for this branch, create it.
        if (!foundChild) {
          childNode = {
            name: nodeName,
            children: []
          };
          children.push(childNode);
        }
        currentNode = childNode;
      } else {
        // Reached the end of the sequence; create a leaf node.
        childNode = {
          name: nodeName,
          value: size
        };
        children.push(childNode);
      }
    }
  }
  return root;
}

export const sunburst = (csvData, breadcrumb, {
  svgId = 'sunburst',
  width = 640,
  height = width,
  radius = width / 2,
  breadcrumbWidth = 75,
  breadcrumbHeight = 30,
  color = d3.scaleOrdinal()
  .domain(['home', 'product', 'search', 'account', 'other', 'end'])
  .range(['#5d85cf', '#7c6561', '#da7847', '#6fb971', '#9e70cf', '#bbbbbb'])
} = {}) => {
  const hierarchicalData = buildHierarchy(csvData);

  const partition = hierarchicalData => d3.partition()
    .size([2 * Math.PI, radius * radius])(d3.hierarchy(hierarchicalData)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value));

  const root = partition(hierarchicalData);
  const svg = d3.create('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `${-radius} ${-radius} ${width} ${width}`)
    .style('max-width', `${width}px`)
    .style('font', '12px sans-serif');;

  // Make this into a view, so that the currently hovered sequence is available to the breadcrumb
  const element = svg.node();
  element.value = {
    sequence: [],
    percentage: 0.0
  };

  const label = svg.append('text')
    .attr('text-anchor', 'middle')
    .attr('fill', '#888')
    .style('visibility', 'hidden');
  label.append('tspan')
    .attr('class', 'percentage')
    .attr('x', 0)
    .attr('y', 0)
    .attr('dy', '-0.1em')
    .attr('font-size', '3em')
    .text('');
  label.append('tspan')
    .attr('x', 0)
    .attr('y', 0)
    .attr('dy', '1.5em')
    .text('of visits begin with this sequence');

  const arc = d3.arc()
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .padAngle(1 / radius)
    .padRadius(radius)
    .innerRadius(d => Math.sqrt(d.y0))
    .outerRadius(d => Math.sqrt(d.y1) - 1);

  const path = svg.append('g')
    .selectAll('path')
    .data(
      root.descendants().filter(d => {
        // Don't draw the root node, and for efficiency, filter out nodes that would be too small to see
        return d.depth && d.x1 - d.x0 > 0.001;
      })
    )
    .join('path')
    .attr('fill', d => color(d.data.name))
    .attr('d', arc);

  const mousearc = d3.arc()
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .innerRadius(d => Math.sqrt(d.y0))
    .outerRadius(radius);

  svg.append('g')
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .on('mouseleave', () => {
      path.attr('fill-opacity', 1);
      label.style('visibility', 'hidden');
      // Update the value of this view
      element.value = {
        sequence: [],
        percentage: 0.0
      };
      breadcrumb.update(element);
    })
    .selectAll('path')
    .data(
      root.descendants().filter(d => {
        // Don't draw the root node, and for efficiency, filter out nodes that would be too small to see
        return d.depth && d.x1 - d.x0 > 0.001;
      })
    )
    .join('path')
    .attr('d', mousearc)
    .on('mouseenter', (event, d) => {
      // Get the ancestors of the current segment, minus the root
      const sequence = d
        .ancestors()
        .reverse()
        .slice(1);
      // Highlight the ancestors
      path.attr('fill-opacity', node =>
        sequence.indexOf(node) >= 0 ? 1.0 : 0.3
      );
      const percentage = ((100 * d.value) / root.value).toPrecision(3);
      label
        .style('visibility', null)
        .select('.percentage')
        .text(percentage + '%');
      // Update the value of this view with the currently hovered sequence and percentage
      element.value = {
        sequence,
        percentage
      };
      breadcrumb.update(element);
    });

  element.scales = {
    color
  };
  return element;
}

export const breadcrumb = ({
  svgId = 'breadcrumb',
  breadcrumbWidth = 75,
  breadcrumbHeight = 30
} = {}) => {
  const svg = d3.create('svg')
    .attr('width', breadcrumbWidth * 10)
    .attr('height', breadcrumbHeight)
    .attr('viewBox', `0 0 ${breadcrumbWidth * 10} ${breadcrumbHeight}`)
    .style('font', '12px sans-serif')
    .style('margin', '5px');

  const breadcrumbPoints = (d, i) => {
    const tipWidth = 10;
    const points = [];
    points.push('0,0');
    points.push(`${breadcrumbWidth},0`);
    points.push(`${breadcrumbWidth + tipWidth},${breadcrumbHeight / 2}`);
    points.push(`${breadcrumbWidth},${breadcrumbHeight}`);
    points.push(`0,${breadcrumbHeight}`);
    if (i > 0) {
      // Leftmost breadcrumb; don't include 6th vertex.
      points.push(`${tipWidth},${breadcrumbHeight / 2}`);
    }
    return points.join(' ');
  }

  const update = sunburstElement => {
    const color = sunburstElement.scales.color;
    const sequence = sunburstElement.value.sequence;
    const percentage = sunburstElement.value.percentage;

    svg.selectAll('*').remove();

    const g = svg.selectAll('g')
      .data(sequence)
      .join('g')
      .attr('transform', (d, i) => `translate(${i * breadcrumbWidth}, 0)`);

    g.append('polygon')
      .attr('points', breadcrumbPoints)
      .attr('fill', d => color(d.data.name))
      .attr('stroke', 'white');

    g.append('text')
      .attr('x', (breadcrumbWidth + 10) / 2)
      .attr('y', 15)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .text(d => d.data.name);

    svg.append('text')
      .text(percentage > 0 ? percentage + '%' : '')
      .attr('x', (sequence.length + 0.5) * breadcrumbWidth)
      .attr('y', breadcrumbHeight / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle');
  }

  return Object.assign(svg.node(), {
    update
  });
}