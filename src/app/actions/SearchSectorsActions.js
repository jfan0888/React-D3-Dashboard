import axios from 'axios';
import {API_URL} from "../constants";
import {requesting, stopRequesting } from "./MarketSelector";

export const CP_EMPTY_VENDOR_SEARCH_RESULTS = 'CP_EMPTY_VENDOR_SEARCH_RESULTS';
export const CP_UPDATE_VENDOR_SEARCH_RESULTS = 'CP_UPDATE_VENDOR_SEARCH_RESULTS';
export const CP_NO_VENDORS_FOUND = 'CP_NO_VENDORS_FOUND';

export const resetVendorSearch = () => {
    return {
        type : CP_EMPTY_VENDOR_SEARCH_RESULTS,
    }
}

export const searchVendors = (query) => (dispatch) => {
    dispatch(requesting());
    dispatch(resetVendorSearch());

    axios.get(`${API_URL}/GetVendorTerm?value=${query}`, {}).then(response => {
        const vendors = response.data.aggregations.vendor.buckets;

        if(!vendors.length) {
            dispatch({
                type: CP_NO_VENDORS_FOUND,
                payload: `No vendors found for '${query}'`
            });
            dispatch(stopRequesting());
            return;
        };

        vendors.forEach(vendor => {
            const postData = [{
                "fieldName": "vendor",
                "fieldValues": [vendor.key]
            }];

            axios.post(`${API_URL}/GetMasterTermFilter`, postData).then(response => {
                dispatch({
                    type: CP_UPDATE_VENDOR_SEARCH_RESULTS,
                    payload: {
                        categoryParent : response.data.aggregations.categoryParent.buckets || [],
                        category : response.data.aggregations.category.buckets || [],
                        vendor
                    }
                });

                dispatch(stopRequesting());
            })
        })


    })
}
