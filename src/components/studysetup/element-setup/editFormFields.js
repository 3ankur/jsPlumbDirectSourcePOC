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
import common from '../../../common/common';


class EditFormFields extends Component {

    constructor(props) {
        super(props);
        this.state = {
            OrignalFieldName : '',
            updatedQuestionFieldName : '',
            isRepetedFields : false
        }

    }


    componentDidMount() {
        console.log("fullDatafullData",this.props.fullData);
        //this.props.fullData && this.props.fullData.labelList
        this.setState({
            OrignalFieldName : this.props.itemDefinationData && this.props.itemDefinationData.name,
            updatedQuestionFieldName : this.props.itemDefinationData && this.props.itemDefinationData.updatedQuestion ? this.props.itemDefinationData.updatedQuestion : ''
        });
    }

    addItem = (data)=>{
        let getSortedBySequenceFields = common.getSortedBySequenceFields(this.props.fullData && this.props.fullData.labelList);
        console.log('full data with merge ',getSortedBySequenceFields);
        let repetedFileds = getSortedBySequenceFields.filter((item)=> {
            if(item.name && this.state.updatedQuestionFieldName){
                console.log('status',item.name.toLowerCase().trim() == this.state.updatedQuestionFieldName.toLowerCase().trim())
                return item.name.toLowerCase().trim() == this.state.updatedQuestionFieldName.toLowerCase().trim()
            }
         })
         console.log('repetedFileds',repetedFileds)
        if(repetedFileds.length > 0){
            common.clearNotification();
            NotificationManager.error('You Entered Same Field Name');
        }else{
            this.props.onSave &&  this.props.onSave(this.state);
        }
    }

    onClose = ()=>{
        this.props.hideModal && this.props.hideModal();
    }

    onChangeName = (e)=>{
        this.setState({
            updatedQuestionFieldName : e.target.value
        })
    }

    render({ props, state } = this) {
        let { afterClose, hideModal, onSave } = props;
        return (
            <Modal onClose={this.onClose} className={props.className}>
                <div className="modal-header border-bottom-p mx-4 p-0 py-2">
                    <h5 className="modal-title c-p" id="exampleModalLabel">Edit Item </h5>
                    <button type="button" className="close c-p" data-dismiss="modal" aria-label="Close" onClick={this.onClose}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body px-4 text-left pt-1">
                    {/* <div className="form-group row">
                        <label htmlFor="staticEmail" className="col-sm-3 col-form-label text-right">  </label>
                        <div className="col-sm-9 p-0">
                            <input type='text'  className=' form-control' />
                        </div>
                    </div> */}
                    <div className="col-12 form-row p-0 m-0 mt-3">
                        <div className="form-group col-md-4 col-half-offset">
                            <label htmlFor="study"> Orignal Item Name  </label>
                        </div>
                        <div className="form-group col-md-4 col-half-offset">
                            <input type='text' value={this.state.OrignalFieldName} className=' form-control' disabled/>
                        </div>
                    </div>
                    <div className="col-12 form-row p-0 m-0 mt-3">
                        <div className="form-group col-md-4 col-half-offset">
                            <label htmlFor="study">  New Item Name </label>
                        </div>
                        <div className="form-group col-md-4 col-half-offset">
                            <input type='text' value={this.state.updatedQuestionFieldName}  onChange={(event)=>this.onChangeName(event)}  className=' form-control'/>
                        </div>
                    </div>
                </div>
                <div className="modal-footer pr-0 pt-0">
                    <button type="button" className="btn text-white align-bottom bg-p mr-2" onClick={()=>this.addItem()}>Add</button>
                    <button type="button" className="btn text-white align-bottom bg-p mr-4" onClick={this.onClose}>Cancel</button>
                </div>
            </Modal>
        );
    }

}

export default connect(null, null)(EditFormFields);