import {GET_PATIENT_INFO} from './actionTypes';


export  function patientInfoAction (info){
    return function(dispatch){
        dispatch(patientData(info));
    }
}

function patientData(data){
    return { type:GET_PATIENT_INFO,payload:data};
}