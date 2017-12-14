import React, {Component} from "react";
import {connect} from "react-redux";
import {get} from "lodash";

import {defaultImage} from '../../constants'

class BuildSegmentCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            viewModal: false,
        };
    }

    renderFilterCounts = (id) => {
        const filteredSelector = this.props.filteredMarketSelectors;
        let list = [];

        return filteredSelector.map((obj) => {
            if (obj.type === 'parent' && obj.id === id) {
                return this.getFilterCount('parent', obj.categoryList, obj.key)
            } else if (obj.type === 'category' && obj.id === id) {
                return this.getFilterCount('category', obj.vendorList, obj.key)
            } else if (obj.type === 'vendor' && obj.id === id) {
                return this.getFilterCount('vendor', obj.categoryList, obj.key)
            }
        })
    };


    getFilterCount(type, data, key){
        let selectedList = []
        let selectedList2 = []
        data.map((obj) => {
            if (!obj.unSelected) {
                if (obj.list) {
                    obj.list.map((listItem) => {
                        if (!listItem.unSelected) {
                            selectedList2.push(listItem.key)
                        }
                    });
                }
                selectedList.push(obj.key)
            }
        })

        if (selectedList.length > 0) {
            return (
                <div key={type + '_selected_count_' + key}>
                    <button key={type + '_selected_count_list2_' + key} className="saved-filter-tile">
                        {(type === 'parent' || type === 'vendor') ? 'Categories - ' :  'Vendors - ' } {(selectedList.length===data.length?'All': selectedList.length)}
                    </button>
                    {(selectedList2.length > 0) ?
                        <button key={type + '_selected_count_list3_' + key} className="saved-filter-tile">
                            {((type == 'parent') ? 'Vendors - ' : 'Products - ') + selectedList2.length}
                        </button>
                        : null}

                </div>)
        } else {
            return (
                <button key={type + '_selected_count_list1_' + key} className="saved-filter-tile">
                    All
                </button>
            )
        }
    }

    /**
     * Not using this now,  because  list is too large
     * */
    getFiltersList(type, data, key) {
        let selectedList = []
        let selectedList2 = []
        data.map((obj) => {
            if (!obj.unSelected) {
                if (obj.list) {
                    obj.list.map((listItem) => {
                        if (!listItem.unSelected) {
                            selectedList2.push(listItem.key)
                        }
                    });
                }
                selectedList.push(obj.key)
            }
        })

        if (selectedList.length > 0) {
            return (
                <div key={type + '_selected_count_' + key}>
                    <button key={type + '_selected_count_list1_' + key} className="saved-filter-tile">
                        {type == 'parent' ? 'Parent Category - ' : ((type == 'category') ? 'Category - ' : 'Vendor - ')} {key}
                    </button>
                    <br/>
                    <button key={type + '_selected_count_list2_' + key} className="saved-filter-tile">
                        {type == 'parent' ? 'Categories - ' : ((type == 'category') ? 'Vendors - ' : 'Products - ')} {selectedList.join(", ")}
                    </button>
                    <br/>
                    {(selectedList2.length > 0) ?
                        <button key={type + '_selected_count_list3_' + key} className="saved-filter-tile">
                            {((type == 'parent') ? 'Vendors - ' : 'Products - ') + selectedList2.join(", ")}
                        </button>
                        : null}

                </div>)
        } else {
            return (
                <button key={type + '_selected_count_list1_' + key} className="saved-filter-tile">
                    {type == 'parent' ? 'Parent Category - ' : ((type == 'category') ? 'Category - ' : 'Vendor - ')} {key}
                </button>
            )
        }

    }

    getImageUrl =(name)=>{
       return 'https://logo.clearbit.com/'+name.toLowerCase()+'.com';
    }

    addDefaultSrc =(ev) =>{
        ev.target.src = defaultImage
    }

    kFormatter (num) {
        return num > 999 ? (num / 1000).toFixed(1) + 'k' : num
    }

    render() {


        let {filteredMarketSelectors,selector,category,chart,legendColor} = this.props

        const filtered = filteredMarketSelectors.filter(item=>  {return ( item.id===selector.id)})
        const name = (category ==='My Customers')?selector.listName:selector.key
        if(chart===true){

            let spanStyle = {
                color: 'black',
                background:(legendColor) ? legendColor : 'white'
            }

            return(
                <div className="segment-card card" key={'chart_' +name}>
                    <div className="segment-card-title clearfix">

                        <span style={spanStyle} className="segmentLegend"></span>
                        {name}

                    </div>
                    <div className="segment-card-value">{this.kFormatter(selector.companyCount)}</div>
                    {(category!=='My Customers')?
                    <div className="segment-filter">
                        <p>Filtered by</p>
                        <div>
                            {this.renderFilterCounts(selector.id)}
                        </div>
                    </div>
                        :null}
                </div>
            )
        }else{
            let  companyCount = 0
            if(category ==='My Customers'){
                companyCount = get(selector, 'companyCount', '0');
            }else{
                companyCount = (filtered[0])? get(filtered[0], 'companyCount', '0'): get(this.props.selector, 'company', '0');
            }
            return (
                //TODO:: move inline styles to style sheet
                <div className="info-area" style={{width: ''}} key={this.props.selector.id}>
                    <i className="ib-icon-close card-delete-button" onClick={(e) => {
                        e.stopPropagation();
                        this.props.onClickRemoveCard(name, this.props.selector.id)
                    }}/>
                    <img alt="" className="segment-info-image" onError={this.addDefaultSrc} src={this.getImageUrl(name)}/>
                    <div className="info-cards-area">
                        <p className="info-caption-content">
                            {name}
                        </p>
                        <div className="info-card-area">
                            <div className="info-number-card">
                                <p className="info-card-title">
                                    Total Companies {(this.props.category ==='My Customers')?' In ':' Using '} {name}
                                </p>
                                <p className="info-card-value">
                                    {companyCount}
                                </p>
                            </div>
                        </div>
                    </div>
                    {(this.props.category!=='My Customers')?
                        <div className="filteredby-area">
                            <img alt="" className="add-card-button pull-left" src="./static/images/add-icon.png"
                                 onClick={() => this.props.openSidebar(this.props.selector.id)}/>
                            <div className="saved-filterby-area">
                                <p className="saved-filterby-caption">
                                    Filtered By
                                </p>
                                <div className="saved-filter-tiles">
                                    {this.renderFilterCounts(this.props.selector.id)}
                                </div>
                            </div>
                        </div>
                        :null}

                </div>
            );
        }

    }
}

function mapStateToProps(state) {
    return {
        filteredMarketSelectors: state.selectedSegment.filteredMarketSelectors,
    };
}

export default connect(mapStateToProps, {})(BuildSegmentCard);
