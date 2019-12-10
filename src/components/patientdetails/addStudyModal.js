/**
* Copyright (c) 2018
* @summary Add Study Modal
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React,{Component} from 'react';
import { connect } from 'react-redux';
import Modal from '../modaldialog/modal';


class AddStudyModal extends Component{

    constructor(props){
        super(props);
        this.state = {
            site: '',
            study : ''
        }

    }

    onClose = () => {
       // hideModal();
        this.props.hideModal && this.props.hideModal();
        if (this.props.afterClose) {
            this.props.afterClose();
        }
    };

    onSaveStudy = () =>{
        this.props.onSave && this.props.onSave(this.state);
    }


    onChangeDropdown = (event) =>{
        this.setState({ [event.target.name] : event.target.value });
    }


    render({props} = this){
        let { afterClose, hideModal, onSave } = props;
        return (
            <Modal onClose={this.onClose}>
                <div className="modal-header border-bottom-p mx-4 p-0 py-3">
                    <h5 className="modal-title c-p" id="exampleModalLabel">Add Study</h5>
                    <button type="button" className="close c-p" onClick={this.onClose}> <span aria-hidden="true">&times;</span> </button>
                </div>
                <div className="modal-body px-4 text-left">
                    <div className="row col-md-12 m-0 p-0">
                            <div className="col-md-12 col-sm-12 row">
                                <div className="form-group col-6">
                                        <label>Study</label>
                                        <select className="form-control" name='study' onChange={this.onChangeDropdown} value={this.state.ehrName}>
                                            <option>Select</option>
                                            <option>EL-12</option>
                                            <option>EL-123</option>
                                            <option>EL-1234</option>
                                        </select>
                                </div>
                                <div className="form-group col-6">
                                        <label>Site</label>
                                        <select className="form-control" name='site' onChange={this.onChangeDropdown} value={this.state.site}>
                                            <option>Select</option>
                                            <option>St. Hospital</option>
                                            <option>Jt. Hospital</option>
                                            <option>Thomas. Hospital</option>
                                        </select>
                                </div>
                            </div>
                    </div>
                </div>
                <div className="modal-footer border-0">
                    <button type="button" className="btn text-white align-bottom modals_buttons-bg" onClick={this.onSaveStudy}>Add</button>
                    <button type="button" className="btn text-white align-bottom modals_buttons-bg" onClick={this.onClose}>Cancel</button>
                </div>
            </Modal>
        );
    }

}

export default connect(null, null )(AddStudyModal);
