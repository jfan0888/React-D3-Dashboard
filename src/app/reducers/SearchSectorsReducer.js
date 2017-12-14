import {uniqBy} from 'lodash';
import {
    CP_EMPTY_VENDOR_SEARCH_RESULTS,
    CP_UPDATE_VENDOR_SEARCH_RESULTS,
    CP_NO_VENDORS_FOUND,
} from '../actions/SearchSectorsActions';

const initialState = {
    categoryParent : [],
    category : [],
    vendor : [],
    message : "Type something and press enter to search vendors."
}

export default (state = initialState, action) => {
    switch(action.type) {
        case CP_EMPTY_VENDOR_SEARCH_RESULTS:
            return {...initialState};
        case CP_UPDATE_VENDOR_SEARCH_RESULTS:
            return {
                ...state,
                categoryParent: uniqBy([...state.categoryParent, ...action.payload.categoryParent], i => i.key),
                category: uniqBy([...state.category, ...action.payload.category], i => i.key),
                vendor: uniqBy([...state.vendor, action.payload.vendor], i => i.key),
                message : ""
            }
        case CP_NO_VENDORS_FOUND:
            return {
                ...initialState,
                message : action.payload
            };
    }

    return state
}