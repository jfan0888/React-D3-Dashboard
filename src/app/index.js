import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import promise from 'redux-promise';
import Async from './middlewares/async'
import thunk from 'redux-thunk';
import {compose, createStore, applyMiddleware} from 'redux';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import IsUserLoggedIn from './components/auth/IsUserLoggedIn';
import Auth from './components/auth/index';
import App from './components/App';
import Home from './components/home/Home';
import Segment from './components/segment/Segment';
import Chart from './components/chart';
import {loadState, saveState} from "./modules/helpers";

import reducers from './reducers';
import './resources/scss/bundle.scss';

const defaultState = {
    view: {
        sidebar: null,
        card: null,
    },
    userInfo: {
        email: null,
        phone: null,
    }
};

/* to persist state, set a key 'persistState' in localStorage with the value 'true' */

const persistState = localStorage.getItem('persistState') == 'true' ? true : false;
const persistedState = persistState ? loadState() : undefined;

const enhance = compose(window.devToolsExtension ? window.devToolsExtension() : f => f);
export const store = createStore(reducers, persistedState, compose(applyMiddleware(thunk), enhance));

if(persistState) {
    store.subscribe(() => {
        saveState(store.getState());
    })
}

ReactDOM.render(
    <Provider store={store}>
        <Router onUpdate={() => window.scrollTo(0, 0)} history={browserHistory}>
            <Route path="login" component={Auth}/>
            <Route component={IsUserLoggedIn}>
                <Route path="/" component={App}>
                    <IndexRoute component={Home}/>
                    <Route path="build" component={Segment}/>
                    <Route path="chart" component={Chart}/>
                </Route>
            </Route>
        </Router>
    </Provider>
    , document.getElementById('react-root'));
