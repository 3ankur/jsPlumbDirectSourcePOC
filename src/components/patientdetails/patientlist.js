/**
* Copyright (c) 2018
* @summary Application Patient List Table
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import ReactTable from "react-table";
import 'react-table/react-table.css'

class PatientList extends Component {
    patientSearchHandeler(e){
        this.props.SearchPatient(e.target.value);
    }

    onTDClick = (row) => {
        this.props.editPatient && this.props.editPatient(row.original);
    }

    componentDidMount(){
         columns = [{
            Header: 'Patient',
            accessor: 'patientName',
            Cell:row =>{
                //return <div><i className="glyphicon glyphicon-edit editicn editPatient" title="Edit Patient Info" onClick={(e)=>this.onTDClick(row)}></i><span className="ml-2 mr-2 p-0 cccolor">|</span><NavLink  to={`/patientdetails/patientdescription/${row.original.uniqueIdentifier}`}  title="Go to Patient Info">{row.original.patientName} </NavLink></div>
                return <NavLink  to={`/patientdetails/patientdescription/${row.original.uniqueIdentifier}`}  title="Go to Patient Info">{row.original.patientName} </NavLink>
            },
            className: 'activelink'
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
            accessor: 'siteName',
            Cell:row =>{
                return row.row._original.siteName ? <span> {row.row._original.siteName}</span> : '--'
            }
          },
          {
            Header: 'Status',
            accessor: 'status',
            Cell:row =>{
                return row.row._original.status ? <span> {row.row._original.status}</span> : '--'
            }
          }
        ]
    }


  render() {
      let data = this.props.lists;
      if(this.props.searchPatients){
        data = data.filter( (row)=>{
            return  (
            row.patientName && row.patientName.toLowerCase().indexOf(this.props.searchPatients && this.props.searchPatients.toLowerCase().trim() ) >-1
            || row.status && row.status.toLowerCase().indexOf(this.props.searchPatients && this.props.searchPatients.toLowerCase().trim() ) >-1
            || row.studyName && row.studyName.toLowerCase().indexOf(this.props.searchPatients && this.props.searchPatients.toLowerCase().trim() ) >-1
            || row.siteName && row.siteName.toLowerCase().indexOf(this.props.searchPatients && this.props.searchPatients.toLowerCase().trim() ) >-1
        )
      });
    }
    return (
    	 <section >
            <div className="row border p-3 m-0 my-2">
                <div className="col p-0 pt-2"><h5 className=" c-p">Patient Details</h5></div>
                <div className="col-auto p-0 mb-2 d-flex flex-row">
                    <span className="px-2 pt-1">Search</span>
                    <div className="input-group border">
                            <input className="form-control border-0" placeholder=""  onChange={this.patientSearchHandeler.bind(this)} />
                            <div className="input-group-addon px-2 bg-p  search-icon" >
                                <i className="material-icons pt-2 text-white">search</i>
                            </div>
                    </div>
                </div>
                <div className="col-12 border px-0">
                    <ReactTable
                            data={data}
                            columns={columns}
                            minRows={1}
                            multiSort ={true}
                            showPagination={true}
                            nextText='>>'
                            previousText='<<'
                            noDataText='No Record Found'
                            defaultPageSize={10}
                           // getTdProps={this.onTDClick}
                        />
                </div>
            </div>
        </section>
    );
  }
}

export default PatientList;
var columns=[];
