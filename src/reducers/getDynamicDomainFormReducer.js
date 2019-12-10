import {GET_FORM} from '../actions/actionTypes';

export default function getFormReducer(state=[], action) {

    switch(action.type) {
     case GET_FORM:
      return  action.payload;
      default:
      return state;
  }
}