import * as d3 from 'd3'

// Set up margin/height/width

var margin = { top: 35, left: 30, right: 15, bottom: 20 }

var height = 130 - margin.top - margin.bottom
var width = 95 - margin.left - margin.right

// I'll give you the container
var container = d3.select('#chart-2')

// Create your scales

let xPositionScale = d3.scaleLinear().range([0, width])

let yPositionScale = d3
  .scaleLinear()
  .domain([0, 0.3])
  .range([height, 0])

// Create a d3.line function that uses your scales

var area_us = d3
  .area()
  .x(d => xPositionScale(d.Age))
  .y1(d => yPositionScale(d.ASFR_us))
  .y0(d => yPositionScale(0))

var area_jp = d3
  .area()
  .x(d => xPositionScale(d.Age))
  .y1(d => yPositionScale(d.ASFR_jp))
  .y0(d => yPositionScale(0))

// Read in your data

d3.csv(require('./fertility.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

// Build your ready function that draws lines, axes, etc

function ready(datapoints) {
  var nested = d3
    .nest()
    .key(function(d) {
      return d.Year
    })
    .entries(datapoints)

  // xPositionScale domain

  var minAge = d3.min(datapoints, function(d) {
    return +d.Age
  })

  var maxAge = d3.max(datapoints, function(d) {
    return +d.Age
  })

  xPositionScale.domain([minAge, maxAge])

  container
    .selectAll('.fertility-graph')
    .data(nested)
    .enter()
    .append('svg')
    .attr('class', 'fertility-graph')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .each(function(d) {
      // going through each SVG one by one
      var svg = d3.select(this)

      // US area

      svg
        .append('path')
        .datum(d.values)
        .attr('d', area_us)
        .attr('stroke', 'none')
        .attr('class', '.area_us_poly')
        .attr('fill', 'rgba(126,250,251,0.7)')

     // Japan area

      svg
        .append('path')
        .datum(d.values)
        .attr('d', area_jp)
        .attr('stroke', 'none')
        .attr('fill', 'rgba(237,126,127,0.7)')

      // Title

      svg
        // .attr('transform', `rotate(-5 0 ${height})`)
        .append('text')
        .attr('font-size', 15)
        .attr('y', -10)
        .attr('x', width / 2)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'Arial')
        .text(function(d){
        	return d.key
        })


      // Legend for Japan
      svg
        .datum(d.values)

        // .attr('transform', `rotate(-5 0 ${height})`)
        .append('text')
        .attr('font-size', 10)
        .attr('y', 30)
        .attr('x', 40)
        .attr('fill', 'rgba(237,126,127,0.7)')
        .attr('font-family', 'Arial')
        .text(function(d) {
          var jp = d3.sum(d.map(d => d.ASFR_jp)).toFixed(2)
          return jp
        })
        .attr('text-anchor', 'middle')

      //  .text(d.values.sum())

      // Legend for US

      svg
        .datum(d.values)
        // .attr('transform', `rotate(-5 0 ${height})`)
        .append('text')
        .attr('font-size', 10)
        .attr('y', 20)
        .attr('x', 40)
        .attr('fill', 'rgba(126,250,251,0.7)')
        .attr('text-anchor', 'middle')
        .attr('font-family', 'Arial')
        .text(function(d) {
          var us = d3.sum(d.map(d => d.ASFR_us)).toFixed(2)
          return us
        })

      // Axis

      var xAxis = d3.axisBottom(xPositionScale).tickValues([15, 30, 45])
      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)

      var yAxis = d3.axisLeft(yPositionScale).tickValues([0.0, 0.1, 0.2, 0.3])
      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)
    })
}

export {xPositionScale, yPositionScale, width, height}