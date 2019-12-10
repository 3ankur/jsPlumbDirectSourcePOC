/**
* Copyright (c) 2018
* @summary Add Patient Modal
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React from 'react';
import { connect } from 'react-redux';
import { hideModal } from '../../actions/modalActions';
import Modal from '../modaldialog/modal';
import DateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import ApiService from '../../api';
import ReactSuperSelect from 'react-super-select';
import '../../../node_modules/react-super-select/lib/react-super-select.css';
import common from '../../common/common';
import { NotificationManager } from 'react-notifications';

    var toDay = DateTime.moment();
    var valid = function( current ){
        return current.isBefore( toDay );
    };

class AddPatientModal extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            "addressLine1": "",
            "addressLine2": "",
            "city": "",
            "email": "",
            "emergencyContact": "",
            "firstName": "",
            "guardianEmail": "",
            "guardianFirstName": "",
            "guardianId": 0,
            "guardianIdentefier": "",
            "guardianLastName": "",
            "lastName": "",
            "neverCallAgain": 0,
            "patientId": 0,
            "patientIdentefier": "",
            "postalCode": "",
            "primaryContact": "",
            "state": "",
            "studyIdentifier": "",
            "studySiteIdentifier": "",
            study:"",
            site:"",
            dobDatePicker : false,
            dob:'',
            studySiteDetailsList:[],
            siteList:[]
          },
          this.PatientEditResponse = '';

    }

    componentDidMount(){
        ApiService.get_all_studies().then((res)=>{
            res && res.data.response.forEach( (d)=>{
                d.id  = d.uniqueIdentifier;
                d.name = d.studyName;
            });
            this.setState({studySiteDetailsList:res.data.response},()=>{
                console.log("its thje dit pa",this.props.PatientEditData);
                if(this.props.PatientEditData){
                    ApiService.editPatientData(this.props.PatientEditData &&  this.props.PatientEditData.patientUniqueIdentifier).then((res) => {
                        let studyFound = res.data.response && this.state.studySiteDetailsList.filter((o)=>{return o.id==res.data.response.studyIdentifier} )
                        let siteFound = res.data.response && this.state.siteList.filter((o)=>{return o.id==res.data.response.studySiteIdentifier} )
                        this.PatientEditResponse  = res.data && res.data.response;
                        this.setState({
                            "addressLine1": res.data.response.addressLine1,
                            "addressLine2": res.data.response.addressLine2,
                            "city": res.data.response.city,
                            "dob": res.data.response.dob,
                            "email": res.data.response.email,
                            "emergencyContact": res.data.response.emergencyContact,
                            "firstName": res.data.response.firstName,
                            "lastName": res.data.response.lastName,
                            "neverCallAgain":res.data.response.neverCallAgain,
                            "patientId": res.data.response.patientId ? res.data.response.patientId : "",
                            "postalCode": res.data.response.postalCode,
                            "primaryContact": res.data.response.primaryContact,
                            "state": res.data.response.state,
                            "guardianEmail": res.data.response.guardianEmail,
                            "guardianFirstName": res.data.response.guardianFirstName,
                            "guardianId": res.data.response.guardianId,
                            "guardianLastName": res.data.response.guardianLastName,
                            "patientIdentefier": res.data.response.patientIdentefier,
                            "guardianIdentefier":  res.data.response.guardianIdentefier,
                            "studyIdentifier": res.data.response.studyIdentifier,
                            "studySiteIdentifier": res.data.response.studySiteIdentifier,
                             study :  studyFound.length >0 ? studyFound[0]["name"] : null,
                             site :  siteFound.length >0 ? siteFound[0]["name"] : null,
                             "patientUniqueIdentifier":this.props.PatientEditData.patientUniqueIdentifier,
                             "patientId": res.data.response.patientId,
                             "sourceIdentifier":res.data.response.sourceIdentifier,
                             "guardianId":res.data.response.guardianId
                        });
                      }, (error) => {
                          common.clearNotification();
                          NotificationManager.error('something went wrong');
                     });
                }
            });
        });
    }

    onClose = ()=>{
        this.props.hideModal && this.props.hideModal();
    }

    onSavePatient = () =>{
     if(this.state &&  this.state.firstName && this.state.dob && this.state.study && this.state.site )  {
        this.props.onSave && this.props.onSave(this.state);
     }else{
        common.clearNotification();
        NotificationManager.error('Please fill the required fields');
     }

    }

    onChangeTextVal = (e)=>{
    this.setState({
        [e.target.name] : e.target.value
    })
    }

    handleStudyChange = (options)=>{
        if(options){
            this.setState({
                study : options.name,
                studyIdentifier : options.id
            });
            let data = options.id;
            ApiService.GetPopulatedStudyDetails(data).then((res) => {
                res && res.data.response.listOfSites.forEach( (d)=>{
                    d.id  = d.unique_identifier;
                    d.name = d.site_name;
                });
              this.setState({ siteList : common.sortByOrder(res.data.response.listOfSites || [] ,'ASC','name') },()=>{
                    if(this.props.PatientEditData){
                        let siteFound = this.state.siteList.filter((o)=>{return o.id == this.PatientEditResponse.studySiteIdentifier} )
                        this.setState({site:siteFound.length >0 ? siteFound[0]["name"] : null ,
                        studySiteIdentifier: siteFound.length >0  ? this.PatientEditResponse.studySiteIdentifier : ''})
                    }
                    else{
                        this.setState({
                        studySiteIdentifier:''})
                    }
                });
            },(error) => {
                NotificationManager.error('something went wrong');
            });
        }
    }

    handleSiteChange = (options)=>{
        if(options){
            this.setState({
                site : options.name,
                studySiteIdentifier : options.id
            });
        }
    }

    onChangeDOBDate = (moment) =>{
        this.setState({
            dob : common.formatDate(moment && moment._d,'DD/MMM/YYYY'),
            dobDatePicker : false
        });
    }

    customSelectedValueTemplateFunction = (selectedItmes) =>{
        return(
            <div className='selected-dropdown-itmes'>
                { selectedItmes.map((item)=>{
                    return(
                        <span key={item.id}>
                            {item.name}
                            { selectedItmes.length > 1 ? ',' : ''}
                        </span>
                    )
                    })
                }
            </div>
        )
    }
    getSelectedOption = (id,dataSource)=>{
        let filterArray = dataSource && dataSource.length > 0 && dataSource.filter((o)=>{ return o.id === id });
        return filterArray && filterArray.length > 0 && filterArray[0] ? filterArray[0] : null
    }

    isNumericInput = (event) => {
        const key = event.keyCode;
        return ((key >= 48 && key <= 57) || // Allow number line
            (key >= 96 && key <= 105) // Allow number pad
        );
    };

    isModifierKey = (event) => {
        const key = event.keyCode;
        return (event.shiftKey === true || key === 35 || key === 36) || // Allow Shift, Home, End
            (key === 8 || key === 9 || key === 13 || key === 46) || // Allow Backspace, Tab, Enter, Delete
            (key > 36 && key < 41)  // Allow left, up, right, down
    };


    enforceFormat = (event) => {
        // Input must be of a valid number format or a modifier key, and not longer than ten digits
        if(!this.isNumericInput(event) && !this.isModifierKey(event)){
            event.preventDefault();
        }
    };

    formatToPhone = (event,phtype) => {
        if(this.isModifierKey(event)) {return;}
        const target = event.target;
        const input = event.target.value.replace(/\D/g,'').substring(0,10); // First ten digits of input only
        const zip = input.substring(0,3);
        const middle = input.substring(3,6);
        const last = input.substring(6,10);
        if(input.length > 6){target.value = `${zip}-${middle}-${last}`;}
        else if(input.length > 3){target.value = `${zip}-${middle}`;}
        else if(input.length > 0){target.value = `${zip}`;}
        if(phtype=='pri'){
            this.setState({primaryContact : target.value})
        }else{
            this.setState({emergencyContact : target.value})
        }
    };

    onChangeContactNo = (event,phtype) =>{
        if(phtype=='pri'){
            this.setState({primaryContact : event.target.value})
        }else{
            this.setState({emergencyContact : event.target.value})
        }
    }

    handlePatientCheckInChange=(event,type)=>{
        if(type === 'yes'){
            this.setState({
                neverCallAgain : event.target.checked ? 1 : 0
            });
        } else if(type === 'no'){
            this.setState({
                neverCallAgain : event.target.checked ? 2 : 0
            });
        }else{
            this.setState({
                neverCallAgain : 0
            });
        }
    }

    customOptionTemplateFunction = (item, search, searchRegex) => {
        return <span title={item.name}>{item.name}</span>
    }

    render({props,state} = this){
        return (
            <Modal onClose={this.onClose} className={props.className}>
                <div className="modal-header border-bottom-p mx-4 p-0 py-3">
                    <h5 className="modal-title c-p" id="exampleModalLabel">{this.props.PatientEditData && this.props.PatientEditData.patientUniqueIdentifier ? "Edit Patient Details" : "Add Patient Details" } </h5>
                    <button type="button" className="close c-p" data-dismiss="modal" aria-label="Close" onClick={this.onClose}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body px-4 text-left">
                    <form className="formOverflow">
                        <div className="row col-md-12 pr-0">
                            <div className="form-group col-md-6 pl-0">
                                <label htmlFor="title">First Name</label>
                                <input className="form-control reqfeild" type="text" value={state.firstName} name="firstName" onChange={this.onChangeTextVal} />
                            </div>
                            <div className="form-group col-md-6 pr-0">
                                <label htmlFor="title">Last Name</label>
                                <input className="form-control reqfeild" type="text"  value={state.lastName} name="lastName" onChange={this.onChangeTextVal} />
                            </div>
                        </div>
                        <div className="row col-md-12 pr-0">
                            <div className="form-group col-md-6 pl-0">
                                <label htmlFor="title">Date of Birth</label>
                                <DateTime dateFormat="DD/MMM/YYYY"
                                    timeFormat={false}
                                    onChange={(event)=>this.onChangeDOBDate(event)}
                                    closeOnSelect={true}
                                    open={this.state.dobDatePicker}
                                    input={true}
                                    className='reqfeild'
                                    isValidDate={ valid }
                                    value={state.dob}
                                    inputProps={{ readOnly: true }}
                                />
                                <i className="glyphicon glyphicon-calendar dateicon3 cursor-pointer" onClick={()=>this.setState({dobDatePicker : !this.state.dobDatePicker})}></i>
                            </div>
                            <div className="form-group col-md-6 pr-0">
                                <label htmlFor="title">Email</label>
                                <input className="form-control" type="text"  value={state.email} name="email" onChange={this.onChangeTextVal} />
                            </div>
                        </div>
                        <div className="row col-md-12 pr-0">
                            <div className="form-group col-md-4 pl-0">
                                <label htmlFor="title">Primary Contact</label>
                                <input type="text" id='contNo'  placeholder="(123) 456-7890" value={state.primaryContact} className="form-control" name='primaryContact'
                                       onKeyDown={this.enforceFormat} onKeyUp={(event)=>this.formatToPhone(event,'pri')} onChange={(event)=>this.onChangeContactNo(event,'pri')}/>
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="title">Emergency Contact </label>
                                <input type="text" id='EcontNo'  placeholder="(123) 456-7890" value={state.emergencyContact} className="form-control" name='emergencyContact'
                                       onKeyDown={this.enforceFormat} onKeyUp={(event)=>this.formatToPhone(event,'emr')} onChange={(event)=>this.onChangeContactNo(event,'emr')}/>
                            </div>
                            <div className="form-group col-md-4 pr-0">
                                <label htmlFor="title">Never Call Again</label>
                                <div className="pr-1">
                                    <div className="col-auto d-flex flex-row p-0 pt-1">
                                        <span className="float-left pr-2 text-right">Yes</span>
                                        <div className="radio-wrapper">
                                            <input type="radio" name="name2"  checked={state.neverCallAgain ==1 ? true : false}   className="yes" id="id4"
                                                 onChange={(event)=>this.handlePatientCheckInChange(event,"yes")} />
                                            <label htmlFor="id4"></label>
                                            <input type="radio" name="name2"  className="neutral"  id="id5"
                                                 onChange={(event)=>this.handlePatientCheckInChange(event,null)}  checked={ state.neverCallAgain!=1 && state.neverCallAgain!=2 ? true : false}  />
                                            <label htmlFor="id5"></label>
                                            <input type="radio" name="name2"  checked={state.neverCallAgain ==2 ? true : false} className="no" id="id6"
                                                 onChange={(event)=>this.handlePatientCheckInChange(event,"no")} />
                                            <label htmlFor="id6"></label>
                                        </div>
                                        <span className="px-2 text-right">No</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row col-md-12 pr-0">
                            <div className="form-group col-md-6 pl-0">
                                <label htmlFor="title">Address</label>
                                <input className="form-control" type="text" value={state.addressLine1} name="addressLine1" onChange={this.onChangeTextVal} />
                            </div>
                            <div className="form-group col-md-6 pr-0">
                                <label htmlFor="title"></label>
                                <input className="form-control mt-2" type="text" value={state.addressLine2} name="addressLine2" onChange={this.onChangeTextVal} />
                            </div>

                        </div>
                        <div className="row col-md-12 pr-0">
                            <div className="form-group col-md-4 pl-0">
                                <label htmlFor="title">City</label>
                                <input className="form-control" type="text" value={state.city} name="city" onChange={this.onChangeTextVal} />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="title">ZIP Code</label>
                                <input className="form-control" type="text" value={state.postalCode} name="postalCode" onChange={this.onChangeTextVal} />
                            </div>
                            <div className="form-group col-md-4 pr-0">
                                <label htmlFor="title">State</label>
                                <input className="form-control" type="text" value={state.state ? state.state : ""} name="state" onChange={this.onChangeTextVal} />
                            </div>
                        </div>
                        <div className="row col-md-12 pr-0 guardianLabel">
                        <h5 className="c-p" id="exampleModalLabel">Guardian Details</h5>
                        </div>
                        <div className="row col-md-12 pr-0">
                            <div className="form-group col-md-4 pl-0">
                                <label htmlFor="title">First Name</label>
                                <input className="form-control" type="text" value={state.guardianFirstName ? state.guardianFirstName : ""} name="guardianFirstName" onChange={this.onChangeTextVal} />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="title">Last Name</label>
                                <input className="form-control" type="text" value={ state.guardianLastName ?  state.guardianLastName : "" } name="guardianLastName" onChange={this.onChangeTextVal} />
                            </div>
                            <div className="form-group col-md-4 pr-0">
                                <label htmlFor="title">Email</label>
                                <input className="form-control" type="text" value={ state.guardianEmail ? state.guardianEmail : ""} name="guardianEmail" onChange={this.onChangeTextVal} />
                            </div>
                        </div>

                    </form>
                </div>
                <div className="modal-footer text-left footer-bg-light py-2 px-3">
                    <div className="row col-12 p-0 justify-content-between">
                        <div className="col-md-9 col-sm-9 p-0">
                            <div className="form-row p-0 col-12">
                                <div className="form-group col-md-4 col-sm-6 custred">
                                    <label htmlFor="title" className="c-p"><strong>Study</strong></label>
                                    <ReactSuperSelect
                                        placeholder="Select"
                                        clearSearchOnSelection={true}
                                        dataSource={this.state.studySiteDetailsList || [] }
                                        onChange={this.handleStudyChange}
                                        searchable={true}
                                        multiple={false}
                                        keepOpenOnSelection={false}
                                        closeOnSelectedOptionClick={false}
                                        deselectOnSelectedOptionClick={true}
                                        customClass='select-container'
                                        customOptionTemplateFunction={this.customOptionTemplateFunction}
                                        customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                        clearable = {false}
                                        disabled={this.props.PatientEditData && this.props.PatientEditData.patientUniqueIdentifier ? true : false}
                                        initialValue={ this.state && this.state.studyIdentifier ? this.getSelectedOption(this.state.studyIdentifier,this.state.studySiteDetailsList) : null }
                                    />
                                </div>
                                <div className="form-group col-md-4 col-sm-6 custred">
                                    <label htmlFor="title" className="c-p"><strong>Site</strong></label>
                                    <ReactSuperSelect
                                        placeholder="Select"
                                        clearSearchOnSelection={true}
                                        dataSource={state.siteList || [] }
                                        onChange={this.handleSiteChange}
                                        searchable={true}
                                        multiple={false}
                                        keepOpenOnSelection={false}
                                        closeOnSelectedOptionClick={false}
                                        deselectOnSelectedOptionClick={true}
                                        customClass='select-container'
                                        customOptionTemplateFunction={this.customOptionTemplateFunction}
                                        customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                        clearable = {false}
                                        disabled={this.props.PatientEditData && this.props.PatientEditData.patientUniqueIdentifier ? true : false}
                                        initialValue={ state.studySiteIdentifier ? this.getSelectedOption(this.state.studySiteIdentifier,state.siteList)  : null}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-3 mt-2">
                            <br/>
                            <button type="button" className="btn text-white align-bottom bg-p mr-2" onClick={this.onSavePatient}>{this.props.PatientEditData && this.props.PatientEditData.patientUniqueIdentifier ? "Update" : "Add"}</button>
                            <button type="button" className="btn text-white align-bottom bg-p" onClick={this.onClose}>Cancel</button>
                        </div>
                    </div>

                </div>
            </Modal>
          );
        };
    }

export default connect(null, { hideModal })(AddPatientModal);
