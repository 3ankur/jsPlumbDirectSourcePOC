/**
* Copyright (c) 2018
* @summary Application Patient Deatil Page
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React, { Component } from 'react';
import Filter from '../filter/filter';
import PatientList from './patientlist';
import * as getPatientList from '../../actions/getPatientList';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ApiService from '../../api';
import common from '../../../src/common/common';
import { NotificationManager } from 'react-notifications';
import * as modalAction from  '../../../src/actions/modalActions';
import { MODAL_TYPE_Add_Patient } from '../../../src/constants/modalTypes';
import { withLastLocation } from 'react-router-last-location';

class PatientDetails extends Component {

    constructor(props, context){
        super(props, context);
        this.state = {
            patientList : [],
            subheaderOptions : {
                site : true,
                study : true,
                status: true,
                dropDownOptions:{
                    multiSelect : false,
                    keepOpenOnSelection:false
                },
                button : {
                    name : 'Patient'
                }
            },
            isOpen: false,
            searchPatients: "",
            studySiteDetailsList : [],
            siteList : [],
            addPatientData:[]
        },
        this.studySiteStatusIdObj = {}
        this.statusFilterCount = 0;
    }

    componentDidMount(){
        ApiService.get_all_studies().then((res)=>{
            res && res.data.response.forEach( (d)=>{
                d.id  = d.uniqueIdentifier;
                d.name = d.studyName;
            });
            this.setState({studySiteDetailsList:res.data.response});
        });
        ApiService.getStatus().then((res)=>{
            res && res.data && res.data.response.length &&  res.data.response.forEach((d)=>{
                d.id  = d.uniqueIdentifier;
            });
            this.setState({statusList:res.data.response});
        })

        let menuLevel = localStorage.getItem("fromMenu") && JSON.parse(localStorage.getItem("fromMenu"));
        if( this.props && !this.props.lastLocation){
                localStorage.setItem("Patient_StudyName","")
                localStorage.setItem("Patient_SiteName","")
                localStorage.setItem("Patient_Status","")
        }

        if(this.checkFilterAlradyPersist()){
            this.loadPatientList(this.studySiteStatusIdObj);
        }
        else{
            this.loadPatientList();
        }

    }


    checkFilterAlradyPersist(){
        try{
            let i=false,j=false,k=false;
            if(localStorage.getItem("Patient_Status") && localStorage.getItem("Patient_Status")!=""){
               let status =JSON.parse(localStorage.getItem("Patient_Status"))
                this.studySiteStatusIdObj['status']=status.id; //status
                i=true;
            }
            if(localStorage.getItem("Patient_SiteName") && localStorage.getItem("Patient_SiteName")!=""){
                let siteId =JSON.parse(localStorage.getItem("Patient_SiteName"))
                this.studySiteStatusIdObj['siteId']=siteId.id; //status
                j=true;
            }
            if(localStorage.getItem("Patient_StudyName") && localStorage.getItem("Patient_StudyName")!=""){
                let studyId =JSON.parse(localStorage.getItem("Patient_StudyName"))
                this.studySiteStatusIdObj['studyId']=studyId.id; //status
                k=true;
            }
            if(i||j||k){
                return true;
            }
            return false


        }catch(e){
            return false;
        }

    }

    loadPatientList(parameter){
        ApiService.getStudySitePatientList(parameter).then((res)=>{
            if(res.data.response && typeof res.data.response == 'string'){
                this.setState({patientList:[]});
            }else{
                res&& res.data &&  res.data.response && res.data.response.forEach((d)=>{
                    d.id  = d.uniqueIdentifier;
                });
                this.setState({patientList:res.data.response});
            }

        },(error) => {
            NotificationManager.error('something went wrong');
        });
    }

    openPatientModal = () =>{
         this.setState({ isOpen: !this.state.isOpen });
    }

    onPatientSave = () =>{}

    searchPatientHandeler =(searchValue)=>{
        this.setState({searchPatients: searchValue});
    }

    onStudyChange = (options) =>{
        this.studySiteStatusIdObj['studyId'] = '';
        this.studySiteStatusIdObj['siteId'] = '';
        var that = this;
        if(options && options.name!="Select" && options.id !="9999999999"){
            this.setState({ siteList : null });
            let data = options.id;
            this.studySiteStatusIdObj.studyId = options.id;
            ApiService.GetPopulatedStudyDetails(data).then((res) => {
              if(res && res.data.response.listOfSites.length == 0){

                }else{
                    res && res.data.response.listOfSites.forEach( (d)=>{
                        d.id  = d.unique_identifier;
                        d.name = d.site_name;
                    });
                }
              this.setState({ siteList :  common.sortByOrder(res.data.response.listOfSites || [] ,'ASC','name') },()=>{
                this.loadPatientList(this.studySiteStatusIdObj);
              });
            },(error) => {
                NotificationManager.error('something went wrong');
            });

            localStorage.setItem("Patient_StudyName",JSON.stringify(options))
        }
    }

    onSiteChange = (options) =>{
        if(options && options.name!="Select" && options.id !="8888888888"){
            var data = options.id;
            this.studySiteStatusIdObj.siteId = options.id;
            this.loadPatientList(this.studySiteStatusIdObj);
            localStorage.setItem("Patient_SiteName",JSON.stringify(options))
        }
    }

    statusChange = (options) =>{

         if(options && options.name!="Select"){
                this.studySiteStatusIdObj['status']=options.id;
                this.loadPatientList(this.studySiteStatusIdObj);
                localStorage.setItem("Patient_Status",JSON.stringify(options))
                this.statusFilterCount++;

            }else{
                if(this.statusFilterCount!=0){

                    this.studySiteStatusIdObj['status']="";
                    if(localStorage.getItem("Patient_Status") && localStorage.getItem("Patient_Status")!=""){
                         localStorage.setItem("Patient_Status","")
                         this.loadPatientList(this.studySiteStatusIdObj);
                    }

                }
                this.statusFilterCount++;


            }
    }

    onPatientButtonClick = (data)=>{
        console.log(data);
        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_Add_Patient, {
            onSave: (data) => {
                if(data){
                    let patientData={
                        "addressLine1": data.addressLine1,
                        "addressLine2": data.addressLine2,
                        "city": data.city,
                        "dob": data.dob,
                        "email": data.email,
                        "emergencyContact": data.emergencyContact,
                        "firstName": data.firstName,
                        "lastName": data.lastName,
                        "neverCallAgain": data.neverCallAgain,
                        "patientId":"",
                        "postalCode": data.postalCode,
                        "primaryContact": data.primaryContact,
                        "state": data.state,
                        "guardianEmail": data.guardianEmail,
                        "guardianFirstName": data.guardianFirstName,
                        "guardianId": data.guardianId,
                        "guardianLastName": data.guardianLastName,
                        "patientIdentefier": data.patientIdentefier,
                        "guardianIdentefier":  data.guardianIdentefier,
                        "studyIdentifier": data.studyIdentifier,
                        "studySiteIdentifier": data.studySiteIdentifier,
                    };
                    if(data.patientUniqueIdentifier){
                        patientData.patientUniqueIdentifier = data.patientUniqueIdentifier;
                        patientData.patientId = data.patientId
                        patientData.sourceIdentifier =  data.sourceIdentifier
                        patientData.guardianId =  data.guardianId
                    }
                    ApiService.savePatientData(patientData).then((res) => {
                        if(res.data.responsecode){
                            if(res.data.responsecode == 430){
                                common.clearNotification();
                                res.data.response && NotificationManager.warning(res.data.response);
                                }else{
                                common.clearNotification();
                                res.data.response && NotificationManager.success(res.data.response);
                                this.props.modalAction.hideModal();
                                this.loadPatientList(this.studySiteStatusIdObj);
                                //this.studySiteStatusIdObj   this.columns
                                }
                        }
                     }, (error) => {
                        common.clearNotification();
                        NotificationManager.error('something went wrong');
                    });
            }
        },
        PatientEditData : data,
        className: 'addPatient'
        });
    }

    editSelectePatient =(info)=>{
         this.onPatientButtonClick(info)
    }


  render({props,state} = this) {
    let {subheaderOptions} = state;
    return (
    	<div className="footpadb">
            <Filter  byDefaultNoSelected={false}
                    options={subheaderOptions}
                    studySiteDetailsList={this.state.studySiteDetailsList}
                    siteStudyChanged={this.onStudyChange}
                    siteList={this.state.siteList}
                    onSiteChange={this.onSiteChange}
                    statusList={this.state.statusList}
                    statusChange = {this.statusChange}
                    onPopUpBtnClick={()=>this.onPatientButtonClick()}
            />
            <PatientList lists={this.state.patientList} editPatient={this.editSelectePatient} SearchPatient={this.searchPatientHandeler} searchPatients={this.state.searchPatients}/>
        </div>
    );
  }
}

function mapStateToProps(state){
    return{
        patientList : state.patientList,
        modal: state.modal
    }
}

function mapDispatchToProps(dispatch){
    return {
        getPatientList : bindActionCreators(getPatientList,dispatch),
        modalAction: bindActionCreators(modalAction, dispatch)
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(withLastLocation(PatientDetails));

