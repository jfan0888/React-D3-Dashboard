import React, {Component} from "react";
import {connect} from "react-redux";
import Moment from 'moment'
import {updateSidebarSpread, updateViewSidebar} from "../../actions/View";
import {emptySelectedCustomer} from "../../actions/CustomerActions";
import {sortAlpha} from "../../modules/helpers";


class CustomerListView extends Component {
    constructor(props) {
        super(props);


    }

    componentDidMount() {
        this.props.updateSidebarSpread(true);
    }
    closeEvent = () => {
        this.props.updateSidebarSpread(false);
        this.props.updateViewSidebar('');
        this.props.emptySelectedCustomer()
    }


    render() {


        return (
            <div className="sidebar sidebar-lg">
                {this.props.spread && (
                    <div className="sidebarwrapper">
                        <div className="sidebarfade"/>
                        <div className="sidebarcontent">
                            <div className="sidebarcontet-innerwrapper">
                                <div className="close-button">
                                    <img onClick={this.closeEvent} className="sidebar-close-icon"
                                         src="./static/images/close-icon.png" alt=""/>
                                </div>
                                <div className="add-customer">

                                    <div className="sidebar-header clearfix">
                                        <div className="sidebar-title">
                                            {this.props.selectedCustomer.listName}

                                            <div className="sidebar-description sidebar-meta">
                                                {this.props.selectedCustomer.listDescription}
                                            </div>
                                            <div className="sidebar-created sidebar-meta">
                                                Created On: {Moment(this.props.created_date).format('MMM D, YYYY')}
                                            </div>
                                        </div>
                                    </div>
                                    <ul className="sidebar-mycustomer-list flex-list">
                                        {sortAlpha(this.props.selectedCustomer.customers, 'company').map(item => {
                                            const itemUrl = (item.url.indexOf('http://')===-1 && item.url.indexOf('https://')===-1)?'http://'+item.url:item.url
                                            if(item.company!==''){
                                                return (
                                                    <li className="flex-list-item" key={item.company}> 
                                                        <div className="flex-list-item-content">
                                                            <span>{item.company} ({item.country})</span>
                                                            <span><a target="_blank" href={itemUrl}> {item.url} </a></span>
                                                        </div>
                                                    </li>)
                                            }

                                        })}
                                    </ul>
                                </div>


                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        spread: state.view.spread,
        viewList: state.selectedSegment.viewList,
        selectedCustomer: state.myCustomers.selectedCustomer

    };
}

export default connect(mapStateToProps, {
    updateSidebarSpread,
    updateViewSidebar,
    emptySelectedCustomer
})(CustomerListView);
