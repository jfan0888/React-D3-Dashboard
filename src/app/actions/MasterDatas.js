import axios from 'axios';
import {API_URL} from '../constants';
export const CP_GET_INDUSTRIES = 'GET_INDUSTRIES';
export const CP_GET_LOCATIONS = 'GET_LOCATIONS';
export const CP_GET_TOTAL_COUNTS ='GET_TOTAL_COUNTS'


export const getTotalCounts = () => dispatch =>{
    return axios.post(`${API_URL}/GetSwimlaneMaster`, [[]]).then(response => {

        dispatch({
            type: CP_GET_TOTAL_COUNTS,
            payload:response.data
        });

    })

}

export const getMasterTermsLocations = () => dispatch => {

    return axios.get(`${API_URL}/GetLocationTerm`, {}).then(response =>{

        dispatch({
            type: CP_GET_LOCATIONS,
            payload: response.data.aggregations.installCountry.buckets
        })
    })
}

export const getMasterTermsIndustries = () => dispatch => {

    return axios.get(`${API_URL}/GetIndustryTerm`, {}).then(response =>{

        dispatch({
            type: CP_GET_INDUSTRIES,
            payload: response.data.aggregations.topLevelIndustry.buckets
        })
    })
}


