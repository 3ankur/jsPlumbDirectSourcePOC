/**
* Copyright (c) 2018
* @summary TThis file is use under  Setup -> Protocol setup -> element Setup
           Open modal when user click on sub element button after select perticular domain element.
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from '../../modaldialog/modal';
import ApiService from '../../../api';
import { NotificationManager } from 'react-notifications';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import common from '../../../common/common';
import ReactSuperSelect from 'react-super-select';
import '../../../../node_modules/react-super-select/lib/react-super-select.css';
import _ from 'lodash';

class EditFormAnswerFields extends Component {
    constructor(props) {
        super(props);
        this.state = {
            OrignalFieldName : '',
            updatedQuestionFieldName : '',
            isRepetedFields : false,
            controlledTermList:[],
            controlledTermListOptions:[],
            finalOptions:[],
            custOptName:"",
            controlledTermListOptionsDefault:[]
        }
        this.currentDragIndex = null;
        this.defaultSTSlec = '';
    }

    componentDidMount() {
        this.setState({
            OrignalFieldName : this.props.itemDefinationData && this.props.itemDefinationData.name,
            updatedQuestionFieldName : this.props.itemDefinationData && this.props.itemDefinationData.updatedQuestion ? this.props.itemDefinationData.updatedQuestion : ''
        });
        ApiService.getContollTermList().then((res) => {
            let updatedcontrolledTermList =[];
            if(res && res.data && res.data.response && res.data.response.length > 0){
                res.data.response.forEach((item,index)=>{
                    let obj = {};
                    obj.id = item.uniqueIdentifier;
                    obj.name = item.ctName;
                    obj.ctMenu = item.ctMenu;
                    updatedcontrolledTermList.push(obj);
                    
                 });
                this.setState({
                    controlledTermList : updatedcontrolledTermList
                },()=>{});
            }
        }, (error) => {
            common.clearNotification();
            NotificationManager.error('something went wrong');
        });
    }

    addItem = (data)=>{
        let getSortedBySequenceFields = common.getSortedBySequenceFields(this.props.fullData && this.props.fullData.labelList);
        let repetedFileds = getSortedBySequenceFields.filter((item)=> {
            if(item.name && this.state.updatedQuestionFieldName){
                return item.name.toLowerCase().trim() == this.state.updatedQuestionFieldName.toLowerCase().trim()
            }
         })
        if(repetedFileds.length > 0){
            common.clearNotification();
            NotificationManager.error('You Entered Same Field Name');
        }else{
            this.props.onSave &&  this.props.onSave(this.state);
        }
    }

    onClose = ()=>{
        this.props.hideModal && this.props.hideModal();
    }

    onChangeName = (e)=>{
        this.setState({
            updatedQuestionFieldName : e.target.value
        })
    }

    onOptionsDragStart=(e,index)=>{
    this.currentDragIndex = index;
}
    onOptionsDragOver=(e,index)=>{
    e.preventDefault();
}
    onOptionsDrop=(e,index)=>{
        let refEle = this.state.finalOptions[this.currentDragIndex];  
        let prevOptState = this.state.finalOptions;
        prevOptState.splice(this.currentDragIndex,1);
        prevOptState.splice(index,0,refEle);
        this.setState({finalOptions:prevOptState});
        this.refs.finalOptContainer.children[index].classList.remove('over');
        e.preventDefault();
    }
    onOptionsDragEnter=(e,index)=>{
        this.refs.finalOptContainer.children[index].classList.add('over');
    }
    onOptionsDragLeave=(e,index)=>{
        this.refs.finalOptContainer.children[index].classList.remove('over');
    }

    removeFinalOptions=(e,index)=>{
        let prevOptState = this.state.finalOptions;
        let prevCtrlListDefault = this.state.controlledTermListOptionsDefault ;

        let dfIdx = _.findIndex(prevCtrlListDefault,(o)=>{return  o.uniqueIdentifier === prevOptState[index]["uniqueIdentifier"] }) ;
        if(dfIdx>-1){
            prevCtrlListDefault.splice(dfIdx,1);
        }
        prevOptState.splice(index,1);
        this.setState({finalOptions:prevOptState,controlledTermListOptionsDefault: JSON.parse(JSON.stringify(prevCtrlListDefault))  },()=>{
        });
    }

    //adding new customoption
    addCustomOption = (e)=>{
        if(this.state.custOptName && this.state.custOptName.trim()){
            const prevSt = this.state.finalOptions;
            let opt = {"index":prevSt.length+1,"value":this.state.custOptName,"type":"custom" }
            prevSt.push(opt);
            this.setState({finalOptions:prevSt,custOptName:""})
        }else{
            common.clearNotification();
            NotificationManager.error('Please enter the option');
        }
        
    }
    onChangeTermList=(option)=>{
        if(option){
            this.state.controlledTermList.forEach((item,index)=>{
                if(item.name == option.name){
                    item.ctMenu.forEach((itx)=>{
                        itx['id'] = itx.uniqueIdentifier;
                        itx['name'] = itx.ctValue;
                        itx['group'] = "ctl";
                    });
                    
                    this.setState({
                        controlledTermListOptions : item.ctMenu,
                        controlledTermListOptionsDefault: JSON.parse(JSON.stringify(item.ctMenu))   
                    },()=>{
                    });
                }
             });
        }
    }

    controlledTermListOptionsChange = (option) => {
        let selctedOpts = [];
        const prevSt = this.state.finalOptions;
        let prevDefSel = this.state.controlledTermListOptionsDefault;
        if (option) {
            option.forEach((opt) => {
                let finalopt = {
                    "index": prevSt.length + 1,
                    "value": opt.ctValue,
                    'uniqueIdentifier': opt.uniqueIdentifier
                }
                selctedOpts.push(finalopt);

                let pix = _.findIndex(prevDefSel, (r) => {
                    return r.uniqueIdentifier === opt.uniqueIdentifier
                });
                if (pix == -1) {
                    prevDefSel.push(opt);
                }
            })

            let foundCustom = prevSt.filter((k) => {
                return k.type === "custom"
            })
            selctedOpts = selctedOpts.concat(foundCustom);
            this.setState({
                finalOptions: selctedOpts,
                custOptName: "",
                controlledTermListOptionsDefault: JSON.parse(JSON.stringify(prevDefSel))
            });
        } else {
            let foundCustom = prevSt.filter((k) => {
                return k.type === "custom"
            })
            this.setState({
                finalOptions: foundCustom,
                custOptName: "",
                controlledTermListOptionsDefault: []
            });
        }

    }
    
    customOptionTemplateFunction = (item, search, searchRegex) => {
        return <span title={item.name}>{item.name}</span>
    }
    getCommaOnAfterItem=(length,itemIndex)=>{
        if(length > 1){
            if((length - 1) === itemIndex){
                return ''
            }else{
                return ','
            }
        }
        return ''
    }
    
    customSelectedValueTemplateFunction = (selectedItmes) =>{
        return(
            <div className='selected-dropdown-itmes'>
                {
                    selectedItmes.map((item,index)=>{
                        return(
                            <span key={item.id ? item.id : common.getRandomNumber()}>
                                {item.name}
                                {this.getCommaOnAfterItem(selectedItmes.length,index)}
                            </span>
                        )
                    })
                }
            </div>
        )
    }


      groceryCartItemTemplate = (item)=> {
            return(
              <div >
                <button className="btn btn-sm btn-primary " onClick={(e)=>{this.doSelectAll(e)} }>Select All</button>
                <button className="btn btn-sm btn-primary float-right" onClick={(e)=>{this.unSelectAll(e)} }>UnSelect All</button>
              </div>);
          };

          doSelectAll = () => {
              let prevSt = this.state.finalOptions;
              let prevDefSel = JSON.parse(JSON.stringify(this.state.controlledTermListOptions));
              let prevControlState = this.state.controlledTermListOptions;
              this.setState({
                  controlledTermListOptionsDefault: JSON.parse(JSON.stringify(prevDefSel))
              })
          }

          unSelectAll = () => {
              this.setState({
                  controlledTermListOptionsDefault: JSON.parse(JSON.stringify([]))
              })
          }
    
    
    render({ props, state } = this) {
        let { afterClose, hideModal, onSave } = props;
               return (
            <Modal onClose={this.onClose} className={props.className}>
                <div className="modal-header border-bottom-p mx-4 p-0 py-2">
                    <h5 className="modal-title c-p" id="exampleModalLabel">Edit Controlled Term List </h5>
                    <button type="button" className="close c-p" data-dismiss="modal" aria-label="Close" onClick={this.onClose}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body px-4 text-left pt-1">
                    <div className="col-12 form-row p-0 m-0 mt-2">
                        <div className="form-group col-md-4 col-half-offset">
                            <label htmlFor="study" className="fw500">Controlled Term List</label>
                        </div>
                        <div className="form-group col-md-6 col-half-offset">
                        <ReactSuperSelect
                                        placeholder="Select"
                                        clearSearchOnSelection={true}
                                        dataSource={this.state.controlledTermList || []}
                                        onChange={(option)=>this.onChangeTermList(option)}
                                        clearable = {false}
                                        deselectOnSelectedOptionClick={true}
                                        searchable={true}
                                        multiple={false}
                                        closeOnSelectedOptionClick={false}
                                        customClass='select-container'
                                        initialValue={this.props.itemDefinationData.ctListname ? { 'id':9999,
                                            'name':this.props.itemDefinationData.ctListname
                                        }: null }
                                    />
                        </div>
                        {/* <div className="form-group col-md-3 col-half-offset mr-0 pr-0">
                        <button type="button" className="btn btn-sm text-white align-bottom bg-p mr-0 float-right mb-2" title="Import Controlled Term List" onClick={()=>this.addItem()}>Import</button>
                        </div> */}
                  </div>
                    <hr className="hrdivider m-0"></hr>
                    <div className="col-12 form-row p-0 m-0 mt-2">
                        <div className="form-group col-md-4 col-half-offset">
                            <label htmlFor="study" className="fw500">Controlled Term Options List</label>
                        </div>
                        <div className="form-group col-md-6 col-half-offset">
                        
                        <ReactSuperSelect 
                                       // customGroupHeadingTemplateFunction ={this.groceryCartItemTemplate} 
                                        placeholder="Select"
                                        clearSearchOnSelection={true}
                                        dataSource={this.state.controlledTermListOptions || []}
                                        onChange={(option)=>this.controlledTermListOptionsChange(option)}
                                        clearable = {false}
                                        deselectOnSelectedOptionClick={true}
                                        searchable={true}
                                        multiple={true}
                                        keepOpenOnSelection={true}
                                        closeOnSelectedOptionClick={false}
                                        customOptionTemplateFunction={this.customOptionTemplateFunction}
                                        customClass='select-container'
                                        customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                       // groupBy="ctl"
                                        initialValue={ this.state.controlledTermListOptionsDefault ? JSON.parse(JSON.stringify(  this.state.controlledTermListOptionsDefault )) || [] : null }
                                   
                                    />
                        </div>
                    </div>
                    <div className="col-12 form-row p-0 m-0 mt-2 mb-2">
                        <div className="form-group col-md-4 col-half-offset">
                            <label htmlFor="study" className="fw500"> Custom Options List</label>
                        </div>
                        <div className="form-group col-md-6 col-half-offset">
                            <input type='text' onChange={(e)=>{this.setState({custOptName:e.target.value})}} value={this.state.custOptName} className='form-control'/>
                        </div>
                        <div className="col-md-1 p-0">
                            <span onClick={(e)=>{this.addCustomOption(e)}}> <i className="material-icons editicn custAdd pt-1" title="Add custom option to Final Options List">control_point</i></span>
                        </div>
                    </div>
                    <hr className="hrdivider m-0"></hr>
                    <div className="col-12 form-row p-0 m-0 mt-2">
                        <div className="form-group col-md-4 col-half-offset">
                            <label htmlFor="study" className="fw500">Final Options List</label>
                        </div>
                        <div className="form-group col-md-6 col-half-offset">
                            <div className="border p-2" ref="finalOptContainer" id="finalOptContainer" title="Drag & Drop to reorder">
                            { this.state.finalOptions && this.state.finalOptions.map((item,index)=>{
                                return <div className="border mb-1 p-1 dragOptions" draggable="true" title={item.value}
                                onDragStart={(e) => this.onOptionsDragStart(e, index)}
                                onDragOver={(e) => this.onOptionsDragOver(e, index)}
                                onDrop={(e) => { this.onOptionsDrop(e, index) }}
                                onDragEnter={(e) => { this.onOptionsDragEnter(e, index) }}
                                onDragLeave={(e) => { this.onOptionsDragLeave(e, index) }}
                                key={index}>{item.value}<i className="material-icons drag-clear" title="Remove options" onClick={(e)=>this.removeFinalOptions(e,index)}>clear</i></div>
                            })}
                            {this.state.finalOptions.length<1 && <div className="emptyOptions">Please add options</div>}
                            </div>
                        </div>
                    </div>
                    <hr className="hrdivider m-0"></hr>
                </div>
                <div className="modal-footer pr-0 pt-0">
                    <button type="button" className="btn btn-sm text-white align-bottom bg-p mr-2" onClick={()=>this.addItem()}>Save</button>
                    <button type="button" className="btn btn-sm text-white align-bottom bg-p mr-4" onClick={this.onClose}>Cancel</button>
                </div>
            </Modal>
        );
    }

}

export default connect(null, null)(EditFormAnswerFields);