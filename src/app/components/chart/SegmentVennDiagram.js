import React, {Component} from "react";
import {connect} from "react-redux";
import {_} from "lodash";
import * as venn from "venn.js";
import * as d3 from "d3";
import {createChartData, emptyChartData, updateChartDataCount,updateFilteredSegmentLegends} from "../../actions/MarketSelector";
import {updateClicked, updateClickedSegment, updateIsFirst,chartLabelShorthands} from "../../actions/ChartActions";
import {createFilteredPostArray} from '../../modules/helpers'
import JScombinatorics from "js-combinatorics";

const createFilteredPostArrayFn =(filteredItem, globalFiltersPostData)=>{

    const postArrayReal = createFilteredPostArray(filteredItem, globalFiltersPostData)
    let postArray =[]
    if(postArrayReal.length){
        postArrayReal.map((item)=>{
            postArray[item.fieldName] = item.fieldValues
        })
    }

    return {
        key : filteredItem.key+chartLabelShorthands[filteredItem.type],
        values : postArray
    };
}

const createFormattedPostArray = (el, keys = []) => {
    const collection = {
        keys,
        values : []
    };

    let key;

    for (key in el) {
        collection.values.push({
            fieldName : key,
            fieldValues : el[key],
        })
    }

    return collection;
}

/**
 Use to send Array of array after new implementation
 **/
const createFormattedPostArrayNew = (el) => {
    const collection =[]
    let key;
    for (key in el) {
        collection.push({
            fieldName : key,
            fieldValues : el[key],
        })
    }
    return collection;
}

/**
 Use to send Array of array after new implementation
 **/
const mergerNew = function (els){
    let i = 0
    let il = els.length
    let postValues = []
    let keys =[]
    for (; i < il; i++) {
        keys.push(els[i].key);
        postValues.push(createFormattedPostArrayNew(els[i]['values']));
    }

    return {keys:keys, values:postValues};
}

const merger = function (els){
    var obj = {}, i = 0, il = els.length, key;
    const keys = [];
    for (; i < il; i++) {
        keys.push(els[i].key);

        for (key in els[i]['values']) {
            if(obj.hasOwnProperty(key)){
                obj[key] = obj[key].concat(els[i]['values'][key]);
            } else {
                obj[key] = els[i]['values'][key];
            }
        }
    }

    return createFormattedPostArray(obj, keys);
}

class SegmentVennDiagram extends Component {

    constructor(props) {
        super(props);

        this.state = {
            clicked:false,
            clickedSegment:{},
            allKeys:[]
        };
    }

    componentWillMount(){
        this.props.emptyChartData()
    }

    componentDidMount() {

        //use sorted to have smaller company count on 1st element
        const sorted = this.props.filteredMarketSelectors.sort((a,b) => a.companyCount > b.companyCount);

        const formattedFilteredMarketSelector = sorted.map((selector) => {

            let arrObj = createFilteredPostArrayFn(selector, this.props.globalFiltersPostData);
            arrObj.id= selector.id
            return arrObj
        });

        const combinations = [];
        const newCombinations =[] //Use to send Array of array after new implementation
        JScombinatorics.power(formattedFilteredMarketSelector).map((el) => {

            if(el.length) {
                let mergedObj = mergerNew(el)
                if(mergedObj.keys.length===1){
                    mergedObj.id=el[0].id
                }

                newCombinations.push(mergedObj) //Use to send Array of array after new implementation
                combinations.push(mergedObj)
            }
        });

        //console.log('newCombinations', newCombinations)
        this.props.updateChartDataCount(combinations.length);

        newCombinations.map((item) => {

            console.log('item.values',item.values)
            this.props.createChartData(item.values, item.keys, item.id)
        });

        // combinations.map((item) => {
        //
        //     this.props.createChartData(item.values, item.keys, item.id)
        // });

    }


    reCalculateForANDCombination = (sets) =>{

        let newSets = sets
        let totalOfSingle = 0;
        let totalOfDouble= 0;
        let totalOfTrible = 0;
        let isThree = false;
        let smallerValueOfSingle = 999999999999;
        let smallerValueOfDouble = 999999999999;
        let smallerValueOfTrible = 999999999999;
        sets.map((set)=>{

            if(set.sets.length===1){
                if(smallerValueOfSingle > set.size) smallerValueOfSingle = set.size
                totalOfSingle += set.size
            }else if(set.sets.length===2){
                if(smallerValueOfDouble > set.size) smallerValueOfDouble = set.size
                totalOfDouble += set.size
            }else if(set.sets.length===3){
                if(smallerValueOfTrible > set.size) smallerValueOfTrible = set.size
                totalOfTrible +=  set.size
                isThree = true
            }
        })

        if(isThree===false){ //two

            // This cannot ever happen with correct data. correct should be
            // const intersection = (totalOfSingle - totalOfDouble)
            const intersection = (totalOfSingle - totalOfDouble)>0?totalOfSingle - totalOfDouble:totalOfDouble-totalOfSingle

            if(intersection <= smallerValueOfSingle){
                // console.log('intersection of intersection <= smallerValueOfSingle ',intersection, smallerValueOfSingle)
                newSets.map((set)=>{
                    if(set.sets.length===2){
                        set.size = intersection
                        // console.log('intersection of 2', set.size, totalOfSingle,   totalOfDouble)
                    }
                })
            }else{
                // console.log('two intersection > smallerValueOfSingle ',intersection, smallerValueOfSingle)
            }

        }
        if(isThree===true){ //three
            const intersection = totalOfSingle - totalOfDouble + totalOfTrible
            newSets.map((set)=>{
                if(set.sets.length===3){
                    if(intersection <= smallerValueOfSingle) {
                        // console.log('intersection of 3', intersection, totalOfSingle , totalOfDouble , totalOfTrible)
                        set.size = intersection
                    }else{
                        set.size = smallerValueOfSingle
                        // console.log('three  intersection > smallerValueOfSingle ',intersection, smallerValueOfSingle, set.size)
                    }
                }

                if(set.sets.length===2){
                    let singleTotal = 0
                    smallerValueOfSingle = 999999999999;
                    sets.map((one)=>{
                        if(one.sets.length===1 && ( one.sets.indexOf(set.sets[0]) != -1 || one.sets.indexOf(set.sets[1]) != -1 )){
                            if(smallerValueOfSingle > set.size) smallerValueOfSingle = set.size
                            singleTotal += one.size
                            //console.log('singleTotal of 2', singleTotal, set.sets[0])
                        }
                    })

                    // This cannot ever happen with correct data. correct should be
                    //let val = singleTotal - set.size
                    let val = (singleTotal - set.size)>0? singleTotal - set.size:  set.size - singleTotal


                    if(val <= smallerValueOfSingle) {
                        // console.log('intersection of 2',  set.size, singleTotal,(  set.size- singleTotal) )
                        //console.log('(singleTotal - set.size) <= smallerValueOfSingle ',singleTotal, smallerValueOfSingle, set.size)
                        set.size = val

                    }else{
                        //console.log('two of three intersection > smallerValueOfSingle ',singleTotal, smallerValueOfSingle, set.size)
                    }


                }
            })

        }

        return newSets
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.chartActions.reDraw===true){

            //console.log('nextProps.chartData',nextProps.chartData)
            let   chartSets = [...nextProps.chartData]

            const self = this
            let sets =[]

            if(nextProps.chartActions.isFirst){
                if(chartSets.length != nextProps.totalData) {
                    return false;
                }
                // sets = this.reCalculateForANDCombination(chartSets)

                sets = chartSets

                //console.log('sets',sets)
                // combine with my customers
                nextProps.customerSelectedForGraph.map((item)=>{
                    chartSets.map((setItem)=>{
                        const newSet = [...setItem.sets, item.listName]
                        chartSets.push( {"sets": newSet, "size":0})
                    })
                    chartSets.push( {"label":item.listName, "sets": [item.listName], "size": item.companyCount})
                })
                this.props.updateIsFirst()
            }else{
                //remove chart and redraw
                let  venn2 = document.getElementById('venn')
                venn2.innerHTML = ""
                nextProps.customerSelectedForGraph.map((item)=>{
                    chartSets.map((setItem)=>{
                        const newSet = [...setItem.sets, item.listName]
                        chartSets.push( {"sets": newSet, "size":0})
                    })
                    chartSets.push( {"label":item.listName, "sets": [item.listName], "size": item.companyCount})
                })
                sets = chartSets
            }

            sets.sort(function(a,b) {
                return (a.sets.length > b.sets.length) ? 1 : ((b.sets.length > a.sets.length) ? -1 : 0);
            });

            const colours = ['rgb(44,160,44)', 'rgb(214,39,40)', 'rgb(31,119,180)', 'rgb(255,127,14)'];

            let legendColorArr = []
            if (sets.length > 0) {
                const chart = venn.VennDiagram()
                    .width(700)
                    .height(600);
                const div = d3.select("#venn")


                div.datum(sets).call(chart);
                d3.select( ".venntooltip" ).remove();
                let tooltip = d3.select("body").append("div").attr("class", "venntooltip");

                let j =-1;
                div.selectAll("path")
                    .filter(function(d) { return d.sets.length == 1; })
                    .style("stroke-opacity", 0)
                    .style("stroke", "#fff")
                    .style("stroke-width", 3)
                    .style("fill-opacity", .25)
                    .style("fill", function(d,i) {
                        if(d.sets.length==1){
                            j++
                            let legObj = {key:d.id,color:colours[i]}
                            legendColorArr.push(legObj)
                            return colours[i];
                        }
                    })

                //d3.selectAll("#mono text").style("fill", "#444");

                d3.selectAll("#venn .venn-circle text")
                    .filter(function(d) { return d.sets.length == 1; })
                    .style("fill", function(d,i) { return colours[i]})
                    .style("font-size", "13px")
                    .style("font-weight", "100");

                div.selectAll("g").on("mouseover", function (d, i) {
                    console.log('mouseover')
                    if(self.props.chartActions.clicked===false) {
                        // sort all the areas relative to the current item
                        venn.sortAreas(div, d);
                        // Display a tooltip with the current size
                        tooltip.transition().duration(400).style("opacity", .9);
                        tooltip.text(d.size + " Companies");
                        // highlight the current path
                        let selection = d3.select(this).transition("tooltip").duration(400);
                        d3.select(this).style("cursor", "pointer")
                        selection.select("path")
                            .style("fill-opacity", d.sets.length == 1 ? .35 : .1)
                            .style("stroke-opacity", 1);
                    }
                })
                    .on("mousemove", function () {
                        tooltip.style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                    })
                    .on("click", function (d, i) {
                        console.log('click')
                        let selection = d3.select(this);
                        self.props.updateClickedSegment({market:d, count:i})
                        selection.select("path")
                            .style("stroke-opacity",1)
                            .style("fill-opacity", .5)

                        self.props.updateClicked(true)

                    })
                    .on("mouseout", function (d, i) {
                        console.log('mouseout')
                        tooltip.transition().duration(400).style("opacity", 0);
                        let selection = d3.select(this).transition("tooltip").duration(400);

                        if(self.props.chartActions.clicked===false){
                            selection.select("path")
                                .style("fill-opacity", d.sets.length == 1 ? .25 : .0)
                                .style("stroke-opacity", 0);

                        }
                    });
            }

            if(sets.length == nextProps.totalData) {

                console.log('----------',legendColorArr)
                this.props.updateFilteredSegmentLegends(legendColorArr);
            }
            this.props.resetRedrow()
        }

    }



    render() {


        return (
            <div className="page--segment">
                <div id="venn"></div>
            </div>
        );
    }
}

function mapStateToProps(state) {
  return {

      filteredMarketSelectors: state.selectedSegment.filteredMarketSelectors,
      selectedMarketSelectors: state.selectedMarketSelectors,
      chartData : state.selectedSegment.chartData.venn,
      totalData : state.selectedSegment.totalData,
      chartActions:state.chartReducer,
      customerSelectedForGraph: state.myCustomers.selectedForGraph,
      globalFiltersPostData:state.selectedSegment.globalFilters.postData
  };
}

export default connect(mapStateToProps, {
    createChartData,
    updateChartDataCount,
    emptyChartData,
    updateClicked,
    updateClickedSegment,
    updateIsFirst,
    updateFilteredSegmentLegends
})(SegmentVennDiagram);
