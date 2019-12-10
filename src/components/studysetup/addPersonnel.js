/**
* Copyright (c) 2018
* @summary This file is use under  Setup -> Study Setup -> Site Deatils
          Open Popup and show form for add perssonel
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React,{Component} from 'react';
import { connect } from 'react-redux';
import Modal from '../modaldialog/modal';
import DateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import common from '../../common/common';
import ApiService from '../../api';
import {NotificationManager} from 'react-notifications';
import ReactSuperSelect from 'react-super-select';
import '../../../node_modules/react-super-select/lib/react-super-select.css';
import moment from 'moment';

class AddPersonnelModal extends Component{
    constructor(props){
        super(props);
        this.state = {
            addPersonnelData : {
                role: '',
                name:'',
                status:'',
                contact_number : '',
                startDate:'',
                endDate:''
            },
            error:false,
            sitePersonnelId:0,
            dateError : false,
            openStartDateCalender:false,
            openEndDateCalender:false,
            disbledfilter:false,
            roleList:[],
            NameList : []
        }
        this.contactNoValidation = ''
    }

    onClose = () => {
        this.props.hideModal && this.props.hideModal();
        if (this.props.afterClose) {
            this.props.afterClose();
        }
    };

    onSavePersonnel = () =>{
        if(this.state.addPersonnelData.role && this.state.addPersonnelData.role !== 'Select Role' &&
                this.state.addPersonnelData.name && this.state.addPersonnelData.name !== 'Select'
                && this.state.addPersonnelData.status && this.state.addPersonnelData.status != 'Select' && this.state.addPersonnelData.startDate){
            if( this.state.addPersonnelData.contact_number){
                let formatedContactNo = this.state.addPersonnelData.contact_number && this.state.addPersonnelData.contact_number.split('-');
                this.contactNoValidation = formatedContactNo && (
                    ( formatedContactNo[0] ? formatedContactNo[0] : '' ) +
                    ( formatedContactNo[1] ? formatedContactNo[1] : '' ) +
                    (formatedContactNo[2] ? formatedContactNo[2] : '' ))
                if(this.contactNoValidation.length == 10){
                    this.setState({error : false, sitePersonnelId : this.props.editId ? this.props.editId : 0 });
                    if(this.state.addPersonnelData.status && this.state.addPersonnelData.status.toLocaleLowerCase() === 'inactive'){
                        if(this.state.addPersonnelData.endDate){
                            if (Date.parse(this.state.addPersonnelData.endDate) >= Date.parse(this.state.addPersonnelData.startDate)) {
                                this.props.onSave && this.props.onSave(this.state.addPersonnelData,this.props.editData ? this.props.editData._index : '');
                            }else{
                                common.clearNotification();
                               NotificationManager.error("End Date should be greater than Start Date")
                            }
                        }else{
                            common.clearNotification();
                            NotificationManager.error("Please fill the End Date field")
                        }
                    }else{
                        if(this.state.addPersonnelData.endDate){
                            if ( Date.parse(this.state.addPersonnelData.endDate) >= Date.parse(this.state.addPersonnelData.startDate)) {
                                this.props.onSave && this.props.onSave(this.state.addPersonnelData,this.props.editData ? this.props.editData._index : '');
                            }else{
                                common.clearNotification();
                                NotificationManager.error("End Date should be greater than Start Date")
                            }
                        }else{
                            this.props.onSave && this.props.onSave(this.state.addPersonnelData,this.props.editData ? this.props.editData._index : '');
                        }
                    }
                }else{
                    common.clearNotification();
                    NotificationManager.error("Contact number should not be less than 10 digits")
                }
            }else{
                this.setState({error : false, sitePersonnelId : this.props.editId ? this.props.editId : 0 });
                if(this.state.addPersonnelData.status && this.state.addPersonnelData.status.toLocaleLowerCase() === 'inactive'){
                    if(this.state.addPersonnelData.endDate){
                        if (Date.parse(this.state.addPersonnelData.endDate) >= Date.parse(this.state.addPersonnelData.startDate)) {
                            this.props.onSave && this.props.onSave(this.state.addPersonnelData,this.props.editData ? this.props.editData._index : '');
                        }else{
                            common.clearNotification();
                           NotificationManager.error("End Date should be greater than Start Date")
                        }
                    }else{
                        common.clearNotification();
                        NotificationManager.error("Please fill the End Date field")
                    }
                }else{
                    if(this.state.addPersonnelData.endDate){
                        if ( Date.parse(this.state.addPersonnelData.endDate) >= Date.parse(this.state.addPersonnelData.startDate)) {
                            this.props.onSave && this.props.onSave(this.state.addPersonnelData,this.props.editData ? this.props.editData._index : '');
                        }else{
                            common.clearNotification();
                            NotificationManager.error("End Date should be greater than Start Date")
                        }
                    }else{
                        this.props.onSave && this.props.onSave(this.state.addPersonnelData,this.props.editData ? this.props.editData._index : '');
                    }
                }
            }

        }else{
            common.clearNotification();
           NotificationManager.error("Please fill the required fields")
        }
    }

    onChangeValue = (dropdownObj,type)=>{
        if(dropdownObj){
            if(type === 'role'){
                this.setState({ addPersonnelData : {
                        ...this.state.addPersonnelData,
                        role : dropdownObj.name}
                    });
            }else if(type === 'name'){
                this.setState({ addPersonnelData : {
                    ...this.state.addPersonnelData,
                    name : dropdownObj.name,
                    contact_number:dropdownObj.contact_number || ""}
                },()=>{});
                document.getElementById("contNo").value =  dropdownObj.contact_number == "--" ? "" : dropdownObj.contact_number
            }else{

                this.setState({ addPersonnelData : {
                    ...this.state.addPersonnelData,
                    [dropdownObj.target.name] : dropdownObj.target.value ,
                        endDate : dropdownObj.target.value  === 'Active' ? '' : this.state.addPersonnelData.endDate
                    }
                });
            }
        }

    }

    onChangeStartDate = (moment,fromInput) =>{
        this.setState({  addPersonnelData : {
                ...this.state.addPersonnelData,
                startDate : moment//common.formatDate(moment && moment._d,'DD/MMM/YYYY')
            },
            openStartDateCalender : ( fromInput && fromInput !== 'fromInput' ) ?  !this.state.openStartDateCalender : false
        });
    }

    onChangeEndDate = (moment,fromInput) =>{
        this.setState({ addPersonnelData : {
            ...this.state.addPersonnelData,
            endDate : moment//common.formatDate(moment && moment._d,'DD/MMM/YYYY')
            },
            openEndDateCalender : ( fromInput && fromInput !== 'fromInput' ) ?  !this.state.openEndDateCalender : false

        });
    }

    componentDidMount(){
        if(this.props.editId){
            ApiService.editPersonnel(this.props.editId).then((res) => {
                this.setState({ addPersonnelData : {
                    ...res.data.response,
                    name : res.data.response.name,
                    contact_number : res.data.response.contact_number == "--" ? "" : res.data.response.contact_number,
                    startDate: res.data.response.start_date &&  moment(res.data.response.start_date,"DD/MMM/YYYY"), //res.data.response.start_date,
                    endDate: res.data.response.end_date &&  moment(res.data.response.end_date,"DD/MMM/YYYY") ,  //res.data.response.end_date,
                    status: res.data.response.status ,//== 2 ? "Inactive" : "Active"

                },
                disbledfilter:true
            });
             },(error) => {
                 NotificationManager.error('something went wrong');
             });
        }
            ApiService.getRolePersonnel().then((res) => {
                res && res.data.response.forEach( (d)=>{
                    d.id = d.unique_identifier;
                    d.name = d.title;
                    })
                this.setState({roleList:res.data.response});
             },(error) => {
                 NotificationManager.error('something went wrong');
             });

             ApiService.getPersonnelName(this.props.studySiteID).then((res) => {
                res && res.data.response.forEach( (d)=>{
                    d.id = d.unique_identifier;
                    d.name = d.lastName+','+d.firstName;
                })
                this.setState({NameList:res.data.response});
             },(error) => {
                 NotificationManager.error('something went wrong');
             });
    }

    customSelectedValueTemplateFunction = (selectedItmes) =>{
        return(
            <div className='selected-dropdown-itmes'>
                {
                    selectedItmes.map((item)=>{
                        return(
                            <span key={item.id ? item.id : common.getRandomNumber()}>
                                {item.name}
                                { selectedItmes.length > 1 ? ',' : ''}
                            </span>
                        )
                    })
                }
            </div>
        )
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

    formatToPhone = (event) => {
        if(this.isModifierKey(event)) {return;}
        const target = event.target;
        const input = event.target.value.replace(/\D/g,'').substring(0,10); // First ten digits of input only
        const zip = input.substring(0,3);
        const middle = input.substring(3,6);
        const last = input.substring(6,10);
        if(input.length > 6){target.value = `${zip}-${middle}-${last}`;}
        else if(input.length > 3){target.value = `${zip}-${middle}`;}
        else if(input.length > 0){target.value = `${zip}`;}
        this.setState({
            addPersonnelData :{
                ...this.state.addPersonnelData,
                contact_number : target.value
            }
        })
    };

    onChangeContactNo = (event) =>{
        this.setState({
            addPersonnelData : {
                ...this.state.addPersonnelData,
                contact_number : event.target.value
            }
        })
    }

    render({props,state} = this){
        let { afterClose, hideModal, onSave } = props;
        return (
            <Modal onClose={this.onClose} className={props.className}>
                <div className="modal-header border-bottom-p mx-4 p-0 py-3">
                    <h5 className="modal-title c-p" id="exampleModalLabel"> { props.isEdit ? <span>Edit</span> : <span>Add</span> } Personnel</h5>
                    <button type="button" className="close c-p" data-dismiss="modal" aria-label="Close" onClick={this.onClose}>
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body px-4 text-left pt-1">
                    <div className="row">
                        <div className="col-6">
                            <div className="form-group custred">
                                <label htmlFor="site">Role</label>
                                <ReactSuperSelect
                                    placeholder="Select"
                                    clearSearchOnSelection={true}
                                    dataSource={state.roleList ? state.roleList : [] }
                                    onChange={(option)=>this.onChangeValue(option,'role')}
                                    searchable={true}
                                    keepOpenOnSelection={false}
                                    closeOnSelectedOptionClick={true}
                                    deselectOnSelectedOptionClick={false}
                                    customClass='select-container'
                                    customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                    clearable = {false}
                                    disabled={this.state.disbledfilter}
                                    initialValue={state.addPersonnelData.role ? { name : state.addPersonnelData.role } : null}
                                />
                            </div>
                        </div>
                        <div className="col-6 row pr-0">
                            <div className="form-group col pr-0 custred">
                                <label htmlFor="site">Name</label>
                                <ReactSuperSelect
                                    placeholder="Select"
                                    clearSearchOnSelection={true}
                                    dataSource={state.NameList ? state.NameList : [] }
                                    onChange={(option)=>this.onChangeValue(option,'name')}
                                    searchable={true}
                                    keepOpenOnSelection={false}
                                    closeOnSelectedOptionClick={true}
                                    deselectOnSelectedOptionClick={false}
                                    customClass='select-container'
                                    customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                    clearable = {false}
                                    disabled={this.state.disbledfilter}
                                    initialValue={state.addPersonnelData.name ? { name : state.addPersonnelData.name ,contact_number:state.addPersonnelData.contact_number}  : null }
                                    />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <div className="form-group custred">
                                <label htmlFor="site">Status</label>
                                <div className="input-group">
                                    <select className="form-control reqfeild" name='status' value={state.addPersonnelData.status} onChange={this.onChangeValue}>
                                        <option>Select</option>
                                        <option>Active</option>
                                        <option>Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-group">
                                <label htmlFor="site">Contact No.</label>
                                <div className="input-group">
                                    <input type="text" id='contNo'  placeholder="(123) 456-7890" className="form-control" name='contact_number'
                                       onKeyDown={this.enforceFormat} onKeyUp={this.formatToPhone} onChange={this.onChangeContactNo}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <div className="form-group">
                                <label htmlFor="site">Start Date</label>
                                <div className="input-group">
                                    <DateTime dateFormat="DD/MMM/YYYY"
                                        timeFormat={false}
                                        onChange={(event)=>this.onChangeStartDate(event,'fromInput')}
                                        value={state.addPersonnelData.startDate}
                                        closeOnSelect={true}
                                        name='startDate'
                                        disableOnClickOutside={false}
                                        closeOnTab={true}
                                        className='reqfeild'
                                        open={this.state.openStartDateCalender}
                                        inputProps={{ readOnly: true }}
                                    />
                                    <i className="glyphicon glyphicon-calendar dateicon3 cursor-pointer" onClick={()=>this.setState({openStartDateCalender : !this.state.openStartDateCalender})}></i>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-group">
                                <label htmlFor="site">End Date</label>
                                <div className="input-group">
                                    <DateTime dateFormat="DD/MMM/YYYY"
                                        timeFormat={false}
                                        onChange={(event)=>this.onChangeEndDate(event,'fromInput')}
                                        value={state.addPersonnelData.endDate}
                                        closeOnSelect={true}
                                        name='endDate'
                                        closeOnTab={true}
                                        className=''
                                        open={this.state.openEndDateCalender}
                                        inputProps={{ readOnly: true }}
                                    />
                                    <i className="glyphicon glyphicon-calendar dateicon3 cursor-pointer" onClick={()=>this.setState({openEndDateCalender : !this.state.openEndDateCalender})}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer border-0 pr-0">
                       {
                           props.isEdit ? <button type="button" className="btn text-white align-bottom bg-p" onClick={this.onSavePersonnel}>Save</button>
                           : <button type="button" className="btn text-white align-bottom bg-p" onClick={this.onSavePersonnel}>Add</button>
                       }
                        <button type="button" className="btn text-white align-bottom bg-p" onClick={this.onClose}>Cancel</button>
                    </div>
                </div>
            </Modal>
        );
    }

}

export default connect(null, null )(AddPersonnelModal);