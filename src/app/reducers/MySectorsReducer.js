import {
    CP_DE_SELECT_MARKET_SELECTOR,
    CP_REQUESTING,
    CP_SAVE_SECTOR_DATA,
    CP_SELECT_MARKET_SELECTOR,
    CP_STOP_REQUESTING,
    CP_VIEW_LIST_MARKET_SELECTOR,
    CP_EMPTY_VIEW_LIST
} from "../actions/MarketSelector";

const InitialState = {
    requesting: false,
    list: [],
    selectedSector: null,
}

export default function (state = InitialState, action) {
    switch (action.type) {
        case CP_REQUESTING:
            return {...state, requesting: true}
        case CP_STOP_REQUESTING:
            return {...state, requesting: false}

        case CP_SELECT_MARKET_SELECTOR:
            const market = state.list.filter((market) => {
                return (market.id === action.payload.id)
            })


            if (!market.length)
                return {
                    ...state,
                    requesting: false,
                    list: [...state.list, action.payload]
                }
        case CP_DE_SELECT_MARKET_SELECTOR:
            return {
                ...state, list: state.list.filter((market) => {
                    return (market.id !== action.payload.id)
                })
            }
        case CP_SAVE_SECTOR_DATA:
            return {
                ...state, requesting: false, list: action.payload.map((obj) => {
                    return JSON.parse(obj.json)
                })
            }
        case CP_VIEW_LIST_MARKET_SELECTOR:
            return {...state, selectedSector: action.payload}

        case CP_EMPTY_VIEW_LIST:

            return {...state, selectedSector: null}

        default:
            break;
    }

    return state;
}
