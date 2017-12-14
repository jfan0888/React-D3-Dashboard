import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as d3 from "d3";

export default class StackedBarChart extends Component {
    drawChart = () => {
      const {id, labels, data} = this.props;
      const margin = {top: 20, right: 20, bottom: 30, left: 180};
      const width =  870;
      const height = 500 - margin.top - margin.bottom;
      const xScale = d3.scaleLinear().range([0, width]);
      const yScale = d3.scaleBand().range([height, 0]).padding(0.1);
      const zScale = d3.scaleOrdinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#fdbd6f", "#f3d2a9"]);
      const xAxis = d3.axisBottom(xScale);//.ticks(d3.max(data, function(d) { return d.total; }));
      const yAxis =  d3.axisLeft(yScale);
      const svg   = d3.select("#"+ id)
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom + 150)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      const stack = d3.stack()
                      .keys(labels)
                      // .order(d3.stackOrderNone)
                      .offset(d3.stackOffsetNone);

      var layers= stack(data);
      data.sort(function(a, b) { return b.total - a.total; });

      yScale.domain(data.map(function(d) { return d.label; }));
      xScale.domain([0, d3.max(layers[layers.length - 1], function(d) { return d[0] + d[1]; }) ]).nice();
      zScale.domain(labels);

      var layer = svg.selectAll(".layer")
                     .data(layers)
                     .enter().append("g")
                     .attr("class", "layer")
                     .attr("fill", function(d) { return zScale(d.key); });

      layer.selectAll("rect")
          .data(function(d) { return d; })
          .enter()
          .append("rect")
          .attr("y", function(d) { return yScale(d.data.label); })
          .attr("x", function(d) { return xScale(d[0]); })
          .attr("height", yScale.bandwidth())
          .attr("width", function(d) { return xScale(d[1]) - xScale(d[0]); })

      svg.append("g")
         .attr("class", "axis axis--x")
         .attr("transform", "translate(0," + height + ")")
         .call(xAxis)
         /*.selectAll("text")
         .attr("y", 0)
         .attr("x", 9)
         .attr("dy", ".35em")
         .attr("transform", "rotate(90)")
         .style("text-anchor", "start");*/

      svg.append("g")
         .attr("class", "axis axis--y")
         .attr("transform", "translate(0,0)")
         .call(yAxis);

      /* Chart Legend */

      var legend = svg.append("g")
                      .attr("font-family", "sans-serif")
                      .attr("font-size", 10)
                      .attr("text-anchor", "end")
                      .selectAll("g")
                      .data(labels)
                      .enter().append("g")
                      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      legend.append("rect")
            .attr("x", width - 190)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", zScale);

      legend.append("text")
            .attr("x", width - 240)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function(d) { return d; });
  }

    componentDidMount() {
        this.drawChart();
    }


  render() {
    return (
      <div className="page--segment">
          <div id={this.props.id || "stacked-chart"}></div>
      </div>
    );
  }
}
