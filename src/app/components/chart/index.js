import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {_} from "lodash";
import {Link} from "react-router";
import html2canvas from "html2canvas";
import ExportToPlatform from "../segment/Export";
import CustomBanner from "../common/templates/CustomBanner";
// Be sure to include styles at some point, probably during your bootstrapping
import "react-select/dist/react-select.css";

import {
    addSavedSegment,
    emptyEmployeeFilter,
    emptyFilterData,
    emptyRevenueFilter,
    refineSelectedMarkets,
    removeSelectedMarket,

    changeStep
} from "../../actions/MarketSelector";

import {removeSelectedCustomer} from "../../actions/CustomerActions";

import {updateViewSidebar, showWarning, hideWarning} from "../../actions/View";

import {clearClickedSegment, updateClicked, updateClickedSegment, updateReDraw} from "../../actions/ChartActions";
import {CP_FILTER_INDUSTRY, CP_FILTER_LOCATION} from "../../actions/MarketSelector";
// To include the default styles
import "react-rangeslider/lib/index.css";
import SegmentVennDiagram from "./SegmentVennDiagram";
import FilterChart from "./FilterChart";
import BuildSegmentCard from "../segment/BuildSegmentCard";
import FooterWizard from '../base/FooterWizard';
import "rc-slider/assets/index.css";
import {getMasterTermsIndustries, getMasterTermsLocations} from "../../actions/MasterDatas";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;


class Chart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            viewFilterSidebar: false,
            selectedMarket: null,
            topCatsForFilter: null,
            productsForFilter: null,
            openExport: false,
            currentTab: 'chart', // Default Tab
            industry: [],
            location: [],
            openDelete: false,
            shouldDeleteMarketId: null,
            shouldDeleteCustomerId:null,
            unknownEmployeeCount : false,
            unknownRevenue :false,
            loading:false
        };

    }

    componentWillMount() {

    }

    componentDidMount() {
        this.props.changeStep(3)
        this.props.getMasterTermsIndustries();
        this.props.getMasterTermsLocations();

        if(this.props.filteredMarketSelectors.length===0){
            this.props.selectedMarketSelectors.map((market) => {
                this.props.GetMasterTermFilter(market)
            })
        }



    }

    componentWillReceiveProps(nextProps){


    }

    /**
     * Export data functions
     * **/
    onOpenExportModal = () => {
        console.log('onOpenExportModal')
        this.setState({openExport: true});
    }

    exportSelected = (e) => {
        console.log('exportSelected')
        e.preventDefault();
        //TODO:: export data when API is ready
        this.onOpenExportModal()
    }

    onCloseExportModal = () => {
        this.setState({openExport: false});
        this.props.clearClickedSegment()
        this.props.updateReDraw(true)
    }

    clearSelected =() =>{
        this.props.clearClickedSegment()
        this.props.updateReDraw(true)
    }

    onClickRemoveCard = (key, id) => {
        this.setState({openDelete: true, shouldDeleteMarketId: {key: key, id: id}});

    }


    /**
     * Export chart data to pdf
     * */
    exportToPdf = () => {

        const self = this
        const pdfName = this.props.name !== '' ? this.props.name + '.pdf' : 'chart_data.pdf'
        const currentTab = this.state.currentTab
        const title = (this.props.name !== '') ? this.props.name  : 'Title '
        const desc = (this.props.description !== '') ? this.props.description  : 'Segment escription '

        let vennImage = ''
        let employeeChart = ''
        let revenueChart = ''
        let companiesImage = ''

        this.setState({currentTab: 'all', loading: true}, () => {

            const refs = this.refs
            let industries = 'All'
            let countries = 'All'

            this.props.globalFilters.map((item)=>{
                if(item.fieldName===CP_FILTER_INDUSTRY){
                    industries = item.fieldValues.join(", ")
                }
                if(item.fieldName===CP_FILTER_LOCATION){
                    countries = item.fieldValues.join(", ")
                }
            })


            this.svgToDataUrl(refs.chart_1.getElementsByTagName('svg')[0], (dataUrl) => {
                vennImage = dataUrl;
                html2canvas(refs.chart_2, {
                    onrendered: function (canvas) {
                        employeeChart = canvas.toDataURL("image/png")
                        html2canvas(refs.chart_3, {
                            onrendered: function (canvas) {
                                revenueChart = canvas.toDataURL("image/png")

                                html2canvas(refs.chart_4, {
                                    onrendered: function (canvas) {
                                        companiesImage = canvas.toDataURL("image/png")
                                        self.setState({currentTab: currentTab, loading: false})

                                        let docDefinition = {
                                            content: [
                                                {text: title, style: 'header'},
                                                {text: desc + '\n\n'},
                                                {
                                                    text: [
                                                        {text: 'Vertical: ', style: ['small', 'bold']},
                                                        {text: industries, style: ['small']}
                                                    ]
                                                },
                                                {
                                                    text: [
                                                        {text: 'Countries: ', style: ['small', 'bold']},
                                                        {text: countries, style: ['small']}
                                                    ]
                                                },
                                                {text: '\n'},
                                                {image: companiesImage, width: 350},
                                                {text: '\n'},
                                                {image: vennImage, width: 520},
                                                {text: 'Employees', pageBreak: 'before', style: 'subHeader'},
                                                {image: employeeChart, width: 520},
                                                {text: 'Revenue (USD)', style: 'subHeader'},
                                                {image: revenueChart, width: 520}
                                            ],
                                            styles: {
                                                header: {
                                                    fontSize: 18,
                                                    bold: true
                                                },
                                                subHeader: {
                                                    fontSize: 15,
                                                    bold: true
                                                },
                                                quote: {
                                                    italics: true
                                                },
                                                small: {
                                                    fontSize: 9
                                                },
                                                bold: {
                                                    bold: true
                                                }
                                            }
                                        };
                                        pdfMake.createPdf(docDefinition).download(pdfName);

                                    }
                                });


                            }
                        });

                    }
                });
            });

        })
    }

    /**
     * Show Filtered markets on chart
     **/
    renderFilteredMarketSelectors = () => {
        return this.props.filteredMarketSelectors.map((selector) => {

            let legColor = (selector.legColor) ? selector.legColor : ''
            return (
                <BuildSegmentCard key={'BuildSegmentCard_' + selector.id}
                                  selector={selector}
                                  chart={true}
                                  legendColor={legColor}

                />

            );
        });
    }

    /**
     * Show customers on chart
     **/
    renderFilteredCustomerLists = () => {
        return this.props.customerSelectedForGraph.map((selector) => {
            return (
                <BuildSegmentCard key={'BuildSegmentCard_customer_' + selector.key}
                                  selector={selector}
                                  chart={true}
                                  category="My Customers"
                />

            );
        });
    }

    saveSegment = () => {
        const { selectedSegment } = this.props;
        const data = {...selectedSegment,
            customers: this.props.customerSelectedForGraph,
            selectedMarketSelectorsForGraph: this.props.selectedMarketSelectors
        };
        this.props.addSavedSegment(data, this.props.savedSegments)
    };



    onTabClick = (value) => {
        this.setState({
            currentTab: value,
        });
    }

    svgToDataUrl(svg, callback) {
        let str = new XMLSerializer(), img = new Image();
        str = str.serializeToString(svg);
        let canvas = document.createElement('canvas');
        img.onload = () => {
            canvas.width = img.width; canvas.height = img.height;
            canvas.getContext("2d").drawImage(img,0,0);
            callback(canvas.toDataURL("image/png"));
        };
        img.src = 'data:image/svg+xml;base64,' + window.btoa(str);
    }



    renderChart = () => {
        const current_tab = this.state.currentTab;
        return (
            <div className="page--home">
                <div className="tabbar">
                    <div className="tabbar-menus">
                        <a className={"tabbar-menu-item " + (current_tab === "chart" && ("active"))}
                           onClick={this.onTabClick.bind(this, "chart")}>CHART</a>
                        <a className={"tabbar-menu-item " + (current_tab === "employees" && ("active"))}
                           onClick={this.onTabClick.bind(this, "employees")}>EMPLOYEES</a>
                        <a className={"tabbar-menu-item " + (current_tab === "revenue" && ("active"))}
                           onClick={this.onTabClick.bind(this, "revenue")}>REVENUE (USD)</a>
                    </div>

                </div>
                <div className="main-content">
                    <div className={"content-area " + ((current_tab === "chart"|| current_tab === "all")?'':'hidden')}>
                        <div  className="chart-wrapper">
                            <div   className="chart-container">
                                <div className="btn-group export-button clearfix text-right vennHeader">
                                    {this.props.chartActions.clicked ? <div><Link to={'build'} onClick={this.exportSelected}
                                                                                  className="btn export-btn pull-right">
                                        <i className="ib-icon-export"></i> Export to Fusiongrove</Link>
                                        <span  onClick={this.clearSelected}
                                               className="btn export-btn pull-right">
                                            <i className="ib-icon"></i> Clear</span>
                                    </div> : null}
                                </div>
                                <div ref="chart_1" className="vennDiv">
                                    <SegmentVennDiagram resetRedrow={() => {
                                        this.props.updateReDraw(false)
                                    }}/>
                                </div>

                            </div>
                            <div className="chart-details">
                                <h4>Companies in Segment</h4>
                                <div ref="chart_4"  className="segment-companies">
                                    {this.renderFilteredMarketSelectors()}
                                    {this.renderFilteredCustomerLists()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"content-area home-sectors " + ((current_tab === "employees" || current_tab === "all")?'':'hidden')}>
                        <div  className="chart-wrapper">
                            <div ref="chart_2" className="chart-container">
                                {this.props.employeeFilters.length && <FilterChart id="employee-filter-chart" filters={this.props.employeeFilters}/> || <div>Drawing Chart ...</div>}
                            </div>
                            <div className="chart-details">
                                <h4>Companies in Segment</h4>
                                <div ref="chart_4"  className="segment-companies">
                                    {this.renderFilteredMarketSelectors()}
                                    {this.renderFilteredCustomerLists()}
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className={"content-area home-sectors " + ((current_tab === "revenue"|| current_tab === "all")?'':'hidden')}>
                        <div className="chart-wrapper">
                            <div ref="chart_3" className="chart-container">
                                {this.props.revenueFilters.length && <FilterChart id="revenue-filter-chart" filters={this.props.revenueFilters}/> || <div>Drawing Chart ...</div>}
                            </div>
                            <div className="chart-details">
                                <h4>Companies in Segment</h4>
                                <div ref="chart_4"  className="segment-companies">
                                    {this.renderFilteredMarketSelectors()}
                                    {this.renderFilteredCustomerLists()}
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        );
    }

    render() {
        return (
            <div>

                {(this.state.loading || this.props.requesting)?<div className="preloader"></div>:null}
                {((this.props.chartData.length < this.props.totalData) )?<div className="preloader"></div>:null}
                {(this.state.openExport) ? <ExportToPlatform
                    closePanel={() => this.onCloseExportModal()}

                /> : null}
                <CustomBanner title=""/>

                <div className="main-content">

                    { this.renderChart() }

                    <div ref="htmtopdfpdf">
                        <img ref="img1" src=""/>
                        <img ref="img2" src=""/>
                        <img ref="img3" src=""/>
                    </div>
                </div>
                <FooterWizard saveSegment={this.saveSegment} exportToPdf= {this.exportToPdf} chartDataLength={this.props.chartData.length} totalData={this.props.totalData} />
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
        warning: state.selectedSegment.warning,
        chartActions: state.chartReducer,
        sidebar: state.view.sidebar,
        employeeFilters: state.selectedSegment.chartData.employeeFilters,
        revenueFilters: state.selectedSegment.chartData.revenueFilters,
        chartData : state.selectedSegment.chartData.venn,
        totalData : state.selectedSegment.totalData,
        customerSelectedForGraph: state.myCustomers.selectedForGraph,
        name:state.selectedSegment.name,
        description:state.selectedSegment.description,
        selectedSegment: state.selectedSegment,
        globalFilters: state.selectedSegment.globalFilters.postData,
        requesting:state.selectedSegment.requesting,
        savedSegments : state.mySavedSegments
    };
}

function mapDispatchToProps(dispatch) {

    return bindActionCreators({
        getMasterTermsLocations: getMasterTermsLocations,
        getMasterTermsIndustries: getMasterTermsIndustries,
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
        changeStep
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Chart);
