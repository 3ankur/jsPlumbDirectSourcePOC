/**
* Copyright (c) 2018
* @summary This file is use under  Setup -> Protocol setup -> element Setup
            Open modal when user click on add log button after select perticular domain element.
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React,{Component} from 'react';
import { connect } from 'react-redux';
import Modal from '../modaldialog/modal';

class ElementFormModal extends Component{

    constructor(props){
        super(props);
    }

    onClose = ()=>{
        this.props.hideModal && this.props.hideModal();
    }

    onSaveForm = () =>{
        this.props.onSave &&  this.props.onSave();
    }


    render({props,state} = this){
        let { afterClose, hideModal, onSave } = props;
        const headerVal = props.header && props.header.split('-')[1];
        return (
            <Modal onClose={this.onClose} className={props.className}>
                <div className="modal-header border-bottom-p mx-4 p-0 py-3">
                    <h5 className="modal-title c-p" id="exampleModalLabel"> Add {headerVal} </h5>
                    <button type="button" className="close c-p" data-dismiss="modal" aria-label="Close" onClick={this.onClose}>
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body px-4 text-left pt-1 pb-0">
                        {props.renderFormData}
                </div>
                <div className="modal-footer pr-0 pt-0">
                    <button type="button" className="btn text-white align-bottom bg-p mr-2" onClick={this.onSaveForm}>Add</button>
                    <button type="button" className="btn text-white align-bottom bg-p mr-4" >Cancel</button>
                </div>
            </Modal>
        );
    }

}

export default connect(null, null )(ElementFormModal);