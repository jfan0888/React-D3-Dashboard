import React, { Component } from 'react';
import { connect } from 'react-redux';
import Moment from 'moment'
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { updateSidebarSpread, updateViewSidebar } from '../../actions/View';
import ReactFileReader from "react-file-reader";
import {addCustomers} from '../../actions/CustomerActions'
import {LOGGEDIN_USER_UUID} from '../../constants'
import uuid from "uuid/v1";

/**
 * Add customer side bar
 * **/
class Sidebar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            customers: [],
            listName: '',
            listDescription: '',
            errors:[],
            saveList:false
        };
    }

    componentDidMount() {
        this.createInitCustomers(5)
        this.props.updateSidebarSpread(true);
    }

    closeEvent = () => {
        this.props.updateSidebarSpread(false);
        this.props.updateViewSidebar('');
    }

    createEmptyCustomer = () => {
        return (
            {
                'country': '',
                'name': '',
                'url': ''
            }
        )
    }

    createInitCustomers = (count) => {
        const cus = this.createEmptyCustomer()
        let cusList = []
        for (let i = 1; i <= count; i++) {
            cusList.push(cus)
        }
        this.setState({
            customers: cusList,
        });
    }


    addMoreCustomer = () => {
        const cus = this.createEmptyCustomer()
        const currentCus = this.state.customers
        currentCus.push(cus)
        this.setState({
            customers: currentCus,
        });
    }

    processCSVData = (allText) => {
        let allTextLines = allText.split(/\r\n|\n/);
        let lines = [];
        for (let i = 0; i < allTextLines.length; i++) {
            let data = allTextLines[i].split(',');
            let cus = this.createEmptyCustomer()
            cus = {
                'country': (data[0] !== undefined && data[0] != '') ? data[0].replace(/^"(.+(?="$))"$/, '$1') : '',
                'name': (data[1] !== undefined && data[1] != '') ? data[1].replace(/^"(.+(?="$))"$/, '$1') : '',
                'url': (data[2] !== undefined && data[2] != '') ? data[2].replace(/^"(.+(?="$))"$/, '$1') : ''
            }
            lines.push(cus);
        }
        this.setState({
            customers: lines,
        });
    }

    importXLS = files => {
        this.setState({
            customers: [],
            inputMethod: false,
        }, () => {
            let self = this
            let reader = new FileReader();
            reader.onload = function (e) {
                // Use reader.result
                self.processCSVData(reader.result)
            }
            reader.readAsText(files[0]);
        });


    }


    handleChangeListName = (event) => {
        this.setState({listName: event.target.value},()=>{
            if(this.state.saveList)
                this.validateForm()
        });
    }

    handleChangeListDescription = (event) => {
        this.setState({listDescription: event.target.value},()=>{
            if(this.state.saveList)            this.validateForm()
        });
    }

    handleChangeCustomerCountryChange = (event) => {
        let data = event.target.name.split('_')
        const currentCus = this.state.customers
        currentCus[data[1]] = {...currentCus[data[1]], country: event.target.value}
        this.setState({customers: currentCus},()=>{
            if(this.state.saveList)            this.validateForm()
        });
    }

    handleChangeCustomerNameChange = (event) => {
        let data = event.target.name.split('_')
        const currentCus = this.state.customers
        currentCus[data[1]] = {...currentCus[data[1]], name: event.target.value}
        this.setState({customers: currentCus},()=>{
            if(this.state.saveList)            this.validateForm()
        });

    }

    handleChangeCustomerUrlChange = (event) => {
        let data = event.target.name.split('_')
        const currentCus = this.state.customers
        currentCus[data[1]] = {...currentCus[data[1]], url: event.target.value}
        this.setState({customers: currentCus},()=>{
            if(this.state.saveList)            this.validateForm()
        });
    }


    validateCountryNameUrl(customer){
        if((customer.country.trim()!=='' && (customer.name.trim()==='' && customer.url.trim()===''))){
            return false
        }
        if((customer.name.trim()!=='' && (customer.country.trim()==='' && customer.url.trim()===''))){
            return false
        }
        if((customer.url.trim()!=='' && (customer.name.trim()==='' && customer.country.trim()===''))){
            return false
        }
        return true
    }

    validateForm =()=>{
        let errors = []
        let validated =true
        if(this.state.listName.trim()===''){
            validated=false
            errors.listName={hasError:true,message:'* Required'}
        }else{
            let customerListNames = this.props.customerList.map(item=>item.listName)
            if(customerListNames.indexOf(this.state.listName.trim())!== -1){
                validated=false
                errors.listName={hasError:true,message:'List name should be unique'}
            }
        }
        if(this.state.listDescription.trim()===''){
            validated=false
            errors.listDescription=true
        }
        if(this.state.customers.length===0){
            validated=false
            errors.customers={hasError:true,message:'* At least one customer need to be inserted'}

        }else{
            let hasAtleastOne =false
            this.state.customers.map((customer)=>{
                if(customer.country.trim()!=='' && customer.name.trim()!=='' && customer.url.trim()!==''){
                    hasAtleastOne=true;
                }
                if(!this.validateCountryNameUrl(customer)){
                    validated=false
                    errors.customers={hasError:true,message:'* Country, company name and url are required'}
                }
            })

            if(hasAtleastOne===false){
                validated=false
                errors.customers={hasError:true, message:'* At least one customer need to be inserted. Country, company name and url are required'}
            }
        }
        this.setState({errors: errors});
        return (validated)?true:false
    }

    createPostArray =()=>{
        let postArray =[]
        let date = Date()
        const unixdate = Moment(date).format('YYYY-MM-DDTHH:mm:ss')
        let item={}
        const uniqueId = LOGGEDIN_USER_UUID+'_'+uuid()
        this.state.customers.map((customer)=>{
            if(customer.country.trim()!=='' && customer.name.trim()!=='' && customer.url.trim()!==''){
                item ={}
                item.listId = uniqueId
                item.userId = LOGGEDIN_USER_UUID
                item.listName = this.state.listName.trim()
                item.listDescription = this.state.listDescription.trim()
                item.url = customer.url.trim()
                item.company = customer.name.trim()
                item.country = customer.country.trim()
                item.created_at = unixdate
                postArray.push(item)
            }


        })
        return postArray
    }

    saveForm = (event) => {
        event.preventDefault();
        this.setState({saveList: true},()=>{
            if(this.validateForm()){
                this.props.addCustomers(this.createPostArray())
                this.closeEvent()
            }
        });

    }

    renderCustomers = () => {
        let customerCount = -1
        if (this.state.customers && this.state.customers.length > 0) {
            return this.state.customers.map((customer) => {
                customerCount++
                return (
                    <tr className="data-column" key={customerCount + '_cutomer'}>
                      <td className="iso-country">
                        <input
                            onChange={this.handleChangeCustomerCountryChange}
                            className="list-name-input input-block"
                            type="text"
                            name={'country_' + customerCount}
                            value={customer.country}/>
                      </td>
                      <td className="company-name">
                        <input onChange={this.handleChangeCustomerNameChange}
                               className="list-name-input input-block" type="text"
                               name={'country_' + customerCount}
                               value={customer.name}/>
                      </td>
                      <td className="url">
                        <input onChange={this.handleChangeCustomerUrlChange}
                               className="list-name-input input-block" type="text"
                               name={'url_' + customerCount}
                               value={customer.url}/>
                      </td>
                    </tr>
                )
            })
        }
    }
    render() {

        return (
            <div className="sidebar">
              <form onSubmit={this.saveForm}>
                  {this.props.spread && (
                      <div className="sidebarwrapper">
                        <div className="sidebarfade"/>
                        <div className="sidebarcontent">
                          <div className="sidebarcontet-innerwrapper">
                            <div className="close-button">
                              <img onClick={this.closeEvent} className="sidebar-close-icon"
                                   src="/static/images/close-icon.png" alt=""/>
                            </div>
                            <div className="add-customer">
                              <p className="add-customer-title">
                                Add Your Customers
                              </p>
                              <div className="customer-lists-area">
                                <div className="customer-list-input">
                                  <p className="list-input-caption">
                                    List Name
                                  </p>
                                  <input className="list-name-input input-block" value={this.state.listName}
                                         onChange={this.handleChangeListName} name="listName"
                                         placeholder="Type list name here"/>
                                    {(this.state.errors && this.state.errors.listName && this.state.errors.listName.hasError)?<span className="error">{this.state.errors.listName.message}</span>:null}


                                </div>
                                <div className="customer-list-input">
                                  <p className="list-input-caption">
                                    List Description
                                  </p>
                                  <input className="list-name-input input-block" value={this.state.listDescription}
                                         onChange={this.handleChangeListDescription}
                                         placeholder="Type description here"/>
                                    {(this.state.errors && this.state.errors.listDescription)?<span className="error">* Required</span>:null}

                                </div>
                              </div>
                              <div className="company-lists-area">
                                <div className="get-lists-icons" onClick={this.xlsImport}>
                                  <img className="xls-import-icon"
                                       src="/static/images/xls-import-active.png"
                                       alt=""/>
                                  <ReactFileReader handleFiles={this.importXLS} fileTypes={'.csv'}>
                                    <span className="button-caption">CSV Import </span>
                                  </ReactFileReader>

                                </div>
                                  {(this.state.errors && this.state.errors.customers && this.state.errors.customers.hasError)?<span className="error">{this.state.errors.customers.message}</span>:null}

                                <div className="company-lists-content">
                                  <div className="company-lists-headers">
                                    <table className="table-minimal add-customer-table">
                                      <thead>
                                      <tr>
                                        <th className="iso-country">ISO Country</th>
                                        <th className="company-name">Company Name</th>
                                        <th className="url"> URL</th>
                                      </tr>
                                      </thead>
                                    </table>
                                  </div>
                                </div>
                                <div className="import-xls-component">
                                  <table className="add-customer-table"><tbody>{this.renderCustomers()}</tbody></table>
                                </div>
                                <div className="addMore" onClick={this.addMoreCustomer}>
                                  <i className="ib-icon-plus"></i> Add More
                                </div>
                                <div className="save-list-area">
                                    {this.props.addingSuccess?<button onClick={this.saveForm} className="save-list-button">SAVE LIST
                                    </button>:null}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                  )}
              </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        spread: state.view.spread,
        addingSuccess:state.myCustomers.addingSuccess,
        customerList: state.myCustomers.lists
    };
}

export default connect(mapStateToProps, {updateSidebarSpread, updateViewSidebar, addCustomers})(Sidebar);
