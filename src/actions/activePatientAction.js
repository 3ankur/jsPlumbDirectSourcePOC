/**
* Copyright (c) 2018
* @summary Application Patient Action
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import GetAllSitesApi from '../api';
import {SELECTED_PATIENT} from './actionTypes';


export function selectPatient(patient){
    return function(dispatch,getState){
        return  GetAllSitesApi.patient_details(patient.patient_id).then((res)=>{
                dispatch(patientDetails(res.data));
            })
    }

}

function patientDetails(data){

    return { type:SELECTED_PATIENT,payload:data};
}