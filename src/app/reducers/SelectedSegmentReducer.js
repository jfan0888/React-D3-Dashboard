import {
    CP_ADD_CHART_ITEM,
    CP_ADD_SAVED_SEGMENT,
    CP_CHANGE_STEP,
    CP_CLEAR_ID,
    CP_CLEAR_SELECTED_MARKET_SELECTORS,
    CP_EMPTY_CHART_DATA,
    CP_UPDATE_CHART_DATA_COUNT,
    CP_EMPTY_EMPLOYEE_FILTER,
    CP_EMPTY_FILTER_DATA,
    CP_EMPTY_REVENUE_FILTER,
    CP_FILTERED_MARKET_SELECTOR,
    CP_POPULATE_SAVED_SEGMENT,
    CP_REMOVE_SELECTED_MARKET,
    CP_REQUESTING,
    CP_SAVE_FILTER,
    CP_SAVE_POST_FILTERS,
    CP_SELECT_UN_SELECT_PRODUCT,
    CP_STOP_REQUESTING,
    CP_UPDATE_FILTERED_MARKET_SELECTOR_COMPANY_HITS_COUNT,
    CP_UPDATE_FILTERED_MARKET_SELECTOR_PRODUCT_LIST,
    CP_UPDATE_FILTERED_MARKET_SELECTOR_PRODUCT_VENDOR_CAT_COUNT,
    CP_UPDATE_SEGMENT_NAME_AND_DESCRIPTION,
    CP_UPDATE_SHOW_HIDE,
    CP_SET_GLOBAL_FILTERS_EMPLOYEE_VOLUME,
    CP_SET_GLOBAL_FILTERS_REVENUE_VOLUME,
    CP_SET_GLOBAL_FILTERS_UNKNOWN_EMPLOYEE,
    CP_SET_GLOBAL_FILTERS_UNKNOWN_REVENUE,
    CP_SET_GLOBAL_FILTERS_INDUSTRIES,
    CP_SET_GLOBAL_FILTERS_LOCATION,
    CP_SELECT_ALL_ON_FILTERED_PARENT,
    CP_SELECT_ALL_ON_FILTERED_CAT,
    CP_SELECT_ALL_ON_FILTERED_VENDOR,
    CP_UN_SELECT_ALL_ON_FILTERED_PARENT,
    CP_UN_SELECT_ALL_ON_FILTERED_CAT,
    CP_UN_SELECT_ALL_ON_FILTERED_VENDOR,
    CP_INIT_SELECTED_SEGMENT,
    CP_UPDATE_EMPLOYEE_FILTER,
    CP_UPDATE_REVENUE_FILTER,
    CP_UPDATE_FILTERED_SEGMENT_LEGENDS
} from "../actions/MarketSelector";

const InitialState = {
    step: 1,
    id: 0,
    dateSaved: '',
    dateUpdated: '',
    chartData: {
        venn:[],
        employeeFilters: [],
        revenueFilters: []    },
    totalData: 0,
    filteredMarketSelectors: [],

    name: "",
    description: "",
    customers: [],


    requesting: false,
    globalFilters:{
        postData:[],
        stateData: {
            employeeVolume: [0,9],
            revenueVolume: [0,9],
            unknownEmployeeCount: true,
            unknownRevenue: true,
            industry: [],
            location: [],
        }
    }
}

export default function (state = InitialState, action) {
    switch (action.type) {
        case CP_INIT_SELECTED_SEGMENT:
            return InitialState
        case CP_SET_GLOBAL_FILTERS_EMPLOYEE_VOLUME:
            return {...state, globalFilters: {...state.globalFilters, stateData:{...state.globalFilters.stateData,employeeVolume:action.payload }}}
        case CP_SET_GLOBAL_FILTERS_REVENUE_VOLUME:
            return {...state, globalFilters: {...state.globalFilters, stateData:{...state.globalFilters.stateData,revenueVolume:action.payload }}}
        case CP_SET_GLOBAL_FILTERS_UNKNOWN_EMPLOYEE:
            return {...state, globalFilters: {...state.globalFilters, stateData:{...state.globalFilters.stateData,unknownEmployeeCount:action.payload }}}
        case CP_SET_GLOBAL_FILTERS_UNKNOWN_REVENUE:
            return {...state, globalFilters: {...state.globalFilters, stateData:{...state.globalFilters.stateData,unknownRevenue:action.payload }}}
        case CP_SET_GLOBAL_FILTERS_INDUSTRIES:
            return {...state, globalFilters: {...state.globalFilters, stateData:{...state.globalFilters.stateData,industry:action.payload }}}
        case CP_SET_GLOBAL_FILTERS_LOCATION:
            return {...state, globalFilters: {...state.globalFilters, stateData:{...state.globalFilters.stateData,location:action.payload }}}
        case CP_SAVE_POST_FILTERS:
            return {...state, globalFilters: {...state.globalFilters, postData:action.payload}}
        case CP_CHANGE_STEP:
            return {...state, step: action.payload}
        case CP_CLEAR_ID:
            return {...state, id: 0}
        case CP_REQUESTING:
            return {...state, requesting: true}
        case CP_STOP_REQUESTING:
            return {...state, requesting: false}

        case CP_SAVE_FILTER:
            return {
                ...state,
                filteredMarketSelectors: state.filteredMarketSelectors.map(market => market.id === action.payload.id ?
                    {...market, filtered: true} :
                    market
                )
            }



        case CP_FILTERED_MARKET_SELECTOR:
            const fm = state.filteredMarketSelectors.filter((market) => {
                return market.id !== action.payload.id
            })
            fm.push(action.payload)
            return {...state, filteredMarketSelectors: fm}
        case CP_UPDATE_SHOW_HIDE:
            if (action.payload.list === 'categoryList') {
                return {
                    ...state,
                    filteredMarketSelectors: state.filteredMarketSelectors.map(market => market.id === action.payload.id ?
                        {
                            ...market, categoryList: market.categoryList.map(cat => cat.key === action.payload.catKey ?
                            {
                                ...cat,
                                unSelected: !(cat.unSelected),
                                list:cat.list.map(item=> item.key ?{
                                    ...item,
                                    unSelected: !(cat.unSelected)
                                }:item)
                            }

                            : cat)
                        } :
                        market
                    )
                }
            }
            if (action.payload.list === 'vendorList') {
                return {
                    ...state,
                    filteredMarketSelectors: state.filteredMarketSelectors.map(market => market.id === action.payload.id ?
                        {
                            ...market, vendorList: market.vendorList.map(cat => cat.key === action.payload.catKey ?
                            {
                                ...cat,
                                unSelected: !(cat.unSelected),
                                list:cat.list.map(item=> item.key ?{
                                    ...item,
                                    unSelected: !(cat.unSelected)
                                }:item)
                            } : cat)
                        } :
                        market
                    )
                }
            }
        case CP_SELECT_UN_SELECT_PRODUCT:
            if (action.payload.list === 'categoryList') {
                return {
                    ...state,
                    filteredMarketSelectors: state.filteredMarketSelectors.map(market => market.id === action.payload.id ?
                        {
                            ...market, categoryList: market.categoryList.map(cat => cat.key === action.payload.catKey ?
                            {
                                ...cat,
                                list: cat.list.map(pro => pro.key === action.payload.productKey ? {
                                    ...pro,
                                    unSelected: ( (pro.unSelected === undefined || pro.unSelected === false ) ? true : !pro.unSelected)
                                } : pro)

                            } : cat)
                        } :
                        market
                    )
                }

            }
            if (action.payload.list === 'vendorList') {
                return {
                    ...state,
                    filteredMarketSelectors: state.filteredMarketSelectors.map(market => market.id === action.payload.id ?
                        {
                            ...market, vendorList: market.vendorList.map(cat => cat.key === action.payload.catKey ?
                            {
                                ...cat,
                                list: cat.list.map(pro => pro.key === action.payload.productKey ? {
                                    ...pro,
                                    unSelected: ( (pro.unSelected === undefined || pro.unSelected === false ) ? true : !pro.unSelected)
                                } : pro)
                            } : cat)
                        } :
                        market
                    )
                }
            }

        case CP_UPDATE_FILTERED_MARKET_SELECTOR_COMPANY_HITS_COUNT:
            return {
                ...state,
                filteredMarketSelectors: state.filteredMarketSelectors.map(market => market.id === action.payload.id ?
                    {...market, companyCount: action.payload.companyCount, hits: action.payload.hits} :
                    market
                )
            }
        case CP_UPDATE_FILTERED_MARKET_SELECTOR_PRODUCT_VENDOR_CAT_COUNT:
            return {
                ...state,
                filteredMarketSelectors: state.filteredMarketSelectors.map(market => market.id === action.payload.id ?
                    {
                        ...market,
                        productCount: action.payload.productCount,
                        vendorCount: action.payload.vendorCount,
                        categoryCount: action.payload.categoryCount
                    } :
                    market
                )
            }

        case CP_UPDATE_FILTERED_MARKET_SELECTOR_PRODUCT_LIST:

            if (action.payload.type === 'parent') {
                return {
                    ...state,
                    filteredMarketSelectors: state.filteredMarketSelectors.map(market => market.id === action.payload.id ?
                        {
                            ...market,
                            categoryList: market.categoryList.map(cat => cat.key === action.payload.catKey ? {
                                ...cat,
                                list: action.payload.vendors,
                                unSelected: action.payload.inActive
                            } : cat)
                        } :
                        market
                    )
                }
            }
            if (action.payload.type === 'category') {
                return {
                    ...state,
                    filteredMarketSelectors: state.filteredMarketSelectors.map(market => market.id === action.payload.id ?
                        {
                            ...market,
                            vendorList: market.vendorList.map(cat => cat.key === action.payload.catKey ? {
                                ...cat,
                                list: action.payload.products,
                                unSelected: action.payload.inActive
                            } : cat)
                        } :
                        market
                    )
                }
            }
            if (action.payload.type === 'vendor') {
                return {
                    ...state,
                    filteredMarketSelectors: state.filteredMarketSelectors.map(market => market.id === action.payload.id ?
                        {
                            ...market,
                            categoryList: market.categoryList.map(cat => cat.key === action.payload.catKey ? {
                                ...cat,
                                list: action.payload.products,
                                unSelected: action.payload.inActive
                            } : cat)
                        } :
                        market
                    )
                }
            }

        case CP_SELECT_ALL_ON_FILTERED_PARENT:
            return {
                ...state, filteredMarketSelectors:state.filteredMarketSelectors.map(market => market.id === action.payload ?
                    {   ...market,
                        categoryList:market.categoryList.map(cat => cat.key ? {
                            ...cat,
                            unSelected:false,
                            list:cat.list.map(item => item.key ? {...item, unSelected:false}: item)
                        }:cat)
                    }:
                market)
            }

        case CP_UN_SELECT_ALL_ON_FILTERED_PARENT:
            return {
                ...state, filteredMarketSelectors:state.filteredMarketSelectors.map(market => market.id === action.payload ?
                    {   ...market,
                        categoryList:market.categoryList.map(cat => cat.key ? {
                            ...cat,
                            unSelected:true,
                            list:cat.list.map(item => item.key ? {...item, unSelected:true}: item)
                        }:cat)
                    }:
                    market)
            }

        case CP_SELECT_ALL_ON_FILTERED_CAT:
            return {
                ...state, filteredMarketSelectors:state.filteredMarketSelectors.map(market => market.id === action.payload ?
                    {   ...market,
                        vendorList:market.vendorList.map(vendor => vendor.key ? {
                            ...vendor,
                            unSelected:false,
                            list:vendor.list.map(item => item.key ? {...item, unSelected:false}: item)
                        }:vendor)
                    }:
                    market)
            }

        case CP_UN_SELECT_ALL_ON_FILTERED_CAT:
            return {
                ...state, filteredMarketSelectors:state.filteredMarketSelectors.map(market => market.id === action.payload ?
                    {   ...market,
                        vendorList:market.vendorList.map(vendor => vendor.key ? {
                            ...vendor,
                            unSelected:true,
                            list:vendor.list.map(item => item.key ? {...item, unSelected:true}: item)
                        }:vendor)
                    }:
                    market)
            }

        case CP_SELECT_ALL_ON_FILTERED_VENDOR:
            console.log('CP_SELECT_ALL_ON_FILTERED_VENDOR')
            return {
                ...state, filteredMarketSelectors:state.filteredMarketSelectors.map(market => market.id === action.payload ?
                    {   ...market,
                        categoryList:market.categoryList.map(cat => cat.key ? {
                            ...cat,
                            unSelected:false,
                            list:cat.list.map(item => item.key ? {...item, unSelected:false}: item)
                        }:cat)
                    }:
                    market)
            }

        case CP_UN_SELECT_ALL_ON_FILTERED_VENDOR:
            console.log('CP_UN_SELECT_ALL_ON_FILTERED_VENDOR')
            return {
                ...state, filteredMarketSelectors:state.filteredMarketSelectors.map(market => market.id === action.payload ?
                    {   ...market,
                        categoryList:market.categoryList.map(cat => cat.key ? {
                            ...cat,
                            unSelected:true,
                            list:cat.list.map(item => item.key ? {...item, unSelected:true}: item)
                        }:cat)
                    }:
                    market)
            }

        case CP_ADD_CHART_ITEM :

            return {
                ...state,
                requesting: false,
                chartData:{...state.chartData, venn: [...state.chartData.venn, action.payload]}

            }
        case CP_UPDATE_CHART_DATA_COUNT :
            return {
                ...state,
                totalData: action.payload

            }

        case CP_EMPTY_CHART_DATA :
            return {
                ...state,
                chartData:{...state.chartData, venn:[]}

            }

        case CP_EMPTY_FILTER_DATA :

            return {
                ...state, filteredMarketSelectors: []
            }

        case CP_CLEAR_SELECTED_MARKET_SELECTORS :

            return {
                ...state,
                chartData: {venn:[], employeeFilters:[], revenueFilters:[]},
                totalData: 0

            }

        case CP_EMPTY_EMPLOYEE_FILTER :

            return {
                ...state, chartData:{...state.chartData, employeeFilters: []}
            }

        case CP_EMPTY_REVENUE_FILTER :

            return {
                ...state, chartData:{...state.chartData,revenueFilters: []}
            }

        case CP_UPDATE_EMPLOYEE_FILTER :
            return {
                ...state,chartData:{...state.chartData, employeeFilters: [...state.chartData.employeeFilters, action.payload]}
            }

        case CP_UPDATE_REVENUE_FILTER :

            return {
                ...state,chartData:{...state.chartData,  revenueFilters: [...state.chartData.revenueFilters, action.payload]}
            }

        case CP_REMOVE_SELECTED_MARKET :
            const shouldRemoveItem = action.payload.id.split("_")
            const shouldRemoveItemType = shouldRemoveItem[0] === 'parent' ? 'categoryParent' : shouldRemoveItem[0]
            return {
                ...state,
                filteredMarketSelectors: (state.filteredMarketSelectors.filter((market) => {
                    return market.id !== action.payload.id
                })),
                chartData:{...state.chartData,
                    employeeFilters: (state.chartData.employeeFilters.filter((item) => {
                        if (!( item[1][0].fieldName === shouldRemoveItemType && item[1][0].fieldValues[0] === shouldRemoveItem[1] )) {
                            return item
                        }
                    })),
                    revenueFilters: (state.chartData.revenueFilters.filter((item) => {
                        if (!( item[1][0].fieldName === shouldRemoveItemType && item[1][0].fieldValues[0] === shouldRemoveItem[1] )) {
                            return item
                        }
                    }))
                }

            };


        case CP_UPDATE_SEGMENT_NAME_AND_DESCRIPTION:
            return {...state, name: action.payload.name, description: action.payload.description}

        case CP_ADD_SAVED_SEGMENT:
            return {...state, id: action.payload.id, dateSaved: action.payload.dateSaved, requesting:false}
        case CP_POPULATE_SAVED_SEGMENT:
            return {
                ...state,
                id: action.payload.id,
                name: action.payload.name,
                description: action.payload.description,
                filteredMarketSelectors: action.payload.filteredMarketSelectors,
                chartData: (action.payload.chartData)?action.payload.chartData:action.payload.marketSelectors.chartData, // for old saved segments
                totalData: (action.payload.totalData)?action.payload.totalData:action.payload.marketSelectors.totalData, // for old saved segments
                //revenueFilters: action.payload.revenueFilters,
                //employeeFilters: action.payload.employeeFilters,
                step: 2,
                dateSaved: action.payload.dateSaved,
                dateUpdated: action.payload.dateUpdated,
                globalFilters:action.payload.globalFilters,
                requesting: false
            }

        case CP_UPDATE_FILTERED_SEGMENT_LEGENDS:
            return {
                ...state,
                filteredMarketSelectors: state.filteredMarketSelectors.map((selector) => {
                    action.payload.map((legObj) => {
                        if(selector.id===legObj.key){
                            selector.legColor = legObj.color
                        }
                    })
                    return selector;
                })
            }



        default:
            break;
    }

    return state;
}
