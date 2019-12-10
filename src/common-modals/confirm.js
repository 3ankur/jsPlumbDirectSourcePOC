import React from 'react';
import { connect } from 'react-redux';
import { hideModal } from '../actions/modalActions';
import Modal from '../components/modaldialog/modal';

class  ConfirmModal extends React.Component {


    constructor(props){
        super(props);

    }

   onClose = () => {
    this.props.hideModal();
    if (this.props.afterClose) {
      this.props.afterClose();
    }
  };

  onOkayClick = () =>{
   this.props.onOkay && this.props.onOkay();
    this.onClose();
  }



componentDidMount(){



}


  render(){

    return (
        <Modal onClose={this.onClose} className={this.props.className ? this.props.className : ''}>
            <div className="modal-header mx-3 p-0 py-3">
                <h5 className="modal-title c-p" id="confirmModal"><i className="material-icons alerticn">warning</i><div className="alerttxt">Confirmation </div></h5>
                <button type="button" className="close c-p" data-dismiss="modal" aria-label="Close" onClick={this.onClose}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body text-left">
                { this.props.displayText ? this.props.displayText : ' Are you sure you want to delete this record?'  }
            </div>
            <div className="modal-footer text-left text-white">
                <div className="row col-12 justify-content-between">
                    <div className="col-12 p-0 text-right">
                        <button type="button" className="btn text-white align-bottom bg-p mr-2" onClick={this.onOkayClick}>Yes</button>
                        <button type="button" className="btn text-white align-bottom bg-p" onClick={this.onClose}>No</button>
                    </div>
                </div>
            </div>
        </Modal>
      )

  }

}
export default connect(null, { hideModal })(ConfirmModal);
