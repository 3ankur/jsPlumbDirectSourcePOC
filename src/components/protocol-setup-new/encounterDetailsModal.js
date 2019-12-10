/**
 * Copyright (c) 2018
 * @summary encounter details modal popup
 * @author Ankur Vishwakarma,Poonam Banode,Mangesh Pimprikar,Irfan Bagwan
 */

import React from 'react';
import { connect } from 'react-redux';
import { hideModal } from '../../actions/modalActions';
import Modal from '../modaldialog/modal';

class  EncounterDetailsModal extends React.Component {


    constructor(props){
        super(props);

        this.state = {
            encounterName:"",
            fromVisit:"",
            
        }

    this.textHandleChange = this.textHandleChange.bind(this);
    }

   onClose = () => {
    this.props.hideModal();
    if (this.props.afterClose) {
      this.props.afterClose();
    }
  };

  onSaveEncouter = () =>{
    this.props.onSave && this.props.onSave(this.state);
    this.onClose();
  }

//   const onEpochNameChange = (e)=>{
//     epocData(e);
//   }

textHandleChange (evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  selectHanderChanges(evt){
    this.setState({ [evt.target.name]: evt.target.value });
  }


componentDidMount(){
    if(this.props.selectedEpochData && this.props.selectedEpochData.length){
        let  prevSt = this.state;
        Object.assign(prevSt,this.props.selectedEpochData[0]);
        this.setState(prevSt)
    }
}


  render(){

    return (
        <Modal onClose={this.onClose}>
            <div className="modal-header border-bottom-p mx-4 p-0 py-3">
                <h5 className="modal-title c-p" id="exampleModalLabel">Encounter Details</h5>
                <button type="button" className="close c-p" data-dismiss="modal" aria-label="Close" onClick={this.onClose}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body px-3 text-left">
                    
                            <form class=" form-row">
                                <div class="form-group col-md-4 col-sm-12">
                                    <label  class="col-sm-12 col-form-label text-left">Encounter Name</label>
                                    <div class="col-sm-12">
                                       <input type="text " class="form-control" />
                                    </div>
                                </div>
                            
                            
                            </form>
    
                            <div class="col-12 row m-0">
                                <label class="">From Visit</label>
                                <div class="col-12 m-0 row">
                                    <div class="col-md-5 col-sm-12 p-0 d-flex flex-row pb-3">
                                        <span class="add-btn float-left mt-1">Min</span>
                                        <input type="text" class="float-left form-control col-lg-5 mr-3" />
                                        <select class=" form-control float-left col-lg-4">
                                            <option>Days</option>
                                            <option>Month</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 col-sm-12 d-flex flex-row p-0 pb-3">
                                            <span class="add-btn float-left mt-1"><i class="material-icons">add</i></span>
                                            <input type="text" class="float-left form-control col-lg-5 mr-3" /> 
                                            <select class=" form-control float-left col-lg-4">
                                                <option>Days</option>
                                                <option>Month</option>
                                            </select>
                                        </div>
                                </div>
                            </div>
                        </div>
            <div className="modal-footer text-left text-white ">
                <div className="row col-12 p-0 justify-content-between">
                    
                    <div className="col-12 pull-right text-right">
                     
                        <button type="button" className="btn text-white align-bottom bg-p" onClick={this.onSaveEpoch}>Save</button>
                        <button type="button" className="btn text-white align-bottom bg-p" onClick={this.onClose}>Cancel</button>                                                
                    </div>
                </div>
                
            </div>
        </Modal>
      )

  }
  
}
export default connect(null, { hideModal })(EpochDetailsModal);
