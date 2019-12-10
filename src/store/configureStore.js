import {createStore, applyMiddleware} from 'redux';
import rootReducer from '../reducers/root';
import thunk from 'redux-thunk';

export default function configureStore(info) {
  	return createStore(
		rootReducer,
		{login:info},
    	applyMiddleware(thunk)
  	);
}