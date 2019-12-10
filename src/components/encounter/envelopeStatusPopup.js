/**
* Copyright (c) 2018
* @summary TThis file is use under  Setup -> Protocol setup -> element Setup
           Open modal when user click on sub element button after select perticular domain element.
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from '../modaldialog/modal';
import ApiService from '../../api';
import { NotificationManager } from 'react-notifications';
import ReactTable from "react-table";
import 'react-table/react-table.css';


class ElementListPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            envelopeDataList : [],
            envelopeDataColumn:[]
        }

    }

    componentDidMount() {
        const  envelopeDataColumn = [
            {
                Header: 'Envelope Id',
                accessor: 'envelopeId',
                Cell:row =>{
                    return row.row._original.envelopeId ? <span> {row.row._original.envelopeId}</span> : '--'
                }
            },
            {
                Header: 'Document Name',
                accessor: '',
                Cell:row =>{
                    return(
                        'ICF document.pdf'
                    )
                }
            },
            {
                Header: 'Status',
                accessor: 'status',
                Cell:row =>{
                    return row.row._original.status ? <span> {row.row._original.status}</span> : '--'
                }
            }
        ];
        ApiService.getEnvelopeStatus(this.props.envelopeId).then((res) => {
            this.setState({envelopeDataList:[res.data],envelopeDataColumn:envelopeDataColumn});
        }, (error) => {
            NotificationManager.error('something went wrong');
        });

    }

    onEditElementRow = ()=>{}

    onDeleteDeleteRow = ()=>{}

    onClose = ()=>{ this.props.hideModal && this.props.hideModal();}

    render({ props, state } = this) {
        let { afterClose, hideModal, onSave } = props;
        return (
            <Modal onClose={this.onClose} className={props.className}>
                <div className="modal-header border-bottom-p mx-4 p-0 py-2">
                    <h5 className="modal-title c-p" id="exampleModalLabel">ICF Form Status</h5>
                    <button type="button" className="close c-p" data-dismiss="modal" aria-label="Close" onClick={this.onClose}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body px-4 text-left pt-1">
                    <div className="row col-12 border p-0 m-0">
                        <ReactTable
                            data={this.state.envelopeDataList}
                            columns={this.state.envelopeDataColumn}
                            minRows={1}
                            multiSort ={true}
                            className='table table-responsive-sm activity-table mb-0'
                            showPagination={true}
                            noDataText='No Record Found'
                            defaultPageSize={10}
                            nextText='>>'
                            previousText='<<'
                        />
                    </div>
                </div>
                <div className="modal-footer pr-0 pt-0"></div>
            </Modal>
        );
    }

}

export default connect(null, null)(ElementListPopUp);