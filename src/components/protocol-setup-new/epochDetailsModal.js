/**
 * Copyright (c) 2018
 * @summary Modal popup for epoch details
 * @author Ankur Vishwakarma,Poonam Banode,Mangesh Pimprikar,Irfan Bagwan
 */

import React from 'react';
import { connect } from 'react-redux';
import { hideModal } from '../../actions/modalActions';
import Modal from '../modaldialog/modal';

class  EpochDetailsModal extends React.Component {


    constructor(props){
        super(props);

        this.state = {
            name:"",
            description:"",
            during_status:"",
            ending_status:"",
            drop_from:""
        }

    this.textHandleChange = this.textHandleChange.bind(this);
    this.selectHanderChanges = this.selectHanderChanges.bind(this);
    }

   onClose = () => {
    this.props.hideModal();
    if (this.props.afterClose) {
      this.props.afterClose();
    }
  };

  onSaveEpoch = () =>{
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
                <h5 className="modal-title c-p" id="exampleModalLabel">Epoch Details</h5>
                <button type="button" className="close c-p" data-dismiss="modal" aria-label="Close" onClick={this.onClose}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body px-3 text-left">
                    
                            <form className=" form-row">
                                <div className="form-group col-md-4 col-sm-12">
                                    <label  className="col-sm-12 col-form-label text-left">Epoch Name</label>
                                    <div className="col-sm-12">
                                       <input type="text" name="name" value={this.state.name}  onChange={this.textHandleChange} className="form-control" />
                                    </div>
                                </div>
                                {/* <div className="form-group col-md-8 col-sm-12">
                                    <label  className="col-sm-12 col-form-label text-left">Description</label>
                                    <div className="col-sm-12">
                                       <input type="text" name="description"  value={this.state.description} onChange={this.textHandleChange} className="form-control" />
                                    </div>
                                </div> */}
                            
                            </form>
                            
                            <form className=" form-row">
                                {/* <div className="form-group col-md-4 col-sm-12">
                                    <label  className="col-sm-12 col-form-label text-left">During Status</label>
                                    <div className="col-sm-12">
                                        <select className="form-control" value={this.state.during_status}   name="during_status" onChange={this.selectHanderChanges}>
                                            <option>Pre Screen</option>
    <option>Screened</option>
    <option>Randomized</option>
    <option>Completed</option>
                                        </select>
                                    </div>
                                </div> */}
                                <div className="form-group col-md-4 col-sm-12">
                                    <label  className="col-sm-12 col-form-label text-left">Ending Status</label>
                                    <div className="col-sm-12">
                                        <select value={this.state.ending_status}  className="form-control" name="ending_status" onChange={this.selectHanderChanges}>
                                           <option>Pre Screen</option>
    <option>Screened</option>
    <option>Randomized</option>
    <option>Completed</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group col-md-4 col-sm-12">
                                    <label  className="col-sm-12 col-form-label text-left">Drop Status</label>
                                    <div className="col-sm-12">
                                        <select value={this.state.drop_from}  className="form-control" name="drop_from" onChange={this.selectHanderChanges}>
                                            <option>Screen Fail</option>
    <option>Drop</option>
                                        </select>
                                    </div>
                                </div>
                            
                            </form>
    {
        /*
        <div className="col-12 row m-0 " > 
                                <label className="">Encounter  Details</label>
                                <div className="col-12 p-0">
                                    <table className="table activity-table border  table-bordered ">
                                        <thead>
                                            <tr><th>Name</th>
                                            <th>Description</th>
                                        </tr></thead>
                                        <tbody>
                                            <tr>
                                                <td>E0</td>
                                                <td>--</td>
                                            </tr>
                                            <tr>
                                                <td>E1</td>
                                                <td>--</td>
                                            </tr>
                                            <tr>
                                                <td>E2</td>
                                                <td>--</td>
                                            </tr>
                                            <tr>
                                                <td>E3</td>
                                                <td>--</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
        */
    }
                            
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
