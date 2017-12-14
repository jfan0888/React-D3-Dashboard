import React, {Component} from "react";
import {connect} from "react-redux";
import {updateSidebarSpread, updateViewSidebar} from "../../actions/View";
import {getCustomerLists,  toggleSelectedCustomerForGraph}  from '../../actions/CustomerActions';

class CustomerList extends Component {
    constructor(props) {
        super(props);
      this.props.updateSidebarSpread(true);
        this.state = {
            selected:[],
            searchTerm:"",
            warning:false,
            items:[]
        };
    }

    componentDidMount() {
        if(this.props.customerList.length===0){
            this.props.getCustomerLists()
        }
    }
    componentWillReceiveProps(nextProps) {

    }

    closeEvent =()=>{
        this.props.updateSidebarSpread(false);
        this.props.updateViewSidebar('');
    }


    onClickCustomerListName =(customerListName)=>{
        if(this.props.directToFiltered===true){
            const selectedCustomer = this.props.customerList.filter(item=>item.listName===customerListName)
            this.props.toggleSelectedCustomerForGraph(selectedCustomer[0])
        }
    }

    render() {
        const self = this
        const selected = this.props.selected.map((item)=>item.listName)
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
                                        Add Your Customer List
                                    </div>
                                </div>

                                    <div className="category-set clearfix">
                                        <div className="flex-list">
                                            {this.props.customerList.length > 0 &&
                                            this.props.customerList.map(function(list){
                                                return  <div onClick={()=>self.onClickCustomerListName(list.listName)} className={(selected.indexOf(list.listName) !== -1)?'flex-list-item is-selected':'flex-list-item'} key={'customerList_'+list.listName}>
                                                    <div className="flex-list-item-content">
                                                        {list.listName}
                                                    </div>
                                                </div>
                                            })
                                            }
                                        </div>

                                    </div>

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
        customerList: state.myCustomers.lists,
        selected: state.myCustomers.selectedForGraph
    };
}

export default connect(mapStateToProps, {
    updateSidebarSpread, updateViewSidebar, getCustomerLists,  toggleSelectedCustomerForGraph
})(CustomerList);
