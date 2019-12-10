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
import common from '../../common/common';
import _ from 'lodash';
import { NotificationManager } from 'react-notifications';

class DndPopUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comment:''
        }
    }

    onClose = () => {
        this.props.hideModal();
        if (this.props.afterClose) {
            this.props.afterClose();
        }
    };

    onChangeText = (e)=>{
        this.setState({
            [e.target.name] : e.target.value
        });
    }

    onSaveReason = ()=>{
        if(this.state.comment){
            this.props.onSave &&  this.props.onSave(this.state);
        }else{
            common.clearNotification();
            NotificationManager.error('Please fill the required fields');
        }

    }

    render() {
        return (
            <Modal onClose={this.onClose} className={this.props.className}>
                <div className="modal-header border-bottom-p mx-3 p-0 py-3">
                    <h5 className="modal-title c-p" id="exampleModalLabel">Reason For DND</h5>
                    <button type="button" className="close c-p" data-dismiss="modal" aria-label="Close" onClick={this.onClose}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body text-left">
                    <div className="row col-sm-12">
                        <label className="text-left col-sm-2 pr-0 pl-0">Comment</label>
                        <textarea row='4' name='comment'  onChange={this.onChangeText} className='form-control input-group col-sm-10 reqfeild'> </textarea>
                    </div>
                </div>
                <div className="modal-footer text-left text-white ">
                    <div className="row col-12 p-0 justify-content-between">
                        <div className="col-12 pull-right" style={{ textAlign: "right" }}>
                            <button type="button" className="btn text-white align-bottom bg-p mr-2" onClick={this.onSaveReason}>Save</button>
                            <button type="button" className="btn text-white align-bottom bg-p" onClick={this.onClose}>Cancel</button>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
}
export default connect(null, { hideModal })(DndPopUp);