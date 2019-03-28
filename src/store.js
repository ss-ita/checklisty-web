
import thunk from 'redux-thunk';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './reducer/index';

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
