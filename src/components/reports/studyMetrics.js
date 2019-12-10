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
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import moment from 'moment';
import ReactSuperSelect from 'react-super-select';



class StudyMetrics extends Component {

    constructor(props){
        super(props);
        this.state = {
            studyData : [{id:1,name:'study1'}],
            studyMatricsData : [
                {
                    "study" : "studyA",
                    "site" : "siteA",
                    "studyManagerAssigned" : "LastName1,FirstName1",
                    "studyStatus" : "drop",
                    "contractedPatientsConsented" : "contractedPatientsConsented1",
                    "contractedPatientsCompleted" : "contractedPatientsCompleted1",
                    "assumedScreenFailRatePer" : "80%",
                    "assumedDroppedRatePer" : "50",
                    "assumedFpi" : "assumed1",
                    "actualFpi" : "actual1",
                    "preScreened" : "23",
                    "screened" : "35",
                    "randomized" : "10",
                    "screenFailed" : "15",
                    "dropped" : "15",
                    "completed" : "15",
                    "actualScreenFailRatePer" : "50",
                    "actualDroppedRatePer" : "60",
                    "perToConsentedGoal" : "60",
                    "perToCompleted Goal" : "80"
                },
                {
                    "study" : "studyA",
                    "site" : "siteA",
                    "studyManagerAssigned" : "LastName1,FirstName1",
                    "studyStatus" : "drop",
                    "contractedPatientsConsented" : "contractedPatientsConsented1",
                    "contractedPatientsCompleted" : "contractedPatientsCompleted1",
                    "assumedScreenFailRatePer" : "80%",
                    "assumedDroppedRatePer" : "50",
                    "assumedFpi" : "assumed1",
                    "actualFpi" : "actual1",
                    "preScreened" : "23",
                    "screened" : "35",
                    "randomized" : "10",
                    "screenFailed" : "15",
                    "dropped" : "15",
                    "completed" : "15",
                    "actualScreenFailRatePer" : "50",
                    "actualDroppedRatePer" : "60",
                    "perToConsentedGoal" : "60",
                    "perToCompleted Goal" : "80"
                }
            ],
            columns : []
        }
        this.filterObject = {}
    }

    componentDidMount(){
        let columns = [
          {
            Header: 'Study',
            accessor: 'study',
            Cell:row =>{
                return( row.row._original.study ?  <span> {row.row._original.study}</span> : '--')
            },
            className: 'activelink'
          },
          {
            Header: 'Study',
            accessor: 'study',
            Cell:row =>{
                return( row.row._original.study ?  <span> {row.row._original.study}</span> : '--')
            },
            className: 'activelink'
          },
          {
            Header: 'Study Managers Assigned',
            accessor: 'studyManagerAssigned',
            Cell:row =>{
                return( row.row._original.studyManagerAssigned ?  <span> {row.row._original.studyManagerAssigned}</span> : '--')
            },
            className: 'activelink'
          },
          {
            Header: 'Study Status',
            accessor: 'studyStatus',
            Cell:row =>{
                return( row.row._original.studyStatus ?  <span> {row.row._original.studyStatus}</span> : '--')
            },
            className: 'activelink'
          },
          {
            Header: 'Contracted Patients Consented',
            accessor: 'contractedPatientsConsented',
            Cell:row =>{
                return( row.row._original.contractedPatientsConsented ?  <span> {row.row._original.contractedPatientsConsented}</span> : '--')
            },
            className: 'activelink'
          },
          {
            Header: 'Contracted Patients Completed',
            accessor: 'contractedPatientsCompleted',
            Cell:row =>{
                return( row.row._original.contractedPatientsCompleted ?  <span> {row.row._original.contractedPatientsCompleted}</span> : '--')
            },
            className: 'activelink'
          },
          {
            Header: 'Assumed Screen Fail Rate %',
            accessor: 'assumedScreenFailRatePer',
            Cell:row =>{
                return( row.row._original.assumedScreenFailRatePer ?  <span> {row.row._original.assumedScreenFailRatePer}</span> : '--')
            },
            className: 'activelink'
          },
          {
            Header: 'Assumed Dropped Rate %',
            accessor: 'assumedDroppedRatePer',
            Cell:row =>{
                return( row.row._original.assumedDroppedRatePer ?  <span> {row.row._original.assumedDroppedRatePer}</span> : '--')
            },
            className: 'activelink'
          },
          {
            Header: 'Assumed FPI',
            accessor: 'assumedFpi',
            Cell:row =>{
                return( row.row._original.assumedFpi ?  <span> {row.row._original.assumedFpi}</span> : '--')
            },
            className: 'activelink'
          },
          {
            Header: 'Actual FPI',
            accessor: 'actualFpi',
            Cell:row =>{
                return( row.row._original.actualFpi ?  <span> {row.row._original.actualFpi}</span> : '--')
            },
            className: 'activelink'
          },
           {
            Header: 'Pre-screened',
            accessor: 'preScreened',
            Cell:row =>{
                return( row.row._original.preScreened ?  <span> {row.row._original.preScreened}</span> : '--')
            },
            className: 'activelink'
          }, {
            Header: 'Screened',
            accessor: 'screened',
            Cell:row =>{
                return( row.row._original.screened ?  <span> {row.row._original.screened}</span> : '--')
            },
            className: 'activelink'
          }, {
            Header: 'Randomized',
            accessor: 'randomized',
            Cell:row =>{
                return( row.row._original.randomized ?  <span> {row.row._original.randomized}</span> : '--')
            },
            className: 'activelink'
          }, {
            Header: 'Screen Failed',
            accessor: 'screenFailed',
            Cell:row =>{
                return( row.row._original.screenFailed ?  <span> {row.row._original.screenFailed}</span> : '--')
            },
            className: 'activelink'
          }, {
            Header: 'Dropped',
            accessor: 'dropped',
            Cell:row =>{
                return( row.row._original.dropped ?  <span> {row.row._original.dropped}</span> : '--')
            },
            className: 'activelink'
          }, {
            Header: 'Completed',
            accessor: 'completed',
            Cell:row =>{
                return( row.row._original.completed ?  <span> {row.row._original.completed}</span> : '--')
            },
            className: 'activelink'
          },
          {
            Header: 'Actual Screen Fail Rate %',
            accessor: 'actualScreenFailRatePer',
            Cell:row =>{
                return( row.row._original.actualScreenFailRatePer ?  <span> {row.row._original.actualScreenFailRatePer}</span> : '--')
            },
            className: 'activelink'
          }, {
            Header: 'Actual Dropped Rate %',
            accessor: 'actualDroppedRatePer',
            Cell:row =>{
                return( row.row._original.actualDroppedRatePer ?  <span> {row.row._original.actualDroppedRatePer}</span> : '--')
            },
            className: 'activelink'
          }, {
            Header: '% to Consented Goal',
            accessor: 'perToConsentedGoal',
            Cell:row =>{
                return( row.row._original.perToConsentedGoal ?  <span> {row.row._original.perToConsentedGoal}</span> : '--')
            },
            className: 'activelink'
          },
          {
            Header: '% to Completed Goal',
            accessor: 'perToCompletedGoal',
            Cell:row =>{
                return( row.row._original.perToCompletedGoal ?  <span> {row.row._original.perToCompletedGoal}</span> : '--')
            },
            className: 'activelink'
          }
        ];
        this.setState({
            columns : columns
        })
        ApiService.get_all_studies().then((res)=>{
            res && res.data.response.forEach( (d)=>{
                d.id  = d.uniqueIdentifier;
                d.name = d.studyName;
            });
            this.setState({studySiteDetailsList:res.data.response});
        });
    }

    handleStudyChange =(options)=>{
        if(options){
            let data = options.id;
            this.filterObject.studyId = options.id;
            ApiService.GetPopulatedStudyDetails(data).then((res) => {
                if(res && res.data.response.listOfSites.length == 0){
                }else{
                    res && res.data.response.listOfSites.forEach( (d)=>{
                        d.id  = d.unique_identifier;
                        d.name = d.site_name;
                    });
                }
                this.setState({ siteList : common.sortByOrder(res.data.response.listOfSites || [] ,'ASC','name')},()=>{
                    //this.loadActivitylist(this.columns,this.studySiteIdObj);
                });
            },(error) => {
                NotificationManager.error('something went wrong');
            });
        }
    }


    handleSiteChange = ()=>{

    }

    customOptionTemplateFunction = (item, search, searchRegex) => {
        return <span title={item.name}>{item.name}</span>
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


  render({props,state} = this) {
      console.log('columns',this.state.columns)
    return (
    	 <div className="footpadb">
            <section className='filter-section'>
                <div className="border px-3 pt-3 pb-1 m-0 row justify-content-between">
                    <div className="col-8 col-md-8 col-sm-8 form-row p-0 ipadnd8">
                        <div className="form-group  col-auto filterwidth">
                            <label htmlFor="study">Study</label>
                            <ReactSuperSelect
                                placeholder="Select"
                                clearSearchOnSelection={true}
                                dataSource={state.studySiteDetailsList || []}
                                onChange={this.handleStudyChange}
                                searchable={true}
                                multiple={false}
                                keepOpenOnSelection={false}
                                closeOnSelectedOptionClick={false}
                                deselectOnSelectedOptionClick={false}
                                customClass='select-container'
                                customOptionTemplateFunction={this.customOptionTemplateFunction}
                                customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                clearable = {false}
                            />
                        </div>
                        <div className="form-group col-auto filterwidth">
                            <label htmlFor="study">Site</label>
                            <ReactSuperSelect
                                placeholder="Select"
                                clearSearchOnSelection={true}
                                dataSource={state.siteList || []}
                                onChange={this.handleSiteChange}
                                searchable={true}
                                deselectOnSelectedOptionClick={false}
                                clearable = {false}
                                multiple={false}
                                keepOpenOnSelection={false}
                                closeOnSelectedOptionClick={false}
                                customClass='select-container'
                                customOptionTemplateFunction={this.customOptionTemplateFunction}
                                customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                            />
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <div className="row border p-3 m-0 my-2">
                    <div className="col p-0 pt-2"><h5 className=" c-p">Patient Progress</h5></div>
                    <div className="col-12 px-0 activitylisttable">
                        <ReactTable
                            data={this.state.studyMatricsData}
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StudyMetrics));

