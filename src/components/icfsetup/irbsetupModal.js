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






class IrbSetupModal extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            irbName : '',
            studySiteDetailsList : [],
            siteList :[],
            studyIdentifier : '',
            siteIdentifier : '',
            studyName:'',
            siteIdentifiers:[],
            setStudyName : '',
            setSiteNames :[]
        }
    }

    onClose = () => {
        this.props.hideModal();
        if (this.props.afterClose) {
            this.props.afterClose();
        }
    };

    onSaveIrb = () => {
        if(this.state.irbName && this.state.studyName && this.state.siteIdentifiers){
            this.props.onSave && this.props.onSave(this.state);
        }else{
            Common.clearNotification();
            NotificationManager.error('Please Fill Required Fileds');
        }

    }

    componentDidMount() {
        ApiService.get_all_studies().then((res)=>{
            res && res.data.response.forEach( (d)=>{
                d.id  = d.uniqueIdentifier;
                d.name = d.studyName;
            });
            if(this.props.irbEditData){
                let temp = [];
                let siteIdentifierList = [];
                for( let item in this.props.irbEditData._original.siteIdentifierList){
                    let obj = {};
                    obj['id'] = item;
                    obj['name'] = this.props.irbEditData._original.siteIdentifierList[item];
                    siteIdentifierList.push(item);
                    temp.push(obj);
                }
                this.setState({
                    setStudyName : { id: this.props.irbEditData._original.studyIdentifier ,  name : this.props.irbEditData._original.studyName },
                    setSiteNames :temp,
                    irbName:this.props.irbEditData._original.irbName,
                    siteIdentifiers : siteIdentifierList
                });
            }
            this.setState({studySiteDetailsList:res.data.response});
        });

    }

    onChangeText = (event)=>{
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    handleStudyChange=(option)=>{
        if(option){
            this.setState({
                studyIdentifier : option.id,
                studyName : option.name
            });
            ApiService.GetPopulatedStudyDetails(option.id).then((res) => {
                res && res.data.response.listOfSites.forEach( (d)=>{
                    d.id  = d.unique_identifier;
                    d.name = d.site_name;
                });
                this.setState({ siteList : res.data.response.listOfSites || [] });
              },(error) => {
                  NotificationManager.error('something went wrong');
              });
        }
    }

    handleSiteChange = (options)=>{
        if(options){
            let siteNames = [];
            options.forEach((item)=>{
                siteNames.push(item.unique_identifier)
            })
            this.setState({
                siteIdentifiers : siteNames
            });
        }
    }

    customOptionTemplateFunction = (item, search, searchRegex) => {
        return <span title={item.name}>{item.name}</span>
    }

    customSelectedValueTemplateFunction = (selectedItmes) =>{
        return(
            <div className='selected-dropdown-itmes'>
                { selectedItmes.map((item,index)=>{
                    return(
                        <span key={index}>
                            {item.name}
                            { selectedItmes.length > 1 ? ',' : ''}
                        </span>
                    )
                    })
                }
            </div>
        )
    }

    render({state,props} = this) {
        return (
            <Modal onClose={this.onClose}>
                <div className="modal-header border-bottom-p mx-3 p-0 py-3">
                    { !props.irbEditData && <h5 className="modal-title c-p" id="exampleModalLabel">Add New IRB</h5> }
                    { props.irbEditData && <h5 className="modal-title c-p" id="exampleModalLabel">Edit IRB</h5> }
                    <button type="button" className="close c-p" data-dismiss="modal" aria-label="Close" onClick={this.onClose}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body px-3 text-left">
                    <div className="row col-12 p-0">
                        <div className="col-sm-12">
                            <div className="form-group form-row">
                                <div className="col-sm-2">Name</div>
                                <div className="col-auto col-sm-6">
                                    <input type="text" className="form-control reqfeild" name='irbName' value={state.irbName} onChange={this.onChangeText} />
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12">
                            <div className="form-group form-row">
                                <div className="col-sm-2">Study</div>
                                <div className="col-auto col-sm-6 custred">
                                    <ReactSuperSelect
                                        placeholder="Select"
                                        clearSearchOnSelection={true}
                                        dataSource={state.studySiteDetailsList || [] }
                                        onChange={this.handleStudyChange}
                                        searchable={true}
                                        multiple={false}
                                        keepOpenOnSelection={false}
                                        closeOnSelectedOptionClick={false}
                                        deselectOnSelectedOptionClick={false}
                                        customClass='select-container'
                                        customOptionTemplateFunction={this.customOptionTemplateFunction}
                                        customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                        initialValue={this.state.setStudyName ? this.state.setStudyName : null}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12">
                            <div className="form-group form-row mb-0 custred">
                                <div className="col-sm-2">Site</div>
                                <div className="col-auto col-sm-6">
                                    <ReactSuperSelect
                                        placeholder="Select"
                                        clearSearchOnSelection={true}
                                        dataSource={state.siteList || [] }
                                        onChange={this.handleSiteChange}
                                        searchable={true}
                                        multiple={true}
                                        keepOpenOnSelection={true}
                                        closeOnSelectedOptionClick={false}
                                        deselectOnSelectedOptionClick={true}
                                        customClass='select-container'
                                        customOptionTemplateFunction={this.customOptionTemplateFunction}
                                        customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                        initialValue={this.state.setSiteNames ? this.state.setSiteNames : null}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer text-left text-white pt-0">
                    <div className="row col-12 p-0 justify-content-between">
                        <div className="col-12 pull-right" style={{ textAlign: "right" }}>
                            <button type="button" className="btn text-white align-bottom bg-p mr-2" onClick={this.onSaveIrb}>
                                {props.irbEditData ? 'Save' : 'Add'}
                            </button>
                            <button type="button" className="btn text-white align-bottom bg-p" onClick={this.onClose}>Cancel</button>
                        </div>
                    </div>
                </div>
            </Modal>
        )

    }

}
export default connect(null, { hideModal })(IrbSetupModal);
