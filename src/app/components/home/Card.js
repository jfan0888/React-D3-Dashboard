import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Moment from 'moment'

import Tile from './Tile';
import {CARD_COUNT_LABELS} from "../../constants";
import {toggleSelectedMarkets ,removeSelectedMarket,  deleteSavedSectorData} from '../../actions/MarketSelector';
import {toggleSelectedCustomerForGraph, deleteCustomerList} from '../../actions/CustomerActions'
import {showWarning} from '../../actions/View'
import {defaultImage} from '../../constants'

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onChecked = (title, category) => {

      if(category==='My Customers'){
          const selectedCustomer = this.props.customerList.filter((item) => {
              if(item.listName === title ) {
                  return item;
              }
          });

          this.props.toggleSelectedCustomerForGraph(selectedCustomer[0])
      }else{

          const id = category+'_'+title
          const isAlreadyInGraph = this.props.selectedMarketSelectorsForGraph.filter(item => item.id===id)
          if(this.props.selectedMarketSelectorsForGraph.length===3 && isAlreadyInGraph.length===0){
              this.props.showWarning("You can select only up to 3 sectors")
          }else{
              const selectedMarket = this.props.mySectors.filter((market) => {
                  if(market.key === title && market.type===category) {
                      return market;
                  }
              });
              this.props.toggleSelectedMarkets(selectedMarket[0]);
          }


      }


  }

  removeCard(title, category){


      if(category!=='My Customers'){
          const selectedMarket = this.props.mySectors.filter((market) => {
              if(market.key === title && market.type===category) {
                  return market;
              }
          });
          this.props.deleteSavedSectorData(selectedMarket[0].id);
          this.props.removeSelectedMarket(selectedMarket[0]);
      }else {
          const selectCus = this.props.customerList.filter((item)=>{
              return item.listName===title
          })
            this.props.deleteCustomerList(selectCus[0].listId)
      }

  }

    getImageUrl =(name)=>{
        return 'https://logo.clearbit.com/'+name.toLowerCase()+'.com';
    }

    addDefaultSrc =(ev) =>{
        ev.target.src = defaultImage
    }

  render() {
    const title = get(this.props, 'title', 'Title');

    let showClose =true;
    const category = get(this.props, 'category', 'CATEGORY');
    const subCategory = get(this.props, 'subCategory', 'subCat');

      let count1_label ='Companies'
      let count2_label = 'Records';
      let count1 =0
      let count2 =0
      let countCompany = 0
    if(category==='My Customers'){
         count1 = this.props.companiesCount;
         count2  =this.props.hits

    }else{
         count1_label = get(CARD_COUNT_LABELS[category], 'count1', 'N/A');
         count1 = get(this.props, count1_label, '0');
         count2_label = get(CARD_COUNT_LABELS[category], 'count2', 'N/A');
         count2 = get(this.props, count2_label, '0.0');
        countCompany = get(this.props, 'Companies', '0');
    }
      return (
          <div
              key={this.props.category+'_card_'+title}
              className={"card-block " + (this.props.isSeleted && 'active')}
              onClick={(e) => {e.stopPropagation();  this.onChecked(title, category) }}>
              {(showClose)?<i className="ib-icon-close card-delete-button" onClick={(e)=>{e.stopPropagation(); this.removeCard(title, category) }} />:null}
              <div className="card-control-button">
                  <img className="check-sign" alt="" src="/static/images/checked.png"></img>
              </div>
              <div className="card-content-area">
                  <span className="card-title">
                    {title}
                  </span>
                  {category==='My Customers'?<span className="card-date">Created On: {Moment(this.props.created).format('MMM D, YYYY h:mm a')}</span>:null}
                  <Tile content={(category==='parent')?'parent category':category} /> <a href="#"  onClick={(e) => {e.stopPropagation(); e.preventDefault();  this.props.onClickViewList(title, category) }} className="link-view-list">
                  View Details
              </a>
                  <div className="card-info-section">
                      <div className="card-info-subsection">
                          <span className="card-info-subsection-caption">
                            # {count1_label}
                          </span>
                          <span className="card-info-subsection-value">
                            {count1}
                          </span>



                      </div>
                      <div className="card-info-subsection">
              <span className="card-info-subsection-caption">
                # {count2_label}
              </span>
                          <span className="card-info-subsection-value">
                {count2}
              </span>
                      </div>
                      {(category!=='vendor')?
                          (category !== 'My Customers')?
                          <div className="card-info-subsection">
                          <span className="card-info-subsection-caption">
                            # Companies
                          </span>
                              <span className="card-info-subsection-value">
                            {countCompany}
                      </span>
                          </div>:null
                          :  <img alt="" className="segment-vendor-image pull-right" onError={this.addDefaultSrc} src={this.getImageUrl(title)}/>}


                  </div>
              </div>
          </div>
      );

  }
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  category: PropTypes.string,
  productsCount: PropTypes.number,
  companiesCount: PropTypes.number,
  count1: PropTypes.number,
  count2: PropTypes.number,
};

function mapStateToProps(state) {
  return {
      mySectors: state.mySectors.list,
      selectedMarketSelectorsForGraph: state.selectedMarketSelectors,
      customerList: state.myCustomers.lists,

  };
}

export default connect(mapStateToProps, {toggleSelectedMarkets, removeSelectedMarket, toggleSelectedCustomerForGraph, showWarning, deleteSavedSectorData, deleteCustomerList})(Card);
