export const CP_UPDATE_VIEW_SIDEBAR = 'UPDATE_VIEW_SIDEBAR';
export const CP_UPDATE_VIEW_CARD = 'UPDATE_VIEW_CARD';
export const CP_UPDATE_SIDEBAR_SPREAD = 'UPDATE_SIDEBAR_SPREAD';
export const CP_SHOW_WARNING = 'SHOW_WARNING';
export const CP_HIDE_WARNING = 'HIDE_WARNING';

export function updateViewSidebar(data) {
    return {
        type: CP_UPDATE_VIEW_SIDEBAR,
        payload: data,
    };
}

export function updateViewCard(data) {
    console.log('updateViewCard', data)
    return {
        type: CP_UPDATE_VIEW_CARD,
        payload: data,
    };
}

export function updateSidebarSpread(data) {
    return {
        type: CP_UPDATE_SIDEBAR_SPREAD,
        payload: data,
    };
}

export const showWarning = (message, type="Error") => dispatch => {

    dispatch({
        type: CP_SHOW_WARNING,
        payload: {message:message, type:type}
    })

    setTimeout(function() { dispatch({
        type: CP_HIDE_WARNING,
        payload: null
    }) }.bind(dispatch),5000);

}

export const hideWarning = () => dispatch => {
    return dispatch({
        type: CP_HIDE_WARNING,
        payload: null
    })

}








