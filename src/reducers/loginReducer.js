import {LOGIN} from '../actions/actionTypes';

export default function login(state=[], action) {

    switch(action.type) {
     case LOGIN:
      return  [action.payload.data]   ;
      default:
      return state;
  }
}