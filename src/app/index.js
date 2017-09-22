import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import promise from 'redux-promise';
import thunk from 'redux-thunk'; 
import { compose, createStore, applyMiddleware } from 'redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './components/App';
import Home from './components/home/Home';

import reducers from './reducers';

import './components/bundle.scss';

const defaultState = {
  view: {
    state: 'loading',
    modal: {},
  },
  userInfo: {
    email: null,
    phone: null,
  },
};

const store = createStore(reducers, defaultState, compose(
    window.devToolsExtension ? window.devToolsExtension() : f => f,
    applyMiddleware(thunk, promise)));

ReactDOM.render(
  <Provider store={store}>
    <Router onUpdate={() => window.scrollTo(0, 0)} history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />;
      </Route>
    </Router>
  </Provider>
  , document.getElementById('react-root'));
