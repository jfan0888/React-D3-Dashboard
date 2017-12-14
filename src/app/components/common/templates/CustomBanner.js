import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";

import {
    changeSegmentNameAndDescription
} from "../../../actions/MarketSelector";

import {
    showWarning
} from "../../../actions/View";

class CustomBanner extends Component {


    constructor() {
        super();

        this.state = {
            segmentName : null,
            segmentDescription : null
        };
    }

    componentDidMount() {
        this.setState({segmentName:this.props.name, segmentDescription:this.props.description})
    }

    onChangeSegmentName = (e) => {
        this.setState({
            segmentName : e.target.value
        }, function() {
            this.updateSegmentNameAndDescription();
        })

    }

    onChangeSegmentDescription = (e) => {
        this.setState({
            segmentDescription : e.target.value
        }, function() {
            this.updateSegmentNameAndDescription();
        })
    }

    updateSegmentNameAndDescription = () =>{
        let {segmentName , segmentDescription} = this.state
        let {selectedSegment , customersForGraph, selectedMarketSelectors, savedSegments} = this.props
        let data = {name : segmentName, description :segmentDescription}
        let saveSegmentData = null
        if(selectedSegment.id !== 0 && (selectedSegment.name != segmentName || selectedSegment.description != segmentDescription)){
            saveSegmentData = {...selectedSegment,
                name : segmentName,
                description :segmentDescription,
                customers: customersForGraph,
                selectedMarketSelectorsForGraph: selectedMarketSelectors
            }
        }
        this.props.changeSegmentNameAndDescription(data, saveSegmentData, savedSegments)

    }



    renderAdditionalButtons=()=>{
        if(this.props.step===2){
            return(
                <div className="input-group segment-actions">
                    {((this.props.filteredMarketSelectors.length < 3))
                        ?<button className="relation-select add-segment-option btn btn-border" onClick={() => this.props.onClickAddSectors()}>
                            <span><i className="ib-icon-add-tab"></i> ADD SEGMENT</span>
                        </button>
                        :null}
                    {(this.props.customersForGraph.length===0)
                        ?<button className="relation-select add-segment-option btn btn-border" onClick={() => this.props.onClickAddCustomerList()}>
                            <span><i className="ib-icon-users-add"></i> ADD CUSTOMER LIST</span>
                        </button>
                        :null}

                </div>
            )
        }
    }

    render() {
        if(this.state.segmentName !== null){
            return (
                <div className="top-banner">
                    <div className=" clearfix">
                        <div className="build-banner-content">
                            <div className="banner-content-left">
                                <div><input
                                    className="segment-name"
                                    placeholder="Enter Segment Name..."
                                    defaultValue={this.state.segmentName}
                                    type="text"
                                    onBlur={this.onChangeSegmentName}/>
                                </div>
                                <div><input
                                    className="segement-discription"
                                    placeholder="Segment Description..."
                                    type="text"
                                    defaultValue={this.state.segmentDescription}
                                    onBlur={this.onChangeSegmentDescription}/>
                                </div>
                            </div>
                            <div className="banner-content-right">
                                {this.renderAdditionalButtons()}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }else{
            return null
        }

    }
}


function mapStateToProps(state) {
    return {
        selectedSegment: state.selectedSegment,
        name: state.selectedSegment.name,
        description: state.selectedSegment.description,
        filteredMarketSelectors:state.selectedSegment.filteredMarketSelectors,
        step:state.selectedSegment.step,
        customersForGraph:state.myCustomers.selectedForGraph,
        selectedMarketSelectors: state.selectedMarketSelectors,
        savedSegments: state.mySavedSegments
    };
}

function mapDispatchToProps(dispatch) {

    return bindActionCreators({
        changeSegmentNameAndDescription,
        showWarning
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomBanner);