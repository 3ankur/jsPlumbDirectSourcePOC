/**
* Copyright (c) 2018
* @summary Application Patient Study Section
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React,{Component} from 'react';
import { connect } from 'react-redux';
import * as modalAction from '../../actions/modalActions';
import { MODAL_TYPE_STUDY_MODAL } from '../../constants/modalTypes';
import {bindActionCreators} from 'redux';
import ReactTable from "react-table";
import 'react-table/react-table.css'
import {NotificationManager} from 'react-notifications';
import ApiService from '../../api'

class EncounterSection extends Component{

    constructor(props){
        super(props);
        this.state = {
            subjectId:""
        }
        this. PatientStudyTableColumns = [{
    Header: 'Study',
    accessor: 'studyName'
  }, {
    Header: 'Site',
    accessor: 'siteName',
  }, {
    Header: 'Disposition Status',
    accessor: 'dispositionStatus',
    Cell:row =>{
        return row.row._original.dispositionStatus ? <span> {row.row._original.dispositionStatus}</span> : '--'
    }
  }, {
    Header: 'Subject ID',
    accessor: 'subjectId',
    Cell:row =>{
        return( this.renderSubjectId(row))
    }
  },
  {
    Header: 'Recruitment ID',
    accessor: 'recruitemnetId',
    Cell:row =>{
        return(
            this.renderRecruitmentId(row)
            //row.row._original.recruitmentId ?  row.row._original.recruitmentId : <span className="bg-light-p rounded px-2 py-1 text-white">Add</span>
        )
    }
  },
    {
        Header: 'Action',
        accessor: 'action',
        Cell : row =>(
            row.original.withDrawStatus===0 ?
            <button type="button" onClick={this.openWithDrawModal.bind(this,row.original)} className="btn bg-g rounded btn-sm cursor-pointer">Withdraw</button> :
            <button type="button" className="btn bg-light-grey2 rounded btn-sm">Withdraw</button>
        )
    }]
    }

    onShowStudyModal=()=>{
        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_STUDY_MODAL,{
            onSave : (data) => { this.props.modalAction.hideModal(); },
            hideModal : ()=>{ this.props.modalAction.hideModal(); }
        });
    }

        addSubjectId(pid){
        this.props.addSubjectIdHandler(pid)
        }

        //subjectId
        changeSubjectId(spData,e){
            if(e.target.validity.valid){
                this.props.updatetheSubjectIdHandler(e.target.value,spData)
            }
        }

        //render subject id
        renderSubjectId(info){
            
            if(info.original.subjectId && !info.original.hasAddEditPatientStudy){
                return  <div><span >{info.original.subjectId}</span> {info.original.withDrawStatus===0 ?  <span className="float-right"><i onClick={(e)=>{this.props.editSubjectId(info.original)} } className="glyphicon glyphicon-edit pr-2 editicn"></i></span> : ''} </div>
            }
            else if(info.original.hasAddEditPatientStudy){
                    return <div ><input className="form-control" type="text" onChange={this.changeSubjectId.bind(this,info.original)} value={info.original.subjectId ? info.original.subjectId : '' }/><div className="col-md-auto justify-content-end p-0"><div className="edit-btn-group  pull-right plcustom"><i className="material-icons" title="Save" onClick={(e)=>{e.preventDefault(); this.props.saveSubjectIdChanges(info.original)}  }>save</i><i onClick={(e)=>{e.preventDefault();this.props.cancelUpdateSubjectId(info.original)}} className="material-icons" title="Cancel">clear</i></div></div></div> ;

            }
            else{
                return <span className="bg-light-p rounded px-2 py-1 text-white" onClick={this.addSubjectId.bind(this,info.original)}>Add</span>
            }

        }

        //renderRecruitmentId
        renderRecruitmentId(info){

            if(info.original.recruitementId && !info.original.hasAddEditPatientRecruitment){
                return  <div><span >{info.original.recruitementId}</span>{info.original.withDrawStatus===0 ? <span className="float-right"> <i onClick={(e)=>{this.props.editRecruitmentId(info.original)} } className="glyphicon glyphicon-edit pr-2 editicn"></i></span> : '' }</div>
            }
            else if(info.original.hasAddEditPatientRecruitment){
                    return <div ><input className="form-control" type="text" onChange={(e)=>{ (e.target.validity.valid) ? this.props.updateRecruitmentId(e.target.value,info.original) : null} } value={info.original.recruitementId ? info.original.recruitementId : '' }/><div className="col-md-auto justify-content-end p-0"><div className="edit-btn-group  pull-right plcustom"><i className="material-icons" title="Save" onClick={(e)=>{e.preventDefault(); this.props.saveRecruitmentIdChanges(info.original)}  }>save</i><i onClick={(e)=>{e.preventDefault();this.props.cancelUpdateRecruitmentId(info.original)}} className="material-icons" title="Cancel">clear</i></div></div></div> ;

            }
            else{
                return <span className="bg-light-p rounded px-2 py-1 text-white" onClick={ (e)=>this.props.addRecruitmentId(info.original)  }>Add</span>
            }

        }


        openWithDrawModal =(spId)=>{
            
            this.props.openWithDrawModal(spId);
        }

        componentWillReceiveProps(nextProps) {
            try{
                if(nextProps.patientStudySiteList !== this.props.patientStudySiteList) {
                   // console.log(nextProps.patientStudySiteList)
                }
            }
            catch(e){

            }
        }



    renderPatientStudies(){
        let patientTemp = [];
        // patientStudySiteList = {this.state.studySiteDetailsList}
        patientTemp.push(this.props.patientStudies);

        // if(this.props.patientStudies && this.props.patientStudies.length){
        //     this.props.patientStudies.forEach( (info,idx)=>{
        //         patientTemp.push({study:info.study,site:info.site,dispositionStatus:info.disposition_status,subjectId:info.subjectid,recruitmentId:info.recruitemenetid})
        //         })
        //     return patientTemp;
        // }
        return this.props.patientStudySiteList || [] //patientTemp;
    }


    render({props} = this){
        return (
            <div className='col-md-12 p-0 row ml-mr-0'>
                <div className='col-md-12 row m-0 p-0 justify-content-between'>
                    <div className="d-flex flex-row col p-0 justify-content-between">
                        <h5 className="mt-4 col-md-8 col-sm-auto p-0 c-p">Patient Studies</h5>
                        {/* <span className="col-auto col-auto add-btn-bg mt-3 mb-3" onClick={this.onShowStudyModal}> <span className="float-right c-w">Study</span> <span className="add-btn"><i className="material-icons">add</i></span> </span> */}
                    </div>
                </div>
                <div className="col-12 row justify-content-start p-0 table-border px-2 m-0 ">
                    <ReactTable
                         data={this.renderPatientStudies()}
                         columns={this.PatientStudyTableColumns}
                         minRows={1}
                         multiSort ={true}
                         className='table table-responsive-sm activity-table mb-0'
                         showPagination={false}
                         noDataText='No Record Found'
                    />
                </div>
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

export default connect(mapStateToProps , mapDispatchToProps)(EncounterSection);

const patientStudyTableData = [
    {
        'study':'EL-12',
        'site':'St. Hospital',
        'dispositionStatus':'Washout',
        'subjectId':'12356',
        'recruitmentId':'23213'
    },
    {
        'study':'EL-12',
        'site':'St. Hospital',
        'dispositionStatus':'Active',
        'subjectId':'35451',
        'recruitmentId':'98745'
    },
    {
        'study':'EL-12',
        'site':'St. Hospital',
        'dispositionStatus':'Washout',
        'subjectId':'',
        'recruitmentId':''
    }

]

const PatientStudyTableColumns = [{
    Header: 'Study',
    accessor: 'studyName',
    Cell:row =>{
        return row.row._original.studyName ? <span> {row.row._original.studyName}</span> : '--'
    }
  }, {
    Header: 'Site',
    accessor: 'siteName',
    Cell:row =>{
        return row.row._original.siteName ? <span> {row.row._original.siteName}</span> : '--'
    }
  }, {
    Header: 'Disposition Status',
    accessor: 'dispositionStatus',
    Cell:row =>{
        return row.row._original.dispositionStatus ? <span> {row.row._original.dispositionStatus}</span> : '--'
    }
  }, {
    Header: 'Subject ID',
    accessor: 'subjectId',
    Cell:row =>{
        return(
            row.row._original.subjectId ?  row.row._original.subjectId : <span className="bg-light-p rounded px-2 py-1 text-white cursor-pointer" onClick={this.addSubjectId.bind(this)}>Add</span>
        )
    }
  },
  {
    Header: 'Recruitment ID',
    accessor: 'recruitemnetId',
    Cell:row =>{
        return(
            row.row._original.recruitmentId ?  row.row._original.recruitmentId : <span className="bg-light-p rounded px-2 py-1 text-white cursor-pointer">Add</span>
        )
    }
  },
    {
        Header: 'Action',
        accessor: 'action',
        Cell : row =>(
            <button type="button" className="btn bg-g rounded btn-sm cursor-pointer">Withdraw</button>
        )
    }]