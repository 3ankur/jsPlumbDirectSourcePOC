/**
* Copyright (c) 2018
* @summary TThis file is use under  Setup -> Protocol setup -> element Setup
           Open modal when user click on sub element button after select perticular domain element.
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from '../../modaldialog/modal';
import ApiService from '../../../api';
import { NotificationManager } from 'react-notifications';
import ReactTable from "react-table";
import 'react-table/react-table.css';


class ElementListPopUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            elementDataList : [],
            elementDataColumn:[]
        }

    }


    componentDidMount() {
        const  elementDataColumn = [
            {
                Header: 'ItemGroup Name',
                accessor: 'elementName',
                Cell:row =>{
                    return row.row._original.elementName ? <span> {row.row._original.elementName}</span> : '--'
                }
            },
            {
                Header: 'ItemGroup Domain',
                accessor: 'domainName',
                Cell:row =>{
                    return(
                        row.row._original.domainName ? <span>{row.row._original.domainName} </span> : '--'
                    )
                }
            },
            {
                Header: 'Action',
                accessor: 'action',
                sortable:false,
                Cell:row =>{
                    return(
                        <div className="d-flex flex-row text-dark pt-1 align-middle">
                            <i className="glyphicon glyphicon-edit pr-2 editicn" onClick={()=>this.onEditElementRow(row && row.row)}></i>
                            {/* <i className="glyphicon glyphicon-trash" onClick={()=>this.onDeleteDeleteRow(row && row.row)}></i> */}
                        </div>
                    )
                }
            }
        ];
        ApiService.getAllItemGroups(this.props.studyId).then((res) => {
            if(res && typeof res.data.response === 'string'){
                this.setState({
                    elementDataList : [],
                    elementDataColumn : []
                })
            }else{
                this.setState({
                    elementDataList : res && res.data.response,
                    elementDataColumn : elementDataColumn
                })
            }

        }, (error) => {
            NotificationManager.error('something went wrong');
        });

    }

    onEditElementRow = (data)=>{
        this.props.onSave &&  this.props.onSave(data,"fromEdit");
    }

    onDeleteDeleteRow = ()=>{

    }

    onClose = ()=>{
        this.props.hideModal && this.props.hideModal();
    }

    render({ props, state } = this) {
        let { afterClose, hideModal, onSave } = props;
        return (
            <Modal onClose={this.onClose} className={props.className}>
                <div className="modal-header border-bottom-p mx-4 p-0 py-2">
                    <h5 className="modal-title c-p" id="exampleModalLabel">ItemGroup List </h5>
                    <button type="button" className="close c-p" data-dismiss="modal" aria-label="Close" onClick={this.onClose}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body px-4 text-left pt-1">
                    {this.state.elementDataList && this.state.elementDataList.length > 0 && <div className="row col-12 p-0 m-0">
                        <ReactTable
                            data={this.state.elementDataList}
                            columns={this.state.elementDataColumn}
                            minRows={1}
                            multiSort ={true}
                            className='table table-responsive-sm activity-table mb-0'
                            showPagination={true}
                            nextText='>>'
	                        previousText='<<'
                            defaultPageSize={10}
                            noDataText='No Record Found'
                        />
                    </div>
                    }
                    {
                       this.state.elementDataList && this.state.elementDataList.length == 0 &&
                       <div className="alert alert-info col-md-12 text-center"> No ItemGroup Found</div>
                    }
                </div>
                <div className="modal-footer pr-0 pt-0">
                    {/* <button type="button" className="btn text-white align-bottom bg-p mr-2" onClick={this.addSubElement}>Add</button>
                    <button type="button" className="btn text-white align-bottom bg-p mr-4" onClick={this.onClose}>Cancel</button> */}
                </div>
            </Modal>
        );
    }

}

export default connect(null, null)(ElementListPopUp);