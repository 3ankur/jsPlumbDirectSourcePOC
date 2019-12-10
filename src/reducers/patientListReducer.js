import {PATIENT_LIST} from '../actions/actionTypes';

export default function PatientListReducer(state=[], action) {

 
  switch(action.type) {
    
    case PATIENT_LIST:
      return action.payload.data;
    default:
      return state;
  }
}
