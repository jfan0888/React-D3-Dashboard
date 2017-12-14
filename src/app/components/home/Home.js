import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {browserHistory} from "react-router";
import Griddle from 'griddle-react';
import urlRegex from 'url-regex';

/* code change */
import Moment from "moment";
import {sortAlpha} from "../../modules/helpers";
import {hideWarning, showWarning, updateSidebarSpread, updateViewCard, updateViewSidebar} from "../../actions/View";
import {
    changeStep,
    deleteSavedSegment,
    emptyViewList,
    getDataForViewList,
    getMasterTermsCategories,
    getMasterTermsParentCategories,
    getMasterTermsProducts,
    getMasterTermsVendors,
    getSavedSectorData,
    getSavedSegments,
    rePopulateSavedSegment,
    initSelectedSegment
} from "../../actions/MarketSelector";
import {getCustomerListDetail, getCustomerLists, getCustomerXRay} from "../../actions/CustomerActions";
import {updateIsFirst, updateReDraw} from "../../actions/ChartActions";

import Card from "./Card";
import Segment from "../segment/Segment";
import Sidebar from "./SideBar";
import CategoryList from "../segment/CategoryList";
import CustomerListView from "../segment/CustomerListView";
import FooterWizard from "../base/FooterWizard";
import Modal from "react-responsive-modal";

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            importMethod: false,
            buildSegment: false,
            currentTab: 'selectors', // Default Tab
            searchTerm:'',
            items:[],
            open: false,
            deleteModal: false,
            selectedSavedSector:'',
            xrayQuery : ''
        };
        this.onCustomerXrayDataSearchTxtClick = this.onCustomerXrayDataSearchTxtClick.bind(this)
    }

    componentDidMount() {
        this.props.changeStep(1)
        this.props.initSelectedSegment()
        this.props.updateReDraw(true)
        this.props.updateIsFirst(true)
        this.props.getMasterTermsParentCategories()
        this.props.getSavedSegments();
        this.props.getCustomerLists()
        this.props.getSavedSectorData();
        this.props.getCustomerXRay();

        this.setState({items: this.props.marketSelectors})
        window.onbeforeunload = function (event) {
            document.getElementsByClassName('refreshAlert')[0].className =
                document.getElementsByClassName('refreshAlert')[0].className
                    .replace(new RegExp('(?:^|\\s)' + 'hidden' + '(?:\\s|$)'), ' ');
            return "";
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.marketSelectors.length !== nextProps.marketSelectors.length) {
            this.setState({items: nextProps.marketSelectors})
        }

    }

    onClickViewList = (title, category) => {
        if(category!=='My Customers'){
            this.props.updateViewSidebar('view_list');
            this.props.getDataForViewList(category, title)
        }else{
            this.props.updateViewSidebar('view_customers');
            this.props.getCustomerListDetail(title)
        }

    }


    onTabClick = (value) => {
        this.setState({
            currentTab: value,
        });
    }

    handleAddCustomer = () => {
        this.props.updateViewSidebar('add_customer');
        this.props.updateSidebarSpread(true)
    }

    handleAddSector = () => {
        this.props.updateViewSidebar('add_sector');
    }



    handleCheckCard = () => {
        this.setState({buildSegment: true});
        this.props.updateViewCard('update_view_card');
    }

    closeEvent = () => {
        this.props.updateViewSidebar("");
    }

    importXLS = () => {
        this.setState({
            importMethod: false,
        });
    }

    mannualImport = () => {
        this.setState({
            importMethod: true,
        });
    }

    searchItems = (e) =>{
        this.setState({searchTerm:e.target.value})
        let items =this.props.marketSelectors.filter((i)=>{return (i.key.toLowerCase().indexOf(e.target.value.toLowerCase())!==-1)})
        this.setState({items:items})
    }

    handleBuiltSegment = (e) => {

        if(this.props.selectedMarketSelectors.length){
            this.props.hideWarning()
            this.setState({
                buildSegment: true,
            });
        }else{
            e.preventDefault()
            this.props.showWarning("Warning: select either one sector")
        }


    }

    renderMarketSelectorCards = () => {
        const self = this
        return (this.state.items.length >0 ) ? sortAlpha(this.state.items, 'key').map((selector) => {

            const isInSelectList = sortAlpha(self.props.selectedMarketSelectors, 'key').filter(item => item.id ===selector.id)

            return (
                <Card
                    key={selector.type + '_' + selector.key}
                    id={selector.key}
                    onChecked={this.handleCheckCard}
                    title={selector.key}
                    category={selector.type}
                    Products={selector.product}
                    Vendors={selector.vendor}
                    Categories={selector.category}
                    Companies={selector.company}
                    isSeleted={(isInSelectList.length)}
                    onClickViewList={this.onClickViewList}

                />
            );
        }) : null
    }

    onCustomerXrayDataSearchTxtClick(e){
        this.setState({
            xrayQuery : e.target.value
        })
    }



    searchItems = (e) =>{
        const query = e.target.value;
        if(query.length > 0 && e.charCode == 13) {
            this.setState({ xrayQuery : e.target.value }, this.onCustomerXrayDataSearch)
        }
    }


    onCustomerXrayDataSearch = () =>{

        if(this.state.xrayQuery && !(this.state.xrayQuery=='')){
            let isUrl =urlRegex({exact: true, strict: false}).test(this.state.xrayQuery)
            let urlType = false
            if(isUrl){
                urlType = true
            }
            this.props.getCustomerXRay(this.state.xrayQuery,urlType)
        }
    }

    renderAlertMessage() {
        return (
            <div className="container text-center hidden refreshAlert">
                <div className="alert alert-warning">
                    You might lose data if you <strong>refresh</strong> the page.
                </div>
            </div>
        );
    }


    renderCustomersXRay = ()=> {

        var tableObj = (this.props.customerXrayData) ? this.props.customerXrayData :'';
        const {customerDetail} = this.props

            return (

                <div>
                    <div className="content-actions-bar">
                        <div className="search-bar">
                            <div className="search-box">
                                <input onChange={this.onCustomerXrayDataSearchTxtClick}  onKeyPress={this.searchItems} className="search-input"
                                       type="text" placeholder="Type Company Name or URL"/>
                                <button className="search-submit" onClick={this.onCustomerXrayDataSearch}></button>
                            </div>
                        </div>
                    </div>
                    {(customerDetail)
                        ? <div className="x-ray-header">
                            <h2 className="title">{customerDetail.company}</h2>

                            <div className="header-row clearfix">
                                <div className="com-address">
                                    <p>{customerDetail.hqAddress}, {customerDetail.hqCity}</p>
                                    <p>{customerDetail.hqState}, {customerDetail.hqCountry}. </p>
                                </div>
                                <div className="com-zip">
                                    <label className="label">Zip Code</label>
                                    <p>{customerDetail.hqZip}</p>
                                </div>
                                <div className="com-phone">
                                    <label className="label">Phone</label>
                                    <p>{customerDetail.hqPhone}</p>
                                </div>
                                <div className="com-url">
                                    <label className="label">Url</label>
                                    <p>{customerDetail.url}</p>
                                </div>
                            </div>
                        </div>
                        :null}

                    <Griddle
                        tableClassName="table-minimal table-sm"
                        useGriddleStyles={false}
                        showFilter={false}
                        resultsPerPage={20}
                        results={tableObj}
                    />
                </div>
            )


    }



    renderMyCustomers = ()=> {

        let cusCount =0;
        if (this.props.customerList && this.props.customerList.length > 0) {
            return sortAlpha(this.props.customerList, 'listName').map((customer)=> {
                cusCount++;
                const isInSelectList = this.props.customerSelectedForGraph.filter(item => item.listName ===customer.listName)
                return (<Card
                    key = {'myCustomer_'+cusCount}
                    onChecked={this.handleCheckCard}
                    title={customer.listName}
                    category="My Customers"
                    hits={customer.hits}
                    created={customer.created_at}
                    isSeleted={(isInSelectList.length)}
                    companiesCount={customer.companyCount}
                    onClickViewList={this.onClickViewList}
                />)

            })
        }
    }


    populateSavedSegment = (selectorId) =>{

        let {selectedMarketSelectors,customerSelectedForGraph} = this.props;
        if(selectedMarketSelectors.length>0 || customerSelectedForGraph.length>0){
            this.setState({selectedSavedSector:selectorId},this.onOpenModal())
        }else{
            this.setState({selectedSavedSector:selectorId},this.onPopulateSavedSegmentModelOkClick(selectorId))
        }
    }


    onPopulateSavedSegmentModelOkClick = (selectorId=null) => {

        let selectedSavedSector = (selectorId) ? selectorId : this.state.selectedSavedSector;
        this.onCloseModal();
        let selectedSavedMarketSelector = this.props.savedMarketSelectors.filter((selector) => {
            return selector.id === selectedSavedSector
        });
        this.props.rePopulateSavedSegment(selectedSavedMarketSelector[0])
        setTimeout(function() { browserHistory.push('/build') }.bind(),1000);
    };


    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };
    onCloseDeleteModal = () => {
        this.setState({ deleteModal: false });
    };

    deleteSavedSegment(id) {
        if (!this.state.deleteModal) {
            this.setState({
                deleteModal: id
            });
        } else {
            this.props.deleteSavedSegment(this.state.deleteModal);
            this.onCloseDeleteModal();
        }
    }

    renderMySavedSegments = ()=> {

        if (this.props.savedMarketSelectors && this.props.savedMarketSelectors.length > 0) {
            return sortAlpha(this.props.savedMarketSelectors, 'name').map((savedMarketSelector)=> {
                return (
                    <div key={savedMarketSelector.id}>
                        <div className="card-block false" style={{ "max-height": "50px"}}>
                            <i className="ib-icon-close card-delete-button" onClick={() => this.deleteSavedSegment(savedMarketSelector.id)}/>
                            <div className="card-content-area" onClick={()=> this.populateSavedSegment(savedMarketSelector.id)}>
                                <span className="card-title"> {savedMarketSelector.name}</span>
                                <span className="card-desc"> {savedMarketSelector.description}</span>
                                <div><span className="card-date">Saved: {Moment(savedMarketSelector.dateSaved).format('MMM D, YYYY h:mm a')}</span></div>
                                <div>{savedMarketSelector.dateUpdated?<span className="card-date">Updated:{Moment(savedMarketSelector.dateUpdated).format('MMM D, YYYY h:mm a')} </span>:null}</div>
                                {savedMarketSelector.filteredMarketSelectors.map(item=>{
                                    return (<div className="card-segments" key={item.key}>{item.key} : {item.companyCount}</div>)
                                })}

                            </div>
                        </div>
                    </div>
                )

            })
        }
    }

    render() {

        const import_method = this.state.importMethod;
        const current_tab = this.state.currentTab;
        const {open, deleteModal}   = this.state;

        return (
            <div className="page--home">
                {(this.props.isRequesting)?<div className="preloader"></div>:null}
                {
                    this.props.sidebar === 'add_customer' && (
                        <Sidebar />
                    )
                }
                {
                    this.props.sidebar === 'add_sector' && (
                        <CategoryList/>
                    )
                }
                {
                    this.props.sidebar === 'view_list' && (
                        <CategoryList viewListSection={true}/>
                    )
                }
                {

                    this.props.sidebar === 'view_customers' && (
                        <CustomerListView />
                    )
                }

                <div className={"tabbar " + (this.state.buildSegment && ("build"))}>
                    <div className="tabbar-menus">
                        <a className={"tabbar-menu-item " + (current_tab === "selectors" && ("active"))}
                           onClick={this.onTabClick.bind(this, "selectors")}>MARKET SELECTORS</a>
                        <a className={"tabbar-menu-item " + (current_tab === "customers" && ("active"))}
                           onClick={this.onTabClick.bind(this, "customers")}>MY CUSTOMERS</a>
                        <a className={"tabbar-menu-item " + (current_tab === "customer-xray" && ("active"))}
                           onClick={this.onTabClick.bind(this, "customer-xray")}>CUSTOMER X-RAY</a>
                        <a className={"tabbar-menu-item " + (current_tab === "segments" && ("active"))}
                           onClick={this.onTabClick.bind(this, "segments")}>MY SAVED SEGMENTS</a>
                    </div>
                    <div className="tabbar-components">

                    </div>
                </div>


                <div className={"main-content " + (this.state.buildSegment && ("build"))}>
                    {
                        current_tab === 'selectors' && (
                            <div className="content-area home-sectors">
                                <div className="content-actions-bar">
                                    <button className="add-icon pull-right has-tooltip" onClick={this.handleAddSector}><i
                                        className="ib-icon-plus"></i>
                                        <span className="tooltip tooltip-without-border" role="tooltip">Add Sector</span>
                                    </button>
                                    <div className="search-bar">
                                        <div className="search-box">
                                            <input onChange={this.searchItems} className="search-input"
                                                   type="text" placeholder="Type Category or Vendor to Search"/>
                                        </div>
                                    </div>
                                </div>
                                {this.renderMarketSelectorCards()}
                            </div>
                        )
                    }
                    {
                        current_tab === 'customers' && (
                            <div className="content-area customers">
                                <div className="content-actions-bar">
                                    <button className="add-icon pull-right has-tooltip" onClick={this.handleAddCustomer}><i
                                        className="ib-icon-plus"></i>
                                        <span className="tooltip tooltip-without-border" role="tooltip">Add Customer</span>
                                    </button>
                                </div>
                                {this.renderMyCustomers()}
                            </div>
                        )
                    }
                    {
                        current_tab === 'customer-xray' && (
                            <div className="content-area customers">
                                {this.renderCustomersXRay()}
                            </div>
                        )
                    }
                    {
                        current_tab === 'segments' && (
                            <div className="content-area customers">
                                {this.renderMySavedSegments()}
                            </div>
                        )
                    }
                </div>
                <Modal open={open} onClose={this.onCloseModal} overlayClassName={"small"}
                       little>
                    <div className="model-title">
                        <h2>Confirm Load Segment</h2>
                    </div>
                    <div className="model-content">
                        This will clear your current selection. Do you want to load this segment ?
                    </div>
                    <div className="model-buttons btn-group pull-right">
                        <button className="btn btn-green pull-right" onClick={()=>this.onPopulateSavedSegmentModelOkClick()}>Yes</button>
                        <button className="btn btn-gray pull-right" onClick={()=>this.onCloseModal()}>No</button>
                    </div>
                </Modal>
                <Modal open={!(!deleteModal)} onClose={this.onCloseDeleteModal} overlayClassName={"small"}
                       little>
                    <div className="model-title">
                        <h2>Confirm Delete Saved Segment</h2>
                    </div>
                    <div className="model-content">
                        This will delete the selected saved segment. Are you sure you want to delete this segment ?
                    </div>
                    <div className="model-buttons btn-group pull-right">
                        <button className="btn btn-red pull-right" onClick={()=>this.deleteSavedSegment()}>Yes</button>
                        <button className="btn btn-gray pull-right" onClick={()=>this.onCloseDeleteModal()}>No</button>
                    </div>
                </Modal>
                {this.state.buildSegment && (<Segment />)}
                <FooterWizard onButtonClick={this.handleBuiltSegment} />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        sidebar: state.view.sidebar,
        card: state.view.card,
        marketSelectors: state.mySectors.list,
        selectedMarketSelectors: state.selectedMarketSelectors,
        customerList: state.myCustomers.lists,
        customerSelectedForGraph: state.myCustomers.selectedForGraph,
        savedMarketSelectors: state.mySavedSegments.list,
        isRequestingSaved: state.mySavedSegments.requesting,
        isRequesting: state.mySectors.requesting,
        customerXrayData : state.myCustomers.customerXrayList,
        customerDetail:state.myCustomers.customerDetail

    };
}

function mapDispatchToProps(dispatch) {

    return bindActionCreators({
        updateViewCard: updateViewCard,
        updateViewSidebar: updateViewSidebar,
        getMasterTermsParentCategories: getMasterTermsParentCategories,
        getMasterTermsCategories: getMasterTermsCategories,
        getMasterTermsVendors: getMasterTermsVendors,
        getMasterTermsProducts: getMasterTermsProducts,
        updateSidebarSpread: updateSidebarSpread,
        getCustomerLists: getCustomerLists,
        getDataForViewList: getDataForViewList,
        getSavedSegments: getSavedSegments,
        deleteSavedSegment: deleteSavedSegment,
        emptyViewList: emptyViewList,
        rePopulateSavedSegment : rePopulateSavedSegment,
        showWarning:showWarning,
        hideWarning:hideWarning,
        changeStep:changeStep,
        getCustomerListDetail:getCustomerListDetail,
        updateReDraw:updateReDraw,
        updateIsFirst:updateIsFirst,
        getSavedSectorData:getSavedSectorData,
        initSelectedSegment:initSelectedSegment,
        getCustomerXRay : getCustomerXRay
    }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Home);
