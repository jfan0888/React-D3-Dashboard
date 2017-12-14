import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {createFilteredPostArray} from '../../modules/helpers'
// To include the default styles
import "react-rangeslider/lib/index.css";
import "rc-slider/assets/index.css";

class ExportToPlatform extends Component {
    constructor(props) {
        super(props);

        this.state = {
            listName: '',
            saveList: false,
            errors: {
                listName: null,
                listDescription: null,
            }
        };
    }


    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {

    }

    handleChangeListName = (event) => {
        this.setState({listName: event.target.value}, () => {
            if (this.state.saveList)
                this.validateForm()
        });
    }




    validateForm = () => {
        let errors = []
        let validated = true
        if (this.state.listName.trim() === '') {
            validated = false
            errors.listName = true
        }




        this.setState({errors: errors});
        return (validated) ? true : false
    }


    export = (event) => {
        event.preventDefault();
        this.setState({saveList: true}, () => {
            const reponse = this.validateForm();
            if (this.validateForm()) {
                //TODO:: export
                let itemFilters = []
                this.props.filteredItems.map(item=>{
                    itemFilters.push({key:item.key, filters: createFilteredPostArray(item)})
                })
                const postData ={
                    selectedSegments: this.props.chartActions.clickedSegments.map((item)=>item.market),
                    listName:this.state.listName,
                    globalFilters:this.props.filters,
                    itemFilters: itemFilters
                }
                console.log('POST DATA :', postData)
                this.props.closePanel()
            }
        });

    }




    render() {
        let count =0;
        return (
            <div className="sidebar">
                <div className="sidebarwrapper">
                    <div className="sidebarfade"/>
                    <div className="sidebarcontent">
                        <div className="sidebarcontet-innerwrapper">
                            <div className="close-button">
                                <img onClick={this.props.closePanel} className="sidebar-close-icon"
                                     src="./static/images/close-icon.png" alt=""/>
                            </div>
                            <div className="add-customer">
                                <div className="sidebar-header clearfix">
                                    <div className="sidebar-title"> Data Export</div>
                                </div>
                                <div className="sidebar-content">
                                    {(this.props.chartActions.clickedSegments.length > 0)
                                        ?
                                        <div>
                                            {this.props.chartActions.clickedSegments.map((item)=>{
                                                count = count +1
                                        return (
                                            <div className="export-header" key={'exportHeader'+count}>
                                                <div className="export-header num-companies">
                                                    {item.market.size} Companies
                                                </div>
                                                <div className="export-header set">
                                                    {item.market.sets.map((i)=>{
                                                        return <span className="ib-icon-plus" key={'exportHeader'+count+'_'+i}>{i}</span>
                                                    })}
                                                </div>

                                            </div>
                                        )
                                        })}


                                            <div className="customer-lists-area">
                                                <div className="customer-list-input">
                                                    <p className="list-input-caption">
                                                        List Name
                                                    </p>
                                                    <input className="list-name-input input-block"
                                                           value={this.state.listName}
                                                           onChange={this.handleChangeListName} name="listName"
                                                           placeholder="Type list name here"/>
                                                    {(this.state.errors && this.state.errors.listName === true) ?
                                                        <span className="error">* Required</span> : null}
                                                </div>


                                            </div>
                                        </div>


                                        : null}
                                </div>
                                <div className="model-buttons btn-group pull-right">
                                    <button className="btn btn-orange pull-right" onClick={this.export}>Export to Fusiongrove
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        chartActions: state.chartReducer,
        filters: state.selectedSegment.globalFilters.postData,
        filteredItems: state.selectedSegment.filteredMarketSelectors
    }
}

function mapDispatchToProps(dispatch) {

    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ExportToPlatform);
