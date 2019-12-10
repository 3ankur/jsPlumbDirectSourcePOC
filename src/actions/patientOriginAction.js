import GetAllSitesApi from '../api';
import {GET_PATIENT_ORIGINS} from './actionTypes';


export function patientOrigin(){

    return function(dispatch,getState){
      return  GetAllSitesApi.getOrigins().then((res)=>{
                dispatch(originsData(res.data));
            })
    }

}

function originsData(data){

    return { type:GET_PATIENT_ORIGINS,payload:data};
}