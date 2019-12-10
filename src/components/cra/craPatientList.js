/**
* Copyright (c) 2018
* @summary Application Patient Deatil Page
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React, { Component } from 'react';
import Filter from '../filter/filter';
import * as getPatientList from '../../actions/getPatientList';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ApiService from '../../api';
import common from '../../../src/common/common';
import { NotificationManager } from 'react-notifications';
import * as modalAction from  '../../../src/actions/modalActions';
import { MODAL_TYPE_FULL_ENCOUNTER,MODAL_TYPE_PATIENT_ENCOUNTER } from '../../../src/constants/modalTypes';
import { withLastLocation } from 'react-router-last-location';
import ReactTable from "react-table";
import 'react-table/react-table.css'

class CraPatientList extends Component {

    constructor(props, context){
        super(props, context);
        this.state = {
            craPatientListData:[],
            searchPatients : '',
            columns : [],
            studySiteDetailsList:[],
            siteList:[],
            subheaderOptions : {
                site : true,
                study : true,
                status: false,
                dropDownOptions:{
                    multiSelect : false,
                    keepOpenOnSelection:false
                }
            },
        },
        this.studySiteStatusIdObj = {}
    }

    componentDidMount(){

        ApiService.get_all_studies().then((res)=>{
            res && res.data.response.forEach( (d)=>{
                d.id  = d.uniqueIdentifier;
                d.name = d.studyName;
            });
            this.setState({studySiteDetailsList:res.data.response});
        });
        this.loadSubjectIDList();
        const columns = [{
            Header: 'Subject ID',
            accessor: 'subjectIdentifier', // String-based value accessors!
            Cell:row =>{
                return row.row._original.subjectIdentifier ? <span>{row.row._original.subjectIdentifier }</span> : '--'
            }
          },
          {
            Header: 'Study',
            accessor: 'studyName',
            Cell:row =>{
                return row.row._original.studyName ? <span> {row.row._original.studyName}</span> : '--'
            }
          },
          {
            Header: 'Site',
            accessor: 'site',
            Cell:row =>{
                return row.row._original.siteName ? <span> {row.row._original.siteName}</span> : '--'
            }
          },
          {
            Header: 'Epoch',
            accessor: 'epochName',
            Cell:row =>{
                return row.row._original.epochName ? <span> {row.row._original.epochName}</span> : '--'
            }
          },
          {
            Header: 'Encounter',
            accessor: 'encounterName',
            Cell:row =>{
                return row.row._original.encounterName ? <span> {row.row._original.encounterName}</span> : '--'
            }
          },
          {
            Header: 'Review',
            accessor: 'review',
            Cell:row =>{
                return <div>
                    <span className="bg-light-p rounded px-2 py-1 text-white cursor-pointer" onClick={this.onShowFullEncounter.bind(this,row)}>
                        FE
                    </span>
                </div>
            }
          }
        ]
        this.setState({
            columns : columns
        })
    }

    onChangeSearchInput =(e)=>{
        this.setState({searchPatients: e.target.value});
    }

    onShowFullEncounter(obj,row) {
        console.log('full encounter obj',obj)
        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_FULL_ENCOUNTER,{
            hideModal : ()=>{
                this.props.modalAction.hideModal();
            },
            encounterGroupIdentifier:obj,
            fromCraPatientReport : true,
            className:'full-encounter-modal'
        });
    }

    onShowPatientEncounter(obj,row) {
        console.log('patient encounter obj',obj)
        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_PATIENT_ENCOUNTER,{
            hideModal : ()=>{
                this.props.modalAction.hideModal();
            },
            encounterGroupIdentifier:obj,
            fromCraPatientReport : true,
            className:'patient-encounter-modal'
        });
    }

    loadSubjectIDList=(data)=>{
        ApiService.getPatientEncounterDetails("fromcra",data).then((res)=>{
            if(res && res.data && res.data.response && typeof res.data.response==="object"){
                this.setState({craPatientListData:res.data.response});
            }else{
                this.setState({craPatientListData:[]});
            }
        })
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
                this.loadSubjectIDList(this.studySiteStatusIdObj);
              });
            },(error) => {
                NotificationManager.error('something went wrong');
            });
        }
    }

    onSiteChange = (options) =>{
        console.log(options,)
        if(options && options.name!="Select" && options.id !="8888888888"){
            var data = options.id;
            this.studySiteStatusIdObj.siteId = options.id;
            this.loadSubjectIDList(this.studySiteStatusIdObj);
        }
    }

  render({props,state} = this) {
    let data = state.craPatientListData;
    let {subheaderOptions} = state;
    if(state.searchPatients){
        data = data.filter( (row)=>{
            return  (
            row.subjectIdentifier && row.subjectIdentifier.toLowerCase().trim().indexOf(state.searchPatients && state.searchPatients.toLowerCase().trim() ) > -1
        )
      });
    }
    return (
    	<div className="footpadb">
         <Filter  byDefaultNoSelected={true}
                    options={subheaderOptions}
                    studySiteDetailsList={this.state.studySiteDetailsList}
                    siteStudyChanged={this.onStudyChange}
                    siteList={this.state.siteList}
                    onSiteChange={this.onSiteChange}
            />
            <section>
                <div className="row border p-3 m-0 my-2">
                    <div className="col p-0 pt-2"><h5 className=" c-p">Review Encounters</h5></div>
                    <div className="col-auto p-0 mb-2 d-flex flex-row">
                        <span className="px-2 pt-1">Search</span>
                        <div className="input-group border">
                                <input className="form-control border-0" placeholder="" onChange={(event)=>this.onChangeSearchInput(event)}  />
                                <div className="input-group-addon px-2 bg-p  search-icon" >
                                    <i className="material-icons pt-2 text-white">search</i>
                                </div>
                        </div>
                    </div>
                    <div className="col-12 px-0">
                        <ReactTable
                                data={data || []}
                                columns={state.columns}
                                minRows={1}
                                multiSort ={true}
                                showPagination={true}
                                nextText='>>'
                                previousText='<<'
                                noDataText='No Record Found'
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


export default connect(mapStateToProps , mapDispatchToProps)(withLastLocation(CraPatientList));

