import {GET_PATIENT_ORIGINS} from '../actions/actionTypes';

export default function getOrigin(state=null, action) {

    switch(action.type) {
     case GET_PATIENT_ORIGINS:
      return action.payload.data;
      default:
      return state;
  }
}