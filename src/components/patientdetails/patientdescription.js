/**
* Copyright (c) 2018
* @summary Application Patient Description component
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React,{Component} from 'react';
import * as modalAction from '../../actions/modalActions';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux' ;
import { MODAL_TYPE_GREEN_PHIRE, MODAL_TYPE_ADD_SITE,MODAL_TYPE_WITHDRAW,MODAL_TYPE_Add_Patient} from '../../constants/modalTypes';
import EncounterSection from './encounterSection';
import PatientStudiesSection from './patientStudiesSection';
import PatientInfo from './patientInfo';
import ApiService from '../../api/restApi';
import { NotificationManager } from 'react-notifications';
import Common from '../../common/common'
import _ from 'lodash';

class PatientDescription extends Component{

    constructor(props){
        super(props)
        this.state = {
            isEdit : false,
            data:{},
            prevSubjecId:"",
            prevRecruitmentId:""
        }
        this.textChanges = this.textChanges.bind(this);
    }

    componentDidMount(){
        this.loadPatientData();
    }
    loadPatientData = ()=>{
        let patient_identifier = this.props.match.params && this.props.match.params.patientId
        ApiService.getPatientInfo(patient_identifier).then((res)=>{
            res && res.data && res.data.response && this.setState({ data : res.data.response[0],prevSubjecId:res.data.response[0]["subjectId"],prevRecruitmentId:res.data.response[0]["recruitemnetId"] });
        });

        ApiService.getPatientStudies(patient_identifier).then((res)=>{
            res && res.data.response.forEach( (d)=>{
                d.id  = d.sitePatientIdentifier;
                d.name = d.studyName;

            });
            this.setState({studySiteDetailsList:res.data.response});
        });
    }

    //get patientstatus sets
    loadPatientStatus =(patient_identifier)=>{
        ApiService.getPatientStudies(patient_identifier).then((res)=>{
            res && res.data.response.forEach( (d)=>{
                d.id  = d.sitePatientIdentifier;
                d.name = d.studyName;
            });
            this.setState({studySiteDetailsList:res.data.response});
        });
    }

    textChanges(e,d){
        const pst = this.state.data;
        pst.patientData.fname,pst.patientData.ssn,pst.patientData.address  = e.target.value;
        this.setState({data:pst});
    }

    onEditPatientDetail = ()=>{
        this.setState({
            isEdit : true
        })
    }

    showGreenPhireModal=()=>{
        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_GREEN_PHIRE,{
            onSave : (data) => {
                // const pst = this.state.data;
                // pst.patientData[0].greenphire = data && data.newGreenPhireVal;
                // this.setState({data:pst});
                // this.props.modalAction.hideModal();
            },
            oldGreenPhireVal : this.state.data.greenphire,
            hideModal : ()=>{
                this.props.modalAction.hideModal();
            }
        });
    }

    showAddSiteModal = ()=>{
        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_ADD_SITE,{
            onSave : (data) => {
                const pst = this.state.data;
                pst.patientData[0].actual_site && pst.patientData[0].actual_site.push(data);
                this.setState({data:pst});
                this.props.modalAction.hideModal();
            },
            hideModal : ()=>{
                this.props.modalAction.hideModal();
            },
            className:'site-modal'
        });
    }

    addRecruitmentIdHandler = (spData)=>{
        if(spData){
            const prevSt = this.state.studySiteDetailsList;
            let idx = _.findIndex(prevSt,(r)=>{return  r.id===spData.id});
            if(idx>-1){
                prevSt[idx]["hasAddEditPatientRecruitment"] = true;
                this.setState({studySiteDetailsList:prevSt});
            }
        }else{

        }

    }

    cancelUpdateRecruitmentId =(spData)=>{
        if(spData){
            const prevSt = this.state.studySiteDetailsList;
            let idx = _.findIndex(prevSt,(r)=>{return r.id===spData.id});
            if(idx>-1){
                prevSt[idx]["hasAddEditPatientRecruitment"] = false;
                this.setState({studySiteDetailsList:prevSt});
            }
        }else{

        }

    }

    editRecruitmentId = (spData)=>{
if(spData){
    const prevSt = this.state.studySiteDetailsList;
    let idx = _.findIndex(prevSt,(r)=>{return r.id===spData.id});
    if(idx>-1){
        prevSt[idx]["hasAddEditPatientRecruitment"] = true;
        this.setState({studySiteDetailsList:prevSt});
    }
}else{

}
    }

    updateRecruitmentId = (dataVal,spData)=>{
        if(spData){
            const prevSt = this.state.studySiteDetailsList;
            let idx = _.findIndex(prevSt,(r)=>{return r.id===spData.id});
            if(idx>-1){
                prevSt[idx]["recruitementId"] = dataVal;
                this.setState({studySiteDetailsList:prevSt});
            }
        }else{

        }
            }
            //saveRecruitmentIdChanges
            saveRecruitmentIdChanges(spData){
                if(spData){
                    const prevSt = this.state.studySiteDetailsList;
                    let idx = _.findIndex(prevSt,(r)=>{return r.id===spData.id});
                    if(idx>-1){
                        let data =   {
                            "sitePatientUniqueIdentifier": spData.id, 
                            "recrruitementId":  spData.recruitementId
                          };
                        ApiService.updatePatientRecruitmentId(data).then( (res)=>{
                            if(res){
                                prevSt[idx]["hasAddEditPatientRecruitment"] = false;
                                this.setState({studySiteDetailsList:prevSt});
                                NotificationManager.success("Updated Successfully..")
                            }
                        })
                    }
                }else{

                }
            }

    addSubjectId =(spData)=>{
if(spData){
    const prevSt = this.state.studySiteDetailsList;
    let idx = _.findIndex(prevSt,(r)=>{return r.id===spData.id});
    if(idx>-1){
        prevSt[idx]["hasAddEditPatientStudy"] = true;
        this.setState({studySiteDetailsList:prevSt});
    }
}else{
}
    }
    updateSubjectId = (dataVal,spData)=>{
if(spData){
    const prevSt = this.state.studySiteDetailsList;
    let idx = _.findIndex(prevSt,(r)=>{return r.id===spData.id});
    if(idx>-1){
        prevSt[idx]["subjectId"] = dataVal;
        this.setState({studySiteDetailsList:prevSt});
    }
}else{
}
    }
    saveSubjectIdHandler(spData){
        if(spData){
            const prevSt = this.state.studySiteDetailsList;
            let idx = _.findIndex(prevSt,(r)=>{return r.id===spData.id});
            if(idx>-1){
                let data =   {
                    "sitePatientUniqueIdentifier": spData.id,
                    "subjectId":spData.subjectId 
                  };
                ApiService.updatePatientSubjectId(data).then( (res)=>{
                    if(res){

                        prevSt[idx]["hasAddEditPatientStudy"] = false;
                        this.setState({studySiteDetailsList:prevSt});
                        NotificationManager.success("Updated Successfully..")
                    }
                })
            }
        }else{
        }

        if(this.state.data.subjectId && this.state.data.subjectId!="" && this.state.data.subjectId.trim()!=""){
        }
    }

    editSubjectIdHandeler = (spData)=>{
if(spData){
    const prevSt = this.state.studySiteDetailsList;
    let idx = _.findIndex(prevSt,(r)=>{return r.id===spData.id});
    if(idx>-1){
        prevSt[idx]["hasAddEditPatientStudy"] = true;
        this.setState({studySiteDetailsList:prevSt});
    }
}else{
}
    }

    cancelUpdateSubjectId =(spData)=>{
        if(spData){
            const prevSt = this.state.studySiteDetailsList;
            let idx = _.findIndex(prevSt,(r)=>{return r.id===spData.id});
            if(idx>-1){
                prevSt[idx]["hasAddEditPatientStudy"] = false;
                this.setState({studySiteDetailsList:prevSt});
            }
        }else{
        }
    }
    // withdraw modal popup & save withdraw comments
    openWithDrawModal = (spData)=>{

if(spData){
    this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_WITHDRAW,{
        onSave : (data) => {
            if(this.props.match.params && this.props.match.params.patientId){
                let obj = {
                    "sitePatientUniqueIdentifier": spData.sitePatientIdentifier,   //this.props.match.params.patientId,
                    "withdrawReason": data && data.comment
                  }
                  ApiService.updatePatientWithdraw(obj).then( (res)=>{
                      NotificationManager.success("Updated Successfully.");
                      this.props.modalAction.hideModal();
                      this.loadPatientData();
                  })
            }
            },
                hideModal : ()=>{ this.props.modalAction.hideModal(); }
            });

}
else{
   // NotificationManager.error("");
}
    }

    gotoEncounterDetailPage = (d)=> {
        if(d === 'unexpectedPage'){
            const unIden = `UN${Common.getRandomNumber()}` ;
            return `/patientdetails/patientdescription/patientEncounter/${unIden}/${this.props.match.params.patientId}/${this.state.data.studyUniqueIdentifier}/null/fromUnexpectedEncounter`
        }else if(d.typeOFEncounter === 1){
            this.props.history.push(`/patientdetails/patientdescription/patientEncounter/${d.uniqueIdentifier}/${this.props.match.params.patientId}/${this.state.data.studyUniqueIdentifier}/${d.uniqueIdentifier}/fromUnexpectedEncounter`);
        }else{
            this.props.history.push(`/patientdetails/patientdescription/patientEncounter/${d.uniqueIdentifier}/${this.props.match.params.patientId}/${this.state.data.studyUniqueIdentifier}/${d.siteUniqueIdentifier}/${d.epochProtocolIdentifier}`)
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
                                Common.clearNotification();
                                res.data.response && NotificationManager.warning(res.data.response);
                                }else{
                                    
                                Common.clearNotification();
                                res.data.response && NotificationManager.success(res.data.response);
                                this.props.modalAction.hideModal();
                                this.loadPatientData();
                                }
                        }
                     }, (error) => {
                        Common.clearNotification();
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

    render(){
        return(
            <section className='footpadb'>
                <div className="border p-3 m-0 row justify-content-between">
                    <div className="p-0 col-md-12 row m-0">
                        <div className="col-md-12 px-0 row  border-light-p  pb-2 m-0 justify-content-start">
                            <h5 className="c-p col-6 p-0 pt-2">Patient Details</h5>
                            <div className="col-md-auto justify-content-end p-0">
                            </div>
                        </div>
                        <PatientInfo patientInfo={this.state.data}
                            textChangeHandler={this.textChanges}
                            onEdit={this.state.isEdit}
                            showGreenPhireModal={this.showGreenPhireModal} 
                            editPatient={this.editSelectePatient}
                            />
                    </div>
                    <div className="row col-md-12 p-0 m-0 mb-2">
                        <EncounterSection
                        patientStudies={this.state.data} gotoEncounterDetailPage={this.gotoEncounterDetailPage}
                        patientStudySiteList = {this.state.studySiteDetailsList}
                        loadPatientStatus={this.loadPatientStatus}
                       />
                        <PatientStudiesSection patientStudies={this.state.data}
                        addSubjectIdHandler={this.addSubjectId.bind(this)}
                        updatetheSubjectIdHandler={this.updateSubjectId.bind(this)}
                        saveSubjectIdChanges={this.saveSubjectIdHandler.bind(this)}
                        editSubjectId={this.editSubjectIdHandeler.bind(this)}
                        cancelUpdateSubjectId={this.cancelUpdateSubjectId.bind(this)}
                        addRecruitmentId={this.addRecruitmentIdHandler.bind(this)}
                        cancelUpdateRecruitmentId={this.cancelUpdateRecruitmentId.bind(this)}
                        editRecruitmentId={this.editRecruitmentId.bind(this)}
                        updateRecruitmentId={this.updateRecruitmentId.bind(this)}
                        saveRecruitmentIdChanges={this.saveRecruitmentIdChanges.bind(this)}
                        openWithDrawModal={this.openWithDrawModal.bind(this)}
                        patientStudySiteList = {this.state.studySiteDetailsList}
                        />
                    </div>
                </div>
            </section>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        modalAction : bindActionCreators(modalAction,dispatch)
    };
}


function mapStateToProps(state){
    return {
        modal : state.modal
    }
}

export default  connect(mapStateToProps , mapDispatchToProps)(PatientDescription);
