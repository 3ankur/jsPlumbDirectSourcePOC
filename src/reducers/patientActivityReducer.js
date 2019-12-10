import {PATIENT_ACTIVITY} from '../actions/actionTypes';

export default function getPatientEnrollActivity(state=[], action) {

    switch(action.type) {

     case PATIENT_ACTIVITY:
      return  [...state,action.payload.data]   ;
      default:
      return state;
  }
}