import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as d3 from "d3";

export default class GroupedBarChart extends Component {
    drawChart = () => {
        const {id, labels} = this.props;
        const data = this.props.data.map((item) => {
            delete item['total'];
            return item;
        });

        console.log("data >> ", data);

        const ranges = ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#fdbd6f", "#f3d2a9"];

        var margin = {top: 20, right: 20, bottom: 30, left: 40},
            padding = {top: 20, right: 20, bottom: 20, left: 20},
            outerWidth = 1150,
            outerHeight = 500,
            innerWidth = outerWidth - margin.left - margin.right,
            innerHeight = outerHeight - margin.top - margin.bottom,
            width = innerWidth - padding.left - padding.right,
            height = innerHeight - padding.top - padding.bottom;

        var x0Scale = d3.scaleBand()
            .rangeRound([0, width - 220])
            .paddingInner(0.1);

        var x1Scale = d3.scaleBand()
            .padding(0);

        var yScale = d3.scaleLinear()
            .rangeRound([height, 0]);

        var zScale = d3.scaleOrdinal()
            .range(ranges);

// Creates SVG
        var svg = d3.select("#" + id).append("svg")
            .attr("width", outerWidth)
            .attr("height", outerHeight)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var g = svg.append("g")
            .attr("transform", "translate(" + padding.left + "," + padding.top + ")");

        var keys = labels;

        /* tooltip*/

        /*var tooltip = svg.append("g")
         .attr("class", "tooltip")
         .style("display", "none");

         tooltip.append("rect")
         .attr("width", 60)
         .attr("height", 20)
         .attr("fill", "white")
         .style("opacity", 0.5);

         tooltip.append("text")
         .attr("x", 30)
         .attr("dy", "1.2em")
         .style("text-anchor", "middle")
         .attr("font-size", "12px")
         .attr("font-weight", "bold");*/

        // Set domains based on data
        x0Scale.domain(data.map(function (d) {
            return d.label;
        }));
        x1Scale.domain(keys).rangeRound([0, x0Scale.bandwidth()]);
        yScale.domain([0, d3.max(data, function (d) {
            return d3.max(keys, function (key) {
                return d[key];
            });
        })]).nice();	// WOOT?


        // ENTER
        //
        g.append("g")
            .selectAll("g")
            .data(data)
            .enter().append("g")
            .attr("transform", function (d) {
                return "translate(" + x0Scale(d.label) + ",0)";
            })
            // rects
            .selectAll("rect")
            .data(function (d) {
                return keys.map(function (key) {
                    return {key: key, value: d[key]};
                });
            })
            .enter().append("rect")
            .attr("class", function (d) {
                return "bar-" + d.key.replace(/[$\s,]/g, "-");
            })
            .attr("x", function (d) {
                return x1Scale(d.key);
            })
            .attr("y", function (d) {
                return yScale(d.value);
            })
            .attr("width", x1Scale.bandwidth())
            .attr("height", function (d) {
                return height - yScale(d.value);
            })
            .attr("fill", function (d) {
                return zScale(d.key);
            })


        // Axes
        g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x0Scale));

        g.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(yScale).ticks(20));

        /*g.append("g")
         .attr("class", "y axis")
         .call(d3.axisLeft(yScale).ticks(10, "s"))
         .append("text")
         .attr("x", 2)
         .attr("y", yScale(yScale.ticks().pop()) + 0.5)
         .attr("dy", "0.32em")
         .attr("fill", "#000")
         .attr("font-weight", "bold")
         .attr("text-anchor", "start")
         .text("Qtde");*/

        // Legend
        var legend = g.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(keys)
            .enter().append("g")
            .attr("class", "lgd")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

        legend.append("rect")
            .attr("class", function (d, i) {
                return "lgd_" + labels[i].replace(/[$\s,]/g, "-");
            })
            .attr("x", width - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", zScale);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function (d) {
                return d;
            });

        // BARS SELECTION
        d3.selectAll("rect")
            .on("mousemove", function (d) {
                const dKey = d.key != undefined ? d.key.replace(/[$\s,]/g, "-") : "";
                d3.selectAll(".bar-" + dKey).style("fill", "#000")
                d3.selectAll(".lgd_" + dKey).style("fill", "#000")

                /*var xPosition = d3.mouse(this)[0] - 5;
                 var yPosition = d3.mouse(this)[1] - 5;
                 tooltip.style("display", "block");
                 tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                 tooltip.select("text").text(d.value);*/
            })
            .on("mouseout", function (d) {
                const dKey = d.key != undefined ? d.key.replace(/[$\s,]/g, "-") : "";
                d3.selectAll(".bar-" + dKey).style("fill", function (d, i) {
                    zScale[i]
                });
                d3.selectAll(".lgd_" + dKey).style("fill", function (d, i) {
                    return zScale[i];
                });

                /*tooltip.style("display", "none");*/
            })
        /*.on("mouseover", function() { tooltip.style("display", null); });*/

        // LEGEND SELECTION
        svg.selectAll("g.lgd")
            .on("mousemove", function (d) {
                d3.selectAll(".bar-" + d.replace(/[$\s,]/g, "-")).style("fill", "#000")
                d3.selectAll(".lgd_" + d.replace(/[$\s,]/g, "-")).style("fill", "#000")
            })
            .on("mouseout", function (d) {
                d3.selectAll(".bar-" + d.replace(/[$\s,]/g, "-")).style("fill", function (d, i) {
                    return zScale[i];
                })
                d3.selectAll(".lgd_" + d.replace(/[$\s,]/g, "-")).style("fill", function (d, i) {
                    return zScale[i];
                });
            })
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
