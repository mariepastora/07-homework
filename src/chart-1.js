import * as d3 from 'd3'
import * as annotator from './annotator'

// Set up margin/height/width

var margin = { top: 60, left: 50, right: 100, bottom: 30 }

var height = 600 - margin.top - margin.bottom
var width = 500 - margin.left - margin.right

// Add your svg
var svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`)

// Create a time parser (see hints)
let parseTime = d3.timeParse('%B-%y')

// Create your scales

var xPositionScale = d3.scaleLinear().range([0, width])

var yPositionScale = d3.scaleLinear().range([height, 0])
var uniqueColors = [
    '#EF8B60',
    '#8DA0CB',
    '#E78AC3',
    '#A6D854',
    '#FCD833',
    '#008000',
    '#0000FF',
    '#C0C0C0',
    '#800080',
    '#FFFFFF'
  ]

var colorScale = d3
  .scaleOrdinal()
  .range(uniqueColors)

// Create a d3.line function that uses your scales
var line = d3.line().y(d => yPositionScale(+d.price))

// Read in your housing price data
d3.csv(require('./housing-prices.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

// Write your ready function

function ready(datapoints) {
  // Convert your months to dates

  datapoints.forEach(d => {
    d.datetime = parseTime(d.month)
  })
  // Get a list of dates and a list of prices and regions

  var dates = datapoints.map(d => d.datetime)
  var prices = datapoints.map(d => d.price)
  var regions = new Set(datapoints.map(d => d.region))

  // Getting min and max of dates and prices

  var minPrice = d3.min(datapoints, function(d) {
    return d.price
  })
  var maxPrice = d3.max(datapoints, function(d) {
    return d.price
  })
  var minDate = d3.min(datapoints, function(d) {
    return d.datetime
  })
  var maxDate = d3.max(datapoints, function(d) {
    return d.datetime
  })

  // Instantiating domains

  xPositionScale.domain([minDate, maxDate])
  yPositionScale.domain([minPrice, maxPrice])
  line.x(d => xPositionScale(d.datetime))
  colorScale.domain(regions)

  // Group your data together

  var nested = d3
    .nest()
    .key(d => d.region)
    .entries(datapoints)

  // Draw your lines

  svg
    .selectAll('.region-line')
    .data(nested)
    .enter()
    .append('path')
    .attr('class', 'region-line')
    .attr('d', d => {
      return line(d.values)
    })
    .attr('fill', 'none')
    .attr('stroke-width', 2)
    .attr('stroke', d => {
      return colorScale(d.key)
    })

  // Draw the circles
  svg
    .selectAll('.circle')
    .data(nested)
    .enter()
    .append('circle')
    .attr('cx', function(d) {
      return xPositionScale(d.values[0].datetime)
    })
    .attr('cy', function(d) {
      return yPositionScale(d.values[0].price)
    })
    .attr('r', 3)
    .attr('fill', d => {
      return colorScale(d.key)
    })

  // Add your text on the right-hand side
  svg
    .selectAll('text')
    .data(nested)
    .enter()
    .append('text')
    .text(function(d) {
      return d.key
    })
    .attr('font-size', 10)
    .attr('x', d => xPositionScale(d.values[0].datetime))
    .attr('y', d => yPositionScale(d.values[0].price))
    .attr('alignment-baseline', 'middle')
    // .attr('text-anchor', 'end')
    .attr('dx', 5)
    .attr('dy', function(d) {
      if (d.key == 'South Atlantic') {
        return 0
      } else if (d.key == 'U.S.') {
        return 2
      }
    })

  // Add your title

  svg
    .append('text')
    .text('U.S. Housing Prices Fall in the Winter')
    .attr('font-size', 20)
    .attr('x', width / 2)
    // .attr('text-align', 'center')
    .attr('y', -40)
    // .attr('alignment-baseline', 'middle')
    .attr('text-anchor', 'middle')
    .attr('font-family', 'Calibri')

  // Add the shaded rectangle

  var dec16 = parseTime('December-16')
  var feb17 = parseTime('February-17')

  svg
    .append('rect')
    .attr('class', 'rect')
    .attr('x', xPositionScale(dec16))
    .attr('y', yPositionScale(maxPrice))
    .attr('width', xPositionScale(feb17) - xPositionScale(dec16))
    .attr('height', height)
    .attr('fill', 'rgba(169,169,169,0.5')
    .lower()
  // Add your axes

  /* Set up axes */
  var xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.timeFormat('%b %y'))

  // .tickFormat(d3.format("%B-%m"))

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  var yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}

export {colorScale, xPositionScale, yPositionScale, width, height, line, parseTime}