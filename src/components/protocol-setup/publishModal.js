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
import Common from '../../common/common'
import moment from 'moment';


var yesterday = DateTime.moment().subtract(1, 'day');
var valid = function( current ){
    return current.isAfter( yesterday );
};

class EpochDetailsModal extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            publishDate: "",
            errorMsg:null,
            openPublishDate:false
        }
        this.onDateChangeHandler = this.onDateChangeHandler.bind(this);
    }

    onClose = () => {
        this.props.hideModal();
        if (this.props.afterClose) {
            this.props.afterClose();
        }
    };

    onPublish = () => {
            if(this.state.publishDate!="" && this.state.publishDate!=undefined){
                this.props.onSave && this.props.onSave(this.state);
                //this.onClose();
            }
            else{
                this.setState({errorMsg:"Select publish date."})
            }

    }


    onDateChangeHandler(dt,fromInput) {
            
        if(dt){
            this.setState({publishDate:dt}); //moment(dt).format('DD/MMM/YYYY')
            this.setState({errorMsg:""})
            this.setState({openPublishDate: ( fromInput && fromInput !== 'fromInput' ) ?  !this.state.openPublishDate : false})
        }

    }
componentDidMount() {


}


    render() {

        return (
            <Modal onClose={this.onClose}>
                <div className="modal-header border-bottom-p mx-4 p-0 py-3">
                    <h5 className="modal-title c-p" id="exampleModalLabel">Publish Date</h5>
                    <button type="button" className="close c-p" data-dismiss="modal" aria-label="Close" onClick={this.onClose}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body px-3 text-left">
                    <div className="form-group col-md-4 col-sm-12">
                        <label className="text-left">Date</label>
                        <div className="input-group">
                        <DateTime dateFormat="DD/MMM/YYYY"
                            timeFormat={false}
                            onChange={(event) => this.onDateChangeHandler(event,'fromInput')}
                            value={this.state.publishDate}
                            closeOnSelect={true}
                            open={this.state.openPublishDate}
                            isValidDate={ valid }
                            inputProps={{ readOnly: true }}
                            // onBlur={()=>{!this.state.openPublishDate }}

                        />
                        <i className="glyphicon glyphicon-calendar dateicon3 cursor-pointer"  onClick={ ()=>this.setState({openPublishDate:!this.state.openPublishDate}) }></i>

                        </div>
                        {this.state.errorMsg!=null ? <span style={ {color:"#691e44",fontSize:"10px",fontWeight:"bold",background:"#CCC"} }>{this.state.errorMsg}</span> : ''}

                    </div>
                </div>
                <div className="modal-footer text-left text-white ">
                    <div className="row col-12 p-0 justify-content-between">

                        <div className="col-12 pull-right" style={{ textAlign: "right" }}>

                            <button type="button" className="btn text-white align-bottom bg-p mr-2" onClick={this.onPublish}>Save</button>
                            <button type="button" className="btn text-white align-bottom bg-p" onClick={this.onClose}>Cancel</button>
                        </div>
                    </div>

                </div>
            </Modal>
        )

    }

}
export default connect(null, { hideModal })(EpochDetailsModal);
