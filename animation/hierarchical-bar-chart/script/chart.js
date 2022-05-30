/// Modified source copyright
// Copyright 2022 Takanori Fujiwara.
// Released under the BSD 3-Clause 'New' or 'Revised' License

/// Original source copyright
// Copyright 2019 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/hierarchical-bar-chart

export const hierarchicalBarChart = (data, {
  svgId = 'hierarchical-bar-chart',
  width = 800,
  height,
  marginTop = 30,
  marginRight = 30,
  marginBottom = 0,
  marginLeft = 100,
  barStep = 21,
  barPadding = 3 / barStep,
  duration = 750,
  color = d3.scaleOrdinal([true, false], ["steelblue", "#aaa"])
} = {}) => {
  const root = d3.hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value)
    .eachAfter(d => d.index = d.parent ? d.parent.index = d.parent.index + 1 || 0 : 0);

  if (height === undefined) {
    let max = 1;
    root.each(d => d.children && (max = Math.max(max, d.children.length)));
    height = max * barStep + marginTop + marginBottom;
  }

  const x = d3.scaleLinear().range([marginLeft, width - marginRight]);

  const xAxis = g => g
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${marginTop})`)
    .call(d3.axisTop(x).ticks(width / 80, "s"))
    .call(g => (g.selection ? g.selection() : g).select(".domain").remove());
  const yAxis = g => g
    .attr("class", "y-axis")
    .attr("transform", `translate(${marginLeft + 0.5},0)`)
    .call(g => g.append("line")
      .attr("stroke", "currentColor")
      .attr("y1", marginTop)
      .attr("y2", height - marginBottom));

  const svg = d3.create('svg')
    .attr('id', svgId)
    .attr('width', width)
    .attr('height', height);

  x.domain([0, root.value]);

  svg.append('rect')
    .attr('class', 'background')
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .attr('width', width)
    .attr('height', height)
    .attr('cursor', 'pointer')
    .on('click', (event, d) => up(svg, d));

  svg.append('g')
    .call(xAxis);

  svg.append('g')
    .call(yAxis);

  const bar = (svg, down, d, selector) => {
    const g = svg.insert("g", selector)
      .attr("class", "enter")
      .attr("transform", `translate(0,${marginTop + barStep * barPadding})`)
      .attr("text-anchor", "end")
      .style("font", "10px sans-serif");

    const bar = g.selectAll("g")
      .data(d.children)
      .join("g")
      .attr("cursor", d => !d.children ? null : "pointer")
      .on("click", (event, d) => down(svg, d));

    bar.append("text")
      .attr("x", marginLeft - 6)
      .attr("y", barStep * (1 - barPadding) / 2)
      .attr("dy", ".35em")
      .text(d => d.data.name);

    bar.append("rect")
      .attr("x", x(0))
      .attr("width", d => x(d.value) - x(0))
      .attr("height", barStep * (1 - barPadding));

    return g;
  }

  const stagger = () => {
    let value = 0;
    return (d, i) => {
      const t = `translate(${x(value) - x(0)},${barStep * i})`;
      value += d.value;
      return t;
    };
  }
  const stack = i => {
    let value = 0;
    return d => {
      const t = `translate(${x(value) - x(0)},${barStep * i})`;
      value += d.value;
      return t;
    };
  }

  const down = (svg, d) => {
    if (!d.children || d3.active(svg.node())) return;

    // Rebind the current node to the background.
    svg.select(".background").datum(d);

    // Define two sequenced transitions.
    const transition1 = svg.transition().duration(duration);
    const transition2 = transition1.transition();

    // Mark any currently-displayed bars as exiting.
    const exit = svg.selectAll(".enter")
      .attr("class", "exit");

    // Entering nodes immediately obscure the clicked-on bar, so hide it.
    exit.selectAll("rect")
      .attr("fill-opacity", p => p === d ? 0 : null);

    // Transition exiting bars to fade out.
    exit.transition(transition1)
      .attr("fill-opacity", 0)
      .remove();

    // Enter the new bars for the clicked-on data.
    // Per above, entering bars are immediately visible.
    const enter = bar(svg, down, d, ".y-axis")
      .attr("fill-opacity", 0);

    // Have the text fade-in, even though the bars are visible.
    enter.transition(transition1)
      .attr("fill-opacity", 1);

    // Transition entering bars to their new y-position.
    enter.selectAll("g")
      .attr("transform", stack(d.index))
      .transition(transition1)
      .attr("transform", stagger());

    // Update the x-scale domain.
    x.domain([0, d3.max(d.children, d => d.value)]);

    // Update the x-axis.
    svg.selectAll(".x-axis").transition(transition2)
      .call(xAxis);

    // Transition entering bars to the new x-scale.
    enter.selectAll("g").transition(transition2)
      .attr("transform", (d, i) => `translate(0,${barStep * i})`);

    // Color the bars as parents; they will fade to children if appropriate.
    enter.selectAll("rect")
      .attr("fill", color(true))
      .attr("fill-opacity", 1)
      .transition(transition2)
      .attr("fill", d => color(!!d.children))
      .attr("width", d => x(d.value) - x(0));
  }

  const up = (svg, d) => {
    if (!d.parent || !svg.selectAll(".exit").empty()) return;

    // Rebind the current node to the background.
    svg.select(".background").datum(d.parent);

    // Define two sequenced transitions.
    const transition1 = svg.transition().duration(duration);
    const transition2 = transition1.transition();

    // Mark any currently-displayed bars as exiting.
    const exit = svg.selectAll(".enter")
      .attr("class", "exit");

    // Update the x-scale domain.
    x.domain([0, d3.max(d.parent.children, d => d.value)]);

    // Update the x-axis.
    svg.selectAll(".x-axis").transition(transition1)
      .call(xAxis);

    // Transition exiting bars to the new x-scale.
    exit.selectAll("g").transition(transition1)
      .attr("transform", stagger());

    // Transition exiting bars to the parent’s position.
    exit.selectAll("g").transition(transition2)
      .attr("transform", stack(d.index));

    // Transition exiting rects to the new scale and fade to parent color.
    exit.selectAll("rect").transition(transition1)
      .attr("width", d => x(d.value) - x(0))
      .attr("fill", color(true));

    // Transition exiting text to fade out.
    // Remove exiting nodes.
    exit.transition(transition2)
      .attr("fill-opacity", 0)
      .remove();

    // Enter the new bars for the clicked-on data's parent.
    const enter = bar(svg, down, d.parent, ".exit")
      .attr("fill-opacity", 0);

    enter.selectAll("g")
      .attr("transform", (d, i) => `translate(0,${barStep * i})`);

    // Transition entering bars to fade in over the full duration.
    enter.transition(transition2)
      .attr("fill-opacity", 1);

    // Color the bars as appropriate.
    // Exiting nodes will obscure the parent bar, so hide it.
    // Transition entering rects to the new x-scale.
    // When the entering parent rect is done, make it visible!
    enter.selectAll("rect")
      .attr("fill", d => color(!!d.children))
      .attr("fill-opacity", p => p === d ? 0 : null)
      .transition(transition2)
      .attr("width", d => x(d.value) - x(0))
      .on("end", function(p) {
        d3.select(this).attr("fill-opacity", 1);
      });
  }
  down(svg, root);

  return svg.node();
}