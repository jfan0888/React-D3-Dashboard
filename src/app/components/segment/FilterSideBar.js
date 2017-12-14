import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {get} from "lodash";
import {sortAlpha} from "../../modules/helpers";

import {rePost, saveFilter, toggleProduct, updateShowHide, selectAllOnFiltered, unSelectAllOnFiltered} from "../../actions/MarketSelector";
// To include the default styles
import "react-rangeslider/lib/index.css";
import "rc-slider/assets/index.css";

class FilterSidebar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            updatedNowToFetch: null,
            selectedAll:true,
            isLoading:true
        };
    }

    componentDidMount(){
        const filteredItem = this.props.filteredMarketSelectors.filter((item) => {
            return item.id === this.props.selectedMarket.id
        })
        this.setState({updatedNowToFetch: null, selectedAll:this.isSelectAll(filteredItem[0])})
    }

    componentWillReceiveProps(nextProps) {
        const filteredItemNextProps = nextProps.filteredMarketSelectors.filter((item) => {
            return item.id === this.props.selectedMarket.id
        })
        const filteredItemthisProps = this.props.filteredMarketSelectors.filter((item) => {
            return item.id === this.props.selectedMarket.id
        })

        if(this.state.isLoading && filteredItemNextProps!==filteredItemthisProps){
            this.setState({updatedNowToFetch: null, selectedAll:this.isSelectAll(filteredItemNextProps[0])})
        }

        if (this.state.updatedNowToFetch !== null) {
            const masterFilters = this.props.createPostArray()
            const filteredItem = nextProps.filteredMarketSelectors.filter((item) => {
                return item.id === this.state.updatedNowToFetch
            })
            this.props.rePost(masterFilters, filteredItem[0])
            this.setState({updatedNowToFetch: null, selectedAll:this.isSelectAll(filteredItem[0])})
        }
    }

    isSelectAll= (item) =>{
        let isSelectAll = true
        let isLoading = false

        if(item.type ==='parent' || item.type ==='vendor'){
            if( (item.categoryList)){
                item.categoryList.map(cat=>{
                    if(cat.unSelected) {isSelectAll = false;}
                    else{
                        if((cat.list)){
                            cat.list.map(item=>{
                                if(item.unSelected){
                                    isSelectAll = false;
                                }
                            })
                        }else{
                            isLoading=true
                        }
                    }
                })
            }else{
                isLoading=true
            }
            if(this.state.isLoading !== isLoading){
                this.setState({isLoading:isLoading})
            }
            return isSelectAll
        }else if('category'){
            (item.vendorList)?item.vendorList.map(cat=>{
                if(cat.unSelected) {isSelectAll = false; }
                else{
                    (cat.list)?cat.list.map(item=>{
                        if(item.unSelected){
                            isSelectAll = false;
                        }
                    }):isLoading=true
                }
            }):isLoading=true
            if(this.state.isLoading !== isLoading){
                this.setState({isLoading:isLoading})
            }
            return isSelectAll
        }


    }

    /**
     * On close right panel
     * **/
    closeEvent = () => {
        this.props.closeFilterSidebar()
    }

    /**
     * On click save filter button
     * **/
    saveFilter = () => {
        this.props.saveFilter(this.props.selectedMarket.id)
        this.closeEvent()


    }

    /**
     * On click top categories in right panel list
     * Select un-select
     **/
    filterProducts = (id, catKey) => {
        let list = ''
        if (this.props.selectedMarket.type === 'parent' || this.props.selectedMarket.type === 'vendor') {
            list = 'categoryList'
        }
        if (this.props.selectedMarket.type === 'category') {
            list = 'vendorList'
        }
        this.setState({updatedNowToFetch: id}, () => {
            this.props.updateShowHide(id, list, catKey)
        })
    }

    /**
     * On click items in the right panel list
     * Select un-select
     **/
    selectItem = (productKey, catKey, id) => {
        let list = null
        if (this.props.selectedMarket.type === 'parent'|| this.props.selectedMarket.type === 'vendor') {
            list = 'categoryList'
        }
        if (this.props.selectedMarket.type === 'category') {
            list = 'vendorList'
        }

        this.setState({updatedNowToFetch: id}, () => {
            this.props.toggleProduct(id, list, catKey, productKey)
        })
    }

    toggleSelectAll =()=>{

        const {id, type} = this.props.selectedMarket

        this.setState({selectedAll: !this.state.selectedAll, updatedNowToFetch: id},()=>{
            console.log('update', this.state.updatedNowToFetch)
            if(this.state.selectedAll===true){
                this.props.selectAllOnFiltered(type, id )
            }else{
                this.props.unSelectAllOnFiltered(type, id)
            }
        })
    }

    /**
     * Render list items for select
     *
     * **/
    renderListForSelectOneByOne = (list, catKey = null) => {
        const self = this
        let count= 0;
        return (list && list.length > 0) ? sortAlpha(list, 'key').map((item) => {
            count++
            return (
                <li className="filter-product-tile" ref={catKey} key={'button_' + item.key}
                    onClick={() => self.selectItem(item.key, catKey, self.props.selectedMarket.id)}>
                    {(!item.unSelected) ? <i className="ib-icon-circle-check"></i> :
                        <i className="ib-icon-circle"></i>} {item.key}
                </li>
            )
        }) : null;
    }

    /**
     *  render list for filter
     *  if type is parent (vendor list)
     *  if types are category or vendor  (product list)
     *
     * **/
    renderListForFilter = () => {
        const self = this
        let cats = []
        let products = []
        this.props.filteredMarketSelectors.map((market) => {
            if (market.key === self.props.selectedMarket.key && market.type === self.props.selectedMarket.type) {
                if (self.props.selectedMarket.type === 'parent' || self.props.selectedMarket.type === 'vendor') {
                    cats = market.categoryList
                }
                else if (self.props.selectedMarket.type === 'category') {
                    cats = market.vendorList
                }
                // else {
                //     products = market.productList
                // }

            }
        });

        return (cats && cats.length > 0) ? cats.map((cat) => {
            if (!cat.unSelected) {
                if((cat.list !== undefined)){
                    return this.renderListForSelectOneByOne(cat.list, cat.key)
                }else {
                    return null
                }

            }
        }) :  this.renderListForSelectOneByOne(products)


    }

    /**
     *  render category for filter
     *  if type is parent (category list)
     *  if types are category (vendor list)
     *
     * **/
    renderTopCatsForFilter = () => {
        const self = this
        let cats = []

        this.props.filteredMarketSelectors.map((market) => {
            if (market.key === self.props.selectedMarket.key && market.type === self.props.selectedMarket.type) {
                if (self.props.selectedMarket.type === 'parent' || self.props.selectedMarket.type === 'vendor') {
                    cats = market.categoryList
                }
                else if (self.props.selectedMarket.type === 'category') {
                    cats = market.vendorList
                }

            }
        });
        return (cats && cats.length > 0) ? sortAlpha(cats, 'key').map((cat) => {
            let className = (!cat.unSelected) ? 'filter-vendor-tile  active' : 'filter-vendor-tile '
            return (
                <button className={className} key={'button_' + cat.key}
                        onClick={() => self.filterProducts(self.props.selectedMarket.id, cat.key)}>
                    {cat.key}
                </button>
            )
        }) : null;

    }

    /**
     * Show counts on Right panel header
     * (Products, Vendors, Companies, Records)
     *
     * **/
    renderCountsForHeader = () => {
        const selectedMarket = this.props.filteredMarketSelectors.filter((market) => {
            return market.id === this.props.selectedMarket.id
        })
        return (
            <div className="card-info">
                {(this.props.selectedMarket.type !== 'product') ?
                    <div className="card-info-item">
                        <p className="info-item-caption">
                            Products
                        </p>
                        <p className="info-item-value">
                            {get(selectedMarket[0], 'productCount', '0')}
                        </p>
                    </div>
                    : null}
                {(this.props.selectedMarket.type !== 'product' && this.props.selectedMarket.type !== 'vendor') ?
                    <div className="card-info-item">
                        <p className="info-item-caption">
                            Vendors
                        </p>
                        <p className="info-item-value">
                            {get(selectedMarket[0], 'vendorCount', '0')}
                        </p>
                    </div>
                    : null}
                <div className="card-info-item">
                    <p className="info-item-caption">
                        Companies
                    </p>
                    <p className="info-item-value">
                        {get(selectedMarket[0], 'companyCount', '0')}
                    </p>
                </div>
                <div className="card-info-item">
                    <p className="info-item-caption">
                        Records
                    </p>
                    <p className="info-item-value">
                        {get(selectedMarket[0], 'hits', '0')}
                    </p>
                </div>
            </div>
        )
    }

    /**
     * Right panel information filter
     *
     * **/
    renderRightPanelInformation = () => {
        if (this.props.selectedMarket) {

            return (
                <div className="filter-sidebar-content">
                    <div className="filter-sidebar-header">
                        <p className="filter-sidebar-caption">{this.props.selectedMarket.key} - {this.props.selectedMarket.type}</p>
                    </div>
                    {this.renderCountsForHeader()}
                    <div className="cat-select-all-wrap">
                        <span className="cat-select-all" onClick={()=>this.toggleSelectAll()}>{(!this.state.selectedAll)?<span className="selectAll">Select All</span>:<span className="unselectAll">De-Select All</span>}</span>
                    </div>

                    <div className="filter-vendors-tiles">
                        {this.renderTopCatsForFilter()}
                    </div>

                    <div className="filter-product-list">
                        <div className="filter-vendor-tile">
                            <ul className="select-list">
                                {this.renderListForFilter()}
                            </ul>
                        </div>
                    </div>

                    <div className="save-button-area">
                        <button className="save-filter-button" onClick={() => this.saveFilter()}>
                            APPLY
                        </button>
                    </div>
                </div>
            )
        }
    }


    render() {
        return (
            <div className="filter-sidebar">
                {(this.state.isLoading) ? <div className="preloader"></div> : null}
                <div className="sidebarfade"/>
                <div className="sidebarcontent">
                    <div className="close-button">
                        <img onClick={this.saveFilter} className="sidebar-close-icon"
                             src="./static/images/close-icon.png" alt=""/>
                    </div>
                    {this.renderRightPanelInformation()}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        filteredMarketSelectors: state.selectedSegment.filteredMarketSelectors
    };
}

function mapDispatchToProps(dispatch) {

    return bindActionCreators({
        updateShowHide: updateShowHide,
        toggleProduct: toggleProduct,
        saveFilter: saveFilter,
        rePost: rePost,
        selectAllOnFiltered:selectAllOnFiltered,
        unSelectAllOnFiltered: unSelectAllOnFiltered
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterSidebar);
