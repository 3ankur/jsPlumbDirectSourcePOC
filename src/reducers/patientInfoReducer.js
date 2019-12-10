import {GET_PATIENT_INFO} from '../actions/actionTypes';

export default function PatientInfoReducer(state=[], action) {

 
  switch(action.type) {
    
    case GET_PATIENT_INFO:
      return action.payload;
    default:
      return state;
  }
}
