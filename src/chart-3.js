import * as d3 from 'd3'

// Create your margins and height/width

var margin = { top: 30, left: 50, right: 50, bottom: 30 }

var height = 250 - margin.top - margin.bottom
var width = 220 - margin.left - margin.right

// I'll give you this part!

var container = d3.select('#chart-3')

// Create your scales

let xPositionScale = d3
  .scaleLinear()
  .domain([1980, 2010])
  .range([0, width])

let yPositionScale = d3
  .scaleLinear()
  .domain([0, 20000])
  .range([height, 0])

// Create your line generator

var line = d3
  .line()
  .x(d => xPositionScale(d.year))
  .y(d => yPositionScale(d.income))
// Read in your data

Promise.all([
  d3.csv(require('./middle-class-income-usa.csv')),
  d3.csv(require('./middle-class-income.csv'))
])
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

function ready([datapointsUSA, datapointsOthers]) {
  // Convert your months to dates

  // Now let's append lines

  var nested = d3
    .nest()
    .key(d => d.country)
    .entries(datapointsOthers)

  // Draw your lines

  container
    .selectAll('.income-graph')
    .data(nested)
    .enter()
    .append('svg')
    .attr('class', 'income-graph')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .each(function(d) {
      // going through each SVG one by one
      var svg = d3.select(this)

      // All countries

      svg
        .append('path')
        .datum(d.values)
        .attr('d', line)
        .attr('stroke', '#9E4B6C')
        .attr('stroke-width', 2)
        .attr('fill', 'none')

      // Read in USA
      svg
        .append('path')
        .datum(datapointsUSA)
        .attr('d', line)
        .attr('stroke', 'grey')
        .attr('fill', 'none')
        .attr('stroke-width', 2)

      // Set up title

      svg
        .append('text')
        .attr('font-size', 12)
        .attr('y', -10)
        .attr('x', width / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', '#9E4B6C')
        .attr('font-weight', 'bold')
        .attr('font-family', 'Arial')
        .text(function(d) {
          return d.key
        })

       // Add text 

       svg
       .append('text')
       .attr('font-size', 11)
       .attr('y', 25)
       .attr('x', 15)
       .attr('fill', 'grey')
       .attr('font-family', 'Arial')
       .text('USA')
      /* Set up axes */

      var xAxis = d3
        .axisBottom(xPositionScale)
        .tickFormat(d3.format(''))
        .tickSize(-height)
        .tickValues([1980, 1990, 2000, 2010])

      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)

      var yAxis = d3
        .axisLeft(yPositionScale)
        .tickFormat(d => '$' + d3.format(',')(d))
        .tickSize(-width)
        .tickValues([5000, 10000, 15000, 20000])

      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)

      d3.selectAll('.x-axis line')
        .attr('stroke-dasharray', '2 3')
        .attr('stroke-linecap', 'round')

      d3.selectAll('.y-axis line')
        .attr('stroke-dasharray', '2 3')
        .attr('stroke-linecap', 'round')
    })

  // REMOVE THOSE THINGS

  d3.selectAll('.x-axis .domain').remove()
  d3.selectAll('.y-axis .domain').remove()
}

export {xPositionScale, yPositionScale, width, height, line}