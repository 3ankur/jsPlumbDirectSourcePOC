
import * as types from './actionTypes';

export function success(sites) {
  return {type: types.GET_ALL_SITES, payload : sites};
}

export function getAllSitesAction() {
 	return function(dispatch) {
	};
}
