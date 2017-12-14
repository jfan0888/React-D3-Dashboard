import {CP_GET_INDUSTRIES, CP_GET_LOCATIONS, CP_GET_TOTAL_COUNTS} from "../actions/MasterDatas";


const InitialState = {
    industries: [],
    locations: [],
    totalCompanies: 0,
    totalRecords: 0
}

export default function (state = InitialState, action) {

    switch (action.type) {
        case CP_GET_INDUSTRIES:

            return {...state, industries: action.payload}
        case CP_GET_LOCATIONS:

            return {...state, locations: action.payload}
        case CP_GET_TOTAL_COUNTS:
            return {
                ...state,
                totalCompanies: action.payload.aggregations.url.value,
                totalRecords: action.payload.hits.total
            }
        default:
            break;
    }

    return state;
}
