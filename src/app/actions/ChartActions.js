export const CP_UPDATE_CLICKED = 'UPDATE_CLICKED';
export const CP_UPDATE_CLICKED_SEGMENT = 'UPDATE_CLICKED_SEGMENT';
export const CP_UPDATE_RE_DRAW = 'UPDATE_RE_DRAW'
export const CP_UPDATE_IS_FIRST='UPDATE_IS_FIRST'
export const CP_CLEAR_CLICKED_SEGMENT ='CLEAR_CLICKED_SEGMENT'

export const chartLabelShorthands = {
    parent: ' (P)',
    categoryParent: ' (P)',
    category: ' (C)',
    vendor: ' (V)'
};

export const updateClicked = (clicked) => {
    return (dispatch) => {
        dispatch({
            type:CP_UPDATE_CLICKED,
            payload: clicked
        });
    }
};

export const clearClickedSegment =() =>{
    return (dispatch) => {
        dispatch({
            type:CP_CLEAR_CLICKED_SEGMENT,
            payload: null
        });
    }
}

export const updateClickedSegment = (segment) => {
    return (dispatch) => {
        dispatch({
            type:CP_UPDATE_CLICKED_SEGMENT,
            payload: segment
        });
    }
};
export const updateReDraw = (data) => {
    return (dispatch) => {
        dispatch({
            type:CP_UPDATE_RE_DRAW,
            payload: data
        });
    }
};


export const updateIsFirst = (isFirst=false) => {
    return (dispatch) => {
        dispatch({
            type:CP_UPDATE_IS_FIRST,
            payload: isFirst
        });
    }
};