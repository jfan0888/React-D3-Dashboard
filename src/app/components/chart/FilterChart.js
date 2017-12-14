import React, { Component } from 'react';
import {API_URL} from '../../constants';
import axios from 'axios';
import GroupedChart from './GroupedBarChart';
import {chartLabelShorthands} from '../../actions/ChartActions'

export default class FilterChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chartLabels : [],
            chartData : {}
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const {filters} = nextProps;

        if(filters.length) return true;

    }

    makeChartData = () => {
        const {filters} = this.props;

        const promises = [];

        let labels;

        filters.forEach((filter) => {
            labels = filter[0].fieldValues;
            filter[0].fieldValues.forEach((fieldValue) => {
                promises.push(axios.post(`${API_URL}/GetSwimlaneMaster`, [[
                    ...filter[1] , {
                        "fieldName" : filter[0].fieldName,
                        "fieldValues": [fieldValue]
                    }
                ]]));
            })
        });

        Promise.all(promises).then((results) => {
            const chartData = {};

            console.log("results >>", results);
            results.forEach(response => {
                console.log("response >>", response);
                const requestData = JSON.parse(response.config.data)[0];
                const key = requestData[0].fieldName +"$"+ requestData[0].fieldValues[0];
                const fieldValue = requestData[requestData.length - 1].fieldValues[0];

                if(!chartData.hasOwnProperty(key)) {
                    chartData[key] = {};
                }

                if(!chartData[key].hasOwnProperty('total')) {
                    chartData[key]['total'] = 0;
                }

                chartData[key][`label`] = requestData[0].fieldValues[0] + chartLabelShorthands[requestData[0].fieldName];
                chartData[key][`${fieldValue}`] = response.data.aggregations.url.value || 0;
                chartData[key][`total`] += response.data.aggregations.url.value || 0;
            });

            this.setState({
                chartLabels : labels.filter((x, i, a) => a.indexOf(x) == i),
                chartData : Object.values(chartData)
            });
        });
    }

    componentWillMount() {
        this.makeChartData();
    }


    render() {
        return (
            this.state.chartData.length && <GroupedChart id={this.props.id} labels={this.state.chartLabels} data={this.state.chartData}/> || null
        );
    }
}
