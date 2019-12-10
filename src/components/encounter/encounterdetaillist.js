/**
* Copyright (c) 2018
* @summary  Domain Element boxes Loop
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React, { Component } from 'react';
import { NavLink,withRouter } from 'react-router-dom';
import {isIE, isEdge, isFirefox, isSafari} from 'react-device-detect';
import {MODAL_TYPE_DND} from '../../constants/modalTypes';
import Common from '../../common/common';
import * as modalAction from '../../actions/modalActions';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux' ;
import ApiService from '../../../src/api';
import { NotificationManager } from 'react-notifications';
import Route from 'route-parser';

class EncounterDetailList extends Component{
    constructor(props){
        super(props);
        this.state = {
            hideEncounterBlock : false,
            dndText : 'DND',
            hideEncounterBlockPatientStatus : false,
            enableUrlForUnExpectedEnc: false
        }
        this.showEncounterStart = [];
    }

    componentDidMount(){
        this.props.encounter.skipped == 1  ? this.setState({dndText:'Not DND',hideEncounterBlock:true}) :this.setState({dndText:'DND',hideEncounterBlock:false});
        this.props.encounter.hasOwnProperty('patientCheckInStatus') && this.props.encounter.patientCheckInStatus !== 1 ? this.setState({hideEncounterBlockPatientStatus:true}):this.setState({hideEncounterBlockPatientStatus:false});
        this.showEncounterStart = this.props.encounter.completionRange && this.props.encounter.completionRange.split('/');
    }

    
    saveDNDApi = (data)=>{
        ApiService.encounterDND(data).then((res) => {
            this.props.modalAction.hideModal();
            this.setState({hideEncounterBlock : !this.state.hideEncounterBlock},()=>{
                this.setState({
                    dndText :  this.state.hideEncounterBlock ? 'Not DND' : 'DND'
                })
            });
            console.log(this.props);
            this.props.loadEncounterDetailData({formGroupIdentifer :this.props.unExpectedEncounterData &&
                this.props.unExpectedEncounterData.selectedEncounterId ?  this.props.unExpectedEncounterData.selectedEncounterId :   this.props.patientId});
        }, (error) => {
           Common.clearNotification();
           NotificationManager.error('Something Went Wrong');
        })
    }

    hideEncounterDetailBox =(text,e)=> {
        if(this.props.encounter.patientCheckInStatus!==1){
            e.preventDefault();
        }else{
            if(text === 'DND'){
                this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_DND,{
                    onSave : (data) => {
                        let saveDND = {
                            "element_unique_identefier": this.props.encounter && this.props.encounter.uniqueIdentifier,
                            "reasonForSkip":  data.comment ?  data.comment : '',
                            "skipped": this.state.hideEncounterBlock ? 0 : 1,
                            "unique_identifier": this.props.encounter && this.props.encounter.formUniqueIdentifier
                        }
                      this.saveDNDApi(saveDND);
                    }
                });
            }
            else{
                let saveDND = {
                    "element_unique_identefier": this.props.encounter && this.props.encounter.uniqueIdentifier,
                    "reasonForSkip": '',
                    "skipped": this.state.hideEncounterBlock ? 0 : 1,
                    "unique_identifier": this.props.encounter && this.props.encounter.formUniqueIdentifier
                }
                this.saveDNDApi(saveDND);
            }
        }
    }

    //for getting the percentage value
    getFillPercentage(encData){

        if(encData.total && encData.completed){
           return  Math.floor(((encData.completed/encData.total)*100))
        }
        return 0;
   }

   componentWillReceiveProps(nextProps){
        if(nextProps.encounter.skipped != this.props.encounter.skipped){
            this.setState({
                hideEncounterBlock : nextProps.encounter.skipped === 1 ? true : false,
                dndText:nextProps.encounter.skipped === 1 ? 'Not DND' : 'DND'
            })
        }
        if(nextProps.encounter.patientCheckInStatus != this.props.encounter.patientCheckInStatus){
            this.setState({
                hideEncounterBlockPatientStatus : nextProps.encounter.patientCheckInStatus === 1 ? false : true
            })
        }

   }

   enableElementClick(event,propsObj){
        if(!propsObj.unexpectedEncounter && propsObj.encounter.patientCheckInStatus == 0 ){
            Common.clearNotification();
            NotificationManager.warning('Please checkin the patient');
        }
   }

    getDynamicUrl=(evt,eleInfo)=>{
        if(eleInfo && eleInfo.patinetEncounterFormStatusForEXP && this.props.encounter.url && (this.props.encounter.url).indexOf("fromUnexpectedEncounter")>-1){
            if(this.props.unexpectedEncounter){
                if(this.props.unExpectedEncounterData && this.props.unExpectedEncounterData.unExpectedEnounterName){
                //creating before process to  fill form
                let urlKey = '/patientdetails/patientdescription/patientEncounter/element/:uniqIdenfier/:elementFormIdenfier/:patEncId/:patDetailIdentity/:studyIdentity/:siteIdentifier/:epochIdentifier';
                let urlParams = new Route(urlKey).match(this.props.encounter.url);

                let unExpectedEncounterName = '';
                if(localStorage.getItem("unExpectedEncounterName")){
                 unExpectedEncounterName =  localStorage.getItem("unExpectedEncounterName")
                }
                let Obj = {
                    "element_unique_identefier": urlParams && urlParams.uniqIdenfier,
                    "encounter_unique_identefier":    urlParams && urlParams.patEncId,
                    "studyIdentefier": this.props.match && this.props.match.params.studyIdentity,
                    "unexpectedEncounterName" : unExpectedEncounterName,
                    "site_patient_unique_identefier": this.props.match && this.props.match.params.patDetailIdentity,
                    "patientEncounterGroupIdentifier": this.props.patientId //props.patientId `UN${Common.getRandomNumber()}`
                }

               // return false;
                ApiService.sheduleUnexpectedEncounter(Obj).then( (res)=>{
                    if(res && res.data && res.data.response){
                        let newFormUrl = `/patientdetails/patientdescription/patientEncounter/element/${urlParams.uniqIdenfier}/${res.data.response.patientFormIdentifier}/${urlParams.patEncId}/${urlParams.patDetailIdentity}/${urlParams.studyIdentity}/${this.props.patientId}/fromUnexpectedEncounter`;//fromUnexpectedEncounter
                       //  urlParams.siteIdentifier
                        this.setState({ enableUrlForUnExpectedEnc :  true },()=>{
                            if(this.state.enableUrlForUnExpectedEnc){
                               // this.props.history &&  this.props.history.push(this.props.encounter.url)
                               this.props.history &&  this.props.history.push(newFormUrl)
                            }
                        })
                    }
                })

                }
                else{
                    Common.clearNotification();
                    NotificationManager.warning('Please fill the required fields');
                }
            }
        }
        else{
            if(this.props.unexpectedEncounter){
                if(this.props.unExpectedEncounterData && this.props.unExpectedEncounterData.unExpectedEnounterName){
                    this.setState({ enableUrlForUnExpectedEnc :  true },()=>{
                        if(this.state.enableUrlForUnExpectedEnc){
                            this.props.history &&  this.props.history.push(this.props.encounter.url)
                        }
                    })
                }else{
                    Common.clearNotification();
                    NotificationManager.warning('Please fill the required fields');
                }
            }
        }


    }

    conditionalCss =()=>{
        console.log("this.props.encounter.domainCode",this.props.encounter.domainCode);
    if(this.props.encounter.domainCode == "EREVPI" || this.props.encounter.domainCode == "EREVSM"){
        console.log("this.props.encounter.smPiEnabled",this.props.encounter.smPiEnabled);
            return `p-0 col-md-2 col-half-offset ${this.props.encounter.smPiEnabled !== 1 ? 'e-hide' : ''}`;
    }else{
        return `p-0 col-md-2 col-half-offset ${!this.props.unexpectedEncounter && ( this.state.hideEncounterBlock || this.state.hideEncounterBlockPatientStatus) ? 'e-hide' : ''}`;

    }
}
conditionalURL =()=>{
    if(!this.props.unexpectedEncounter){
        if(this.state.hideEncounterBlockPatientStatus || this.state.hideEncounterBlock){
            return '#'
        }else{
            if((this.props.encounter.domainCode == "EREVPI" || this.props.encounter.domainCode == "EREVSM") && this.props.encounter.smPiEnabled !==1){
                return '#'
            }else{
                return this.props.encounter.url
            }
        }
    }else{
        return '#'
    } 
}

    render({props,state} = this){
        let  iconStyle={};
        let updatedUrl = props.encounter.url;
        if(isIE){
              iconStyle={background:`-ms-linear-gradient(bottom, #691e44 ${Number(  (props.encounter.completePercentage =='NaN' || props.encounter.completePercentage =='') ? 0: props.encounter.completePercentage)}%, #928d94 ${Number((props.encounter.completePercentage =='NaN' || props.encounter.completePercentage =='') ? 0: props.encounter.completePercentage)}%)`}
        }else if(isFirefox){
              iconStyle={background:`-moz-linear-gradient(bottom, #691e44 ${Number(  (props.encounter.completePercentage =='NaN' || props.encounter.completePercentage =='') ? 0: props.encounter.completePercentage)}%, #928d94 ${Number((props.encounter.completePercentage =='NaN' || props.encounter.completePercentage =='') ? 0: props.encounter.completePercentage)}%)`}
        }else{
              iconStyle={background:`-webkit-linear-gradient(bottom, #691e44 ${Number( (props.encounter.completePercentage =='NaN' || props.encounter.completePercentage =='') ? 0: props.encounter.completePercentage)}%, #928d94 ${Number((props.encounter.completePercentage =='NaN' || props.encounter.completePercentage =='') ? 0: props.encounter.completePercentage)}%)`}
        }

        return  ( <div className={this.conditionalCss()}
                    onClick={(event)=>this.enableElementClick(event,this.props)}>
                <div className={"shadow-box text-center "+((props.encounter.elementName == "Comments" || props.encounter.elementType == "Review")? 'commentbox':'') + " p-4 c-p mr-3 mt-3"}>
                    <NavLink onClick={(event)=>this.getDynamicUrl(event,props.encounter)} to={this.conditionalURL()}>
                        <img className="img-fluid" style={iconStyle} src={"assets/images/icon/" + ( props.encounter.elementType ? props.encounter.elementType.toLowerCase() : 'no-image') +".png"} />
                        <h6 className="c-p"><b>{props.encounter.completionRange}</b></h6>
                        <h6 className="c-p"><strong title={props.encounter.elementName}>{props.encounter.elementName ? Common.getSubString(props.encounter.elementName,10) : '--'}</strong></h6>
                    </NavLink>
                    {!props.unexpectedEncounter && !props.unExpectedEncounterData.isUnexpected && props.encounter.elementName!="Comments" && props.encounter.elementType !="Review" && <span className={`eye-icon`}>
                        <button type="button" className={`btn btn-xs xmbtn ${this.state.hideEncounterBlock ? 'notDndColr' : ''} ${this.state.hideEncounterBlockPatientStatus || ( this.showEncounterStart && parseInt(this.showEncounterStart[0]) > 0) ? 'e-hide' : ''}`}
                            onClick={(event)=> { ( this.showEncounterStart && parseInt(this.showEncounterStart[0]) > 0 ) ? '' : this.hideEncounterDetailBox(this.state.dndText,event)  }}> {this.state.dndText} </button>
                    </span>
                    }
                </div>
            </div>

        )}
}


function mapDispatchToProps(dispatch) {
    return { modalAction  : bindActionCreators(modalAction,dispatch) };
}


function mapStateToProps(state){
    return { modal : state.modal }
}

export default withRouter(connect(mapStateToProps , mapDispatchToProps)(EncounterDetailList));
