import GetAllSitesApi from '../api';
import {PATIENT_ACTIVITY} from './actionTypes';

export function patientActivity(patient){
    return function(dispatch){
      return GetAllSitesApi.getPatientActivityist(patient.patient_id).then((res)=>{
        dispatch(activityData(res.data));
     })
    }
}

export function savePatientActivity(patient,actionType){
    return function(dispatch,getState){
           return  GetAllSitesApi.savePatientActivity({id:patient.patientData[0].patient_id,type:actionType}).then((res)=>{
                dispatch(activityData(res.data));
            })
   }

}

function activityData(data){
 return { type:PATIENT_ACTIVITY,payload:data};
}