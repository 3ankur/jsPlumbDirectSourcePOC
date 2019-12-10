import axios from 'axios';
import Common from '../common/common'
import jstz from 'jstz';
const timezone = jstz.determine();

if(axios.defaults && axios.defaults.headers && axios.defaults.headers.common){
    axios.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
    axios.defaults.headers.common["X-CSRF-TOKEN"] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    axios.defaults.headers.common["Client-Timezone"] = timezone.name(); 

}

//To change service end point depend of env  || window.location.hostname == "54.243.7.114"
let EC2_API_END_POINT = "";

export default class RestApi {
    static get_all_studies() {
        return axios.get(`${EC2_API_END_POINT}api/v1/studies/`);
    }

    static GetPopulatedStudyDetails(data) {
        return axios.get(`${EC2_API_END_POINT}api/v1/studies/${data}`);
    }

    static GetPopulatedSiteDetails(data) {
        return axios.get(`${EC2_API_END_POINT}api/v1/studies/sites/${data}`);
    }

    static editPersonnel (personnelId) {
        return axios.get(`${EC2_API_END_POINT}api/v1/studies/sites/personnels/${personnelId}`);
    }
    static savePersonnel (data) {
        return axios.post(`${EC2_API_END_POINT}api/v1/studies/personnels`,data);
    }

    static getRolePersonnel () {
        return axios.get(`${EC2_API_END_POINT}api/v1/users/authorities/`);
    }

    static getPersonnelName (sitePatientIdentifier="") {
        let point = `${EC2_API_END_POINT}api/v1/users/personnels`
        if(sitePatientIdentifier){
            point=`${point}?sitePatientIdentifier=${sitePatientIdentifier}&whodiditFlag=1`
        }
        return axios.get(point);
    }

    static getDomainList() {
        return axios.get(`${EC2_API_END_POINT}api/v1/formbuilder/domains`);
    }

    static getFormJson(data) {
        return axios.get(`${EC2_API_END_POINT}api/v1/formbuilder/domains/${data}`);
    }

    static getStudySitePatientList(parameter) {
        let url = 'api/v1/studies/patients';
        if(parameter && parameter.studyId){
          url = url + `?studyId=${parameter.studyId}`;
        }
        if(parameter && parameter.siteId){
          url = url + `&siteId=${parameter.siteId}`;
        }
        if(parameter && parameter.status && (parameter.studyId || parameter.siteId)){
            url = url + `&status=${parameter.status}`;
          }
        if(parameter && parameter.status && !parameter.studyId && !parameter.siteId) {
            url = url + `?status=${parameter.status}`;
        }
        return Common.AjaxRequest(EC2_API_END_POINT,"GET",url);
    }


    static getPatientListByStudySiteId(data) {
        return Common.AjaxRequest(EC2_API_END_POINT,"GET",`api/v1/studies/patients?studyId=${data.studyId}&siteId=${data.siteId}`)
    }

    static getPatientInfo(data) {
        return axios.get(`${EC2_API_END_POINT}api/v1/studies/patients?patientId=${data}`);
    }

    static getStatus() {
        return axios.get(`${EC2_API_END_POINT}api/v1/users/patients/status`);
    }

    static getAllItemGroups(studyId){
        return axios.get(`${EC2_API_END_POINT}api/v1/setup/studies/${studyId}/itemGroups`);
    }

    static GetProtocolVersionListByStudyId(data) {
        return axios.get(`${EC2_API_END_POINT}api/v1/setup/studies/${data}/protocol`);

    }

     static saveItemGroupMaster(parameter,data) {
        return axios.post(`${EC2_API_END_POINT}api/v1/formbuilder/studies/${parameter.studyId}/domains/${parameter.domainId}`, data, { headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        });
    }

    static getPatientListDetails(data) {
        return Common.AjaxRequest(EC2_API_END_POINT,"GET",`api/v1/studies/patients?siteId=${data}`,data);
    }

    static saveCustomFormSetup(parameter,data) {
        return Common.AjaxRequest(EC2_API_END_POINT,"POST",`api/v1/formbuilder/studies/${parameter.studyId}/domain/${parameter.domainId}/custom`,data);
    }

    static getItemGroupDetailsFromEncounter(parameter) {
        return   Common.AjaxRequest(EC2_API_END_POINT,"GET",`api/v1/formbuilder/studies/${parameter.study_identifier}/element/${parameter.element_identifier}`);
    }

    static AddNewDraftToStudy(data) {
        return axios.post(`${EC2_API_END_POINT}api/v1/setup/studies/${data}/protocol`,{ headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    });
    }

    static getProtocolSetupByVersionAndStatus(studyId,protocolId,status){
        return axios.get(`${EC2_API_END_POINT}api/v1/setup/studies/${studyId}/protocol/${protocolId}`);
    }

    static saveProtocolSetupJSON(studyId,protocolId,data) {
        return axios.post(`${EC2_API_END_POINT}api/v1/setup/studies/${studyId}/protocol/${protocolId}`,data);
    }

    static publishProtocolSetup(studyId,protocolId,data) {
        return   axios.post(`${EC2_API_END_POINT}api/v1/setup/studies/${studyId}/protocol/${protocolId}`,data);
    }

    static createEnvelope(data) {
        return axios.post(`${EC2_API_END_POINT}api/v1/docusign/envelope/embedded`,data);
    }

    static getEnvelopeStatus(data) {
        return axios.get(`${EC2_API_END_POINT}api/v1/docusign/envelope/status/${data}`);
    }

    static getEnvelopeRecipentsStatus(data) {
        return axios.get(`${EC2_API_END_POINT}api/v1/docusign/envelope/recipents/${data}`);
    }
    static getsigningURL(parameter,data) {
        return axios.post(`${EC2_API_END_POINT}api/v1/docusign/envelope/signingUrl/${parameter}`,data);
    }

    static getPatientEpochDetails(studyId,patSiteIdentity){
        return axios.get(`${EC2_API_END_POINT}api/v1/visit/studies/${studyId}/patients/${patSiteIdentity}/encounters`)
    }

    static getUnexpectedEncounterDeatils(studyId,patSiteIdentity,formGroupIdentifier){
        return axios.get(`${EC2_API_END_POINT}api/v1/visit/studies/${studyId}/patients/${patSiteIdentity}/${formGroupIdentifier}/encounters/unexpected`)
    }

    static schedulePatientEncounter(data){
        return   Common.AjaxRequest(EC2_API_END_POINT,"POST","api/v1/studies/patients/encounters/schedule/",data);
    }

    static getEncounterDetailsItemGroup(parametes){
        return axios.get(`${EC2_API_END_POINT}api/v1/visit/element/${parametes.uniqueIdentifier}/form/${parametes.elementIdentifier}`);
    }

    static  getPatientEncounterDetails(id,data){
        if(id=="fromcra"){
            id="99999";
            let url = `api/v1/studies/patients/site/${id}/encounters`;
        if(data && data.studyId){
          url = url + `?studyIdentifer=${data.studyId}`;
        }
        if(data && data.siteId){
          url = url + `&studSiteIdentifer=${data.siteId}`;
        }
        return   Common.AjaxRequest(EC2_API_END_POINT,"GET",url);
        }else{
            return axios.get(`${EC2_API_END_POINT}api/v1/studies/patients/site/${id}/encounters`);
        }
    }

    static  encounterDND(data){
        return   Common.AjaxRequest(EC2_API_END_POINT,"PUT","api/v1/studies/patients/encounters/update",data);
    }

    static  updatePatientSubjectId(data){
      return   Common.AjaxRequest(EC2_API_END_POINT,"PUT","api/v1/studies/patients/subjectis",data);
    }

    static  updatePatientRecruitmentId(data){
        return   Common.AjaxRequest(EC2_API_END_POINT,"PUT","api/v1/studies/patients/recruitementid",data);
    }

    static  updatePatientWithdraw(data){
        return   Common.AjaxRequest(EC2_API_END_POINT,"PUT","api/v1/studies/patients/withdraw",data);
    }

    static  getEncounterDetailBoxes(data){
        return   Common.AjaxRequest(EC2_API_END_POINT,"GET",`api/v1/studies/patients/encounters?formGroupIdentifer=${data.formGroupIdentifer}`);
    }

    static getCdashMapping(data) {
        return   Common.AjaxRequest(EC2_API_END_POINT,"GET",`api/v1/formbuilder/cdashMapping`,data);
    }

    static compareProtocol(source,target){
        return   Common.AjaxRequest(EC2_API_END_POINT,"GET",`api/v1/setup/protocol/compare?sourceVersion=${source}&targetVersion=${target}`);
      }

    static checkinPatient(data){
        return   Common.AjaxRequest(EC2_API_END_POINT,"POST",`api/v1/visit/encounters/checkin`,data);
      }

      static saveEncounterForm(data){
        return   Common.AjaxRequest(EC2_API_END_POINT,"POST",`api/v1/studies/patients/encounter/`,data);
      }

      static getEncounterPEDetails(data){
        return   Common.AjaxRequest(EC2_API_END_POINT,"GET",`api/v1/studies/patients/site/encounters/${data}`);
      }

      static getActivityList(parameter){
          let url = 'api/v1/activities/';
          if(parameter && parameter.studyId){
            url = url + `?studyIdentifer=${parameter.studyId}`;
          }
          if(parameter && parameter.siteId){
            url = url + `&siteIdentifer=${parameter.siteId}`;
          }
        return   Common.AjaxRequest(EC2_API_END_POINT,"GET",url);
      }

    static getCustomElementfrom(data){
        return   Common.AjaxRequest(EC2_API_END_POINT,"GET",`api/v1/formbuilder/studies/${data.study_identifier}/element/${data.element_identifier}/custom`);
    }

    static savePostItNotes(data){
        return   Common.AjaxRequest(EC2_API_END_POINT,"POST",`api/v1/activities/postit`,data);
    }

    static donePostItNotes(data){
        return   Common.AjaxRequest(EC2_API_END_POINT,"POST",`api/v1/activities/postit/done`,data);
    }

    static editPostit(data){
        return   Common.AjaxRequest(EC2_API_END_POINT,"GET",`api/v1/activities/postit?postitIdentifier=${data}`);
    }

    static getEncounterDeatilFilterData(data){
        return   Common.AjaxRequest(EC2_API_END_POINT,"GET",`api/v1/filters/patients/encounters?formGroupIdentifier=${data.formGroupIdentifer}`);
    }

    static getIRBSetupData(){
        return   Common.AjaxRequest(EC2_API_END_POINT,"GET",`api/v1/docusign/IRBsetup`);
    }

    static getICFSetupData(){
        return   Common.AjaxRequest(EC2_API_END_POINT,"GET",`api/v1/docusign/ICFsetup`);
    }

    static saveIRBSetup(data){
        return   Common.AjaxRequest(EC2_API_END_POINT,"POST",`api/v1/docusign/IRBsetup`,data);
    }

    static saveICFSetup(data){
        return   Common.AjaxRequest(EC2_API_END_POINT,"POST",`api/v1/docusign/ICFsetup`,data);
    }

    static getAuditTrailDetails(type,v1,v2){
        return   Common.AjaxRequest(EC2_API_END_POINT,"GET",`api/v1/setup/audit/${type}/${v1}/${v2}`);
    }

    static getEncounterFEDetails(data){
        let tmpHeaders = {}
        if((window.location.href).indexOf("craPatientList")>-1){
             tmpHeaders = { headers: {
                'allowed-masking':  'yes'
            }
        }
    }
       return   Common.AjaxRequest(EC2_API_END_POINT,"GET",`api/v1/studies/patients/site/fullencounters/${data}`,tmpHeaders);
    }

    static getEpochStatus(data){
        return   Common.AjaxRequest(EC2_API_END_POINT,"GET",`api/v1/users/epochs/status`);
    }

    static getstudysummary(data){
        return   Common.AjaxRequest(EC2_API_END_POINT,"GET",`api/v1/studies/studies/summary`);
    }

      static sheduleUnexpectedEncounter(data){
        return   Common.AjaxRequest(EC2_API_END_POINT,"POST",`api/v1/studies/patients/encounters/schedule/unexpected`,data);
      }


      static checkForScheduleDate(studyId,patientId,encounterId){

        return   Common.AjaxRequest(EC2_API_END_POINT,"GET",`api/v1/visit/patients/encounters?studyIdentifier=${studyId}&sitePatientIdentifier=${patientId}&encounterIdentifier=${encounterId}`);
      }

      static getContollTermList(data){
        return   Common.AjaxRequest(EC2_API_END_POINT,"GET",`api/v1/formbuilder/ctlist`,data);

      }

      static savePatientData(data){
        return   Common.AjaxRequest(EC2_API_END_POINT,"POST",`api/v1/studies/patients/`,data);

      }

      static editPatientData(data){
        return   Common.AjaxRequest(EC2_API_END_POINT,"GET",`api/v1/studies/patients/list?patientUniqueIdentifier=${data}`);
      }

      static getPatientStudies(data){
        return   Common.AjaxRequest(EC2_API_END_POINT,"GET",`api/v1/studies/patients/studies/${data}`);
      }

      static approveSM_PI_Signature(data){
        return   Common.AjaxRequest(EC2_API_END_POINT,"POST",`api/v1/studies/encounters/signature`,data);
      }

      static deleteFile(data){
        return   Common.AjaxRequest(EC2_API_END_POINT,"POST",`api/v1/media/delete/`,data);
      }

      static getCalendarSummaryData(date,flag=1){

       // http://localhost:8080/api/v1/visit/encounter/calenderview/{date}/{flag}?date=14%2FDec%2F2018%203%3A15&flag=1'
        return   Common.AjaxRequest(EC2_API_END_POINT,"GET",`api/v1/visit/encounter/calenderview?date=${date} 12:12&flag=${flag}`);
      }

      static getPatientSheduleDetailSummaryData(timestamp){
      //  http://localhost:8080/api/v1/visit/encounter/patient/schedule/detail?timestamp=MTU0NDcwNzgwMDAwMCMxNTQ0NzExNDAwMDAwI0lTVA%3D%3D
        return   Common.AjaxRequest(EC2_API_END_POINT,"GET",`api/v1/visit/encounter/patient/schedule/detail?timestamp=${timestamp}`);
      }
}
