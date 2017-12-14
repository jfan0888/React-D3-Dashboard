import { browserHistory } from 'react-router';

export default function({dispatch}){
    return next => action =>{
        if( !action.payload || !action.payload.then ){
            return next(action);
        }

        action.payload.then(
            function(response) {
                const newAction = { ...action, payload: response};
                dispatch(newAction);
            }
        ).catch((e)=>{
            if(e.response.data.error === 'token_expired'){
            browserHistory.push('/login');
        }
    });
    }
}