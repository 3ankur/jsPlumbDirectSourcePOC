import React from 'react';
import { connect } from 'react-redux';
import { hideModal } from '../actions/modalActions';
import Modal from '../components/modaldialog/modal';

class  NotifyModal extends React.Component {


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
     

<Modal onClose={this.onClose}>
                <div className="modal-header border-bottom-p mx-4 p-0 py-3">
                    <h5 className="modal-title c-p" id="exampleModalLabel">Are you sure?</h5>
                    <button type="button" className="close c-p" data-dismiss="modal" aria-label="Close" onClick={this.onClose}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body px-3 text-left">

            
                    <div className="col-sm-12">
                    You have entered the data on this page. If you navigate away from this page without first saving your data, the changes will be lost    
                    </div>
                </div>
                <div className="modal-footer text-left text-white ">
                    <div className="row col-12 p-0 justify-content-between">

                        <div className="col-12 pull-right" style={{ textAlign: "right" }}>

                            <button type="button" className="btn text-white align-bottom bg-p mr-2" onClick={this.onOkayClick}>Yes</button>
                        <button type="button" className="btn text-white align-bottom bg-p" onClick={this.onClose}>No</button> 
                        </div>
                    </div>

                </div>
            </Modal>
      )

  }
  
}
export default connect(null, { hideModal })(NotifyModal);
