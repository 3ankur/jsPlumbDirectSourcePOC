import { combineReducers } from "redux";
import getAllSites from './getAllSites';
 
import PatientListReducer from './patientListReducer'
import ActivePatient from './activePatientReducer';
import origins from './patientOriginReducer';
import patientActivity from './patientActivityReducer';
import getAllStudies from './getAllStudies'
import modal from './modalReducer';
import login from './loginReducer';
import getFormReducer from './getDynamicDomainFormReducer';
 
import getPatientInfo from './patientInfoReducer';

const rootReducer = combineReducers({
 
    getAllSites,
    patientList : PatientListReducer,
    activePatient:ActivePatient,
    origins,
    patientActivity,
	getAllStudies,
    modal,
    login,
    getFormReducer,
    getPatientInfo
});
 
 
 

export default rootReducer;