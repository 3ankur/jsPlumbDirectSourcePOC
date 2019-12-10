/**
* Copyright (c) 2018
* @summary Add GreenPhire Modal
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React,{Component} from 'react';
import { connect } from 'react-redux';
import Modal from '../modaldialog/modal';


class AddGreenPhire extends Component{

    constructor(props){
        super(props);
        this.state = {
            oldGreenPhireVal : '',
            newGreenPhireVal : '',
            disableCard : false
        }

    }

    onClose = () => {
       // hideModal();
        this.props.hideModal && this.props.hideModal();
        if (this.props.afterClose) {
            this.props.afterClose();
        }
    };

    onSaveGreenPhire = () =>{
        this.props.onSave && this.props.onSave(this.state);
    }

    onChangeCardNumber = (evt)=>{
        this.setState({ [evt.target.name]: evt.target.value });
    }

    onChangeDisableCard = (evt) => {
        this.setState({ [evt.target.name]: evt.target.checked });
    }

    componentDidMount(){
        this.setState({ oldGreenPhireVal : this.props.oldGreenPhireVal });
    }


    render({props} = this){
        let { afterClose, hideModal, onSave, oldGreenPhireVal } = props;
        return (
            <Modal onClose={this.onClose}>
                <div className="modal-header border-bottom-p mx-4 p-0 py-3">
                    <h5 className="modal-title c-p" id="exampleModalLabel">Greenphire Details</h5>
                    <button type="button" className="close c-p" aria-label="Close" onClick={this.onClose}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body px-4 text-left">
                    <div className="row col-md-12 m-0 p-0">
                        <div className="col-md-4 col-sm-6">
                            <div className="form-group">
                                <label>Old Card Number</label>
                                <input type="text" placeholder="xxx-xxx-xxx-xxx" name='oldGreenPhireVal'  className="form-control" value={this.state.oldGreenPhireVal} onChange={this.onChangeCardNumber} />
                                <div className="custom-control custom-checkbox mt-2">
                                    <input type="checkbox" name='disableCard' className="custom-control-input" id="customCheck2" onChange={this.onChangeDisableCard} />
                                    <label className="custom-control-label" htmlFor="customCheck2">Disable card</label>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>New Card Number</label>
                                <input type="text" name='newGreenPhireVal' value={this.state.newGreenPhireVal} placeholder="xxx-xxx-xxx-xxx" className="form-control" onChange={this.onChangeCardNumber}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer text-left text-white footer-bg-light">
                    <div className="row col-12 p-0 justify-content-between">
                        <div className="">
                            <br/>
                            <button type="button" className="btn text-white align-bottom bg-p" onClick={this.onSaveGreenPhire}>Update</button>
                            <button type="button" className="btn text-white align-bottom bg-p ml-2" onClick={this.onClose}>Cancel</button>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }

}

export default connect(null, null )(AddGreenPhire);
