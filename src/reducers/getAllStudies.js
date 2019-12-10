import * as types from '../actions/actionTypes';

export default function getAllStudies(state=null, action) {
  switch(action.type) {
    case types.GET_ALL_STUDIES:
      return action.payload;
    default:
      return state;
  }
}
