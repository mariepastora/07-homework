import * as d3 from 'd3'

// I'll give you margins/height/width

var margin = { top: 130, left: 20, right: 20, bottom: 30 }
var height = 500 - margin.top - margin.bottom
var width = 400 - margin.left - margin.right

// And grabbing your container

var container = d3.select('#chart-4')

// Create your scales

var xPositionScale = d3
  .scaleLinear()
  .domain([-6, 6])
  .range([0, width])

var yPositionScale = d3.scaleLinear().range([height, 0])

// Create your area generator

var area = d3
  .area()
  .y1(d => yPositionScale(d.value))
  .y0(d => yPositionScale(0))

// Read in your data, then call ready

// Write your ready function

d3.tsv(require('./climate-data.tsv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  // Appending 4 SVGs

  const svgToAppend = ['svg1951', 'svg1983', 'svg1994', 'svg2005']

  for (const svg of svgToAppend) {
    container
      .append('svg')
      .attr('class', svg)
      .attr('height', height + margin.top + margin.bottom)
      .attr('width', width + margin.left + margin.right)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  }

  // Defining  SVGs

  var svg1951 = d3.select('.svg1951')
  var svg1983 = d3.select('.svg1983')
  var svg1994 = d3.select('.svg1994')
  var svg2005 = d3.select('.svg2005')

  // Adjusting scales

  var maxFreq = d3.max(datapoints, function(d) {
    return +d.freq
  })

  yPositionScale.domain([0, maxFreq])
  area.x(d => xPositionScale(d.key))

  // Graphing all data on all graphs for 51-83

  var filtered51 = datapoints.filter(function(d) {
    return +d.year < 1983
  })

  var nested51 = d3
    .nest()
    .key(d => d.diff)
    .rollup(values => d3.median(values, v => v.freq))
    .entries(filtered51)

  d3.selectAll('.svg1951,.svg1983,.svg1994,.svg2005')
    .append('path')
    .datum(nested51)
    .attr('d', area)
    .attr('class', 'year1951')
    .attr('stroke', 'none')
    .attr('fill', '#F4F4F4')
    .attr('opacity', 1)
    .attr('stroke-width', 2)

  // Draw one temperature

  function drawTemp(svg, data, minTemp, maxTemp, color) {
    var filteredData = data.filter(function(d) {
      return minTemp <= +d.key && +d.key <= maxTemp
    })
    console.log(filteredData)

    svg
      .append('path')
      .datum(filteredData)
      .attr('d', area)
      .attr('class', 'allyears')
      .attr('stroke', 'none')
      .attr('fill', color)
      .attr('opacity', 1)
      .attr('stroke-width', 2)
  }

  // Draw all temperatures

  function graphAllTemps(svg, data) {
    drawTemp(svg, data, -6, -3, '#236085')
    drawTemp(svg, data, -3, -0.9, '#96bccf')
    drawTemp(svg, data, -0.9, 0.9, '#e5e5e5')
    drawTemp(svg, data, 0.9, 3, '#ee9f71')
    drawTemp(svg, data, 3, 6, '#c9604b')
  }

  // Draw entire SVG

  function drawAllAreas(svg, startYear, endYear) {
    var filteredData = datapoints.filter(function(d) {
      return +d.year >= startYear && +d.year < endYear
    })

    var nestedData = d3
      .nest()
      .key(d => d.diff)
      .rollup(values => d3.median(values, v => v.freq))
      .entries(filteredData)

    graphAllTemps(svg, nestedData)

    // Setting up lines

    const linesToAppend = [-3, -0.9, 0.9, 3]

    var marg = height - margin.top

    for (const line of linesToAppend) {
      console.log(yPositionScale(30))
      svg
        .append('line')
        .attr('x1', xPositionScale(line))
        .attr('x2', xPositionScale(line))
        .attr('y1', margin.bottom)
        .attr('y2', height)
        .attr('class', 'dashedLine')
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('opacity', 1)
        .attr('stroke-dasharray', '2 2')
    }

    // Setting up title

    svg
      .append('g')
      .append('text')
      .attr('x', width / 2)
      .attr('y', 13)
      .attr('fill', 'black')
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'bold')
      .text(startYear + ' to ' + endYear)
  }

  // Calling functions for each SVG

  drawAllAreas(svg1951, 1951, 1980)
  drawAllAreas(svg1983, 1983, 1993)
  drawAllAreas(svg1994, 1994, 2004)
  drawAllAreas(svg2005, 2005, 2015)

  // Set up additional elements

  container.selectAll('svg').each(function() {
    var svg = d3.select(this).select('g')

    var ticks = [-4, -2, 0, 2, 4]
    var tickLabels = [
      'Extremely Cold',
      'Cold',
      'Normal',
      'Hot',
      'Extremely Hot'
    ]

    var colorScale = d3
      .scaleLinear()
      .domain(['-6,6'])
      .range(['red', 'green'])

    // xAxis
    var diff_height = height - margin.top
    var diff_left = width - margin.left

    var xAxis = d3
      .axisBottom(xPositionScale)
      .tickValues(ticks)
      .tickFormat(function(d, i) {
        return tickLabels[i]
      })

    svg
      .append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', 'translate(' + 0 + ',' + (height - margin.top) + ')')
      .style('color', function(d) {
        console.log(d)
        return colorScale(d)
      })
      .call(xAxis)

    // xAxis Labels

    // Title
    // Lines

    // s is no longer defined here
  })
}
