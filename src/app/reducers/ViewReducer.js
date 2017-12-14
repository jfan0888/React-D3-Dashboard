import {
    CP_HIDE_WARNING,
    CP_SHOW_WARNING,
    CP_UPDATE_SIDEBAR_SPREAD,
    CP_UPDATE_VIEW_CARD,
    CP_UPDATE_VIEW_SIDEBAR
} from "../actions/View";

const InitialState = {
    sidebar: "",
    card: "",
    spread: "",
    warning: {
        message: "",
        type: ""
    }

}

export default function (state = InitialState, action) {
    const newState = JSON.parse(JSON.stringify(state));

    switch (action.type) {
        case CP_UPDATE_VIEW_SIDEBAR:
            newState.sidebar = action.payload;
            return newState;
        case CP_UPDATE_VIEW_CARD:
            newState.card = action.payload;
            return newState;
        case CP_UPDATE_SIDEBAR_SPREAD:
            newState.spread = action.payload;
            return newState;
        case CP_SHOW_WARNING:
            return {...state, warning: action.payload}
        case CP_HIDE_WARNING:
            return {...state, warning: {message: "", type: ""}}
        default:
            break;
    }

    return state;
}
