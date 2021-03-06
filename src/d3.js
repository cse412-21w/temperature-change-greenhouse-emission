import worldData from '../static/data_world.csv'    // import dataset
"use strict";     // the code should be executed in "strict mode".
                  // With strict mode, you can not, for example, use undeclared variables

var bar_svg;    // used for svg later
var g;    // used for color scheme later
var worldArray = [];   // used to store data later

// preparation for our svg
var margin = { top: 20, right: 20, bottom: 50, left: 25},
w = 1400 - (margin.left + margin.right),
h = 520 - (margin.top + margin.bottom);
console.log(margin);

// preparation for our x/y axis
var y = d3.scaleLinear()
          .range([h, 0]);
var x = d3.scaleBand()
          .range([0, w])
          .padding(0.15);
var yAxis = d3.axisLeft(y);
var xAxis = d3.axisBottom(x)

var yearSet = [];

// once finish processing data, make a graph!
d3.csv(worldData).then(function(data) {
  data.forEach(function(d){
    worldArray.push(d);
    if (!yearSet.includes(d.Years)) {
      yearSet.push(d.Years);
    }
  })
  drawBarD3();
});

function drawBarD3() {
  x.domain(worldArray.map(d => d.Years));
  y.domain(d3.extent(worldArray, d => parseFloat(d.Temperature_Change)));

  // create our svg
  bar_svg = d3.select('#d3')
                .append('svg')
                .attr("id", "bar-chart")
                .attr("width", w + margin.left + margin.right)
                .attr("height", h + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  g = bar_svg.selectAll('g')
              .data(worldArray)
              .enter()
                .append('g')
                //.attr('transform', d => 'translate(0' + ',' + x(d.Years) + ')');

  // append x axis to svg
  bar_svg.append("g")
            .attr("transform", "translate(0," + h + ")")
            .attr("class","myXaxis")
            .call(xAxis)
            .append('text')
              .attr('text-anchor', 'end')
              .attr('fill', 'black')
              .attr('font-size', '15px')
              .attr('font-weight', 'bold')
              .attr('x', w - margin.right)
              .attr('y', -10)
              .text('Years');

  // append y axis to svg
  bar_svg.append("g")
            .attr("class","myYaxis")
            .call(yAxis)
            .append('text')
              .attr('transform', `translate(20, ${margin.top}) rotate(-90)`)
              .attr('text-anchor', 'end')
              .attr('fill', 'black')
              .attr('font-size', '15px')
              .attr('font-weight', 'bold')
              .text('Temperature Change (degree celcius)');

  g.append('rect')
    .attr('class', 'bar')
    .attr('y', function(d) {
      if (d.Temperature_Change >= 0) {
        return y(d.Temperature_Change);
      } else {
        return y(0);
      }
    })
    .attr('x', d => x(d.Years))
    .attr('width', x.bandwidth())
    .attr('height', function(d) {
      if (d.Temperature_Change >= 0) {
        return y(0) - y(d.Temperature_Change);
      } else {
        return y(d.Temperature_Change) - y(0);
      }
    })
    .style('fill', function(d) {
      if (d.Temperature_Change >= 0) {
        return 'pink';
      } else {
        return 'skyblue';
      }
    })
    .style('stroke', 'teal');

  g.append('title')
    .text(d => d.Temperature_Change);

  g.selectAll("rect").join("rect")
    .on('mouseover', function() {
      d3.select(this).attr('stroke', '#333').attr('stroke-width', 2);
    })
    .on('mouseout', function() {
      d3.select(this).attr('stroke-width', null);
    });

  // add legend
  var legend = bar_svg.append('g')
                        .attr("id","legend-group");

  legend.selectAll("rect").data(worldArray)
      .join("rect")
        .attr("class","legends")
        .attr("x",40)
        .attr("y", function(d) {
          if (d.Temperature_Change >= 0) {
            return 25;
          } else {
            return 25+30;
          }
        })
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function(d) {
          if (d.Temperature_Change >= 0) {
            return 'pink';
          } else {
            return 'skyblue';
          }
        });

  legend.selectAll("text").data(worldArray)
      .join("text")
        .attr("class","legends")
        .attr("x", 60)
        .attr("y", function(d) {
          if (d.Temperature_Change >= 0) {
            return 30;
          } else {
            return 30+30;
          }
        })
        .text(function(d) {
          if (d.Temperature_Change >= 0) {
            return "Temperature Change >= 0";
          } else {
            return "Temperature Change < 0";
          }
        })
        .style("font-size", "15px")
        .attr("alignment-baseline","middle");
}


