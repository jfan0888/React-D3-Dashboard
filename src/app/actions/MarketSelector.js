import axios from "axios";
import {API_URL, LOGGEDIN_USER_UUID} from "../constants";
import Moment from "moment";
import uuid from "uuid/v1";
import {CP_POPULATE_SAVED_CUSTOMERS} from "./CustomerActions";
import {updateIsFirst, updateReDraw} from "./ChartActions";
import {hideWarning, showWarning} from "./View";

import {createFilteredPostArray} from "../modules/helpers"


export const CP_ADD_MARKET_SELECTOR = 'ADD_MARKET_SELECTOR';
export const CP_TOGGLE_SELECTED_MARKET = 'TOGGLE_SELECTED_MARKET';
export const CP_REMOVE_SELECTED_MARKET = 'REMOVE_SELECTED_MARKET';
export const CP_ADD_MARKET_SELECTOR_PARENT_CAT = 'ADD_MARKET_SELECTOR_PARENT_CAT';
export const CP_TOGGLE_MARKET_SELECTOR_PARENT_CAT = 'TOGGLE_MARKET_SELECTOR_PARENT_CAT';
export const CP_TOGGLE_MARKET_SELECTOR_CAT = 'TOGGLE_MARKET_SELECTOR_CAT';
export const CP_ADD_MARKET_SELECTOR_CAT = 'ADD_MARKET_SELECTOR_CAT';
export const CP_ADD_MARKET_SELECTOR_VENDOR = 'ADD_MARKET_SELECTOR_VENDOR';
export const CP_ADD_MARKET_SELECTOR_PRODUCT = 'ADD_MARKET_SELECTOR_PRODUCT';
export const CP_SELECT_MARKET_SELECTOR = 'SELECT_MARKET_SELECTOR';
export const CP_DE_SELECT_MARKET_SELECTOR = 'DE_SELECT_MARKET_SELECTOR'
export const CP_FILTERED_MARKET_SELECTOR = 'FILTERED_MARKET_SELECTOR';
export const CP_UPDATE_SHOW_HIDE = 'UPDATE_SHOW_HIDE';
export const CP_SELECT_UN_SELECT_PRODUCT = 'SELECT_UN_SELECT_PRODUCT';
export const CP_ADD_CHART_ITEM = 'ADD_CHART_ITEM';
export const CP_UPDATE_FILTERED_MARKET_SELECTOR_COMPANY_HITS_COUNT = 'UPDATE_FILTERED_MARKET_SELECTOR_COMPANY_HITS_COUNT';
export const CP_UPDATE_FILTERED_MARKET_SELECTOR_PRODUCT_LIST = 'UPDATE_FILTERED_MARKET_SELECTOR_PRODUCT_LIST';
export const CP_SAVE_FILTER = 'SAVE_FILTER';
export const CP_UPDATE_SELECTED_MARKET_SELECTORS = 'UPDATE_SELECTED_MARKET_SELECTORS';
export const CP_UPDATE_FILTERED_SELECTED_MARKET_SELECTORS = 'UPDATE_FILTERED_SELECTED_MARKET_SELECTORS';

export const CP_REFINE_SELECTED_MARKETS = 'REFINE_SELECTED_MARKETS';
export const CP_VIEW_LIST_MARKET_SELECTOR = 'VIEW_LIST_MARKET_SELECTOR';
export const CP_EMPTY_VIEW_LIST = 'EMPTY_VIEW_LIST';
export const CP_REQUESTING = 'REQUESTING';
export const CP_STOP_REQUESTING = 'STOP_REQUESTING';
export const CP_UPDATE_FILTERED_MARKET_SELECTOR_PRODUCT_VENDOR_CAT_COUNT = 'UPDATE_FILTERED_MARKET_SELECTOR_PRODUCT_VENDOR_CAT_COUNT'
export const CP_UPDATE_SEGMENT_NAME_AND_DESCRIPTION = 'UPDATE_SEGMENT_NAME_AND_DESCRIPTION'
export const CP_GET_SAVED_SEGMENT = "GET_SAVED_SEGMENT";
export const CP_PAGINATE_SAVED_SEGMENT = "PAGINATE_SAVED_SEGMENT";
export const CP_ADD_SAVED_SEGMENT = "ADD_SAVED_SEGMENT";
export const CP_DELETE_SAVED_SEGMENT = "DELETE_SAVED_SEGMENT"
export const CP_POPULATE_SAVED_SEGMENT = "POPULATE_SAVED_SEGMENT"
export const CP_POPULATE_SAVED_SEGMENT_TO_SELECTED = "POPULATE_SAVED_SEGMENT_TO_SELECTED"
export const CP_CLEAR_SELECTED_MARKET_SELECTORS = "CLEAR_SELECTED_MARKET_SELECTORS"
export const CP_EMPTY_FILTER_DATA = "EMPTY_FILTER_DATA";
export const CP_EMPTY_EMPLOYEE_FILTER = "EMPTY_EMPLOYEE_FILTER"
export const CP_EMPTY_REVENUE_FILTER = "EMPTY_REVENUE_FILTER"
export const CP_EMPTY_CHART_DATA = "EMPTY_CHART_DATA"
export const CP_CLEAR_USER_SELECTED_MARKET_SELECTORS = "CLEAR_USER_SELECTED_MARKET_SELECTORS"
export const CP_CLEAR_ID = "CLEAR_ID"
export const CP_CHANGE_STEP = "CHANGE_STEP"
export const CP_SAVE_SECTOR_DATA = "SAVE_SECTOR_DATA"
export const CP_SAVE_POST_FILTERS = "SAVE_POST_FILTERS"
export const CP_REQUESTING_SAVED = 'REQUESTING_SAVED'
export const CP_SET_GLOBAL_FILTERS_EMPLOYEE_VOLUME = 'SET_GLOBAL_FILTERS_EMPLOYEE_VOLUME'
export const CP_SET_GLOBAL_FILTERS_REVENUE_VOLUME = 'SET_GLOBAL_FILTERS_REVENUE_VOLUME'
export const CP_SET_GLOBAL_FILTERS_UNKNOWN_EMPLOYEE = 'SET_GLOBAL_FILTERS_UNKNOWN_EMPLOYEE'
export const CP_SET_GLOBAL_FILTERS_UNKNOWN_REVENUE = 'SET_GLOBAL_FILTERS_UNKNOWN_REVENUE'
export const CP_SET_GLOBAL_FILTERS_INDUSTRIES = 'SET_GLOBAL_FILTERS_INDUSTRIES'
export const CP_SET_GLOBAL_FILTERS_LOCATION = 'SET_GLOBAL_FILTERS_LOCATION'
export const CP_UPDATE_FILTERED_SEGMENT_LEGENDS = 'UPDATE_FILTERED_SEGMENT_LEGENDS'


export const CP_SELECT_ALL_ON_FILTERED_PARENT ='CP_SELECT_ALL_ON_FILTERED_PARENT'
export const CP_SELECT_ALL_ON_FILTERED_CAT ='CP_SELECT_ALL_ON_FILTERED_CAT'
export const CP_SELECT_ALL_ON_FILTERED_VENDOR ='CP_SELECT_ALL_ON_FILTERED_VENDOR'
export const CP_UN_SELECT_ALL_ON_FILTERED_PARENT ='CP_UN_SELECT_ALL_ON_FILTERED_PARENT'
export const CP_UN_SELECT_ALL_ON_FILTERED_CAT ='CP_UN_SELECT_ALL_ON_FILTERED_CAT'
export const CP_UN_SELECT_ALL_ON_FILTERED_VENDOR ='CP_UN_SELECT_ALL_ON_FILTERED_VENDOR'
export const CP_INIT_SELECTED_SEGMENT = 'CP_INIT_SELECTED_SEGMENT'

export const CP_UPDATE_CHART_DATA_COUNT ='CP_UPDATE_CHART_DATA_COUNT'
export const CP_UPDATE_EMPLOYEE_FILTER ='CP_UPDATE_EMPLOYEE_FILTER'
export const CP_UPDATE_REVENUE_FILTER ='CP_UPDATE_REVENUE_FILTER'

export const revenueSliderDataSet = {
    1: "Less than $1M",
    2: "$1M",
    3: "$10M",
    4: "$50M",
    5: "$100M",
    6: "$200M",
    7: "$500M",
    8: "$1000M",
    9: "Over $1000M"
}

export const revenueSliderDataSetLabels = {

    1: "Less than $1,000,000",
    2: "From $1,000,000 to $9,999,999",
    3: "From $10,000,000 to $49,999,999",
    4: "From $50,000,000 to $99,999,999",
    5: "From $100,000,000 to $199,999,999",
    6: "From $200,000,000 to $499,999,999",
    7: "From $500,000,000 to $999,999,999",
    8: "Over $1,000,000,000"
}

export const employeeSliderDataSetLabels = {

    1: "Less than 10",
    2: "From 10 to 49",
    3: "From 50 to 199",
    4: "From 200 to 499",
    5: "From 500 to 999",
    6: "From 1,000 to 4,999",
    7: "From 5,000 to 9,999",
    8: "Above 10,000"
}

export const employeeSliderDataSet = {
    1: "Less than 10",
    2: "10",
    3: "50",
    4: "200",
    5: "500",
    6: "1000",
    7: "5000",
    8: "10000",
    9: "Above 10,000"
}

export const CP_FILTER_REVENUE = "revenue"
export const CP_FILTER_EMPLOYEES = "employees"
export const CP_FILTER_INDUSTRY = "topLevelIndustry"
export const CP_FILTER_LOCATION = "installCountry"

export function initSelectedSegment() {
    return {type: CP_INIT_SELECTED_SEGMENT}
}

export function selectAllOnFiltered(type, id) {
    switch (type){
        case  'parent':
            return {type: CP_SELECT_ALL_ON_FILTERED_PARENT, payload:id}
        case  'category':
            return {type: CP_SELECT_ALL_ON_FILTERED_CAT, payload:id }
        case  'vendor':
            return {type: CP_SELECT_ALL_ON_FILTERED_VENDOR, payload:id }
        default :
            return null
    }
}

export function unSelectAllOnFiltered(type, id) {
    switch (type){
        case  'parent':
            return {type: CP_UN_SELECT_ALL_ON_FILTERED_PARENT, payload:id }
        case  'category':
            return {type: CP_UN_SELECT_ALL_ON_FILTERED_CAT, payload:id }
        case  'vendor':
            return {type: CP_UN_SELECT_ALL_ON_FILTERED_VENDOR, payload:id }
        default :
            return null
    }
}

export function setGlobalFiltersEmployee(data) {
    return {
        type: CP_SET_GLOBAL_FILTERS_EMPLOYEE_VOLUME,
        payload: data,
    };
}

export function setGlobalFiltersRevenue(data) {
    return {
        type: CP_SET_GLOBAL_FILTERS_REVENUE_VOLUME,
        payload: data,
    };
}

export function setGlobalFiltersUnknownRevenue(data) {
    return {
        type: CP_SET_GLOBAL_FILTERS_UNKNOWN_REVENUE,
        payload: data,
    };
}

export function setGlobalFiltersUnknownEmployee(data) {
    return {
        type: CP_SET_GLOBAL_FILTERS_UNKNOWN_EMPLOYEE,
        payload: data,
    };
}

export function setGlobalFiltersLocation(data) {
    return {
        type: CP_SET_GLOBAL_FILTERS_LOCATION,
        payload: data,
    };
}

export function setGlobalFiltersIndustry(data) {
    return {
        type: CP_SET_GLOBAL_FILTERS_INDUSTRIES,
        payload: data,
    };
}

export function changeStep(step) {
    return {
        type: CP_CHANGE_STEP,
        payload: step,
    };
}

export function requesting() {
    return {
        type: CP_REQUESTING,
        payload: null,
    };
}

export function stopRequesting() {
    return {
        type: CP_STOP_REQUESTING,
        payload: null,
    };
}

export function updateShowHide(id, list, catKey) {
    const data = {id: id, list: list, catKey: catKey}
    return {
        type: CP_UPDATE_SHOW_HIDE,
        payload: data,
    };
}

export function toggleProduct(id, list, catKey, productKey) {
    const data = {id: id, list: list, catKey: catKey, productKey: productKey}
    return {
        type: CP_SELECT_UN_SELECT_PRODUCT,
        payload: data,
    };
}

export function saveFilter(id) {
    const data = {id: id}
    return {
        type: CP_SAVE_FILTER,
        payload: data,
    };
}


export function addNewMarketSelector(data) {
    return {
        type: CP_ADD_MARKET_SELECTOR,
        payload: data,
    };
}


export const toggleSelectedMarkets = (data) => dispatch => {

    dispatch(hideWarning())
    return dispatch({
        type: CP_TOGGLE_SELECTED_MARKET,
        payload: data
    })


}


export function removeSelectedMarket(data) {
    return {
        type: CP_REMOVE_SELECTED_MARKET,
        payload: data,
    }
}
export function refineSelectedMarkets() {
    return {
        type: CP_REFINE_SELECTED_MARKETS,
        payload: {},
    }
}


export const getMasterTermsParentCategories = () => dispatch => {
    return axios.get(`${API_URL}/GetCategoryParentTerm`, {}).then(response => {
        dispatch({
            type: CP_ADD_MARKET_SELECTOR_PARENT_CAT,
            payload: response.data.aggregations.categoryParent.buckets.map((category) => {
                return {
                    ...category,
                    highlighted: false
                }
            })
        })
    })
}

export const toggleHighlightedParentCategory = (categoryKey, loadCategories = true) => dispatch => {
    dispatch({
        type: CP_TOGGLE_MARKET_SELECTOR_PARENT_CAT,
        payload: categoryKey
    })

    if (loadCategories) {
        dispatch(requesting());
        return axios.post(`${API_URL}/GetMasterTermFilter`, [{
            "fieldName": "categoryParent",
            "fieldValues": [categoryKey]
        }]).then(response => {
            const categories = response.data.aggregations.category.buckets;
            if (!categories.length) return;

            dispatch({
                type: CP_ADD_MARKET_SELECTOR_CAT,
                payload: categories.map((category) => {
                    return {
                        ...category,
                        parent: categoryKey,
                        highlighted: false
                    }
                })
            });

            dispatch(stopRequesting());
        })
    }
}

export const toggleHighlightedCategory = (categoryKey, loadCategories = true) => dispatch => {
    dispatch({
        type: CP_TOGGLE_MARKET_SELECTOR_CAT,
        payload: categoryKey
    })

    if (loadCategories) {
        dispatch(requesting());
        return axios.post(`${API_URL}/GetMasterTermFilter`, [{
            "fieldName": "category",
            "fieldValues": [categoryKey]
        }]).then(response => {
            const vendors = response.data.aggregations.vendor.buckets;
            if (!vendors.length) return;

            dispatch({
                type: CP_ADD_MARKET_SELECTOR_VENDOR,
                payload: vendors.map((vendor) => {
                    return {
                        ...vendor,
                        parent: categoryKey,
                        highlighted: false
                    }
                })
            });

            dispatch(stopRequesting());
        })
    }
}

export const getMasterTermsCategories = () => dispatch => {

    return axios.get(`${API_URL}/GetCategoryTerm`, {}).then(response => {
        dispatch({
            type: CP_ADD_MARKET_SELECTOR_CAT,
            payload: response.data.aggregations.category.buckets
        })
    })

}

export const getMasterTermsVendors = () => dispatch => {

    return axios.get(`${API_URL}/GetVendorTerm`, {}).then(response => {

        dispatch({
            type: CP_ADD_MARKET_SELECTOR_VENDOR,
            payload: response.data.aggregations.vendor.buckets
        })
    })

}

export const getMasterTermsProducts = () => dispatch => {
    return axios.get(`${API_URL}/GetProductTerm`, {}).then(response => {

        dispatch({
            type: CP_ADD_MARKET_SELECTOR_PRODUCT,
            payload: response.data.aggregations.product.buckets
        })
    })
}


export const deSelectMarketSelector = (id) => {
    return (dispatch) => {
        dispatch({
            type: CP_DE_SELECT_MARKET_SELECTOR,
            payload: {id: id}
        });
        dispatch({
            type: CP_REMOVE_SELECTED_MARKET,
            payload: {id: id}
        });

    }
}

/**
 * This function is using  for adding market segments direct to filtered from right panel
 * */
export const directToFilteredMarket = (selectedWithCounts, type, postArray, directToFiltered) => {
    return (dispatch) => {
        if (postArray) {
            let revenue = postArray.filter((item) => {
                return item.fieldName === CP_FILTER_REVENUE
            })
            let employees = postArray.filter((item) => {
                return item.fieldName === CP_FILTER_EMPLOYEES
            })
            let industries = postArray.filter((item) => {
                return item.fieldName === CP_FILTER_INDUSTRY
            })
            let locations = postArray.filter((item) => {
                return item.fieldName === CP_FILTER_LOCATION
            })
            selectedWithCounts = {
                ...selectedWithCounts,
                revenue: (revenue.length) ? revenue[0].fieldValues : '',
                employees: (employees.length) ? employees[0].fieldValues : '',
                industries: (industries.length) ? industries[0].fieldValues : '',
                locations: (locations.length) ? locations[0].fieldValues : '',
            }
        }

        dispatch(toggleSelectedMarkets(selectedWithCounts));

        if (directToFiltered) {
            dispatch(GetMasterTermFilter(selectedWithCounts));

            //because masterDataFilter gets first element as key
            let newPostArray = []
            newPostArray.push({fieldName: type, fieldValues: [selectedWithCounts.key]})
            postArray.map((item) => {
                newPostArray.push(item)
            })
            dispatch(masterDataFilter(newPostArray, (type === 'categoryParent') ? 'parent' : type))
        }

    }
}

export const getSavedSectorData = () => {
    return (dispatch) => {

        dispatch({type: CP_REQUESTING})

        let getData = {
            "pageNumber":1,
            "pageSize": 100,
            "exportFields": ["segmentId", "name", "created_at", "json"],
            "sortfields": [{"fieldName": "name.keyword", "type": 0}, {"fieldName": "created_at", "type": 1}],
            "filters":[{
                "fieldName":"userId",
                "fieldValues":[LOGGEDIN_USER_UUID]
            }]
        };

        axios.post(`${API_URL}/GetSectors`, (getData),
            {}).then(response => {
            dispatch({
                type: CP_SAVE_SECTOR_DATA,
                payload: response.data
            });
        })
    }
};

export const saveSectorData = (values) => {
    let date = Date();
    let saveData = {
        "userId":LOGGEDIN_USER_UUID,
        "sectorId": LOGGEDIN_USER_UUID + "_" + values.id,
        "name": values.key,
        "json": JSON.stringify(values),
        "created_at": Moment(date).format('YYYY-MM-DDTHH:mm:ss')
    };

    axios.post(`${API_URL}/InsertSectorsData`, ([saveData]),
        {}).then(response => {
    })
};

export const deleteSavedSectorData = (id) => {
    return (dispatch) => {
        let itemId = LOGGEDIN_USER_UUID + "_" + id;
        return axios.get(`${API_URL}/DeleteSectorById/${itemId}`, {}).then(response => {
            dispatch({type:CP_DE_SELECT_MARKET_SELECTOR, payload:{id:id}})

        }).catch(function (error) {
            if (error.response) {
                dispatch(showWarning("Error occurred on deleting the sector. Try again later."))
            }});
    }
};

export const GetCategoryParentMasterAllCounts = (values, directToFiltered = false, postArray = []) => {

    return (dispatch) => {
        dispatch(requesting())

        let valueArr = []
        valueArr = valueArr.concat(values)
        axios.post(`${API_URL}/GetCategoryParentMaster`, {
                "values": valueArr
            }
            ,
            {}).then(response => {

            let selctedWithCounts = {
                id: 'parent_' + values,
                key: values,
                type: 'parent',
                product: response.data.aggregations.product.value,
                vendor: response.data.aggregations.vendor.value,
                category: response.data.aggregations.category.value,
                company: response.data.aggregations.url.value,
                hits: response.data.hits.total
            }

            saveSectorData(selctedWithCounts);

            dispatch({
                type: CP_SELECT_MARKET_SELECTOR,
                payload: selctedWithCounts
            });


            dispatch(directToFilteredMarket(selctedWithCounts, 'categoryParent', postArray, directToFiltered))


        });
    }
};

export const GetCategoryMasterAllCounts = (values, directToFiltered = false, postArray = []) => {

    return (dispatch) => {
        dispatch(requesting())
        let valueArr = []
        valueArr = valueArr.concat(values)
        axios.post(`${API_URL}/GetCategoryMaster`, {
                "values": valueArr
            }
            ,
            {}).then(response => {

            let selctedWithCounts = {
                id: 'category_' + values,
                key: values,
                type: 'category',
                product: response.data.aggregations.product.value,
                vendor: response.data.aggregations.vendor.value,
                category: 0,
                company: response.data.aggregations.url.value,
                hits: response.data.hits.total
            }

            saveSectorData(selctedWithCounts);

            dispatch({
                type: CP_SELECT_MARKET_SELECTOR,
                payload: selctedWithCounts
            });


            dispatch(directToFilteredMarket(selctedWithCounts, 'category', postArray, directToFiltered))

        });
    }
}

export const GetVendorMasterAllCounts = (values, directToFiltered = false, postArray = []) => {

    return (dispatch) => {
        dispatch(requesting())
        let valueArr = []
        valueArr = valueArr.concat(values)
        axios.post(`${API_URL}/GetVendorMaster`, {
                "values": valueArr
            }
            ,
            {}).then(response => {

            let selctedWithCounts = {
                id: 'vendor_' + values,
                key: values,
                type: 'vendor',
                product: response.data.aggregations.product.value,
                vendor: 0,
                category: 0,
                company: response.data.aggregations.url.value,
                hits: response.data.hits.total
            }

            saveSectorData(selctedWithCounts);

            dispatch({
                type: CP_SELECT_MARKET_SELECTOR,
                payload: selctedWithCounts
            });


            dispatch(directToFilteredMarket(selctedWithCounts, 'vendor', postArray, directToFiltered))

        });
    }
}

export function GetProductMasterAllCounts(values) {
    return (dispatch) => {

        let valueArr = []
        valueArr = valueArr.concat(values)
        axios.post(`${API_URL}/GetProductMaster`, {
                "values": valueArr
            }
            ,
            {}).then(response => {

            const selctedWithCounts = {
                id: 'product_' + values,
                key: values,
                type: 'product',
                product: response.data.aggregations.product.value,
                vendor: 0,
                category: 0,
                company: response.data.aggregations.url.value,
                hits: response.data.hits.total
            }
            dispatch({
                type: CP_SELECT_MARKET_SELECTOR,
                payload: selctedWithCounts
            });
        });
    }


}

// use to retrive  company count and hists
export function GetSwimlaneMasterCompanyCount(dispatch, id, postArray) {

    axios.post(`${API_URL}/GetSwimlaneMaster`, [postArray],
        {}).then(response => {

        let companyCounts = {
            id: id,
            companyCount: (response.data.aggregations.url !== undefined) ? response.data.aggregations.url.value : 0,
            hits: (response.data.hits !== undefined) ? response.data.hits.total : 0,
        }

        dispatch({
            type: CP_UPDATE_FILTERED_MARKET_SELECTOR_COMPANY_HITS_COUNT,
            payload: companyCounts
        });
    });


}

export function GetMasterTermFilterForUpdate(dispatch, id, type, catKey, inActive, postArray) {


    axios.post(`${API_URL}/GetMasterTermFilter`, postArray,
        {}).then(response => {

        let productList = {
            id: id,
            type: type,
            catKey: catKey,
            inActive: inActive,
            products: (response.data.aggregations.product !== undefined) ? response.data.aggregations.product.buckets : [],
            vendors: (response.data.aggregations.vendor !== undefined) ? response.data.aggregations.vendor.buckets : []
        }

        dispatch({
            type: CP_UPDATE_FILTERED_MARKET_SELECTOR_PRODUCT_LIST,
            payload: productList
        });
    });


}

export function emptyViewList() {
    return {
        type: CP_EMPTY_VIEW_LIST,
        payload: null,
    };
}

export function getDataForViewList(type, key) {
    let postArray = [
        {
            fieldName: (type === 'parent') ? 'categoryParent' : type,
            fieldValues: [key]
        }
    ]
    return (dispatch) => {
        const id = type + '_' + key
        axios.post(`${API_URL}/GetMasterTermFilter`, postArray
            ,
            {}).then(response => {

            let filteredWithCounts = {
                id: type + '_' + key,
                key: key,
                type: type,
                productList: (response.data.aggregations.product !== undefined) ? response.data.aggregations.product.buckets : [],
                productCount: (response.data.aggregations.product !== undefined) ? response.data.aggregations.product.buckets.length : 0,
                vendorList: (response.data.aggregations.vendor !== undefined) ? response.data.aggregations.vendor.buckets : [],
                vendorCount: (response.data.aggregations.vendor !== undefined) ? response.data.aggregations.vendor.buckets.length : 0,
                categoryList: (response.data.aggregations.category !== undefined) ? response.data.aggregations.category.buckets : [],
                categoryCount: (response.data.aggregations.category !== undefined) ? response.data.aggregations.category.buckets.length : 0,
                patentCategoryList: (response.data.aggregations.categoryParent !== undefined) ? response.data.aggregations.categoryParent.buckets : [],
            }

            dispatch({
                type: CP_VIEW_LIST_MARKET_SELECTOR,
                payload: filteredWithCounts
            });


        }).catch(error => {
            console.log('error on GetMasterTermFilter try again', error.response)
            dispatch(getDataForViewList(type, key))
        });
    }
}

export function GetMasterTermFilter(selectedMarket, masterFilter = []) {


    let type = selectedMarket.type;
    let key = selectedMarket.key

    let postArray = [
        {
            fieldName: (type === 'parent') ? 'categoryParent' : type,
            fieldValues: [key]
        }
    ]

    if (masterFilter.length > 0) {
        masterFilter.map((item) => {
            postArray.push({
                fieldName: item.fieldName, fieldValues: item.fieldValues
            })
        })
    }
    return (dispatch) => {

        let valueArr = []
        const id = type + '_' + key
        axios.post(`${API_URL}/GetMasterTermFilter`, postArray
            ,
            {}).then(response => {

            let filteredWithCounts = {
                id: type + '_' + key,
                key: key,
                type: type,
                filtered: true,
                productList: (response.data.aggregations.product !== undefined) ? response.data.aggregations.product.buckets : [],
                productCount: (response.data.aggregations.product !== undefined) ? response.data.aggregations.product.buckets.length : 0,
                vendorList: (response.data.aggregations.vendor !== undefined) ? response.data.aggregations.vendor.buckets : [],
                vendorCount: (response.data.aggregations.vendor !== undefined) ? response.data.aggregations.vendor.buckets.length : 0,
                categoryList: (response.data.aggregations.category !== undefined) ? response.data.aggregations.category.buckets : [],
                categoryCount: (response.data.aggregations.category !== undefined) ? response.data.aggregations.category.buckets.length : 0,
                patentCategoryList: (response.data.aggregations.categoryParent !== undefined) ? response.data.aggregations.categoryParent.buckets : [],
                hits: response.data.hits.total
            }

            dispatch({
                type: CP_FILTERED_MARKET_SELECTOR,
                payload: filteredWithCounts
            });

            let inActive = false;


            GetSwimlaneMasterCompanyCount(dispatch, id, postArray)

            if (type == 'parent' || type == 'vendor') {
                filteredWithCounts.categoryList.map((onecat) => {
                    const newPostArray = [...postArray, {fieldName: 'category', fieldValues: [onecat.key]}]
                    GetMasterTermFilterForUpdate(dispatch, id, type, onecat.key, inActive, newPostArray)
                    // showFirst = false;
                })
            }


            if (type == 'category') {
                filteredWithCounts.vendorList.map((onecat) => {
                    const currentCat = onecat
                    const newPostArray = [...postArray, {fieldName: 'vendor', fieldValues: [onecat.key]}]
                    GetMasterTermFilterForUpdate(dispatch, id, type, onecat.key, inActive, newPostArray)
                    // showFirst = false;

                })
            }

        }).catch(error => {
            console.log('error on GetMasterTermFilter try again', error.response)
            GetMasterTermFilter(type, key)
        });
    }


}

export const createChartData = (postArr, key, dataId=null) => {

    console.log('createChartData',postArr)
    return (dispatch) => axios.post(`${API_URL}/GetSwimlaneMaster`, postArr, {}).then(response => {
        let data = {"sets": key, "size": response.data.aggregations.url.value}

        if (key.length == 1) {
            data = {...data, label: key[0]}
            if(dataId){
                data = {...data,id:dataId}
            }
        }

        dispatch({
            type: CP_ADD_CHART_ITEM,
            payload: data
        });
    });

}


export function getParentCategories() {

    return axios.get(`${API_1_URL}/GetCategoryParentTerm`, {
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    }).then(response => {
        //dispatch({type:ADD_MARKET_SELECTOR, payload:response.data})
    });
}

export function updateChartDataCount(count) {
    return {
        type: CP_UPDATE_CHART_DATA_COUNT,
        payload: count
    }
}

export function emptyChartData() {
    return {
        type: CP_EMPTY_CHART_DATA
    }
}

export function emptyFilterData() {
    return {
        type: CP_EMPTY_FILTER_DATA
    }
}

export const makeEmployeeFilterData = (postArr) => dispatch => {
    let employeesObj = postArr.filter(function (arrObj) {
        return arrObj.fieldName === CP_FILTER_EMPLOYEES;
    });

    return dispatch({
        type: 'CP_UPDATE_EMPLOYEE_FILTER',
        payload: [
            employeesObj[0], postArr.filter(function (arrObj) {
                return arrObj.fieldName != CP_FILTER_EMPLOYEES;
            })
        ]
    });
}

export const makeRevenueFilterData = (postArr) => dispatch => {
    let revenueObj = postArr.filter(function (arrObj) {
        return arrObj.fieldName === CP_FILTER_REVENUE;
    });

    return dispatch({
        type: CP_UPDATE_REVENUE_FILTER,
        payload: [
            revenueObj[0], postArr.filter(function (arrObj) {
                return arrObj.fieldName != CP_FILTER_REVENUE;
            })
        ]
    });
}

export function emptyEmployeeFilter() {
    return {
        type: CP_EMPTY_EMPLOYEE_FILTER
    }
}

export function emptyRevenueFilter() {
    return {
        type: CP_EMPTY_REVENUE_FILTER
    }
}

export const masterDataFilter = (postArr, type) => dispatch => {

    let typeObj = postArr[0];

    let revenueObj = postArr.filter(function (arrObj) {
        return arrObj.fieldName === CP_FILTER_REVENUE;
    });

    let employeesObj = postArr.filter(function (arrObj) {
        return arrObj.fieldName === CP_FILTER_EMPLOYEES;
    });

    let industriesObj = postArr.filter(function (arrObj) {
        return arrObj.fieldName === CP_FILTER_INDUSTRY;
    });

    let locationsObj = postArr.filter(function (arrObj) {
        return arrObj.fieldName === CP_FILTER_LOCATION;
    });

    employeesObj[0] && dispatch({
        type: 'UPDATE_EMPLOYEE_FILTER',
        payload: [
            employeesObj[0], postArr.filter(function (arrObj) {
                return arrObj.fieldName != CP_FILTER_EMPLOYEES;
            })
        ]
    });

    revenueObj[0] && dispatch({
        type: 'UPDATE_REVENUE_FILTER',
        payload: [
            revenueObj[0], postArr.filter(function (arrObj) {
                return arrObj.fieldName != CP_FILTER_REVENUE;
            })
        ]
    });


    axios.post(`${API_URL}/GetSwimlaneMaster`, [postArr],
        {}).then(response => {

        let category = 0;
        let vendor = 0;

        const selctedWithCounts = {
            id: type + '_' + typeObj.fieldValues[0],
            key: typeObj.fieldValues[0],
            type: type,
            revenue: (revenueObj[0]) ? revenueObj[0].fieldValues : '',
            employees: (employeesObj[0]) ? employeesObj[0].fieldValues : '',
            industries: (industriesObj[0]) ? industriesObj[0].fieldValues : '',
            locations: (locationsObj[0]) ? locationsObj[0].fieldValues : '',
            product: 0,
            vendor: 0,
            category: 0,
            company: response.data.aggregations.url.value,
            hits: response.data.hits.total
        };


        const globalFilters = postArr.filter(item => {
            return (item.fieldName === CP_FILTER_REVENUE || item.fieldName === CP_FILTER_EMPLOYEES || item.fieldName === CP_FILTER_LOCATION || item.fieldName === CP_FILTER_INDUSTRY)

        })
        dispatch(GetMasterTermFilter(selctedWithCounts, globalFilters));
    });

}




/**
 * Use to update count on select unselect right panel
 * */
export const rePost = (masterFilters, filteredItem) => {
    const postArray = createFilteredPostArray(filteredItem, masterFilters)

    console.log('rePost', postArray)
    /**
     * Need counts of what we send, because API doesn't re-send same list
     * */
    let productCountInList = 0
    let categoryCountInList = 0
    let vendorCountInList = 0

    postArray.map((i) => {
        if (i.fieldName === 'product') {
            productCountInList = i.fieldValues.length
        } else if (i.fieldName === 'category') {
            categoryCountInList = i.fieldValues.length
        } else if (i.fieldName === 'vendor') {
            vendorCountInList = i.fieldValues.length
        }
    })

    return (dispatch) => {
        axios.post(`${API_URL}/GetSwimlaneMaster`, [postArray],
            {}).then(response => {

            let companyCounts = {
                id: filteredItem.id,
                companyCount: (response.data.aggregations.url !== undefined) ? response.data.aggregations.url.value : 0,
                hits: (response.data.hits !== undefined) ? response.data.hits.total : 0,
            }

            dispatch({
                type: CP_UPDATE_FILTERED_MARKET_SELECTOR_COMPANY_HITS_COUNT,
                payload: companyCounts
            });


        });
        axios.post(`${API_URL}/GetMasterTermFilter`, postArray
            ,
            {}).then(response => {

            let filteredWithCounts = {
                id: filteredItem.id,
                productCount: (response.data.aggregations && response.data.aggregations.product !== undefined) ? response.data.aggregations.product.buckets.length : productCountInList,
                vendorCount: (response.data.aggregations && response.data.aggregations.vendor !== undefined) ? response.data.aggregations.vendor.buckets.length : vendorCountInList,
                categoryCount: (response.data.aggregations && response.data.aggregations.category !== undefined) ? response.data.aggregations.category.buckets.length : categoryCountInList
            }

            dispatch({
                type: CP_UPDATE_FILTERED_MARKET_SELECTOR_PRODUCT_VENDOR_CAT_COUNT,
                payload: filteredWithCounts
            });
        });

    }
}


export const changeSegmentNameAndDescription = (data, saveSegment=null, savedSegments) => dispatch => {

    dispatch({
        type: CP_UPDATE_SEGMENT_NAME_AND_DESCRIPTION,
        payload: data
    });

    if(saveSegment!==null){
        dispatch(addSavedSegment(saveSegment, savedSegments))
    }

}

export const savePostFilteres = (data) => dispatch => {
    dispatch({
        type: CP_SAVE_POST_FILTERS,
        payload: data
    });
}

export const getSavedSegments = (page = 1) => dispatch => {
    const data = {
        pageNumber: page,
        pageSize: 100,
        exportFields: ["segmentId", "name", "created_at", "json", "description"],
        sortfields: [{fieldName: "created_at", type: 1}],
        filters:[{
            fieldName:"userId",
            fieldValues:[LOGGEDIN_USER_UUID]
        }]
    };

    dispatch({
        type: CP_REQUESTING_SAVED
    });

    return axios.post(`${API_URL}/GetSegments`, data).then(response => {
        const payload = {
            type: page === 1 ? CP_GET_SAVED_SEGMENT : CP_PAGINATE_SAVED_SEGMENT,
            payload: response.data.map((segment) => {
                return JSON.parse(segment.json);
            })
        };
        dispatch(payload);
        if (payload.payload.length === data.pageSize) {
            dispatch(getSavedSegments(page + 1));
        }
    })
};

export const addSavedSegment = (data, savedSegments) => dispatch => {
    if (!data.name) {
        dispatch(showWarning('Segment name is empty.'));
        return;
    }

    if(savedSegments.list.some(segment => segment.name == data.name && data.id != segment.id)) {
        dispatch(showWarning('Segment name already exists.'));
        return;
    }

    if (data.id === 0) {
        data.id = uuid();
        data.dateSaved = new Date();
    } else {
        data.dateUpdated = new Date();
    }

    const content = {
        userId:LOGGEDIN_USER_UUID,
        segmentId: data.id,
        name: data.name,
        description: data.description,
        json: JSON.stringify(data),
        created_at: data.dateSaved
    };
    dispatch({type:CP_REQUESTING})
    return axios.post(`${API_URL}/InsertSegmentsData`, [content]).then(response => {
        dispatch({type: CP_ADD_SAVED_SEGMENT, payload: {id: data.id, dateSaved: data.dateSaved}});
        dispatch(showWarning('Segment Saved.', 'Success'));
        dispatch(getSavedSegments());
    });

};

export const deleteSavedSegment = (id) => dispatch => {
    return axios.get(`${API_URL}/DeleteSegmentById/${id}`).then(response => {
        if(response.data===true){
            dispatch({type: CP_DELETE_SAVED_SEGMENT, payload: id});
            dispatch(showWarning('Segment Deleted.', 'Success'));
        }else{
            dispatch(showWarning("Error occurred on deleting saved segment. Try again later."))
        }


    }).catch(function (error) {
        if (error.response) {
            dispatch(showWarning("Error occurred on deleting saved segment. Try again later."))
        }});
};

export const rePopulateSavedSegment = (segment) => dispatch => {

    dispatch(hideWarning())

    dispatch({
        type: CP_POPULATE_SAVED_SEGMENT,
        payload: segment
    });


    dispatch({
        type: CP_POPULATE_SAVED_SEGMENT_TO_SELECTED,
        payload: segment.selectedMarketSelectorsForGraph
    });

    dispatch({
        type: CP_POPULATE_SAVED_CUSTOMERS,
        payload: segment
    })
    dispatch(updateIsFirst(true))
    dispatch(updateReDraw(true))
}

export const updateFilteredSegmentLegends = (legendObj) => dispatch => {

    dispatch({
        type: CP_UPDATE_FILTERED_SEGMENT_LEGENDS,
        payload: legendObj
    });
}



