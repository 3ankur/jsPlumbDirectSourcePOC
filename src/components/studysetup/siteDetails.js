/**
* Copyright (c) 2018
* @summary This file is use under  Setup -> Study Setup -> Site Deatils
            Contains all site data.
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React,{Component} from 'react';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import * as modalAction from '../../actions/modalActions';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux' ;
import { MODAL_TYPE_PERSONNEL_DETAILS, MODAL_TYPE_CONFIRM_POPUP } from '../../constants/modalTypes';
import DateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import ApiService from '../../api';
import Common from '../../common/common';
import {NotificationManager} from 'react-notifications';
import { NavLink } from 'react-router-dom';
import common from '../../common/common';
import moment from 'moment';

class SiteDetails extends Component{
    constructor(props){
        super(props);
        this.state = {
            siteDetails: {},
            personnelDetailsColumns:[]
        }
    }

    componentDidMount(){
        localStorage.setItem("fromMenu",false)
        const personnelDetailsColumns = [
            {
                Header: 'Role',
                accessor: 'role',
                Cell:row =>{
                    return(
                        row.row.role ? <span className='cursor-pointer'> { row.row.role} </span> : '--'
                    )
                }
            },
            {
                id:'Name',
                Header: 'Name',
                accessor:'name',
                sortable:true,
                Cell:row =>{
                    return(
                        row.row._original ? <span> {row.row._original.name} </span> : '--'
                    )
                }
            },
            {
                Header: 'Start Date',
                accessor: 'start_date',
                sortable:true,
                Cell:row =>{
                    return(
                        row.row.start_date ? <span> {row.row.start_date} </span> : '--'
                    )
                },
                sortMethod: (a,b,c)=>{
                    let fomatedOldDate  = a && moment(a,"DD/MMM/YYYY");
                    let formattedNewDate =  b && moment(b,"DD/MMM/YYYY");
                    let oldDate = fomatedOldDate &&  Date.parse(fomatedOldDate);
                    let newDate =  formattedNewDate && Date.parse(formattedNewDate);
                    return oldDate - newDate
                }
            },
            {
                Header: 'End Date',
                accessor: 'end_date',
                Cell:row =>{
                    return(
                        row.row.end_date ? <span> {row.row.end_date} </span> : '--'
                    )
                },
                sortMethod: (a,b,c)=>{
                    let fomatedOldDate  = a && moment(a,"DD/MMM/YYYY");
                    let formattedNewDate =  b && moment(b,"DD/MMM/YYYY");
                    let oldDate = fomatedOldDate &&  Date.parse(fomatedOldDate);
                    let newDate =  formattedNewDate && Date.parse(formattedNewDate);
                    return oldDate - newDate
                }
            },
            {
                Header: 'Status',
                accessor: 'status',
                Cell:row =>{
                    return(
                        row.row.status ? <span> { row.row.status} </span> : '--'
                    )
                }
            },
            /*{element
                Header: 'Action',
                accessor: 'action',
                sortable:false,
                Cell:row =>{
                    return(
                        <div className="d-flex flex-row text-dark pt-1 align-middle">
                            <i className="glyphicon glyphicon-edit pr-2" onClick={()=>this.onEditPersonnelRow(row && row.row)}></i>
                            <i className="glyphicon glyphicon-trash" onClick={()=>this.onDeletePersonnelRow(row && row.row)}></i>
                        </div>
                    )
                }
            }*/
        ]
        try{
            let data = this.props.match.params.siteName;
        ApiService.GetPopulatedSiteDetails(data).then((res) => {
           this.setState({siteDetails : res.data && res.data.response,personnelDetailsColumns:personnelDetailsColumns})
         },(error) => {
             NotificationManager.error('something went wrong');
        });

        }
        catch(e){

        }


    }

    onShowPersonnelModal = ()=>{
        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_PERSONNEL_DETAILS,{
            onSave : (data) => {
                let sendData ={};
                sendData['status']=data.status == "Inactive" ? 2 : 1;
                sendData['contact_number']=data.contact_number;
                sendData['end_date']=data.end_date;
                sendData['start_date']=data.start_date;
                sendData['uniqueIdentifier']=data.uniqueIdentifier;
                ApiService.savePersonnel(sendData).then((res) => {
                    let siteData = { "siteName": this.props.match.params.siteName }
                    this. updatePeronalInfo(siteData);
                },(error) => {
                    if (error.response && error.response.status == '404') {
                        NotificationManager.warning(error.response.data && error.response.data.apierror && error.response.data.apierror.message);
                    }else{
                        NotificationManager.error('something went wrong');
                    }
                });

            },
            hideModal : ()=>{ this.props.modalAction.hideModal(); },
            className:'personnel-modal'
        });
    }


    onEditPersonnelRow = (row)=>{
        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_PERSONNEL_DETAILS,{
            onSave : (data,index) => {
                let prevSt = this.state.siteDetails.sitePersonnels && [ ...this.state.siteDetails.sitePersonnels];
                let sendData ={};
                sendData['status']=data.status == "Inactive" ? 2 : 1;
                sendData['contact_number']=data.contact_number;
                sendData['end_date']=  moment.isMoment(data.endDate) ?  common.formatDate(data.endDate._d,'DD/MMM/YYYY') : data.endDate;
                sendData['start_date']= moment.isMoment(data.startDate) ? common.formatDate(data.startDate._d,'DD/MMM/YYYY') : data.startDate;
                sendData['uniqueIdentifier']=data.uniqueIdentifier;
                ApiService.savePersonnel(sendData).then((res) => {
                    let data = this.props.match.params.siteName;
                    ApiService.GetPopulatedSiteDetails(data).then((res) => {
                       this.setState({siteDetails : res.data && res.data.response},()=>{
                        this.props.modalAction.hideModal();
                       })
                     },(error) => {
                         NotificationManager.error('something went wrong');
                    });
                },(error) => {
                    if (error.response && error.response.status == '404') {
                        NotificationManager.warning(error.response.data && error.response.data.apierror && error.response.data.apierror.message);
                    }else{
                        NotificationManager.error('something went wrong');
                    }
                });
            },
            hideModal : ()=>{ this.props.modalAction.hideModal(); },
            className:'personnel-modal',
            isEdit:true,
            editData : row,
            editId:row._original.uniqueIdentifier,
            studySiteID:this.props.match && this.props.match.params.siteName
        });
    }


    updatePeronalInfo(siteData){
        ApiService.GetPopulatedSiteDetails(siteData).then((res) => {
            try{
                this.setState({ siteDetails:  res.data[0]
                });
                this.props.modalAction.hideModal();
            }
            catch(e){}
        },(error) => {
            NotificationManager.error('something went wrong');
        });
    }

    onDeletePersonnelRow = (row) =>{
        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_CONFIRM_POPUP,{
            onOkay : () => {
                let prevSt = [ ...this.state.siteDetails.personnels];
                let personnelId = prevSt[row._index].sitePersonnelId;
                ApiService.deletePersonnel(personnelId).then((res) => {
                    let siteData = {
                         "siteName": this.props.match.params.siteName
                     }
                    ApiService.GetPopulatedSiteDetails(siteData).then((res) => {
                        let prevSt =  res.data && [...res.data[0].personnels];
                        this.setState({ siteDetails:
                            res.data[0]
                        });
                        this.props.modalAction.hideModal();
                     },(error) => {
                         NotificationManager.error('something went wrong');
                     });
                 },(error) => {
                     NotificationManager.error('something went wrong');
                });
            },
            hideModal : ()=>{ this.props.modalAction.hideModal(); },
            className:'confirm-modal',
        });
    }

    onRowClick = (state, rowInfo, column) => {
        return {
            onClick: (e) => {
                rowInfo.row._original.isAccessible && this.onEditPersonnelRow(rowInfo && rowInfo.row)
            }
        }
    }

    render({props,state} = this){
       let { siteDetails } = state;
        return(
            <section className='siteDetails footpadb iefixflex'>
                <div  className="p-3 m-0 border row justify-content-between">
                    <div  className="row border-bottom-dotted col-12 m-0 p-0 justify-content-between mb-3">
                        <div className="col pl-0"> <h5  className="pt-2 c-p">Site Details: <span  className="text-muted bluetxt">
                            {siteDetails.name}
                            </span> </h5>
                        </div>
                        <div className='col pull-right d-flex justify-content-end p-0 mt-1'>
                            <h5 className="pt-1">Study:  <span  className=" bluetxt text-muted pt-1">
                                { siteDetails.study_name}</span>
                            </h5>
                        </div>
                    </div>
                    <div  className="row">
					    <div  className="col-md-2">
                            <div  className="form-group">
                                <label htmlFor="site">Name</label>
                                <div  className="input-group">
                                    <input type="text"  className="form-control" value={siteDetails.name || ''} disabled/>
                                </div>
                            </div>
                        </div>
					    <div  className="col-md-2 col-half-offset">
                            <div  className="form-group">
                                <label htmlFor="site">Status</label>
                                <div  className="input-group">
                                    <input type="text" className="form-control" value={siteDetails.status || ''} disabled/>
                                </div>
                            </div>
                        </div>
                        <div  className="col-md-2 col-half-offset">
                            <div  className="form-group">
                                <label htmlFor="site">Qualification Date</label>
                                <div  className="input-group">
                                    <DateTime
                                        timeFormat={false}
                                        value={siteDetails.qualificationDate}
                                        inputProps={{ disabled: true }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div  className="col-md-2 col-half-offset">
                            <div  className="form-group">
                                <label htmlFor="site">Initiation Date</label>
                                <div  className="input-group">
                                    <DateTime
                                        timeFormat={false}
                                        value={siteDetails.initiationDate}
                                        inputProps={{ disabled: true }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div  className="col-md-2 col-half-offset">
                            <div  className="form-group">
                                <label htmlFor="site">IRB Approval Date</label>
                                <div  className="input-group">
                                    <DateTime
                                        timeFormat={false}
                                        value={siteDetails.irbApprovalDate}
                                        inputProps={{ disabled: true }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div  className="col-md-2 col-half-offset">
                            <div  className="form-group">
                                <label htmlFor="site">Contract with Sponsor</label>
                                <div  className="input-group">
                                    <DateTime
                                        timeFormat={false}
                                        value={siteDetails.contractSponsorDate}
                                        inputProps={{ disabled: true }}
                                    />
                                </div>
                            </div>
                        </div>
					    <div  className="col-md-2 col-half-offset">
                            <div  className="form-group">
                                <label htmlFor="site">Contract with Site </label>
                                <div  className="input-group">
                                    <DateTime dateFormat="DD/MM/YYYY"
                                        timeFormat={false}
                                        value={siteDetails.contractSiteDate}
                                        inputProps={{ disabled: true }}
                                    />
                                </div>
                            </div>
					    </div>

                        <div className='col-xs-12 col-md-12 col-lg-12'></div>
                        <div  className="col-md-4 col-half-offset">
                            <div  className="form-group">
                                <label htmlFor="site">Address</label>
                                <input type="text"  className="form-control" value={siteDetails.address1 || ''} disabled/>
                            </div>
                        </div>
                        <div  className="col-md-2 col-half-offset">
                            <div  className="form-group">
                                <label htmlFor="site">State</label>
                                <div  className="input-group">
                                    <input type="text"  className="form-control" value={siteDetails.state || ''} disabled/>
                                </div>
                            </div>
                        </div>
                        <div  className="col-md-2 col-half-offset">
                            <div  className="form-group">
                                <label htmlFor="site">City</label>
                                <div  className="input-group">
                                    <input type="text"  className="form-control" value={siteDetails.city || ''} disabled/>
                                </div>
                            </div>
                        </div>
                        <div  className="col-md-2 col-half-offset">
                            <div  className="form-group">
                                <label htmlFor="site">ZIP Code</label>
                                <div  className="input-group">
                                    <input type="text"  className="form-control" value={siteDetails.zipCode || ''} disabled/>
                                </div>
                            </div>
                        </div>
                        <div  className="col-md-2 col-half-offset">
                            <div  className="form-group">
                                <label htmlFor="site">Elligo Phone</label>
                                <div  className="input-group">
                                    <input type="text"  className="form-control" value={ siteDetails.elligoPhone || ''} disabled/>
                                </div>
                            </div>
					    </div>
                        <div className='col-xs-12 col-md-12 col-lg-12'></div>
                        <div  className="col-md-4 col-half-offset">
                            <div  className="form-group">
                                <input type="text" className="form-control" value={siteDetails.address2 || ''} disabled/>
                            </div>
                        </div>
                        <div className='col-xs-12 col-md-12 col-lg-12'></div>
                    </div>
                    <div  className="row col-12 px-0 pt-1 pb-3 m-0">
						<div  className="col-md-12 row m-0 p-0 mb-2 justify-content-between border-bottom-dotted pb-0">
                            <h5  className="mt-2 col-md-8 col-sm-auto p-0 c-p ">Personnel Details</h5>
                            {/* <span onClick={this.onShowPersonnelModal} className="col-md-4 col-sm-auto pt-2">
                                <span  className="float-right c-b cursor-pointer">Personnel</span> <span  className="add-btn"><i  className="material-icons">add</i></span>
                            </span> */}
                        </div>
                        <div  className="col-12 border px-0 site-info-table">
                             <ReactTable
                                data={siteDetails.sitePersonnels}
                                columns={state.personnelDetailsColumns}
                                minRows={1}
                                multiSort ={true}
                                className='table activity-table table-responsive-sm m-0 '
                                showPagination={true}
                                nextText='>>'
                                previousText='<<'
                                defaultPageSize={10}
                                noDataText='No Record Found'
                                getTrProps={this.onRowClick}
                                sortable={true}
                            />
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return { modalAction : bindActionCreators(modalAction,dispatch) };
}

function mapStateToProps(state){
    return { modal : state.modal }
}

export default connect(mapStateToProps , mapDispatchToProps)(SiteDetails);