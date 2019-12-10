import * as types from '../actions/actionTypes';

export default function getAllSites(state=null, action) {
  switch(action.type) {
    case types.GET_ALL_SITES:
      return action.payload.data;
    default:
      return state;
  }
}
