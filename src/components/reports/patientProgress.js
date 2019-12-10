/**
* Copyright (c) 2018
* @summary This file is use under  Activity List
            Contains User Activity
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React, { Component } from 'react';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import ApiService from '../../../src/api';
import common from '../../../src/common/common';
import { NotificationManager } from 'react-notifications';
import * as modalAction from  '../../../src/actions/modalActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ReactSuperSelect from 'react-super-select';

class PatientProgress extends Component {

    constructor(props){
        super(props);
        this.state = {
            studyList : [],
            siteList : [],
            patientData : [{
                "study" : "studyA",
                "site" : "siteA",
                "patientName" : "LastName1,FirstName1",
                "subjectId" : "subjId1",
                "status" : "drop",
                "epoch" : "epoch1",
                "encounter" : "encounter1",
                "inWindowExpectMinDate" : "22/oct/2018",
                "inWindowExpectMaxDate" : "27/oct/2018",
                "encounterSheduleDate" : "30/oct/2018",
                "patientCheckinDate" : "1/nov/2018"
            },{
                "study" : "studyB",
                "site" : "siteB",
                "patientName" : "LastName2,FirstName2",
                "subjectId" : "subjId2",
                "status" : "drop2",
                "epoch" : "epoch2",
                "encounter" : "encounter2",
                "inWindowExpectMinDate" : "22/oct/2018",
                "inWindowExpectMaxDate" : "27/oct/2018",
                "encounterSheduleDate" : "30/oct/2018",
                "patientCheckinDate" : "1/nov/2018"
            }],
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
            Header: 'Site',
            accessor: 'site',
            Cell:row =>{
                return( row.row._original.site ?  <span> {row.row._original.site}</span> : '--')
            },
            className: 'activelink'
          },
          {
            Header: 'Patient Name',
            accessor: 'patientName',
            Cell:row =>{
                return( row.row._original.patientName ?  <span> {row.row._original.patientName}</span> : '--')
            },
            className: 'activelink'
          },
          {
            Header: 'Subject Id',
            accessor: 'subjectId',
            Cell:row =>{
                return( row.row._original.subjectId ?  <span> {row.row._original.subjectId}</span> : '--')
            },
            className: 'activelink'
          },
          {
            Header: 'Status',
            accessor: 'status',
            Cell:row =>{
                return( row.row._original.status ?  <span> {row.row._original.status}</span> : '--')
            },
            className: 'activelink'
          },
          {
            Header: 'Epoch',
            accessor: 'epoch',
            Cell:row =>{
                return( row.row._original.epoch ?  <span> {row.row._original.epoch}</span> : '--')
            },
            className: 'activelink'
          },
          {
            Header: 'Encounter',
            accessor: 'encounter',
            Cell:row =>{
                return( row.row._original.encounter ?  <span> {row.row._original.encounter}</span> : '--')
            },
            className: 'activelink'
          },
          {
            Header: 'In Window Expectation (Minimum Date)',
            accessor: 'inWindowExpectMinDate',
            Cell:row =>{
                return( row.row._original.inWindowExpectMinDate ?  <span> {row.row._original.inWindowExpectMinDate}</span> : '--')
            },
            className: 'activelink'
          },
          {
            Header: 'In Window Expectation (Maximum Date)',
            accessor: 'inWindowExpectMaxDate',
            Cell:row =>{
                return( row.row._original.inWindowExpectMaxDate ?  <span> {row.row._original.inWindowExpectMaxDate}</span> : '--')
            },
            className: 'activelink'
          },
          {
            Header: 'Encounter Scheduled Date',
            accessor: 'encounterSheduleDate',
            Cell:row =>{
                return( row.row._original.encounterSheduleDate ?  <span> {row.row._original.encounterSheduleDate}</span> : '--')
            },
            className: 'activelink'
          },
           {
            Header: 'Patient Check-in Date',
            accessor: 'patientCheckinDate',
            Cell:row =>{
                return( row.row._original.patientCheckinDate ?  <span> {row.row._original.patientCheckinDate}</span> : '--')
            },
            className: 'activelink'
          }
        ];

        this.setState({
            columns : columns
        });

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
                            data={this.state.patientData}
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PatientProgress));

