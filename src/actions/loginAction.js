
import {LOGIN} from './actionTypes';

export function login(data,actionType){
    return function(dispatch,getState){
     return  dispatch(loginData( {"data":data}  ));
   }
}

function loginData(data){
 return { type:LOGIN,payload:data};
}