import GetAllSitesApi from '../api';
import * as types from './actionTypes';

export function success(studies) { return {type: types.GET_ALL_STUDIES, payload : studies};}
export function getStudyByIdSuccess(studies) { return {type: types.GET_ALL_STUDIES, payload : studies};}

export function getAllStudiesAction() {
 	return function(dispatch) {
        return GetAllSitesApi.get_all_studies().then(res => {
            res.data && res.data.response.forEach( (v,i)=>{
                 v.id = v.unique_identifier ? v.unique_identifier : null
                 v.name = v.study_name ? v.study_name : null
            } )
            dispatch(success(res.data.response));
        }).catch(error => {
            throw(error);
        });
	};
}

export function getStudiesByIdAction(id) {
    return function(dispatch) {
       return GetAllSitesApi.get_study_by_id(id).then(res => {
           dispatch(getStudyByIdSuccess(res.data));
       }).catch(error => {
           throw(error);
       });
   };
}
