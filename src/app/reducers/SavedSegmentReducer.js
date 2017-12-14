import {CP_GET_SAVED_SEGMENT, CP_PAGINATE_SAVED_SEGMENT, CP_REQUESTING_SAVED, CP_DELETE_SAVED_SEGMENT} from "../actions/MarketSelector";

const InitialState = {
    requesting: false,
    list: []
}

export default function (state = InitialState, action) {
    switch (action.type) {

        case CP_REQUESTING_SAVED:
            return {...state, requesting: true}
        case CP_GET_SAVED_SEGMENT:
            return {...state, list: action.payload, requesting: false};
        case CP_PAGINATE_SAVED_SEGMENT:
            return {...state, list: [...state.list, ...action.payload]};
        case CP_DELETE_SAVED_SEGMENT:
            return {...state, list: state.list.filter((market) => {
                return (market.id !== action.payload)
            })};


        default:
            break;
    }

    return state;
}
