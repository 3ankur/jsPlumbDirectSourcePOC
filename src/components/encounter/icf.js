/**
* Copyright (c) 2018
* @summary ICf Details Page
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React, { Component } from 'react';
import moment from 'moment';
import ApiService from '../../api';
import {NotificationManager} from 'react-notifications';
import { MODAL_ENVELOPSTATUS,MODAL_RECIPENTSTATUS } from '../../constants/modalTypes';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux' ;
import * as modalAction from '../../actions/modalActions';
import ReactTable from "react-table";
import 'react-table/react-table.css';

const PIArray = [
    {
        "value": "amit.tanwar@saama.com",
        "name": "Amit Tanwar"
	  },
]

const studyManageArray = [
    {
        "value": "v.patel@saama.com",
        "name": "vinod Patel"
	  },
]

const PatientArray = [
    {
        "value": "poonam.banode@saama.com",
        "name": "Poonam Banode"
	  },
]

class Screened extends Component {

    constructor(props){
        super(props);
        this.state = {
           pI:'',
           studyManager:'',
           patient:'',
           legancy:'',
           legancyEmail:'',
           envelopID:'',
           envelopeDataList : [],
            envelopeDataColumn:[]
        }
    }
    componentDidMount(){
     let envelopeID = localStorage.getItem('envelopeID');
     if(envelopeID !=null){
        this.getEnvelopDetails(envelopeID);
        localStorage.setItem('envelopeID','');
     }
    }
    onChangeDropDown = (event)=>{
        this.setState({
            [event.target.name] : event.target.value
        });
    }

    getEnvelopDetails(envelopeId){
        ApiService.getEnvelopeRecipentsStatus(envelopeId).then((res) => {
            this.setState({envelopeDataList:res.data.signers,envelopeDataColumn:envelopeDataColumn},()=>{
                res.data.signers.map((item)=>{
                    let signData={
                        "returnUrl": "localhost:3000/#/encounterdetails/icf/",
                        "authenticationMethod": "None",
                        "email": item.email,
                        "userName": item.name,
                        "clientUserId": item.clientUserId,
                        "envelopID":this.state.envelopID
                      }
                    ApiService.getsigningURL(this.state.envelopID,signData).then((ressign) => {
                            item['url']=ressign.data && ressign.data.url;
                        this.setState({envelopeDataList:res.data.signers,envelopeDataColumn:envelopeDataColumn});
                    }, (error) => {
                        NotificationManager.error('something went wrong');
                    });
                })
            });
        }, (error) => {
            NotificationManager.error('something went wrong');
        });
    }

    onClickCreateEnvelope = () =>{
       let tempObj =  [
            {
              "email": this.state.pI,
              "name":"Amit Tanwar"
            },
            {
              "email": this.state.studyManager,
              "name": "vinod Patel"
            },
            {
              "email": this.state.patient,
              "name": "Poonam Banode"
            },
            {
              "email":"shilpee.samar@saama.com",//this.state.legancyEmail,
              "name": this.state.legancy
            }
       ]
        ApiService.createEnvelope(tempObj).then((res) => {
            if(res && res.data && res.status === 200){
                NotificationManager.success('Data saved successfully');
                this.setState({envelopID:res.data.envelopeId},()=>{});
                localStorage.setItem('envelopeID',res.data.envelopeId)
                this.getEnvelopDetails(res.data.envelopeId);
            }
         },(error) => {
             NotificationManager.error('something went wrong');
         });
    }

    openEnvelopeStatusModal(){
        this.props.modalAction && this.props.modalAction.showModal(MODAL_ENVELOPSTATUS,{
            onSave : (data) => {if(data){}
            },
            hideModal : ()=>{
                this.props.modalAction.hideModal();
            },
            envelopeId:this.state.envelopID,
            className:'element_list_modal'
        });
    }

    openRecipentStatusModal(){
        this.props.modalAction && this.props.modalAction.showModal(MODAL_RECIPENTSTATUS,{
                onSave : (data) => {if(data){}
            },
            hideModal : ()=>{
                this.props.modalAction.hideModal();
            },
            envelopeId:this.state.envelopID,
            className:'element_list_modal',
        });
    }

  render() {
    return (
        <section className=" baseline-container footpadb">
            <div className="border p-3 m-0 row justify-content-between">
                <div className="row col-12 justify-content-between border-bottom-dotted m-0 mb-1 pb-2 px-0">
                    <div className="col-md-4 col-sm-auto p-0">
                        <h5 className=" c-p pt-1">ICF Body</h5>
                    </div>
                    <div className="col-md-auto col-sm-auto d-flex flex-row text-right p-0">
                        <div className="d-flex flex-row pt-1 mr-3 col-sm-auto">
                            <i className="material-icons px-1 py-1 mr-2">person_outline</i>
                            <span className="mr-2 pt-1">Smith, James</span>
                            <span className="border-left border-secondary mr-2"></span>
                            <span className="mr-2 pt-1">Language</span>
                            <select>
                                <option>English</option>
                            </select>
                        </div>
                        {this.state.envelopID && <div className="col-md-auto justify-content-end p-0">
                                    <div className="edit-btn-group  pull-right plcustom">
                                        <i className="material-icons" title='ICF Form Status' onClick={this.openEnvelopeStatusModal.bind(this)} >assignment_ind</i>
                                        {/* <i className="material-icons" title='ICF Form Recipent Status' onClick={this.openRecipentStatusModal.bind(this)}>fingerprint</i> */}
                                        {/* <i className="material-icons" title='Download ICF Form'>play_for_work</i> */}
                                    </div>
                                </div>}
                    </div>
                </div>
                <div className="col-12 p-0 mt-1 text-center">
                    <div className="form-group">
                        {/* <iframe id="fred" title="PDF in an i-Frame" src="assets/images/Informed_Consent _template.pdf" frameBorder="1" scrolling = "auto"
                            height="1100" width="850" >
                        </iframe> */}

            <embed src="assets/images/Informed_Consent _template.pdf" width="600" height="500" alt="pdf" />
                    </div>
                </div>
                <div className="col-12 p-0 mt-1">
                    <div className="row col-12 justify-content-start p-0 m-0">
                        <div className="col-3 pl-0">
                            <div className="form-group col-12 p-0">
                                <div className="input-group">
                                    <select className="form-control" name='pI' onChange={this.onChangeDropDown}>
                                        <option disabled selected hidden>Select PI</option>
                                        { PIArray.map((item,index)=>{
                                            return <option key={index} value={item.value}>{item.name}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col-3 pl-0">
                            <div className="form-group col-12 p-0">
                                <div className="input-group">
                                    <select className="form-control" name='studyManager' onChange={this.onChangeDropDown}>
                                        <option disabled selected hidden>Select Study Manager</option>
                                        { studyManageArray.map((item,index)=>{
                                            return <option key={index} value={item.value}>{item.name}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col-3 pl-0">
                            <div className="form-group col-12 p-0">
                                <div className="input-group">
                                    <select className="form-control" name='patient' onChange={this.onChangeDropDown}>
                                        <option disabled selected hidden>Select Patient</option>
                                        { PatientArray.map((item,index)=>{
                                            return <option key={index} value={item.value}>{item.name}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col-3 pl-0 pr-0">
                            <div className="form-group col-12 p-0">
                                <div className="input-group">
                                   <input type='text' placeholder="Legal Assent Representative" name='legancy' className='form-control'  onChange={this.onChangeDropDown} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row col-12 justify-content-start p-0 m-0">
                        <div className="col-3 pl-0">
                            {/* <div className="form-group">
                                {this.state.pI && <label className="alert  col-12 pl-3 p-2 emailLabel"><i className="material-icons emailOutline">mail_outline</i>{this.state.pI}<i className="material-icons sendArrow">send</i></label>}
                            </div>
                            {this.state.pI &&<div className="col-12 p-0 mt-1 text-center">
                            </div>} */}
                        </div>
                        <div className="col-3 pl-0">
                            {/* <div className="form-group">
                                {this.state.studyManager && <label className="alert  col-12 pl-3 p-2 emailLabel"><i className="material-icons emailOutline">mail_outline</i>{this.state.studyManager}<i className="material-icons sendArrow">send</i></label>}
                            </div>
                            {this.state.studyManager &&<div className="col-12 p-0 mt-1 text-center">
                            </div>} */}
                        </div>
                        <div className="col-3 pl-0">
                            {/* <div className="form-group">
                                {this.state.patient && <label className="alert  col-12 pl-3 p-2 emailLabel"><i className="material-icons emailOutline">mail_outline</i>{this.state.patient}<i className="material-icons sendArrow">send</i></label>}
                            </div>
                            {this.state.patient &&<div className="col-12 p-0 mt-1 text-center">
                            </div>} */}
                        </div>
                        <div className="col-3 pl-0 pr-0">
                            {/* <div className="form-group">
                                <div className="input-group">
                                   {this.state.legancy && <input  type='text' name='legancyEmail' placeholder="Legal Assent Representative Mail ID" className='form-control legacyin'  onChange={this.onChangeDropDown} />}

                                </div>
                            </div>
                            {this.state.legancye &&<div className="col-12 p-0 mt-1 text-center">
                            </div>} */}
                        </div>
                    </div>
                </div>
               { this.state.envelopeDataList.length==0 && <div className="col-12 p-0 mt-1 text-center">
                    <button type="button" className="btn text-white align-bottom bg-p" onClick={this.onClickCreateEnvelope}>Invite For Sign</button>
                </div>}
                {this.state.envelopeDataList && this.state.envelopeDataList.length > 0 && <div className="row col-12 border p-0 m-0">
                        <ReactTable
                            data={this.state.envelopeDataList}
                            columns={this.state.envelopeDataColumn}
                            minRows={1}
                            multiSort ={true}
                            className='table table-responsive-sm activity-table mb-0'
                            showPagination={true}
                            nextText='>>'
                            previousText='<<'
                            defaultPageSize={10}
                            noDataText='No Record Found'
                        />
                    </div>}
            </div>
        </section>
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

export default connect(mapStateToProps,mapDispatchToProps)(Screened);

const  envelopeDataColumn = [
    {
        Header: 'Name',
        accessor: 'name',
        Cell:row =>{
            return row.row._original.name ? <span> {row.row._original.name}</span> : '--'
        }
    },{
        Header: 'Status',
        accessor: 'status',
        Cell:row =>{
            return row.row._original.status ? <span> {row.row._original.status}</span> : '--'
        }
    },{
        Header: 'Send for sign',
        accessor: 'url',
        Cell:row =>{
                return(
                    <div className="d-flex flex-row text-dark pt-1 align-middle">
                       <a href={row.row._original.url} target="_blank"> <i className="material-icons emailOutline">send</i></a>
                    </div>
                )
            }

    }
];