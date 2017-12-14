import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {_} from "lodash";
import Slider, {Range} from "rc-slider";
import Modal from "react-responsive-modal";
import CustomBanner from "../common/templates/CustomBanner";
import CategoryList from "./CategoryList";
import CustomerList from "./CustomerList";
import {createFilteredPostArray} from '../../modules/helpers'

import Select from "react-select";
// Be sure to include styles at some point, probably during your bootstrapping
import "react-select/dist/react-select.css";

import {
    addSavedSegment,
    changeStep,
    CP_FILTER_EMPLOYEES,
    CP_FILTER_INDUSTRY,
    CP_FILTER_LOCATION,
    CP_FILTER_REVENUE,
    employeeSliderDataSet,
    employeeSliderDataSetLabels,
    emptyEmployeeFilter,
    emptyFilterData,
    emptyRevenueFilter,
    GetMasterTermFilter,
    makeEmployeeFilterData,
    makeRevenueFilterData,
    masterDataFilter,
    refineSelectedMarkets,
    removeSelectedMarket,
    revenueSliderDataSet,
    revenueSliderDataSetLabels,
    savePostFilteres,
    setGlobalFiltersEmployee,
    setGlobalFiltersIndustry,
    setGlobalFiltersLocation,
    setGlobalFiltersRevenue,
    setGlobalFiltersUnknownEmployee,
    setGlobalFiltersUnknownRevenue
} from "../../actions/MarketSelector";

import {removeSelectedCustomer} from "../../actions/CustomerActions";

import {hideWarning, showWarning, updateViewSidebar} from "../../actions/View";

import {clearClickedSegment, updateClicked, updateClickedSegment, updateReDraw} from "../../actions/ChartActions";
// To include the default styles
import "react-rangeslider/lib/index.css";
import FilterSidebar from "./FilterSideBar";
import BuildSegmentCard from "./BuildSegmentCard";


import "rc-slider/assets/index.css";


import Tooltip from "rc-tooltip";
import {getMasterTermsIndustries, getMasterTermsLocations} from "../../actions/MasterDatas";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import FooterWizard from "../base/FooterWizard";
import {sortAlpha} from "../../modules/helpers";
pdfMake.vfs = pdfFonts.pdfMake.vfs;


const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Handle = Slider.Handle;

const handle = (props) => {

    const {value, dragging, index, ...restProps} = props;
    let revenueSliderDataSetRev = makeReverseOrder(revenueSliderDataSet)

    return (
        <Tooltip
            prefixCls="rc-slider-tooltip"
            overlay={(revenueSliderDataSetRev[value]) ? revenueSliderDataSetRev[value] : 0}
            visible={dragging}
            placement="top"
            key={index}
        >
            <Handle value={value} {...restProps} />
        </Tooltip>
    );
};

const employeeTooltipHandle = (props) => {

    const {value, dragging, index, ...restProps} = props;

    let employeeSliderDataSetRev = makeReverseOrder(employeeSliderDataSet)

    return (
        <Tooltip
            prefixCls="rc-slider-tooltip"
            overlay={(employeeSliderDataSetRev[value]) ? employeeSliderDataSetRev[value] : 0}
            visible={dragging}
            placement="top"
            key={index}
        >
            <Handle value={value} {...restProps} />
        </Tooltip>
    );
};

const makeReverseOrder = (obj) => {

    let revArr = []
    for (let key in obj) {
        revArr[key] = obj[key]
    }
    let newObj = {}
    revArr.reverse()
    let i = 0
    revArr.map(function (obj) {
        newObj[++i] = obj
    })


    //console.log('+++==',newObj)
    return newObj
}


class Segment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            viewFilterSidebar: false,
            selectedMarket: null,
            topCatsForFilter: null,
            productsForFilter: null,
            openExport: false,
            industry: [],
            location: [],
            openDelete: false,
            shouldDeleteMarketId: null,
            shouldDeleteCustomerId: null,
            unknownEmployeeCount: true,
            unknownRevenue: true,
            unknownIndustries : true,
            unknownLocations : true,
            loading: false,
            employeeVolume: [],
            revenueVolume: [],
            filterExpanded: false,
            total: 0
        };
        this.handleIndustrySelectChange = this.handleIndustrySelectChange.bind(this)
        this.handleLocationSelectChange = this.handleLocationSelectChange.bind(this)
    }

    componentDidMount() {
        this.props.changeStep(2)
        this.props.getMasterTermsIndustries();
        this.props.getMasterTermsLocations();


        if (this.props.selectedMarketSelectors.length) {
            this.setState({
                    total: this.props.selectedMarketSelectors.length
                }
            )
        }
        if (this.props.globalFilters) {
            this.setState({
                    employeeVolume: this.props.globalFilters.employeeVolume,
                    revenueVolume: this.props.globalFilters.revenueVolume,
                    industry: this.props.globalFilters.industry,
                    location: this.props.globalFilters.location,
                    unknownEmployeeCount: this.props.globalFilters.unknownEmployeeCount,
                    unknownRevenue: this.props.globalFilters.unknownRevenue
                }, () => {
                    if (this.props.filteredMarketSelectors.length === 0) {
                        this.props.selectedMarketSelectors.map((market) => {
                            this.props.GetMasterTermFilter(market, this.createPostArray())
                        })
                    }
                }
            )
        }

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedMarketSelectors.length !== this.state.total) {
            this.setState({total: nextProps.selectedMarketSelectors.length}, () => {

            })
        }
    }


    checkLoading = () => {
        if (this.state.loading) {
            return true;
        } else if (this.state.total !== this.props.filteredMarketSelectors.length) {
            return true;
        } else {
            return false;
        }
    }


    /**
     * Delete (market sector OR customers list) functions
     * */
    onCloseDeleteModal = () => {
        this.setState({openDelete: false, shouldDeleteMarketId: null, shouldDeleteCustomerId: null});
    }

    onClickRemoveCard = (key, id) => {
        this.setState({openDelete: true, shouldDeleteMarketId: {key: key, id: id}});

    }

    onClickRemoveCustomerCard = (key) => {
        this.setState({openDelete: true, shouldDeleteCustomerId: {key: key}});
    }

    onConfirmDelete = () => {
        if (this.state.shouldDeleteMarketId !== null) {
            this.props.removeSelectedMarket(this.state.shouldDeleteMarketId)
        }
        if (this.state.shouldDeleteCustomerId !== null) {
            this.props.removeSelectedCustomer(this.state.shouldDeleteCustomerId)
        }
        this.onCloseDeleteModal();
    }


    /**
     * Add sector on build segment page
     * */
    onClickAddSectors = () => {
        //add sector list will have selected elements but not in filtered list, so clear them
        this.props.refineSelectedMarkets()

        this.props.updateViewSidebar('add_sector');
    }

    /**
     * Add customer list on build segment page
     * */
    onClickAddCustomerList = () => {
        this.props.updateViewSidebar('add_customer_for_graph');
    }
    /**
     * On click "Chart"
     * */
    showChart = (e) => {


        this.makeEmployeeFilterData();
        this.makeRevenueFilterData();

        if (this.props.selectedMarketSelectors.length) {
            if (this.props.name === "" || this.props.description === "") {
                e.preventDefault()
                this.props.showWarning("Warning: Segment name and description is required to continue.")
            } else {

                this.props.savePostFilteres(this.createPostArray())
                this.props.hideWarning();
                this.props.updateReDraw(true)
            }
        } else {
            e.preventDefault()
            this.props.showWarning("Warning: Select either one sector.")
        }


    }

    makeEmployeeFilterData = () => {

        this.props.emptyEmployeeFilter();
        const globalFilters = this.createPostArray()
        this.props.filteredMarketSelectors.map((sector) => {
            let postArr = createFilteredPostArray(sector, globalFilters)
            this.props.makeEmployeeFilterData(postArr);
        });
    }

    makeRevenueFilterData = () => {

        this.props.emptyRevenueFilter();
        const globalFilters = this.createPostArray()
        this.props.filteredMarketSelectors.map((sector) => {
            let postArr = createFilteredPostArray(sector, globalFilters)
            this.props.makeRevenueFilterData(postArr);
        });
    }

    /**
     * Before open right panel get data need to display
     * Do it only once of one market item
     * **/
    openSidebar = (id) => {

        this.props.hideWarning()

        const selectedMarket = this.props.selectedMarketSelectors.filter((market) => {
            if (market.id === id) {
                return market;
            }
        });
        this.setState({selectedMarket: selectedMarket[0]}, () => {

            //check the market item is already on filteredMarketSelectors
            let isInFilter = this.props.filteredMarketSelectors.filter((market) => {
                if (market.id === id) {
                    return market;
                }
            });
            if (isInFilter.length === 0 || isInFilter[0].productList === undefined) { // if not already, then loaded get data
                this.props.GetMasterTermFilter(this.state.selectedMarket, this.createPostArray())
            }
            this.setState({viewFilterSidebar: true})

        })
    }

    /**
     * On close Filter Sidebar right panel
     * **/
    closeFilterSidebar = () => {
        this.setState({
            viewFilterSidebar: false,
            selectedMarket: null
        });
    }

    /**
     * Show selected markets
     **/


    renderSelectedMarketSelectors = () => {
        let self = this
        return this.props.selectedMarketSelectors.map((selector) => {
            return (
                <BuildSegmentCard key={'BuildSegmentCard_' + selector.id}
                                  openSidebar={self.openSidebar}
                                  selector={selector}
                                  onClickRemoveCard={self.onClickRemoveCard}/>
            );
        });
    };

    renderSelectedCustomers = () => {
        let self = this
        return this.props.customerSelectedForGraph.map((customer) => {
            return (
                <BuildSegmentCard key={'BuildSegmentCard_customer_' + customer.listName}
                                  openSidebar={null}
                                  selector={customer}
                                  category="My Customers"
                                  onClickRemoveCard={self.onClickRemoveCustomerCard}/>
            );
        })
    }


    handleIndustrySelectChange(value) {
        let newIndustryValue = []
        if (value.length > 0) {
            if (value[value.length - 1].value === 'unselect-all') {
                newIndustryValue = []
            } else if (value[value.length - 1].value === 'select-all') {
                newIndustryValue = this.props.industries.map(function (option) {
                    return {value: option.key, label: option.key}
                })
            } else {
                newIndustryValue = value
            }
        } else {
            newIndustryValue = value
        }

        this.props.setGlobalFiltersIndustry(newIndustryValue)

        this.setState({industry: newIndustryValue},()=>{
            this.filterSelectedSectors()
        });

    }

    handleLocationSelectChange(value) {
        let newLocationValue = []
        if (value.length > 0) {

            if (value[value.length - 1].value === 'unselect-all') {
                newLocationValue = []
            } else if (value[value.length - 1].value === 'select-all') {
                newLocationValue = this.props.locations.map(function (option) {
                    return {value: option.key, label: option.key}
                })
            } else {
                newLocationValue = value
            }
        } else {
            newLocationValue = value
        }

        this.props.setGlobalFiltersLocation(newLocationValue)
        this.setState({location: newLocationValue},()=>{
            this.filterSelectedSectors()
        });

    }

    handleOnChangeRevenue = (value) => {
        this.props.setGlobalFiltersRevenue(value)
        this.setState({
            revenueVolume: value
        },()=>{
            this.filterSelectedSectors()
        })

    }

    handleOnChangeEmployees = (value) => {
        this.props.setGlobalFiltersEmployee(value)
        this.setState({
            employeeVolume: value
        },()=>{
            this.filterSelectedSectors()
        })

    }

    handleUnknownCheckboxChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        if (name === 'unknownRevenue') this.props.setGlobalFiltersUnknownRevenue(value)
        if (name === 'unknownEmployeeCount') this.props.setGlobalFiltersUnknownEmployee(value)
        this.setState({
            [name]: value
        }, () => {
            this.filterSelectedSectors()
        });

    }

    createPostArray(key = null, type = null) {

        let {
            revenueVolume,
            employeeVolume,
            industry,
            location,
            unknownEmployeeCount,
            unknownRevenue,
            unknownIndustries,
            unknownLocations
        } = this.state

        let revenueValue = revenueVolume;
        let employeeValue = employeeVolume;

        // create industry array to post
        let industryValue = industry.map((i) => {
            return i.value
        });

        if(industryValue.length>0){
            if(unknownIndustries){
                industryValue.push('Unknown')
            }
        }

        // create location array to post
        let locationValue = location.map((i) => {
            return i.value
        });

        if(locationValue.length>0){
            if(unknownLocations){
                locationValue.push('Unknown')
            }
        }


        const postArr = []

        let typeFilter = (type === "parent") ? "categoryParent" : type

        // set revenue filter values
        let revenueSearchQry = [];
        let revenueSliderDataSetLabelsRev = makeReverseOrder(revenueSliderDataSetLabels)
        for (var rev in revenueSliderDataSetLabelsRev) {
            if ((rev == revenueValue[0] || rev > revenueValue[0]) && (rev < revenueValue[1])) {
                revenueSearchQry.push(revenueSliderDataSetLabelsRev[rev])
            }
        }
        if (unknownRevenue) {
            revenueSearchQry.push('Unknown')
        }

        // set employee filter values
        let employeeSearchQry = [];
        let employeeSliderDataSetLabelsRev = makeReverseOrder(employeeSliderDataSetLabels)
        for (var emp in employeeSliderDataSetLabelsRev) {
            if ((emp == employeeValue[0] || emp > employeeValue[0]) && (emp < employeeValue[1])) {
                employeeSearchQry.push(employeeSliderDataSetLabelsRev[emp])
            }
        }

        if (unknownEmployeeCount) {
            employeeSearchQry.push('Unknown')
        }

        if (typeFilter !== null) {
            postArr.push({
                fieldName: typeFilter,
                fieldValues: [key]
            });


        }




        if (revenueSearchQry && revenueSearchQry.length != 0) {
            postArr.push({
                fieldName: CP_FILTER_REVENUE,
                fieldValues: revenueSearchQry
            });
        }
        if (employeeSearchQry && employeeSearchQry.length != 0) {
            postArr.push({
                fieldName: CP_FILTER_EMPLOYEES,
                fieldValues: employeeSearchQry
            });
        }
        if (industryValue && industryValue.length != 0) {
            postArr.push({
                fieldName: CP_FILTER_INDUSTRY,
                fieldValues: industryValue
            });
        }
        if (locationValue && locationValue.length != 0) {
            postArr.push({
                fieldName: CP_FILTER_LOCATION,
                fieldValues: locationValue
            });
        }

        return postArr;
    }

    filterSelectedSectors() {

        this.props.showWarning("Warning: Changing above filters will reset selected market segments, according to new filtering", 'Warning')
        this.props.selectedMarketSelectors.map((sector) => {
            let postArr = this.createPostArray(sector.key, sector.type)

            this.props.masterDataFilter(postArr, sector.type)
        })

        this.props.emptyFilterData();
    }

    toggleFilter = () => {
        this.setState({filterExpanded: !this.state.filterExpanded})
    }

    renderFilterArea = () => {
        let {
            revenueVolume,
            employeeVolume,
            industry,
            location,
            unknownRevenue,
            unknownEmployeeCount,
            unknownIndustries,
            unknownLocations
        } = this.state

        let industryList = this.props.industries
        let locationsList = this.props.locations
        let industriesOptions = []
        let locationOptions = []

        if (industryList) {
            industriesOptions.push({value: 'select-all', label: 'Select all'})
            sortAlpha(industryList, 'key').map(function (option) {
                industriesOptions.push({value: option.key, label: option.key})
            })

            industriesOptions.push({value: 'unselect-all', label: 'Un-select all'})
        }


        if (locationsList) {
            locationOptions.push({value: 'select-all', label: 'Select all'})
            sortAlpha(locationsList, 'key').map(function (option) {
                locationOptions.push({value: option.key, label: option.key})
            })

            locationOptions.push({value: 'unselect-all', label: 'Un-select all'})
        }

        if (this.props.location.query.type !== 'chart') {
            return (
                <div className="filter-area">
                    <div
                        className={(this.state.filterExpanded) ? 'filter-content' : 'filter-content collapse'}>
                        <div className="filter-filterby">
                            <p className="filterby-title">
                                Filter by
                            </p>

                            {/*new*/}
                            <div className="filters-row">
                                <div className="filters-column">

                                    <div className="filter-label label">
                                        <span>Revenue</span>
                                    </div>
                                    <div className="filter-input filterby-filter-bar">

                                        <Range
                                            defaultValue={revenueVolume}
                                            onAfterChange={this.handleOnChangeRevenue}
                                            marks={makeReverseOrder(revenueSliderDataSetLabels)}
                                            step={1}
                                            max={9}
                                            min={1}
                                            handle={handle}
                                        />
                                        <div className="label-set">
                                            <label>
                                                <input
                                                    className="checkbox"
                                                    name="unknownRevenue"
                                                    type="checkbox"
                                                    checked={unknownRevenue}
                                                    onChange={this.handleUnknownCheckboxChange.bind(this)}/>
                                                Include Unknown</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="filters-column">
                                    <div className="filter-label label">
                                        <span>Employees</span>
                                    </div>
                                    <div className="filter-input filterby-filter-bar">
                                        <Range
                                            defaultValue={employeeVolume}
                                            onAfterChange={this.handleOnChangeEmployees}
                                            handle={employeeTooltipHandle}
                                            marks={makeReverseOrder(employeeSliderDataSetLabels)}
                                            step={1}
                                            max={9}
                                            min={1}
                                        />
                                        <div className="label-set">
                                            <label>
                                                <input
                                                    className="checkbox"
                                                    name="unknownEmployeeCount"
                                                    type="checkbox"
                                                    checked={unknownEmployeeCount}
                                                    onChange={this.handleUnknownCheckboxChange.bind(this)}/>
                                                Include Unknown</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="filters-column2">
                                    <div className="filter-label label">
                                        <span>Vertical</span>
                                    </div>
                                    <div className="filter-input">
                                        <Select
                                            name="form-field-name-industry"
                                            options={industriesOptions}
                                            onChange={this.handleIndustrySelectChange}
                                            multi={true}
                                            value={industry}
                                            placeholder="All"
                                        />
                                        <div className="label-set">
                                            <label>
                                                <input
                                                    className="checkbox"
                                                    name="unknownIndustries"
                                                    type="checkbox"
                                                    checked={unknownIndustries}
                                                    onChange={this.handleUnknownCheckboxChange.bind(this)}/>
                                                Include Unknown</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="filters-column">
                                    <div className="filter-label label">
                                        <span>Countries</span>
                                    </div>
                                    <div className="filter-input ">
                                        <Select
                                            name="form-field-name-location"
                                            options={locationOptions}
                                            onChange={this.handleLocationSelectChange}
                                            multi={true}
                                            value={location}
                                            placeholder="All"
                                        />
                                        <div className="label-set">
                                            <label>
                                                <input
                                                    className="checkbox"
                                                    name="unknownLocations"
                                                    type="checkbox"
                                                    checked={unknownLocations}
                                                    onChange={this.handleUnknownCheckboxChange.bind(this)}/>
                                                Include Unknown</label>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>

                    </div>
                    <div onClick={() => this.toggleFilter()} className="filters-visible-button btn btn btn-orange">
                        {(this.state.filterExpanded)
                            ? <div>FILTERS<i className="ib-icon-arrow-up spread-trigger"/></div>
                            : <div>FILTERS<i className="ib-icon-arrow-down spread-trigger"/></div>
                        }

                    </div>
                </div>
            )
        }
    }

    render() {

        let {revenueVolume, employeeVolume} = this.state

        return (
            <div>
                {(this.checkLoading()) ? <div className="preloader"></div> : null}
                <CustomBanner onClickAddSectors={this.onClickAddSectors}
                              onClickAddCustomerList={this.onClickAddCustomerList}/>
                <div className="main-content">
                    {
                        this.props.sidebar === 'add_sector' && (
                            <CategoryList
                                directToFiltered={true}
                                postArray={this.createPostArray()}
                            />
                        )
                    }
                    {
                        this.props.sidebar === 'add_customer_for_graph' && (
                            <CustomerList
                                directToFiltered={true}
                            />
                        )
                    }
                    {(this.state.viewFilterSidebar) ? <FilterSidebar
                        selectedMarket={this.state.selectedMarket}
                        createPostArray={() => this.createPostArray()}
                        closeFilterSidebar={() => this.closeFilterSidebar()}

                    /> : null}

                    {(revenueVolume.length>0 && employeeVolume.length>0)? this.renderFilterArea():''}

                    <div>{this.renderSelectedMarketSelectors()} {this.renderSelectedCustomers()}</div>


                    <div ref="htmtopdfpdf">
                        <img ref="img1" src=""/>
                        <img ref="img2" src=""/>
                        <img ref="img3" src=""/>
                    </div>

                    <Modal open={this.state.openDelete} onClose={this.onCloseDeleteModal} overlayClassName={"small"}
                           little>
                        <div className="model-title">
                            <h2>Confirm Delete</h2>
                        </div>
                        <div className="model-content">
                            Are you sure you want to
                            delete {this.state.shouldDeleteMarketId ? this.state.shouldDeleteMarketId.key : ''}
                            {this.state.shouldDeleteCustomerId ? this.state.shouldDeleteCustomerId.key : ''}
                        </div>
                        <div className="model-buttons btn-group pull-right">
                            <button className="btn btn-green pull-right" onClick={this.onConfirmDelete}>Yes</button>
                            <button className="btn btn-gray pull-right" onClick={this.onCloseDeleteModal}>No</button>
                        </div>
                    </Modal>
                </div>
                <FooterWizard onButtonClick={this.showChart}/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        selectedMarketSelectors: state.selectedMarketSelectors,
        filteredMarketSelectors: state.selectedSegment.filteredMarketSelectors,
        industries: state.masterData.industries,
        locations: state.masterData.locations,
        chartActions: state.chartReducer,
        sidebar: state.view.sidebar,
        employeeFilters: state.selectedSegment.chartData.employeeFilters,
        revenueFilters: state.selectedSegment.chartData.revenueFilters,
        chartData: state.selectedSegment.chartData.venn,
        totalData: state.selectedSegment.totalData,
        customerSelectedForGraph: state.myCustomers.selectedForGraph,
        name: state.selectedSegment.name,
        description: state.selectedSegment.description,
        globalFilters: state.selectedSegment.globalFilters.stateData
    };
}

function mapDispatchToProps(dispatch) {

    return bindActionCreators({
        GetMasterTermFilter: GetMasterTermFilter,
        getMasterTermsLocations: getMasterTermsLocations,
        getMasterTermsIndustries: getMasterTermsIndustries,
        masterDataFilter: masterDataFilter,
        emptyFilterData: emptyFilterData,
        showWarning: showWarning,
        hideWarning: hideWarning,
        updateReDraw: updateReDraw,
        updateClickedSegment: updateClickedSegment,
        updateClicked: updateClicked,
        removeSelectedMarket: removeSelectedMarket,
        updateViewSidebar: updateViewSidebar,
        refineSelectedMarkets: refineSelectedMarkets,
        emptyEmployeeFilter: emptyEmployeeFilter,
        emptyRevenueFilter: emptyRevenueFilter,
        addSavedSegment: addSavedSegment,
        removeSelectedCustomer: removeSelectedCustomer,
        clearClickedSegment: clearClickedSegment,
        makeEmployeeFilterData,
        makeRevenueFilterData,
        changeStep,
        savePostFilteres: savePostFilteres,
        setGlobalFiltersEmployee,
        setGlobalFiltersIndustry,
        setGlobalFiltersLocation,
        setGlobalFiltersRevenue,
        setGlobalFiltersUnknownEmployee,
        setGlobalFiltersUnknownRevenue
    }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Segment);
