 import {SELECTED_PATIENT} from '../actions/actionTypes';

export default function ActivePatient(state=null, action) {

 
  switch(action.type) {
    
    case SELECTED_PATIENT:
    
      return action.payload.data;
    default:
      return state;
  }
}