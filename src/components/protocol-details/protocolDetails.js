/**
 * Copyright (c) 2018
 * @summary Protocol version list for study
 * @author Ankur Vishwakarma,Poonam Banode,Mangesh Pimprikar,Irfan Bagwan
 */

import React, { Component } from 'react';
import Filter from '../filter/filter';
import ApiService from '../../api';
import { NavLink } from 'react-router-dom';
import {NotificationManager} from 'react-notifications';
import Common from '../../common/common';
import ReactTable from "react-table";
import { MODAL_AUDIT_TRAIL} from '../../constants/modalTypes';
import * as modalAction from '../../actions/modalActions';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux' ;
import 'react-table/react-table.css';
import moment from 'moment'


class ProtocolDetails extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            studyListItems:[],
            subheaderOptions: {
                study: true,
                protocolDetails: true,
                protocolStudyList:[],
                simpleButton : {
                    name : 'Audit',
                    id : '#audit',
                    classes:" btn text-white align-bottom common-btn-bg mt-2 "
                }
            },
            selectedStudy:"",
            studyVersionData :[],
            hasAlreadyDraft:false
        }
        this.siteStudyChangedHandler = this.siteStudyChangedHandler.bind(this);
    }
    //get protocolversion list
    getStudyProtocolLists(data,selectedObj){
        ApiService.GetProtocolVersionListByStudyId(data).then((res)=>{
            if(res.data.responsecode===200 && res.data.status==="success"   && typeof(res.data.response)==="object"){
                res.data && res.data.response.forEach((vx,ix)=>{
                    vx.studyName = this.state.selectedStudy.name;
                });


                this.setState({studyVersionData:res.data.response});
                const filterDraftDt = res.data.response && res.data.response.filter( (o)=>{return o.status === "Draft"});
                filterDraftDt.length>0 ? this.setState({hasAlreadyDraft:true}) : this.setState({hasAlreadyDraft:false})
                this.renderDraftButton();

            }
            else{
                this.setState({studyVersionData:[],hasAlreadyDraft:false});
               // this.renderDraftButton();
            }

            versionDetailsColumns = [
                {
                    Header: 'Name',
                    accessor: 'name',
                    Cell:row =>{

                        let url = "";
                        if(row.original.status === "Active" || row.original.status ==="Retired"){ //protocolStatus
                            url = `/protocol-details/setup-preview/${this.state.selectedStudy.name}/${row.original.protocolId}/${row.original.studyIdentifier}/${row.original.version}/${row.original.publishDate}/${row.original.name}/${row.original.status}/${row.original.uniqueIdentifier}`
                        }
                        else{
                            url = `/protocol-details/protocol-setup-new/${this.state.selectedStudy.name}/${row.original.protocolId}/${row.original.studyIdentifier}/${row.original.version}/${row.original.name}/${row.original.uniqueIdentifier}`
                        }
                        return(
                            <NavLink  to={url}  title={row.row.name}>{row.row.name} </NavLink>
                        )
                    }
                },
                {
                    Header: 'Versions',
                    accessor: 'version',
                    Cell:row =>{
                        let url = "";
                        if(row.original.status === "Active" || row.original.status ==="Retired"){
                            url = `/protocol-details/setup-preview/${this.state.selectedStudy.name}/${row.original.protocolId}/${row.original.studyIdentifier}/${row.original.version}/${row.original.publishDate}/${row.original.name}/${row.original.status}/${row.original.uniqueIdentifier}`
                        }
                        else{
                            url = `/protocol-details/protocol-setup-new/${this.state.selectedStudy.name}/${row.original.protocolId}/${row.original.studyIdentifier}/${row.original.version}/${row.original.name}/${row.original.uniqueIdentifier}`
                        }
                        return(
                            row.row.version ? <NavLink  to={url}  >{row.row.version} </NavLink> : '--'
                        )
                    }
                },
                {
                    Header: 'Status',
                    accessor: 'status',
                    Cell:row=>{
                        return row.original.status ? <span>{row.original.status}</span>  : '--'
                    }
                },
                {
                    Header: 'Publish Date',
                    accessor: 'publishDate',
                    Cell:row=>{
                        return row.original.publishDate ? <span>{Common.formatDate(row.original.publishDate)}</span>  : '--'
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
                    Header: 'Last Updated By',
                    accessor: 'performUser',
                    Cell:row=>{
                        return row.original.performUser ? <span>{row.original.performUser}</span>  : '--'
                    }
                }
            ]
            this.setState({selectedStudy:selectedObj})
        },(error)=>{
            //NotificationManager.error('Error', 'Someting went wrong..') ;
            this.setState({selectedStudy:selectedObj})
            this.setState({studyVersionData:[]});
            this.setState({hasAlreadyDraft:false})
        });
    }

    siteStudyChangedHandler(selectedObj){
        if(selectedObj){
           let  data = selectedObj.id  //{studyId:selectedObj.id }
         // this.setState({selectedStudy:selectedObj})
          this.getStudyProtocolLists(data,selectedObj);
        }

    }

    //get active protocol
    getActiveProtocolDetails(versionId){
        try{ return ApiService.getEpochJSONByVersionId(versionId) }
        catch(e){ }
    }

    //update for draft JSON
    UpdateActiveJSONtoDraft(info,draftInfo){
        this.getActiveProtocolDetails(info.versionId).then( (res)=>{
            if(res.data){
                let data= {
                    jsonData: res.data.jsonData,
                    versionId:draftInfo[0]["version_name"]
                }
                ApiService.saveProtocolSetupJSON(draftInfo[0]["versionId"],data).then( (res)=>{
                    if(res.status=="200"){
                        // NotificationManager.success("Setup Saved successfully...!");
                    }
                },(err)=>{})
            }
        },(error)=>{});
        return false;
    }

    getListsForDraft(studyData){
        ApiService.GetProtocolVersionListByStudyId(studyData).then((res)=>{



            if(res.data.responsecode===200 && res.data.status==="success"   && typeof(res.data.response)==="object"){
                res.data && res.data.response.forEach((vx,ix)=>{
                    vx.studyName = this.state.selectedStudy.name;
                } )
                this.setState({studyVersionData:res.data.response});
                const filterDraftDt = res.data && res.data.response.filter( (o)=>{return o.status === "Draft"});
                filterDraftDt.length>0 ? this.setState({hasAlreadyDraft:true}) : this.setState({hasAlreadyDraft:false})
            }
        },(error)=>{
            //NotificationManager.error('Error', 'Someting went wrong..') ;
            this.setState({studyVersionData:[]});
            this.setState({hasAlreadyDraft:false})
        });
    }

    addNewDraft(){
        let data = this.state.selectedStudy.id // {"versionParentStudyId":this.state.selectedStudy.id}
        ApiService.AddNewDraftToStudy(data).then( (res)=>{
            this.getListsForDraft(data);
        },(error)=>{
            NotificationManager.error('Error', 'Someting went wrong..') ;
        })
    }

    renderDraftButton(){
        if(this.state.selectedStudy ){
            return( !this.state.hasAlreadyDraft ?  <span className="text-right pt-4"><span style={ {cursor:"pointer"} } className="float-right  c-b" onClick={this.addNewDraft.bind(this)}>Draft</span><span className="add-btn"><i className="material-icons">add</i></span></span> : '');
        }
    }


    componentDidMount() {
        ApiService.get_all_studies().then((res)=>{

        if(res.data.responsecode===200 && res.data.status==="success"   && typeof(res.data.response)==="object"){

            res && res.data.response.forEach( (d)=>{
                d.id  = d.uniqueIdentifier;
                d.name = d.studyName
            })
            this.setState({studyListItems:res.data.response});
         }
        })
    }

onAuditTrailClick = ()=>{

this.props.modalAction && this.props.modalAction.showModal(MODAL_AUDIT_TRAIL,{
    onSave : (data) => {
 this.props.modalAction.hideModal();
},
selectedStudy:this.state.selectedStudy.id,
className:"audit-trail",
    hideModal : ()=>{ this.props.modalAction.hideModal(); }
});

    }

    render({ props, state } = this) {
        let { subheaderOptions } = state;
        return (
            <div className='footpadb'>
                <Filter siteStudyChanged={this.siteStudyChangedHandler} options={subheaderOptions}
                studySiteDetailsList={this.state.studyListItems}
                onAuditTrailClick={this.onAuditTrailClick.bind(this)}
                />
                <section className="border mt-2">
                    <div className="row col-12 m-0 px-3 mt-3">
                        <h5 className=" c-p">Source Data Version Details</h5>
                        <div className="col"> { !this.state.hasAlreadyDraft ? this.renderDraftButton() : '' } </div>
                        <div className="col-12 justify-content-between border-bottom-dotted m-0 px-0">
                        </div>
                    </div>
                    <div className="row px-3 pt-2 pb-3 m-0">
                        <div className="col-12 table-border p-0">
                            <ReactTable
                                data={this.state.studyVersionData}
                                columns={versionDetailsColumns}
                                minRows={1}
                                multiSort ={true}
                                className='table activity-table table-responsive-sm m-0'
                                showPagination={true}
                                noDataText='No Record Found'
                                nextText='>>'
                                previousText='<<'
                                defaultPageSize={10}
                            />
                        </div>
                    </div>
                </section>
            </div>
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
var versionDetailsColumns = [];
export default  connect(mapStateToProps , mapDispatchToProps)(ProtocolDetails);