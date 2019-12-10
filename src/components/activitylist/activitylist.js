/**
* Copyright (c) 2018
* @summary This file is use under  Activity List
            Contains User Activity
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React, { Component } from 'react';
import Filter from '../filter/filter';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import ApiService from '../../../src/api';
import common from '../../../src/common/common';
import { NotificationManager } from 'react-notifications';
import * as modalAction from  '../../../src/actions/modalActions';
import { MODAL_TYPE_ACTIVITY_LIST_POST_IT } from '../../../src/constants/modalTypes';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import moment from 'moment'


class ActivityList extends Component {

    constructor(props){
        super(props);
        this.studySiteIdObj = {};
        this.state = {
            subheaderOptions : {
               site : true,
               study : true,
               button : {
                   name : 'Postit'
               }
           },
           activityListData : [],
           columns : [],
           studySiteDetailsList : [],
           siteList : []
       }
    }

    componentDidMount(){
        this.columns = [
          {
            Header: 'Patient',
            accessor: 'patientName', // String-based value accessors!
            Cell:row =>{
                return( row.row._original.patientName ?  <NavLink className="nav-link" to={`/patientdetails/patientdescription/${row.original.sitePatinetIdentifier}`}>{row.row._original.patientName} </NavLink> : '--')
            },
            className: 'activelink'
          },
          {
            Header: 'Epoch',
            accessor: 'epoch',
            Cell:row =>{
                return row.row._original.epoch ? <span> {row.row._original.epoch}</span> : '--'
            }
          },
          {
            Header: 'Encounter',
            accessor: 'encounterName',
            Cell:row =>{
                if(row.row._original.activityListType === 'postit'){
                    return(row.row._original.encounterName ? <span className='c-b' onClick={()=>this.onPostItButtonClick(row.row._original)}>{row.row._original.encounterName}</span> : '--')
                }else{
                    return ( row.original.isAccessEncounterDetails ? (row.row._original.encounterName  ? <NavLink className="nav-link" to={`/patientdetails/patientdescription/patientEncounter/${row.original.patientEncounterGroupIdentifier}/${row.original.sitePatinetIdentifier}/${row.row._original.studyIdentifier}/${row.row._original.siteIdentifier}/${row.row._original.epochProtocolIdentifier}`} >{row.row._original.encounterName}</NavLink> : '--') : ( row.row._original.encounterName ? row.row._original.encounterName : '--' )  )
                }
            },
            className: 'activelink'
          }, {
            Header: 'Type Name',
            accessor: 'type',
            Cell:row =>{
                return row.row._original.type ? <span> {row.row._original.type}</span> : '--'
            }
          }, {
            Header: 'Activity List Name',
            accessor: 'activityListName',
            Cell:row =>{
                return row.row._original.activityListName ? <span> {row.row._original.activityListName}</span> : '--'
            }
          }, {
            Header: 'Open Date', // Custom header components!
            accessor: 'openDate',
            Cell:row =>{
                return( row.row._original.openDate ? <span>{row.row._original.openDate}</span> : '--')
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
            Header: 'Due Date', // Custom header components!
            accessor: 'dueDate',
            Cell:row =>{
                return(row.row._original.dueDate ? <span>{row.row._original.dueDate}</span> : '--')
            },
            sortMethod: (a,b,c)=>{
                let fomatedOldDate  = a && moment(a,"DD/MMM/YYYY");
                let formattedNewDate =  b && moment(b,"DD/MMM/YYYY");
                let oldDate = fomatedOldDate &&  Date.parse(fomatedOldDate);
                let newDate =  formattedNewDate && Date.parse(formattedNewDate);
                return oldDate - newDate
            }
          }
        ];
        ApiService.get_all_studies().then((res)=>{
            res && res.data.response.forEach( (d)=>{
                d.id  = d.uniqueIdentifier;
                d.name = d.studyName;
            });
            this.setState({studySiteDetailsList:res.data.response});
        });
      this.loadActivitylist(this.columns);
    }

    loadActivitylist(columns,parameter){
        ApiService.getActivityList(parameter).then((res) => {
            try{
                if( res && res.data && res.data.response && typeof res.data.response == 'string'){
                    this.setState({
                        activityListData : [],
                        columns : []
                   });
                }else{
                    this.setState({
                        activityListData : res && res.data && res.data.response,
                        columns : columns
                   });
                }
            }catch(e){ }
         }, (error) => {
             common.clearNotification();
             NotificationManager.error('something went wrong');
         });
    }

    onPostItButtonClick = (data)=>{
        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_ACTIVITY_LIST_POST_IT, {
            onSave: (data,doneStatus,uniqueIdentifier) => {
                if(data){
                    if(doneStatus){
                        let doneObj={
                            postitDoneStatus : doneStatus != (null||"") ? 1 : 0,
                            uniqueIdentifier:uniqueIdentifier ? uniqueIdentifier : ''
                        }
                        ApiService.donePostItNotes(doneObj).then((res) => {
                            //this.loadActivitylist(this.columns);
                           // this.props.history.go(0)
                           this.loadActivitylist(this.columns,this.studySiteIdObj);
                          }, (error) => {
                              common.clearNotification();
                              NotificationManager.error('something went wrong');
                         });
                    }else{
                        let savePostItObj={
                            postitDescription : data.description,
                            postitDueDate : data.dueDate &&  common.formatDate(data.dueDate,"DD/MMM/YYYY"),
                            postitTitle : data.title,
                            studyIdentifier : data.studyIdentifier ? data.studyIdentifier : '',
                            sitePatientIdentifier : data.patientIdentifier ? data.patientIdentifier : '',
                            siteIdentifier:data.siteIdentifier ? data.siteIdentifier : '',
                            uniqueIdentifier:uniqueIdentifier ? uniqueIdentifier : ''
                        }
                        //savePostItObj['siteIdentifier'] == '' ? delete savePostItObj['siteIdentifier'] : savePostItObj['siteIdentifier'];
                        //savePostItObj['sitePatientIdentifier'] == '' ? delete savePostItObj['sitePatientIdentifier'] : savePostItObj['sitePatientIdentifier'];
                    ApiService.savePostItNotes(savePostItObj).then((res) => {
                        // this.loadActivitylist(this.columns);
                        if(res && res.data && res.data.length == 0){
                           // NotificationManager.error('something went wrong');
                        }else{
                            this.loadActivitylist(this.columns,this.studySiteIdObj);
                            //this.props.history.go(0)
                        }
                     }, (error) => {
                         common.clearNotification();
                         NotificationManager.error('something went wrong');
                    });
                }

                }
                this.props.modalAction.hideModal();
            },
            hideModal: () => {
                this.props.modalAction.hideModal();
            },
            postItEditData : data,
            className: 'activity-list-postit',
        });
    }

    onElementSearch(e){
        e.preventDefault();
        this.setState({elementSearchTxt:e.target.value})

    }

    onStudyChange = (options)=>{
        this.studySiteIdObj.studyId = '';
        this.studySiteIdObj.siteId = '';
        if(options){
            let data = options.id;
            this.studySiteIdObj.studyId = options.id;
            ApiService.GetPopulatedStudyDetails(data).then((res) => {
              // this.setState({ studyDetails : res.data.response , SiteDetailsColumns:SiteDetailsColumns});
                if(res && res.data.response.listOfSites.length == 0){
                    //this.loadActivitylist(this.columns,this.studySiteIdObj);
                }else{
                    res && res.data.response.listOfSites.forEach( (d)=>{
                        d.id  = d.unique_identifier;
                        d.name = d.site_name;
                    });
                }
                this.setState({ siteList : common.sortByOrder(res.data.response.listOfSites || [] ,'ASC','name')},()=>{
                    this.loadActivitylist(this.columns,this.studySiteIdObj);});
            },(error) => {
                NotificationManager.error('something went wrong');
            });
        }
    }

    onSiteChange = (options)=>{
        this.studySiteIdObj.siteId = options.id;
        this.loadActivitylist(this.columns,this.studySiteIdObj);
    }

  render({props,state} = this) {
    let { subheaderOptions, activityListData } = state;
    if(state.elementSearchTxt){
        activityListData = activityListData.filter( (row)=>{
            return (
                row.patientName && row.patientName.toLowerCase().indexOf(state.elementSearchTxt && state.elementSearchTxt.toLowerCase().trim() )>-1
                || row.encounterName && row.encounterName.toLowerCase().indexOf(state.elementSearchTxt && state.elementSearchTxt.toLowerCase().trim() )>-1
                || row.activityListName && row.activityListName.toLowerCase().indexOf(state.elementSearchTxt && state.elementSearchTxt.toLowerCase().trim() )>-1
                || row.openDate && row.openDate.toLowerCase().indexOf(state.elementSearchTxt && state.elementSearchTxt.toLowerCase().trim() )>-1
                || row.dueDate && row.dueDate.toLowerCase().indexOf(state.elementSearchTxt && state.elementSearchTxt.toLowerCase().trim() )>-1
                || row.study && row.study.toLowerCase().indexOf(state.elementSearchTxt && state.elementSearchTxt.toLowerCase().trim() )>-1
                || row.site && row.site.toLowerCase().indexOf(state.elementSearchTxt && state.elementSearchTxt.toLowerCase().trim() )>-1
                || row.type && row.type.toLowerCase().indexOf(state.elementSearchTxt && state.elementSearchTxt.toLowerCase().trim() )>-1
                || row.epoch && row.epoch.toLowerCase().indexOf(state.elementSearchTxt && state.elementSearchTxt.toLowerCase().trim() )>-1
            )
        })
    }
    return (
    	 <div className="footpadb">
            <Filter
                options={subheaderOptions}
                onPopUpBtnClick={()=>this.onPostItButtonClick()}
                studySiteDetailsList={this.state.studySiteDetailsList || []}
                siteStudyChanged={this.onStudyChange}
                siteList={this.state.siteList || []}
                onSiteChange={this.onSiteChange}
                byDefaultNoSelected ={true}
            />
            <section>
                <div className="row border p-3 m-0 my-2">
                    <div className="col p-0 pt-2"><h5 className=" c-p">Activity List</h5></div>
                    <div className="col-auto p-0 mb-2 d-flex flex-row">
                        <span className="px-2 pt-1">Search</span>
                        <div className="input-group border">
                            <input className="form-control border-0" placeholder="" onChange={this.onElementSearch.bind(this)} />
                            <div className="input-group-addon px-2 bg-p  search-icon" >
                                <i className="material-icons pt-2 text-white">search</i>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 px-0 activitylisttable">
                        <ReactTable
                            data={activityListData}
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
    return { modalAction: bindActionCreators(modalAction, dispatch) };
}

function mapStateToProps(state) {
    return {modal: state.modal}
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ActivityList));

