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
import * as modalAction from  '../../../src/actions/modalActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


class ActivityList extends Component {

    constructor(props){
        super(props);
        this.state = {
            columns : []
        }
    }

    componentDidMount(){
        this.columns = [
          {
            Header: 'Patient',
            accessor: 'patientName',
            Cell:row =>{
                return( row.row._original.patientName ? <span>{row.row._original.patientName}</span> : '--')
            },
          },
          {
            Header: 'Study',
            accessor: 'studyName',
            Cell:row =>{
                return( row.row._original.studyName ? <span>{row.row._original.studyName}</span> : '--')
            }
            },
            {
                Header: 'Site',
                accessor: 'siteName',
                Cell:row =>{
                    return( row.row._original.siteName ? <span>{row.row._original.siteName}</span> : '--')
                }
            },
            {
                Header: 'Encounter',
                accessor: 'encounterName',
                Cell:row =>{
                    return( row.row._original.encounterName ? <span>{row.row._original.encounterName}</span> : '--')
                }
            },
            {
                Header: 'Due Date',
                accessor: 'dueDate',
                Cell:row =>{
                    return( row.row._original.dueDate ? <span>{row.row._original.dueDate}</span> : '--')
                }
            }
        ];
        this.setState({
            columns : this.columns
        });
    }

  render({props,state} = this) {
    return (
    	 <div className="">
                <div className="row p-2 m-0 my-2 calhead" >
                    <div className="p-0 pt-2"><h5 className=" c-p calheadsub">Patient Schedule Detail</h5></div>
                    <div className="col-12 px-0">
                        <ReactTable
                            data={this.props.patientSheduleData || []}
                            columns={this.state.columns || []}
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
export default connect(mapStateToProps, mapDispatchToProps)(ActivityList);

