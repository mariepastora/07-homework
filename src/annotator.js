import * as d3 from 'd3'

function draggableGroups(svg) {
  let draggable = d3.drag().on('drag', function(d) {
    // Save the x and y into the data point
    // (I have NO idea why we have to do this)
    d.x = d3.event.x
    d.y = d3.event.y

    // Grab the group so we can move it
    let g = d3.select(this)

    // Update the top/left of the group
    g.attr('transform', `translate(${d.x}, ${d.y})`)

    // Update the coordinate printout
    g.select('text.g-coords').text(`(${d.x}, ${d.y})`)
  })

  svg
    .selectAll('g')
    .each(function(d) {
      // Need to set d.x and d.y to wherever the
      // position is before using .call(draggable),
      // or dragging breaks! Maybe only needed for <g> elements?

      let g = d3.select(this)
      let match = g.attr('transform').match(/(\d+),(\d+)/)
      d.x = match[1]
      d.y = match[2]
    })
    .call(draggable)
}

function addWidthLine(svg, width) {
  svg
    .append('line')
    .attr('class', 'width-line')
    .attr('stroke', 'purple')
    .attr('x1', width)
    .attr('x2', width)
    .attr('y1', -1000)
    .attr('y2', 1000)

  svg
    .append('text')
    .attr('class', 'width-text')
    .attr('fill', 'purple')
    .attr('x', width)
    .attr('y', 100)
    .text(`width: ${width}px`)
    .attr('transform', `rotate(-90 ${width} 103)`)

  addToggle(svg, 'Toggle width line', 'width-line-hidden')
}

function addCircleCoords(svg) {
  svg.selectAll('circle').each(function(d) {
    let circle = d3.select(this)
    let x = circle.attr('cx')
    let y = circle.attr('cy')
    d3.select(this.parentNode)
      .append('text')
      .attr('class', 'circle-coords')
      .attr('x', x)
      .attr('y', y)
      .attr('dx', 5)
      .attr('dy', 5)
      .attr('alignment-baseline', 'hanging')
      .text(`(${Math.round(x)},${Math.round(y)})`)
  })

  addToggle(svg, 'Toggle circle coords', 'circle-coords-hidden')
}

function addGroupRect(svg) {
  svg
    .selectAll('g')
    .on('mouseover', function(d) {
      d3.select(this).classed('selected', true)
    })
    .on('mouseout', function(d) {
      d3.select(this).classed('selected', false)
    })
    .each(function(d) {
      let g = d3.select(this)
      let match = g.attr('transform').match(/(\d+),(\d+)/)
      let x = match[1]
      let y = match[2]

      g.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', 1000)
        .attr('width', 1000)
        .attr('class', 'g-highlight')

      g.append('text')
        .attr('class', 'g-coords')
        .attr('x', 0)
        .attr('y', 0)
        .attr('dx', -3)
        .attr('dy', -7)
        .attr('fill', 'red')
        .attr('text-anchor', 'end')
        .text(`(${x},${y})`)
    })

  addToggle(svg, 'Toggle g outlines', 'g-highlight-hidden')
  draggableGroups(svg)
}

function addToggle(svg, text, className) {
  let p = svg.node().parentNode.parentNode.previousElementSibling

  svg.classed(className, true)

  d3.select(p)
    .append('a')
    .attr('class', 'btn btn-sm mr-3 btn-warning')
    .on('click', function() {
      let hasClass = svg.classed(className)
      svg.classed(className, !hasClass)
    })
    .html(text)
}

function drawAnnotations(svg, width) {
  addWidthLine(svg, width)
  addCircleCoords(svg)
  addGroupRect(svg)
}

export { addWidthLine, addCircleCoords, addGroupRect, drawAnnotations }
