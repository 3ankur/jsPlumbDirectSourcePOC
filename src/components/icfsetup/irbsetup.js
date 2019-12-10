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
import { MODAL_TYPE_ADD_IRB_SETUP } from '../../constants/modalTypes';
import { NavLink } from 'react-router-dom';
import common from '../../common/common';

class IcfIrbSetup extends Component {

    constructor(props, context){
        super(props, context);
        this.state = {
            irbColumnList: [],
            irbList : []
        }
    }

    componentDidMount(){
       this.loadIrbData();
    }

    getSiteList = (data)=>{
        let siteList = [];
        if(data){ for(let item in data){ siteList.push(data[item]);}}
        return siteList.length > 0 && siteList.join(',');
    }

    loadIrbData = () =>{
        let irbColumnList = [
            {
                Header: 'Name',
                accessor: 'irbName'
            },
            {
                Header: 'Study',
                accessor: 'studyName'
            }, {
                Header: 'Site',
                accessor: 'site',
                Cell:row =>{
                    return(
                        row.row._original.siteIdentifierList ? <span>{this.getSiteList(row.row._original.siteIdentifierList)}</span> : '--'
                    )
                }
            }
        ]
        ApiService.getIRBSetupData().then((res)=>{
            res && res.data.response.forEach((d)=>{
                d.id  = d.studyIdentifier;
                d.name = d.studyName;
            });
            this.setState({ irbList : res.data.response , irbColumnList : irbColumnList },()=>{});
        });
    }

    openIrbModal = (irbEditData)=>{
        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_ADD_IRB_SETUP,{
            onSave : (data) => {
                if(data){
                    let saveIrbObj = {
                        "irbIdentifier": irbEditData ? irbEditData.irbIdentifier : '',
                        "irbName": data.irbName,
                        "siteIdentifierList": data.siteIdentifiers,
                        "studyIdentifier": data.studyIdentifier
                    }
                    ApiService.saveIRBSetup(saveIrbObj).then((res) => {
                        if(res && res.data.status == 'success'){
                            common.clearNotification();
                            NotificationManager.success('Data saved successfully');
                            this.loadIrbData();
                            this.props.modalAction.hideModal();
                        }
                      },(error) => {
                          NotificationManager.error('something went wrong');
                      });
                }
            },
            irbEditData : irbEditData,
            hideModal : ()=>{ this.props.modalAction.hideModal(); },
            className:'irb-modal'
        });
    }


    onRowClick = (state, rowInfo, column) => {
        return {
            onClick: (e) => {
                //this.openIrbModal(rowInfo && rowInfo.row)
            }
        }
    }



  render({props,state} = this) {
    return (
        <section className="irb-setup">
            <div className="border p-3 m-0 row justify-content-between">
                <div className="row col-12 justify-content-between border-bottom-dotted m-0 mb-3 pb-2 px-0">
                    <div className="col-3 p-0">
                        <h5 className="pt-2 c-p">Elligo Central IRB</h5>
                    </div>
                </div>
                <div className="row col-12 pr-0">
                    <div className="col-12 p-0">
                        <div className="row col-12 d-flex flex-row-reverse mb-2">
                            <span className="col-sm-auto pl-0">
                                <NavLink to='/irbSetup/icfSetup'>Add New ICF</NavLink>
                            </span>
                            <span className='text-muted ml-1 mr-1'> | </span>
                            <span onClick={()=> this.openIrbModal() } className="col-sm-auto pr-0">
                                <span className="c-b cursor-pointer float-right">Add New IRB</span>
                                <span  className="add-btn"><i  className="material-icons">add</i></span>
                            </span>
                        </div>
                        <div  className="col-12 border px-0 site-info-table">
                            <ReactTable
                                data={state.irbList || []}
                                columns={state.irbColumnList}
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

