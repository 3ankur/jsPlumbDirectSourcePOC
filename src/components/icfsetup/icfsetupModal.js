/**
 * Copyright (c) 2018
 * @summary Irb Modal
 * @author Ankur Vishwakarma,Poonam Banode,Mangesh Pimprikar,Irfan Bagwan
 */

import React from 'react';
import { connect } from 'react-redux';
import { hideModal } from '../../actions/modalActions';
import Modal from '../modaldialog/modal';
import DateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import Common from '../../common/common';
import ReactSuperSelect from 'react-super-select';
import '../../../node_modules/react-super-select/lib/react-super-select.css';
import ApiService from '../../api';
import { NotificationManager } from 'react-notifications';
import common from '../../common/common';

var yesterday = DateTime.moment().subtract(1,'day');;
var valid = function( current ){
    return current.isAfter( yesterday );
};

class IcfSetupModal extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            irbName : '',
            irbIdentifier : '',
            openDateCalender : false,
            fileUploadUrl : '',
            fileUploadName:'',
            irbNameList : [],
            language : '',
            version : '1.0',
            effectiveDate:'',
            reSign : false,
            investigator : false,
            subinvestigator : false,
            legal : false
        }
    }

    onClose = () => {
        this.props.hideModal();
        if (this.props.afterClose) {
            this.props.afterClose();
        }
    };

    onSaveIcf = () => {
        this.props.onSave && this.props.onSave(this.state);
    }

    componentDidMount() {
        ApiService.getIRBSetupData().then((res)=>{
            res && res.data.response.forEach((d)=>{
                d.id  = d.irbIdentifier;
                d.name = d.irbName;
            });
            this.setState({ irbNameList : res.data.response },()=>{});
        });
    }

    onChangeText = (event)=>{
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    handleIrbChange = (option) =>{
        if(option){
            this.setState({
                irbName : option.name,
                irbIdentifier : option.id
            })
        }
    }

    customOptionTemplateFunction = (item, search, searchRegex) => {
        return <span title={item.name}>{item.name}</span>
    }

    customSelectedValueTemplateFunction = (selectedItmes) =>{
        return(
            <div className='selected-dropdown-itmes'>
                { selectedItmes.map((item)=>{
                    return(
                        <span key={item.id}>
                            {item.name}
                            { selectedItmes.length > 1 ? ',' : ''}
                        </span>
                    )
                    })
                }
            </div>
        )
    }

    onChangeFileHandler = (evt)=>{
        let self = this;
        let reader = new FileReader();
        let file = evt.target.files[0];

        reader.onload = function(upload) {
            let data = upload.target.result && upload.target.result.split(',');
            self.setState({
                fileUploadUrl: data[1],
                fileUploadName : file.name
            });
        };
        reader.readAsDataURL(file);
    }

    onDateChange = (e)=>{
        this.setState({
            openDateCalender : false,
            effectiveDate : common.formatDate(e._d,'DD/MMM/YYYY')
        })
    }

    onChangeCheckboxVal = (event,type)=>{
        if(type == 'reSign'){
            this.setState({ reSign : event.target.checked ? true : false })
        }
        if(type == 'investigator'){
            this.setState({ investigator : event.target.checked ? true : false })
        }
        if(type == 'subinvestigator'){
            this.setState({ subinvestigator : event.target.checked ? true : false })
        }
        if(type == 'legal'){
            this.setState({ legal : event.target.checked ? true : false })
        }
    }

    render({state,props} = this) {
        return (
            <Modal onClose={this.onClose} className={props.className}>
                <div className="modal-header border-bottom-p mx-3 p-0 py-3">
                    <h5 className="modal-title c-p" id="exampleModalLabel">Add New ICF</h5>
                    <button type="button" className="close c-p" data-dismiss="modal" aria-label="Close" onClick={this.onClose}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body px-3 text-left">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <div className="form-group form-row">
                                <div className="col-sm-5 mt-1">IRB Name</div>
                                <div className="col-sm-7 p-0">
                                    <ReactSuperSelect
                                        placeholder="Select"
                                        clearSearchOnSelection={true}
                                        dataSource={state.irbNameList || [] }
                                        onChange={this.handleIrbChange}
                                        searchable={true}
                                        multiple={false}
                                        keepOpenOnSelection={false}
                                        closeOnSelectedOptionClick={false}
                                        deselectOnSelectedOptionClick={false}
                                        customClass='select-container'
                                        customOptionTemplateFunction={this.customOptionTemplateFunction}
                                        customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="form-group form-row">
                                <div className="col-sm-5 mt-1">Language</div>
                                <div className="col-sm-7 p-0">
                                    <select className='form-control' name='language' onChange={this.onChangeText}>
                                        <option>English</option>
                                        <option>Spanish</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="form-group form-row">
                                <div className="col-sm-5 mt-1">Document Upload</div>
                                <div className="col-sm-7 input-group ml-0 position-relative p-0">
                                    <input className='custom-file-input'  ref="file"  type='file'name="file" id='file' encType="multipart/form-data" style={{zIndex:1}}
                                        onChange={(event)=>this.onChangeFileHandler(event)}
                                        />
                                        <span className='fileInputVal'>{this.state.fileUploadName}</span>
                                    <label className="custom-file-label mb-0"></label>
                                </div>
                            </div>
                        </div>
                        {/* <div className="col-sm-6">
                            <div className="form-group form-row">
                                <div className="col-sm-5 mt-1">Version</div>
                                <div className="col-sm-7 p-0">
                                    <input type='text' className='form-control' value={state.version} disabled/>
                                </div>
                            </div>
                        </div> */}
                        <div className="col-sm-6">
                            <div className="form-group form-row">
                                <div className="col-sm-5 mt-1">Effective Date</div>
                                <div className="col-sm-7 p-0">
                                    <div className='custonDate'>
                                    <DateTime dateFormat="DD-MMM-YYYY"
                                        timeFormat={false}
                                        onChange={(event)=>this.onDateChange(event)}
                                        closeOnSelect={true}
                                        open={state.openDateCalender}
                                        className='p-0'
                                        value={this.state.effectiveDate}
                                        isValidDate={ valid }
                                    />
                                    <i className="glyphicon glyphicon-calendar dateicon3 cursor-pointer" onClick={()=>this.setState({openDateCalender : !this.state.openDateCalender})}></i>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
		            <div className="row">
                        <div className="col-sm-12 mb-2" style={{ color: "#691e44", 'fontWeight': 500}}>
                        Version Settings
                        </div>
                        <div className="col-6 d-flex flex-column">
                            <div className="custom-control custom-checkbox mr-sm-2 my-2 d-flex flex-nowrap">
                                <input type="checkbox" className="custom-control-input order-2" id="reSign" onChange={(event)=>{this.onChangeCheckboxVal(event,'reSign')}} />
                                <label className="custom-control-label order-1" htmlFor="reSign">Force Re-Sign</label>
                            </div>
                            <div className="custom-control custom-checkbox mr-sm-2 my-2 d-flex flex-nowrap">
                                <input type="checkbox" className="custom-control-input order-2" id="investigator" onChange={(event)=>{this.onChangeCheckboxVal(event,'investigator')}}/>
                                <label className="custom-control-label order-1" htmlFor="investigator">Primary Investigator</label>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="custom-control custom-checkbox mr-sm-2 my-2 d-flex flex-nowrap">
                                <input type="checkbox" className="custom-control-input order-2" id="subinvestigator" onChange={(event)=>{this.onChangeCheckboxVal(event,'subinvestigator')}}/>
                                <label className="custom-control-label order-1" htmlFor="subinvestigator">Study Manager</label>
                            </div>
                            <div className="custom-control custom-checkbox mr-sm-2 my-2 d-flex flex-nowrap">
                                <input type="checkbox" className="custom-control-input order-2" id="legal" onChange={(event)=>{this.onChangeCheckboxVal(event,'legal')}}/>
                                <label className="custom-control-label order-1" htmlFor="legal">Legal Ascent Rep.</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer text-left text-white pt-0">
                    <div className="row col-12 p-0 justify-content-between">
                        <div className="col-12 pull-right" style={{ textAlign: "right" }}>
                            <button type="button" className="btn text-white align-bottom bg-p mr-2" onClick={this.onSaveIcf}>Add</button>
                            <button type="button" className="btn text-white align-bottom bg-p" onClick={this.onClose}>Cancel</button>
                        </div>
                    </div>
                </div>
            </Modal>
        )

    }

}
export default connect(null, { hideModal })(IcfSetupModal);
