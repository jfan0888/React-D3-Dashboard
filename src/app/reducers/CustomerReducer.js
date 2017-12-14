import {
    CP_ADD_CUSTOMERS,
    CP_EMPTY_SELECTED_CUSTOMER,
    CP_GET_COMPANY_COUNT,
    CP_GET_CUSTOMERS,
    CP_POPULATE_SAVED_CUSTOMERS,
    CP_REMOVE_CUSTOMER_LIST_FOR_GRAPH,
    CP_REQUEST_ADD_CUSTOMERS,
    CP_SELECT_UN_SELECT_A_LIST_FOR_GRAPH,
    CP_UPDATE_SELECTED_CUSTOMER,
    CP_DELETE_CUSTOMER_LIST,
    CP_GET_CUSTOMER_X_RAY_DATA
} from "../actions/CustomerActions";

const initSelectedCustomer = {
    listName: "",
    listDescription: "",
    created_date: "",
    companyCount: 0,
    hits: 0,
    customers: []
}
const InitialState = {
    lists: [],
    selectedForGraph: [],
    selectedCustomer: initSelectedCustomer,
    addingSuccess: true,
    customerXrayList:[],
    customerDetail:null

}

export default function (state = InitialState, action) {
    switch (action.type) {
        case CP_REQUEST_ADD_CUSTOMERS:
            return {...state, addingSuccess: false}
        case CP_ADD_CUSTOMERS:
            return {...state, addingSuccess: true}
        case CP_UPDATE_SELECTED_CUSTOMER:
            const selected = state.lists.filter(item => item.listName === action.payload.name)
            return {...state, selectedCustomer: {...selected[0], customers: action.payload.customers}}
        case CP_EMPTY_SELECTED_CUSTOMER:
            return {...state, selectedCustomer: initSelectedCustomer}
        case CP_GET_CUSTOMERS:
            return {...state, lists: action.payload}
        case CP_DELETE_CUSTOMER_LIST:
            return{...state, lists:state.lists.filter(item=> item.listId!== action.payload.itemId)}
        case CP_GET_COMPANY_COUNT:
            return {
                ...state, lists: state.lists.map(customer => customer.listName === action.payload.listName ?
                    {...customer, companyCount: action.payload.companyCount, hits: action.payload.hits} :
                    customer
                )
            }
        case CP_SELECT_UN_SELECT_A_LIST_FOR_GRAPH:
            if (!state.selectedForGraph.some(customer => customer.listName == action.payload.listName)) {
                return {...state, selectedForGraph: [action.payload]};
            } else {
                return {
                    ...state, selectedForGraph: state.selectedForGraph.filter((customer) => {
                        return customer.listName != action.payload.listName;
                    })
                };
            }
        case CP_REMOVE_CUSTOMER_LIST_FOR_GRAPH:
            return {
                ...state, selectedForGraph: state.selectedForGraph.filter((customer) => {
                    return customer.listName !== action.payload.key;
                })
            };
        case CP_POPULATE_SAVED_CUSTOMERS:
            return {
                ...state, selectedList: action.payload.customers, selectedForGraph: action.payload.customers
            };
        case CP_GET_CUSTOMER_X_RAY_DATA:

            let tableObj = action.payload.data.map(function(x) {
                return {
                    "Parent Category": x.categoryParent,
                    Category:x.category,
                    Vendor : x.vendor,
                    Product : x.product,
                    "Top Level Industry":x.topLevelIndustry,
                    "Sub Level Industry" : x.subLevelIndustry,
                    "Install Country":x.installCountry,
                    Employees: x.employees,
                    Revenue: x.revenue,


                };
            });
            let detailObj = action.payload.data.map(function(x) {
                return {
                    company: x.company,
                    hqAddress:x.hqAddress,
                    hqCity:x.hqCity,
                    hqState:x.hqState,
                    hqCountry:x.hqCountry,
                    hqZip:x.hqZip,
                    hqPhone:x.hqPhone,
                    url:x.url

                };
            });
            return {
                ...state, customerXrayList: tableObj, customerDetail:(detailObj.length)?detailObj[0]:null
            };

        default:
            break;
    }

    return state;
}
