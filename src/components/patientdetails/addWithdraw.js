/**
* Copyright (c) 2018
* @summary Add Study Modal
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from '../modaldialog/modal';
import ReactSuperSelect from 'react-super-select';
import '../../../node_modules/react-super-select/lib/react-super-select.css';
import {NotificationManager} from 'react-notifications';
import common from '../../common/common'


class AddWithDrawModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            comment:'',
            withDrawReasonArr:[],
            withDrawReason:''
        }

    }

    onClose = () => {
        // hideModal();
        this.props.hideModal && this.props.hideModal();
        if (this.props.afterClose) {
            this.props.afterClose();
        }
    };

    saveComment = ()=>{
        if(this.state.withDrawReason && this.state.comment){
            this.props.onSave && this.props.onSave(this.state);
        }else{
            common.clearNotification();
            NotificationManager.error('Please fill the required fields');
        }
    }



    onChangeDropdown = (dt) => {
        dt && this.setState({ withDrawReason : dt.name });
    }

    onComment = (e)=>{
        this.setState({comment:e.target.value})

    }
componentDidMount(){
    this.setState({withDrawReasonArr:withDrawReasons})
}

customSelectedValueTemplateFunction = (selectedItmes) =>{
    return(
        <div className='selected-dropdown-itmes'>
            {
                selectedItmes.map((item)=>{
                    return(
                        <span key={item.id ? item.id : common.getRandomNumber()}>
                            {item.name}
                            { selectedItmes.length > 1 ? ',' : ''}
                        </span>
                    )
                })
            }
        </div>
    )
}
customOptionTemplateFunction = (item, search, searchRegex) => {
    return <span title={item.name}>{item.name}</span>
}


    render({ props } = this) {
        let { afterClose, hideModal, onSave } = props;
        return (
            <Modal onClose={this.onClose} className={'helloterer'}>
                <div className="modal-header border-bottom-p mx-4 p-0 py-3">
                    <h5 className="modal-title c-p" id="exampleModalLabel">Withdraw</h5>
                    <button type="button" className="close c-p" onClick={this.onClose}> <span aria-hidden="true">&times;</span> </button>
                </div>
                <div className="modal-body px-4 text-left">
                    {/* <div className="row">
                        <div className="col-md-2"> Are you sure? </div>
                        <div className="col-md-10"> <span className="float-left px-2 text-muted">Yes</span>
                            <label className="switch arrow float-left">
                                <input type="checkbox" />
                                    <span className="slider"></span> </label>
                                <span className="float-left px-2 text-muted">No</span> </div>
                        </div> */}
                        <div className="row col-12 m-0 p-0">
                            <div className="col-md-4 p-0 mt-2">
                                <label htmlFor="desc">Comments</label>
                            </div>
                            <div className="form-group form-row col-8 p-0 mb-1 custred">
                                <div className="col-4 pt-2 text-right">Reason</div>
                                <div className="col-8 p-0 float-right">
                                    {/* <select className="form-control">
                                        <option>Other</option>
                                    </select> */}
                                    <ReactSuperSelect
                                    placeholder="Select"
                                    clearSearchOnSelection={true}
                                    dataSource={this.state.withDrawReasonArr ? this.state.withDrawReasonArr : [] }
                                    onChange={(option)=>this.onChangeDropdown(option)}
                                    searchable={true}
                                    keepOpenOnSelection={false}
                                    closeOnSelectedOptionClick={true}
                                    customOptionTemplateFunction={this.customOptionTemplateFunction}
                                    deselectOnSelectedOptionClick={false}
                                    customClass='select-container'
                                    customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                    clearable = {false}
                                />
                                </div>
                            </div>
                            <textarea value={this.state.comment} onChange={this.onComment.bind(this)} className="form-control reqfeild" id="desc" rows="3"></textarea>
                        </div>
                        <div className="row">
                            <div className="col-10"></div>
                            <div className="col-2 mt-1">
                                <button type="button" className="btn text-white align-bottom bg-p float-right" onClick={this.saveComment} data-dismiss="modal">Done</button>
                            </div>
                        </div>
                    </div>

            </Modal>
                );
    }

}

export default connect(null, null )(AddWithDrawModal);
const withDrawReasons =  [{"name":"Withdrawal by parent/guardian","id":"1"},{"id":"2","name":"Failure to meet randomization criteria"},{"id":"3","name":"Site terminated by sponsor"},{"id":"4","name":"Failure to meet continuation criteria"},{"id":"5","name":"Randomized by mistake"},{"id":"6","name":"Randomized by mistake with study treatment"},{"id":"7","name":"Randomized by mistake without study treatment"},{"id":"8","name":"Non-compliance with non-study device"},{"id":"9","name":"Non-compliance with study device"},{"id":"10","name":"Protocol violation"},{"id":"11","name":"Protocol-specified withdrawal criterion met"},{"id":"12","name":"Other"},{"id":"13","name":"Completed"},{"id":"14","name":"Pregnancy"},{"id":"15","name":"Recovery"},{"id":"16","name":"Death"},{"id":"17","name":"Progressive disease"},{"id":"18","name":"Disease relapse"},{"id":"19","name":"Adverse event"},{"id":"20","name":"Disease relapse"},{"id":"21","name":"Lack of efficacy"},{"id":"22","name":"Lost to follow-up"},{"id":"23","name":"Physician decision"},{"id":"24","name":"Screen failure"},{"id":"25","name":"Non-compliance with study drug"},{"id":"26","name":"Study terminated by sponsor"},{"id":"27","name":"Technical problems"},{"id":"28","name":"Withdrawal by subject"},{"id":"29","name":"Protocol deviation"}];
