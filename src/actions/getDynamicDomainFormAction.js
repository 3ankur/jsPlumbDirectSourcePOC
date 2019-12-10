import GetAllSitesApi from '../api';
import * as types from './actionTypes';

export function success(data) { return {type: types.GET_FORM, payload : data};}

export function getDynamicDomainFormAction(data) {
 	return function(dispatch) {
        return GetAllSitesApi.getForm(data).then(res => {
            dispatch(success(res.data));
        }).catch(error => {
            throw(error);
        });
	};
}

