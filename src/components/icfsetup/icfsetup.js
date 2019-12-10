/**
* Copyright (c) 2018
* @summary Application Patient Deatil Page
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React, { Component } from 'react';
import Filter from '../filter/filter';
import ApiService from '../../api';
import { NotificationManager } from 'react-notifications';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import * as modalAction from '../../actions/modalActions';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux' ;
import { MODAL_TYPE_ADD_IRB_SETUP,MODAL_TYPE_ADD_ICF_SETUP } from '../../constants/modalTypes';
import { NavLink } from 'react-router-dom';
import  common from '../../common/common';

class IcfIrbSetup extends Component {

    constructor(props, context){
        super(props, context);
        this.state = {
            icfColumnList: [],
            icfList : []
        }
    }

    componentDidMount(){
        this.loadIcfSetUpData();
    }

    loadIcfSetUpData = ()=>{
        let icfColumnList =[
            {
                Header: 'IRB Name',
                accessor: 'irbName',
                Cell:row =>{
                    return row.row._original.irbName ? <span> {row.row._original.irbName}</span> : '--'
                }
            },
            {
                Header: 'Language',
                accessor: 'langauge',
                Cell:row =>{
                    return row.row._original.langauge ? <span> {row.row._original.langauge}</span> : '--'
                }
            }, {
                Header: 'Version',
                accessor: 'version',
                Cell:row =>{
                    return row.row._original.version ? <span> {row.row._original.version}</span> : '--'
                }
            },
            {
                Header: 'Effective Date',
                accessor: 'effectiveDate',
                Cell:row =>{
                    return row.row._original.effectiveDate ? <span> {row.row._original.effectiveDate}</span> : '--'
                }
            }
        ]

        ApiService.getICFSetupData().then((res)=>{
            this.setState({
                icfColumnList : icfColumnList,
                icfList : res.data.response
            });
        });
    }

    openIcfModal = ()=>{
        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_ADD_ICF_SETUP,{
            onSave : (data) => {
                if(data){
                    let saveIrbObj = {
                        "effectiveDate":  common.formatDate(data.effectiveDate,'YYYY-MM-DD'),
                        "irbIdentifier": data.irbIdentifier,
                        "isForceSign": data.reSign,
                        "isLeagalAdvisor": data.legal,
                        "isPrimaryInvestigator": data.investigator,
                        "isStudyManager": data.subinvestigator,
                        "langauge": data.language,
                        "documentName" : data.fileUploadName,
                        "documentBase64":data.fileUploadUrl
                      }
                    ApiService.saveICFSetup(saveIrbObj).then((res) => {
                        if(res && res.data.status == 'success'){
                            common.clearNotification();
                            NotificationManager.success('Data saved successfully');
                            this.loadIcfSetUpData();
                            this.props.modalAction.hideModal();
                        }
                      },(error) => {
                          NotificationManager.error('something went wrong');
                      });
                }
            },
            hideModal : ()=>{ this.props.modalAction.hideModal(); },
            className:'icf-modal'
        });
    }


  render({props,state} = this) {
    return (
        <section className="baseline-container">
            <div className="border p-3 m-0 row justify-content-between">
                <div className="row col-12 justify-content-between border-bottom-dotted m-0 mb-3 pb-2 px-0">
                    <div className="col-3 p-0">
                        <h5 className="pt-2 c-p">ICF Setup</h5>
                    </div>
                </div>
                <div className="row col-12 pr-0">
                    <div className="col-12 p-0">
                        <div className="row col-12 d-flex flex-row-reverse mb-2">
                            <span onClick={this.openIcfModal} className="col-sm-auto">
                                <span className="float-right c-b cursor-pointer">Add New ICF</span> <span  className="add-btn"><i  className="material-icons">add</i></span>
                            </span>
                        </div>
                        <div  className="col-12 border px-0 site-info-table">
                            <ReactTable
                                data={state.icfList || []}
                                columns={state.icfColumnList}
                                minRows={1}
                                multiSort ={true}
                                className='table activity-table table-responsive-sm m-0 '
                                showPagination={true}
                                nextText='>>'
                                previousText='<<'
                                defaultPageSize={10}
                                noDataText='No Record Found'
                                getTrProps={this.onRowClick}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
  }
}

function mapDispatchToProps(dispatch) {
    return { modalAction : bindActionCreators(modalAction,dispatch) };
}

function mapStateToProps(state){
    return { modal : state.modal }
}




export default connect(mapStateToProps , mapDispatchToProps)(IcfIrbSetup);

