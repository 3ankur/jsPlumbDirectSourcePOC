/**
 * Copyright (c) 2018
 * @summary Publishing the protocol setup modal popup
 * @author Ankur Vishwakarma,Poonam Banode,Mangesh Pimprikar,Irfan Bagwan
 */

import React from 'react';
import { connect } from 'react-redux';
import { hideModal } from '../../actions/modalActions';
import Modal from '../modaldialog/modal';
import DateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import Common from '../../common/common';
import _ from 'lodash';
import { NotificationManager } from 'react-notifications';

class ElementNotSaveModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            unfilledForm:[],
            actualFormSaveJSON:[]
        }
    }

    onClose = () => {
        this.props.hideModal();
        this.setState({unfilledForm:[]})
        if (this.props.afterClose) {
            this.props.afterClose();
        }
    };

    validateForm(){
        let errArr =[];
        this.state.unfilledForm && this.state.unfilledForm.forEach( (formVal,idx)=>{
            if(formVal.hasOwnProperty("ansStatus")){
                if(!formVal.hasOwnProperty("ansComments") && formVal.ansStatus!=4){
                    errArr.push(false)
                }
                if(formVal.hasOwnProperty("ansComments") &&  formVal.ansComments.trim()=="" && formVal.ansStatus!=4){
                    errArr.push(false)
                }
                if(formVal.hasOwnProperty("ansComments") && formVal.hasOwnProperty("ansStatus") && formVal.ansComments && formVal.ansComments!=="" && formVal.ansStatus!=4 ){
                    errArr.push(true)
                }
            }
        });
        if(errArr && errArr.indexOf(false)>-1){
            return false
        }else{
            return true;
        }
    }

    onSave = () => {
       if(this.validateForm()){
        let prevInfoSt = this.state.actualFormSaveJSON;
        this.state.unfilledForm.forEach(  (rdata,ridx)=>{
          let hasAlradyExits = _.findIndex(this.state.actualFormSaveJSON,(k)=>{return k.elementEncounterIdentifier == rdata.uniqueIdentifier })
            if(hasAlradyExits>-1){
                if(rdata.hasOwnProperty("ansStatus") && rdata.hasOwnProperty("ansComments")){
                    prevInfoSt[hasAlradyExits]["answerStatus"] = 1
                    prevInfoSt[hasAlradyExits]["performedStatus"] = rdata.ansStatus
                    prevInfoSt[hasAlradyExits]["comments"] = rdata.ansComments
                    prevInfoSt[hasAlradyExits]["tableview"] = this.props.actualFormData.columnList !== null &&  this.props.actualFormData.columnList.length > 0  ?   1 : 0
                }
                else{
                    prevInfoSt[hasAlradyExits]["performedStatus"] = 4
                    prevInfoSt[hasAlradyExits]["comments"] = rdata.ansComments
                    prevInfoSt[hasAlradyExits]["tableview"] = this.props.actualFormData.columnList !== null &&  this.props.actualFormData.columnList.length > 0  ?   1 : 0
                }
            }else if(rdata.hasOwnProperty("ansStatus") && rdata.hasOwnProperty("ansComments")){
                let info = this.getSaveJSONInfo()
                info.answerStatus = 1;
                info.performedStatus = rdata.ansStatus;
                info.comments = rdata.ansComments;
                info.elementEncounterIdentifier = rdata.uniqueIdentifier
                info.tableview  =  this.props.actualFormData.columnList !== null &&  this.props.actualFormData.columnList.length > 0  ?   1 : 0
                prevInfoSt.push(info)
            }else{
                let info = this.getSaveJSONInfo()
                info.performedStatus = 4;
                info.elementEncounterIdentifier = rdata.uniqueIdentifier
                info.tableview  =  this.props.actualFormData.columnList !== null &&  this.props.actualFormData.columnList.length > 0  ?   1 : 0
                prevInfoSt.push(info)
            }
        });
        this.setState({actualFormSaveJSON:prevInfoSt},()=>{
            this.props.onSave(this.state.actualFormSaveJSON);
        });
       }else{
            NotificationManager.error('Invalid Form');
        }
    }

    getSaveJSONInfo(){
        return    {
               "answerStatus": 0,
               "attributeValue": "",
               "comments": "",
               "elementEncounterIdentifier": "",
               "meausrementvalue": "",
               "performedStatus":4,
               "tableview": 0
             }
    }

    componentDidMount() {
        try{
            if(this.props.actualFormData && this.props.actualFormData.labelList){
                let mainArr = [];
                let excludeQues = ["label","textBlockLong","reminder"];
                let prevSt = this.state.unfilledForm
                    const filterEle  = this.props.actualFormData.labelList.filter( (o)=>{ return  (o.inputValue===null || o.inputValue=="" || parseInt(o.inputValue)  == 0)  } )
                    filterEle && filterEle.forEach( (ui,op)=>{
                        if(!(excludeQues.indexOf(ui.inputType)>-1)){
                            mainArr.push(ui)
                        }
                    });
                this.setState({unfilledForm:mainArr},()=>{});
            }
            if(this.props.forSaveForm){
                this.setState({actualFormSaveJSON:this.props.forSaveForm})
            }
        }catch(e){}
    }

    reasonComment =(uid,index,e)=>{
        const prevSt = this.state.unfilledForm;
        prevSt[index]["ansComments"] = e.target.value;
        this.setState({unfilledForm:prevSt},()=>{});
    }

    updateReasonStatus(type,uid,index){
        const prevSt = this.state.unfilledForm;
        prevSt[index]["ansStatus"] = type;
        this.setState({unfilledForm:prevSt},()=>{});
    }

    render() {
        return (
            <Modal onClose={this.onClose} className={this.props.className}>
                <div className="modal-header border-bottom-p mx-4 p-0 py-3">
                    <h5 className="modal-title c-p" id="exampleModalLabel">Questionnaire Status</h5>
                    <button type="button" className="close c-p" data-dismiss="modal" aria-label="Close" onClick={this.onClose}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body text-left">
                    <div className="">
                    { this.state.unfilledForm  && this.state.unfilledForm.length>0  &&   <div className="row  border p-0 m-0">
                        <table className="table table-responsive-lg activity-table" id="logtable">
                                <thead>
                                    <tr valign="middle">
                                        <th>Question</th>
                                        <th>Action</th>
                                        <th>Comments</th>
                                    </tr>
                                </thead>
                                <tbody>{this.state.unfilledForm.map( (naQues,naIdx)=>{
                                            return <tr key={naQues.uniqueIdentifier ? naQues.uniqueIdentifier  : naIdx}>
                                                <td>{naQues.name}</td>
                                                <td>
                                                    <div className="btn-group ml-2" role="group" aria-label="status">
                                                        {/* <button onClick={this.updateReasonStatus.bind(this,1,naQues.uniqueIdentifier,naIdx)}  type="button" className={naQues.ansStatus && naQues.ansStatus==1 ? "btn p-1 active_element_anstype" : "btn p-1 "   }   title="Done"><i className="material-icons">done</i></button>
                                                        <button onClick={this.updateReasonStatus.bind(this,2,naQues.uniqueIdentifier,naIdx)} type="button" className={naQues.ansStatus && naQues.ansStatus==2 ? "btn p-1 active_element_anstype" : "btn p-1 "   }  title="Not Done"><small><i className="material-icons">close</i></small></button> */}
                                                        <button  onClick={this.updateReasonStatus.bind(this,2,naQues.uniqueIdentifier,naIdx )} type="button" className={naQues.ansStatus && naQues.ansStatus==2 ? "btn p-1 active_element_anstype" : "btn p-1 "   }  title="Not Asked">NASK</button>
                                                        <button  onClick={this.updateReasonStatus.bind(this,3,naQues.uniqueIdentifier,naIdx )} type="button" className={naQues.ansStatus && naQues.ansStatus==3 ? "btn p-1 active_element_anstype" : "btn p-1 "   }  title="Not Available">NAVU</button>
                                                    </div>
                                                </td>
                                                <td>
                                                    <input type="text" disabled = {(naQues.ansStatus && naQues.ansStatus!=4)? "" : "disabled"} value={naQues.ansComments ? naQues.ansComments : ""} onChange={this.reasonComment.bind(this,naQues.uniqueIdentifier,naIdx)} className="form-control" />
                                                </td>
                                            </tr>
                                        })
                                }</tbody>
                            </table>
                            </div>
                        }
                        {this.state.unfilledForm  && this.state.unfilledForm.length==0 && <div className="row p-0 m-0"> <div className="alert alert-info col-md-12 text-center">Please save the changes.</div></div>}
                  </div>
                </div>
                <div className="modal-footer text-left text-white ">
                    <div className="row col-12 p-0 justify-content-between">
                        <div className="col-12 pull-right" style={{ textAlign: "right" }}>
                            <button type="button" className="btn text-white align-bottom bg-p mr-2" onClick={this.onSave}>Save</button>
                            <button type="button" className="btn text-white align-bottom bg-p" onClick={this.onClose}>Cancel</button>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
}
export default connect(null, { hideModal })(ElementNotSaveModal);