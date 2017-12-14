import axios from 'axios';
import {API_URL, LOGGEDIN_USER_UUID} from '../constants';

export const CP_ADD_CUSTOMERS = 'ADD_CUSTOMERS';
export const CP_GET_CUSTOMERS = 'GET_CUSTOMERS';
export const CP_REQUEST_ADD_CUSTOMERS ='REQUEST_ADD_CUSTOMERS'
export const CP_GET_COMPANY_COUNT = 'GET_COMPANY_COUNT'
export const CP_SELECT_UN_SELECT_A_LIST_FOR_GRAPH = 'SELECT_UN_SELECT_A_LIST_FOR_GRAPH'
export const CP_REMOVE_CUSTOMER_LIST_FOR_GRAPH = 'REMOVE_CUSTOMER_LIST_FOR_GRAPH'
export const CP_POPULATE_SAVED_CUSTOMERS = 'POPULATE_SAVED_CUSTOMERS'
export const CP_UPDATE_SELECTED_CUSTOMER = 'UPDATE_SELECTED_CUSTOMER'
export const CP_EMPTY_SELECTED_CUSTOMER = 'EMPTY_SELECTED_CUSTOMER'
export const CP_DELETE_CUSTOMER_LIST ='CP_DELETE_CUSTOMER_LIST'
export const CP_GET_CUSTOMER_X_RAY_DATA ='GET_CUSTOMER_X_RAY_DATA'
import {showWarning} from  "./View"

export const deleteCustomerList = (itemId) => {
    return (dispatch) => {
        return axios.get(`${API_URL}/DeleteCustomerListById/${itemId}`, {}).then(response => {
            dispatch({type:CP_DELETE_CUSTOMER_LIST, payload:{itemId}})
        }).catch(function (error) {
            if (error.response) {
                dispatch(showWarning("Error occurred on deleting the customer list. Try again later."))
            }})
    }
};

export function removeSelectedCustomer(data){
    return {
        type: CP_REMOVE_CUSTOMER_LIST_FOR_GRAPH,
        payload: data,
    };
}


export function toggleSelectedCustomerForGraph(data) {
    return {
        type: CP_SELECT_UN_SELECT_A_LIST_FOR_GRAPH,
        payload: data,
    };
}

export const getCustomerListDetail  = (listName) => dispatch => {
    return axios.post(`${API_URL}/GetCustomerExportData`,
        {
            "pageNumber":1,
            "pageSize" : 1000,
            "filters" : [ {
                "fieldName":"listName",
                "fieldValues":[listName]
            },
                {
                    "fieldName":"userId",
                    "fieldValues":[LOGGEDIN_USER_UUID]
                }],
            "exportFields" : ["url","company","country", "created_date"],
            "sortfields":[{"fieldName":"company","type":0},{"fieldName":"url","type":1}]
        }

        ,{}).then(response => {
        dispatch({
            type: CP_UPDATE_SELECTED_CUSTOMER,
            payload:{name:listName,
                customers:response.data}
        })
    })
}

export function emptySelectedCustomer() {
    return {
        type: CP_EMPTY_SELECTED_CUSTOMER,
        payload: null,
    };
}

export const addCustomers = (values) => {


    return (dispatch) => {
        dispatch({
            type:CP_REQUEST_ADD_CUSTOMERS,
            payload: ''
        });

        axios.post(`${API_URL}/InsertCustomerData`,values,
            {
            }).then(response=>{
            dispatch({
                type:CP_ADD_CUSTOMERS,
                payload: true
            });
            // There is a delay on response
            setTimeout(() => {
                dispatch(getCustomerLists());
            }, 2000)


        });
    }
};


export const getCustomerLists = () => dispatch => {
    return axios.post(`${API_URL}/GetCustomerExportData`,
        {
            "pageNumber":1,
            "pageSize" : 10000,
            "filters" : [
                {
                    "fieldName":"userId",
                    "fieldValues":[LOGGEDIN_USER_UUID]
                }
            ],
            "exportFields" : ["listName","listId","listDescription", "created_at"],
            "sortfields":[{"fieldName":"listId","type":0},{"fieldName":"url","type":1}]

        }
        , {}).then(response =>{

        let result = response.data.reduce((unique, o) => {
            if(!unique.find(obj => obj.listId === o.listId)) {
                unique.push(o);
            }
            return unique;
        },[]);

        dispatch({
            type: CP_GET_CUSTOMERS,
            payload: result
        })

        result.map((cus) => {
            getCustomerCompanyCount(dispatch, cus.listName )
        })
    })
}

export function getCustomerCompanyCount(dispatch, key) {
    let postArray =[
        {
            fieldName: 'listName',
            fieldValues:[key]
        }
    ]


    axios.post(`${API_URL}/GetCustomerMaster`, postArray
        ,
        {

        }).then(response=>{

        const listWithCount = {
            listName:key,
            companyCount: response.data.aggregations.url.value,
            hits: response.data.hits.total
        }
        dispatch({
            type:CP_GET_COMPANY_COUNT,
            payload: listWithCount
        });
    });


}

export const getCustomerXRay = (searchQry,urlType) => dispatch => {

    let type = 'vendor'
    if(urlType){
        type =  'url'
    }

    let postArray =
    {
        "pageNumber":1,
        "pageSize" : 1000
    }
    axios.post(`${API_URL}/GetCompanyData/`+type+`/`+searchQry, postArray
        ,
        {

        }).then(response=>{
        dispatch({
            type:CP_GET_CUSTOMER_X_RAY_DATA,
            payload: response.data
        });
    });

}






