/**
* Copyright (c) 2018
* @summary This file is use under Study Setup -> Protocol Setup -> Element Setup
            File includes element setup information
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import GenerateHtml from '../../generateHtml/generatehtml';
import * as getFormAction from '../../../actions/getDynamicDomainFormAction';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ApiService from '../../../api';
import _ from 'lodash';
import DateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import ReactSuperSelect from 'react-super-select';
import '../../../../node_modules/react-super-select/lib/react-super-select.css';
import common from '../../../common/common';
import TableView from '../../generate-table/table';
import * as modalAction from '../../../actions/modalActions';
import { MODAL_TYPE_SUBELEMENT, MODAL_TYPE_ELEMENT_LIST, MODAL_TYPE_ELEMENT_PREVIEW,  MODAL_TYPE_EDIT_FORM_FEILDS, MODAL_TYPE_EDIT_FORM_ANSWER_FIELDS } from '../../../constants/modalTypes';
import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion';

// Demo styles, see 'Styles' section below for some notes on use.
import 'react-accessible-accordion/dist/fancy-example.css';
import 'react-accessible-accordion/dist/minimal-example.css';
//import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
//import type {DroppableProvided, DraggableProvided ,  DropResult} from 'react-beautiful-dnd';

const iconList = [];

const customClassObject = {
    'textbox': {
        containerClass: 'p-0',
        elementClass: 'form-control select-width'
    },
    'dropdown': {
        containerClass: 'p-0',
        elementClass: 'form-control select-width'
    },
    'date': {
        containerClass: 'custonDate',
        elementClass: 'p-0'
    },
    'radio': {
        containerClass: 'col-auto d-flex flex-row p-0',
        elementClass: 'p-0'
    },
    'textarea': {
        containerClass: 'col pr-0 pl-0 display-inline',
        elementClass: 'form-control'
    },
    'Time': {
        containerClass: '',
        elementClass: 'select-width p-0'
    },
    'checkbox': {
        containerClass: 'p-0',
        elementClass: ''
    },
    'label': {
        containerClass: 'p-0',
        elementClass: ''
    },
    'file': {
        containerClass: 'input-group ml-0 position-relative',
        elementClass: 'select-width custom-file-input'
    },
    'reminder': {
        containerClass: 'col-md-12 ml-0 position-relative pl-0',
        elementClass: ''
    }
}

class ElementSetup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showForm: false,
            inputs: [],
            dataSaveObj: {},
            repeatForm: 1,
            repeatFormLabel: 1,
            domain: '',
            elementName: '',
            domainElement: '',
            elementIcon: null,
            whoDidIt: '',
            whenWasDone: '',
            domainList: [],
            iconList: iconList,
            whoCdashList: [],
            whenCdashList: [],
            initDomainValue: null,
            initWhodidIt: null,
            initWhenWasDone: null,
            initElementIcon: null,
            customDomainList: [],
            showPreviewMsg: '',
            checked:false,
            showPreviewFormPopUpData : false,
            disabledFilter :false,
            displayTableType:false,
            hideIsTableOptions : false,
            predefinedColumnValues : [],
            predefinedColumnName : ''
        },
            this.domainArray = [],
            this.customDomainKey = '',
            this.previewDataList = {},
            this.sequenceCounter = 0,
            this.domainId = '',
            this.fromEditElement=false,
            this.elementIdFromEdit='',
            this.isAnyItemQuestionCheck = [],
            this.logTypeDataArray = [],
            this.fromEditCheck=false
    }

    componentDidMount() {
        ApiService.getCdashMapping().then((res) => {
            res && res.data.length && res.data.forEach((d) => {
                d.name = d.cdashigVariableLabel
            })
            this.setState({ whoCdashList: res.data, whenCdashList: res.data })
        }, (error) => {
            common.clearNotification();
            NotificationManager.error('something went wrong');
        });
        ApiService.getDomainList().then((res) => {
            res && res.data.response.forEach((d)=>{
                d.id = d.domainIdentifier
                d.name = d.domainName
            });
           this.setState({ domainList : res.data.response });
            if (this.props.match && this.props.match.params &&
                this.props.match.params.domain_key && this.props.match.params.domain_key != "null"
                && this.props.match.params.element_name && this.props.match.params.element_name != "null") {
                let forDomain;
                forDomain = this.state.domainList.filter((o) => { return o.name === this.props.match.params.domain_key })
                this.setState({ initDomainValue: forDomain && forDomain.length ? forDomain[0] : null })
                setTimeout(() => {
                    this.setState({
                        elementName: this.props.match.params.element_name,
                        initElementIcon: this.props.match.params && this.props.match.params.element_logo ? { name: this.props.match.params.element_logo } : null,
                        initWhodidIt: this.props.match.params && this.props.match.params.who_did != "null" && this.props.match.params.who_did ? { name: this.props.match.params.who_did } : null,
                        initWhenWasDone: this.props.match.params && this.props.match.params.when_did != "null" && this.props.match.params.when_did ? { name: this.props.match.params.when_did } : null,
                    });
                }, 100)
            } else {
                this.setState({ initDomainValue: { name: "Select" }, initElementIcon: { name: "Select" }, initWhenWasDone: { name: "Select" }, initWhodidIt: { name: "Select" } })
            }
        }, (error) => {
            common.clearNotification();
            NotificationManager.error('something went wrong');
        });
    }

    onDataTypeChange = (option) => {
        if (option && option.name != "Select") {
            let domain = option.value;
            this.fromEditElement =option.fromEditElement;
            if (option && option.fromEditElement) {
                this.setState({
                    showForm: true, dataSaveObj: {}, domain: domain, domainElement: option.name, elementName: this.state.elementName, repeatFormLabel: 1,
                    initElementIcon: this.state.initElementIcon, initWhenWasDone: this.state.initWhenWasDone, initWhodidIt: this.state.initWhodidIt, showPreviewMsg: ''
                }, (s) => {
                    this.domainArray = this.state.domainElement && this.state.domainElement.split('-');
                });
            } else {
                this.setState({
                    showForm: true, dataSaveObj: {}, domain: option.domainCode, domainElement: option.name, elementName: '', repeatFormLabel: 1,
                    initElementIcon: { name: "Select" }, initWhenWasDone: { name: "Select" }, initWhodidIt: { name: "Select" }, showPreviewMsg: '',
                    predefinedColumnName : '',
                    predefinedColumnValues : ''
                }, (s) => {
                    this.domainArray = this.state.domainElement && this.state.domainElement.split('-');
                });
            }
            if(!this.fromEditElement){ this.setElementIconList(option);}
            if (option && (option.name == 'Select' || option.domainCode === 'EREVPI' || option.domainCode === 'EREVSM' || option.domainCode === 'EICF')) {
                this.setState({ inputs: [], showForm: false, showPreviewMsg: 'No preview for this element',domain: option.domainCode, domainElement: option.name});
                if(this.props.location.pathname.indexOf("protocol-encounter-setup") > -1 ){
                    this.setState({ disabledFilter : true })
                }
                this.domainId = option.id;
                this.getPreviewViewData();
            } else {
                if (option && option.name != 'Custom') {
                    //let temp = option.id;
                    this.domainId = option.id;
                    this.getFormJson(this.domainId,option.fromEditElement,false,option);
                } else {
                    this.setState({ inputs: [] });
                    this.domainId = option.id;
                    //this.getPreviewViewData(this.state.inputs[]);
                    this.previewDataList = {}
                    this.getFormJson(this.domainId,option.fromEditElement,true,option);
                }
            }
        }
    }

    setElementIconList = (option)=>{
        let elementIconFormatedArray = option && option.elementIcon && option.elementIcon.split(',');
        let tempIconListArray = [];
        elementIconFormatedArray.map((item,index)=>{
            let obj = {
                id : index,
                name : item
            }
            tempIconListArray.push(obj);
        });
        this.setState({ iconList : tempIconListArray},()=>{
            this.setState({
               initElementIcon : option.name != 'Custom'  ? this.state.iconList &&  this.state.iconList[0] :  null
            });
        });
    }

    getFormJson = (data,fromEditElement,fromCustomDomain,option) => {
        if(this.props.location.pathname.indexOf("protocol-encounter-setup") > -1 || fromEditElement){
            this.setState({disabledFilter:true});
            let Data = {
                study_identifier : this.props.match && this.props.match.params && this.props.match.params.studyId,
                element_identifier :this.elementIdFromEdit || (this.props.match && this.props.match.params && this.props.match.params.element_identifier)
            }
            if(!fromCustomDomain){
                ApiService.getItemGroupDetailsFromEncounter(Data).then((res) => {
                    if(res.data){
                        let isIcfDomain = res && res.data && res.data.response && ( res.data.response.domainCode === 'EICF' || res.data.response.domainCode === 'EREVPI' || res.data.response.domainCode === 'EREVSM') ? true : false;
                        this.setState({ inputs: res.data.response ? [res.data.response] : [], showPreviewMsg : isIcfDomain ? 'No preview for this element':'' , showForm : isIcfDomain ? false : true},()=>{
                        let prevSeqSt = this.state.inputs[0];
                        let newSequenceData = [].concat(prevSeqSt && prevSeqSt.mandatory || [],prevSeqSt && prevSeqSt.optional || [],prevSeqSt && prevSeqSt.custom || []);
                        let c1 = 0;
                        let getSortedBySequenceFields = common.getSortedBySequenceFields(newSequenceData);
                        let maxSequenceNumber = Math.max.apply(Math,getSortedBySequenceFields.map(function(o) { return o && o.sequence }))
                        this.sequenceCounter = maxSequenceNumber != -Infinity ? maxSequenceNumber : 0;
                        this.getPreviewViewData(prevSeqSt);
                        }) ;
                    }else{
                        this.setState({ inputs: [] });
                    }
                }, (error) => {
                    NotificationManager.error('something went wrong');
                });
            }else{
                ApiService.getCustomElementfrom(Data).then((res) => {
                    res.data ? this.setState({ inputs: [res.data.response] },()=>{
                        let prevSeqSt = this.state.inputs[0];
                        let newSequenceData = [].concat(prevSeqSt && prevSeqSt.mandatory || [],prevSeqSt && prevSeqSt.optional || [],prevSeqSt && prevSeqSt.custom || []);
                        let c1 = 0;
                        let getSortedBySequenceFields = common.getSortedBySequenceFields(newSequenceData);
                        let maxSequenceNumber = Math.max.apply(Math,getSortedBySequenceFields.map(function(o) { return o && o.sequence }))
                        this.sequenceCounter = maxSequenceNumber != -Infinity ? maxSequenceNumber : 0;
                        this.getPreviewViewData(prevSeqSt);
                    }) : this.setState({ inputs: [] });
                    }, (error) => {
                        common.clearNotification();
                        NotificationManager.error('something went wrong');
                });
            }
        }else{
            ApiService.getFormJson(data).then((res) => {
                    res.data ? this.setState({ inputs: [res.data.response] },()=>{
                        let prevSeqSt = this.state.inputs[0];
                        let newSequenceData = [].concat(prevSeqSt.mandatory || [],prevSeqSt.optional || [],prevSeqSt.custom || []);
                        let c1 = 0;
                        let getSortedBySequenceFields = common.getSortedBySequenceFields(newSequenceData);
                        let maxSequenceNumber = Math.max.apply(Math,getSortedBySequenceFields.map(function(o) { return o && o.sequence }))
                        this.sequenceCounter = maxSequenceNumber != -Infinity ? maxSequenceNumber : 0;
                        this.getPreviewViewData(prevSeqSt);

                    }) : this.setState({ inputs: [] });
           }, (error) => {
                common.clearNotification();
               NotificationManager.error('something went wrong');
           });
        }
    }

    findLastIndexHandler = (x, currentLabelId) => {
        var lableId = x.formLabelName.replace(/[^a-zA-Z]+/g, '');
        return currentLabelId == lableId;
    }

    getFormLabelJson = (data) => {
        ApiService.getFormLabelJson(data).then((res) => {
            let tempArray = this.state.inputs;
            tempArray.map((form, index) => {
                var currentLabelId = res.data.formLabelName.replace(/[^a-zA-Z]+/g, '');
                let testIndex = _.findLastIndex(form.formlabel, (x) => { return this.findLastIndexHandler(x, currentLabelId) });
                form.formlabel.splice(testIndex + 1, 0, res.data);
                form.formlabel[testIndex + 1].closeBtn = true
            })
            this.setState({ inputs: tempArray });
        }, (error) => {
            common.clearNotification();
            NotificationManager.error('something went wrong');
        });
    }

    onRepeateForm = () => {
        this.setState({ repeatForm: ++this.state.repeatForm });
        let temp = {
            "domain": this.state.domain,
            "iteration": this.state.repeatForm
        }
        this.getFormJson(temp, true);
    }

    onRepeateFormLabel = (labelName) => {
        this.setState({ repeatFormLabel: ++this.state.repeatFormLabel });
        let temp = {
            "labelName": labelName ? labelName : '',
            "repeatCounter": this.state.repeatFormLabel
        }
        this.getFormLabelJson(temp);
    }

    onChangeTextHandler = (e, formId, formLabelId, oid) => {

    }

    onChangeDropDownHandler = (option, formId, formLabelId, oid) => {
    }

    onchangeTimeHandler = (e, formId, formLabelId, oid) => {

    }

    onChangeFileHandler = (event, itemDefIndex) => {
    }

    saveAPIForElementSetup = ()=>{
        let parameter = {
            studyId : this.props.match && this.props.match.params.studyId,
            domainId : this.domainId,
            elementIcon : this.state.elementIcon,
            elementId : this.elementIdFromEdit
        }
        let data = this.previewDataList;
        data.elementIcon = this.state.elementIcon;
        data.whoCdashMap = (this.state.whoDidIt && this.state.whoDidIt !== 'Select') ? this.state.whoDidIt : '';
        data.whenCdashMap = this.state.whenWasDone;
        data.elementName = this.state.elementName && this.state.elementName.trim();
        data.domainCode = this.state.domain;
        data.domainName = this.state.domainElement;

//this.state.inputs[0] && (this.fromEditCheck ? (this.state.inputs[0].predefinedColumnValues ? this.state.inputs[0].predefinedColumnValues.split(','):[]): (this.state.inputs[0].predefinedColumnValues ? this.state.inputs[0].predefinedColumnValues :[]))
        let newArray =this.getPredefineColumnValues().map((item)=>{
            if(item){
               return item.trim();
            }
        }).join(',');
        data.predefinedColumnName = (this.state.inputs[0] && this.state.inputs[0].predefinedColumnName) ? this.state.inputs[0].predefinedColumnName : '';
        data.predefinedColumnValues = (this.state.inputs[0] && this.state.inputs[0].predefinedColumnValues) ? newArray : '';
        if(this.state.domainElement !== 'Custom'){
            ApiService.saveItemGroupMaster(parameter,data).then((res) => {
                if (res.status == 200 && res.data.responsecode==200) {
                    this.setState({
                        elementName: '',
                        elementIcon: null,
                        domainElement: null,
                        whoDidIt: '',
                        whenWasDone: '',
                        inputs: [],
                        showForm: false,
                        initDomainValue: this.state.initDomainValue != null ? null : { name: "Select" },
                        initElementIcon: this.state.initElementIcon != null ? null : { name: "Select" },
                        initWhodidIt: this.state.initWhodidIt != null ? null : { name: "Select" },
                        initWhenWasDone: this.state.initWhenWasDone != null ? null : { name: "Select" },
                        showPreviewMsg : ''
                    })
                    if(this.props.location.pathname.indexOf("protocol-encounter-setup") > -1){
                        common.clearNotification();
                        NotificationManager.success('Data saved successfully & Redirect to Encounter Setup','',999);
                        setTimeout(()=>{this.props.history.goBack();},1000);
                    }else{
                        this.setState({disabledFilter:false});
                        common.clearNotification();
                        NotificationManager.success('Data saved successfully');
                    }
                } else if(res.data.responsecode==400) {
                    common.clearNotification();
                    NotificationManager.error(res.data.custommessages && res.data.custommessages.elementName);
                }else{
                    common.clearNotification();
                    NotificationManager.error('Something went wrong');
                }
            }, (error) => {
                if (error.response && error.response.status == '404') {
                    common.clearNotification();
                    NotificationManager.warning(error.response.data && error.response.data.apierror && error.response.data.apierror.message);
                } else {
                    common.clearNotification();
                    NotificationManager.error('Something went wrong');
                }
            });
        }else{
            ApiService.saveCustomFormSetup(parameter,data).then((res) => {
                if (res.status == 200 && res.data.responsecode==200) {
                    this.setState({
                        elementName: '',
                        elementIcon: null,
                        domainElement: null,
                        whoDidIt: '',
                        whenWasDone: '',
                        inputs: [],
                        showForm: false,
                        initDomainValue: this.state.initDomainValue != null ? null : { name: "Select" },
                        initElementIcon: this.state.initElementIcon != null ? null : { name: "Select" },
                        initWhodidIt: this.state.initWhodidIt != null ? null : { name: "Select" },
                        initWhenWasDone: this.state.initWhenWasDone != null ? null : { name: "Select" }
                    });
                    if(this.props.location.pathname.indexOf("protocol-encounter-setup") > -1){
                        common.clearNotification();
                        NotificationManager.success('Data saved successfully & Redirect to Encounter Setup','',999);
                        setTimeout(()=>{this.props.history.goBack();},1000);
                    }else{
                        this.setState({disabledFilter:false});
                        common.clearNotification();
                        NotificationManager.success('Data saved successfully');
                    }
                } else if(res.data.responsecode==400) {
                    common.clearNotification();
                    NotificationManager.error(res.data.custommessages && res.data.custommessages.elementName);
                }else{
                    common.clearNotification();
                    NotificationManager.error('Something went wrong');
                }
            }, (error) => {
                if (error.response && error.response.status == '404') {
                    common.clearNotification();
                    NotificationManager.warning(error.response.data && error.response.data.apierror && error.response.data.apierror.message);
                } else {
                    common.clearNotification();
                    NotificationManager.error('Something went wrong');
                }
            });
        }
    }

    checkForDuplicate = (data)=>{
        try{
            for(let item of data){
                if(data.filter((f)=>{return item.trim() == f.trim()}).length > 1 ){
                   
                    return true;
                    break;
                }else{
                    return false
                }
            }
        }catch(e){}
    }

    onSaveData = () => {
        if (this.state.domainElement && this.state.domainElement !== 'Select' && this.state.elementName &&
            this.state.elementIcon && this.state.elementIcon !== 'Select') {
                let getSortedBySequenceFields = common.getSortedBySequenceFields(this.previewDataList.labelList);
                let previewShowObj = {
                    ...this.previewDataList,
                    labelList : getSortedBySequenceFields
                }
                let isSequenceEmpty = previewShowObj && previewShowObj.labelList && previewShowObj.labelList.filter((item)=>{
                    return item.sequence == ''
                });
                let valueArr = previewShowObj && previewShowObj.labelList && previewShowObj.labelList.map(function(item){ return item.sequence });
                const isDuplicate = valueArr && valueArr.some(function(item, idx){
                    return valueArr.indexOf(item) != idx
                });

                this.isAnyItemQuestionCheck = previewShowObj && previewShowObj.labelList && previewShowObj.labelList.filter((item)=>{
                    return item.isChecked && item.isChecked === true
                });

                this.logTypeDataArray = previewShowObj && previewShowObj.labelList && previewShowObj.labelList.filter((item)=>{
                    return item.isTable && item.isTable === true
                });

                if(isSequenceEmpty && isSequenceEmpty.length > 0){
                    common.clearNotification();
                    NotificationManager.error('Sequence can not be blank');
                }else{
                    if(!isDuplicate){
                        if(this.state.showForm){
                            if(this.isAnyItemQuestionCheck.length > 0 ){
                                if(this.state.isLogType || this.state.displayTableType){
                                    if(this.logTypeDataArray.length > 0){
                                        if(this.state.displayTableType){
                                            if(this.state.inputs[0] && this.state.inputs[0].predefinedColumnName && this.state.inputs[0].predefinedColumnValues){
                                                let isDuplicatePredefinedValue =  this.checkForDuplicate(this.state.inputs[0].predefinedColumnValues);
                                               if(isDuplicatePredefinedValue){
                                                common.clearNotification();
                                                NotificationManager.error('Duplicate predefined column values not allowed');
                                               }else{
                                                this.saveAPIForElementSetup();
                                               }
                                            }else{
                                                common.clearNotification();
                                                NotificationManager.error('Please enter required field for table type');
                                            }
                                        }else{this.saveAPIForElementSetup()}
                                    } else{
                                        common.clearNotification();
                                        NotificationManager.error('Please select atleast one item for Logs Type');
                                    }
                                }else{
                                    if(this.state.elementIcon === 'Table'){
                                        if(this.state.inputs[0] && this.state.inputs[0].predefinedColumnName && this.state.inputs[0].predefinedColumnValues){
                                            this.saveAPIForElementSetup();
                                        }else{
                                            common.clearNotification();
                                            NotificationManager.error('Please enter required field for table type');
                                        }
                                    }else{this.saveAPIForElementSetup();}
                                }
                            }else{
                                if(this.state.domainElement == 'Custom' || this.state.domain == 'EREM' || this.state.domain == 'ECKL'){
                                    common.clearNotification();
                                    NotificationManager.error('Please add atleast one item to complete the form setup');
                                }else{
                                    common.clearNotification();
                                    NotificationManager.error('Please select atleast one item to complete the form setup');
                                }
                            }
                        }else{
                            this.saveAPIForElementSetup();
                        }
                    }else{
                        common.clearNotification();
                        NotificationManager.error('Please enter unique sequence');
                    }
                }
        } else {
            common.clearNotification();
            NotificationManager.error('Please fill the required fields');
        }
    }

    onChangeText = (option, type) => {
        if (option && option.name != "Select") {
            if (type === 'icon') {
                this.setState({ elementIcon: option.name,
                    displayTableType:option.name=="Table"?true:false,
                    hideIsTableOptions : option.name !== 'Procedure' ? false : true,
                    isLogType : option.name == 'Logs' ? true : false,
                    predefinedColumnName : '',
                    predefinedColumnValues : ''
                });
            } else if (type === 'who_cdash') {
                this.setState({ whoDidIt: option.name });
            } else if (type === 'when_cdash') {
                this.setState({ whenWasDone: option.name });
            }
        }
    }

    onChangeElementName = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onCloseFormLabel = (lableIndex) => {
        let prevSt = this.state.inputs;
        if (lableIndex > -1) {
           prevSt && prevSt[0].custom.splice(lableIndex, 1);
        }
        this.setState({ inputs: prevSt });
        this.getPreviewViewData(this.state.inputs[0]);
    }

    getFormatedSubelementName = (name) => {
        let numbers = name && name.match(/\d+/g)
        if (numbers) {
            let updatedName = name && `${name.split(numbers && numbers[0])[0]} ${numbers && numbers[0]}`;
            return updatedName
        }
        return name;
    }

    getFormElementClasses = (formData, itm) => {
        let cls = `input-group mt-0 mb-3 col-md-12 col-lg-12 pl-0 ${formData.name}-form-grp`;
        return cls;
    }

    customSelectedValueTemplateFunction = (selectedItmes) => {
        return (
            <div className='selected-dropdown-itmes'>
                {
                    selectedItmes.map((item) => {
                        return (
                            <span key={item.id ? item.id : common.getRandomNumber()}>
                                {item.name}
                                {selectedItmes.length > 1 ? ',' : ''}
                            </span>
                        )
                    })
                }
            </div>
        )
    }

    customOptionTemplateFunction = (item, search, searchRegex) => {
        return <span title={item.name}>{item.name}</span>
    }

    getCodeDefinationList = (data,fullVal) => {
        let codeDef = [];
        data && data.map((subData, index) => {
            let tempObj = {
                "codeId":0,
                "codeOid":'',
                "name": "No Yes Response",
                "codelist_defination_id": subData.codelist_defination_id,
                "codeListOid": "",
                "inputType": subData.inputType,
                "codedValue": subData.inputType === 'checkbox' ? fullVal.fieldName.value : subData.codedValue,
                "decode":  subData.inputType === 'checkbox' ? fullVal.fieldName.value : subData.codedValue,
                "term_ref": "",
                "extensible": "",
                "language": "",
                "sequence": index + 1
            }
            codeDef.push(tempObj);
        });
        return codeDef;
    }

    getItemDefinationList = (data,labelName) => {
        let itemDef = [];

        data && data.map((subData, index) => {
            subData.answerType.value = subData.answerType.value === 'labelText' ? 'label' : subData.answerType.value
            this.sequenceCounter = this.sequenceCounter + 1;
            let tempObj = {
                "oid": "",
                "name": subData.fieldName.value,
                "cdash_alias_name": subData.fieldCdash.value,
                "domain": this.domainArray && this.domainArray[0],
                "cdash_core": "",
                "sdtm": "",
                "description": "",
                "question": subData.fieldName.value,
                "completion_instructions": "",
                "info_for_sponsors": "",
                "inputValue": subData.answerType.value === 'label' && subData.answerType.labelVal ? subData.answerType.labelVal : '' ,
                "inputType": (subData.answerType.codeDefinationList && subData.answerType.codeDefinationList.length !== 0) ? '' : subData.answerType.value,
                "sequence": Number(this.sequenceCounter),
                "ref_oid": "",
                "codeDefinationList": this.getCodeDefinationList(subData.answerType && subData.answerType.codeDefinationList,subData),
                "isRepeat": true,
                "isElligoStandard": true,
                "value": subData.answerType.labelVal,
                "uniqueIdentifier" : null,
                "isChecked":true
            }
           itemDef.push(tempObj);
        });
        return itemDef;
    }

    getFormLabelData = (data)=>{
        let formLabelData = [];
        let tempFormLabel = {
            "labelId": 0,
            "formLabelName":data.formLabel ? data.formLabel : '',
            "isRepeat": false,
            "sequence":1,
            "customItemDefinationList": this.getItemDefinationList(data.subElementformDataList),
            "itemDefinationList" : [],
            "uniqueIdentifier" : null
        }
        return tempFormLabel
    }

    openSubElementModal = (e) => {
        e.nativeEvent.stopImmediatePropagation();
        e.stopPropagation();
        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_SUBELEMENT, {
            onSave: (data) => {
                var prevSt = this.state.inputs;
                let newData1 = this.getFormLabelData(data);
                if (prevSt.length === 0) {
                    prevSt = [{
                        name: this.domainArray[0],
                        formview: "grid",
                        domainId:0,
                        domainCode:"CUST",
                        custom: [newData1]
                    }]
                } else {
                    if(prevSt[0].hasOwnProperty('custom')){
                        prevSt[0].custom.push(newData1);
                    }else{
                        prevSt[0].custom = [];
                        prevSt[0].custom.push(newData1);
                    }
                }
                this.getPreviewViewData(prevSt[0]);
                this.setState({ inputs: prevSt },()=>{});
                this.props.modalAction.hideModal();
            },
            hideModal: () => {
                this.props.modalAction.hideModal();
            },
            className: 'sub_element_modal',
        });
    }

    openElementListModal = () => {
        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_ELEMENT_LIST, {
            onSave: (data,from) => {
                if (data) {
                    if(from){
                        this.fromEditCheck=true;
                    }
                    this.elementIdFromEdit = data._original.uniqueIdentifier;
                    let getDomainIdentifier = this.state.domainList.filter((item)=>{
                        return item.domainName === data._original.domainName
                    })
                    this.setState({
                        domain : "",
                        initDomainValue : null
                    },()=>{
                        this.setState({
                            elementName: data._original.elementName,
                            domain: data._original.domainCode,
                            elementIcon: data._original.elementIcon,
                            whoDidIt: data._original.whoCdashMap,
                            whenWasDone: data._original.whenCdashMap,
                            initDomainValue: { name: `${data._original.domainName}`, id : getDomainIdentifier.length > 0 && getDomainIdentifier[0].domainIdentifier , value: data._original.domainCode, fromEditElement: true },
                            initElementIcon: { name: data._original.elementIcon },
                            initWhodidIt: { name: data._original.whoCdashMap ? data._original.whoCdashMap : 'Select' },
                            initWhenWasDone: { name: data._original.whenCdashMap ? data._original.whenCdashMap :'Select' }
    
                        }, () => {
                            this.props.modalAction.hideModal();
                        });
                    })
                }
            },
            hideModal: () => {
                this.props.modalAction.hideModal();
            },
            studyId: this.props.match && this.props.match.params.studyId,
            className: 'element_list_modal',
        });
    }

    renderCustomDomain = () => {
        return (<div>dfgd</div>)
    }



    reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    }

    goToElementPreviewModal = (previewShowObj)=>{
        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_ELEMENT_PREVIEW, {
            onSave: (data) => {
            },
            hideModal: () => this.props.modalAction.hideModal(),
            className: 'element_preview_modal',
            renderFormData:this.renderForm(previewShowObj)
        });
    }

    openElementPreviewModal = (formData)=>{
        let getSortedBySequenceFields = common.getSortedBySequenceFields(this.previewDataList.labelList);
        let previewShowObj = {
            ...this.previewDataList,
            labelList : getSortedBySequenceFields
        }

        let isSequenceEmpty = previewShowObj && previewShowObj.labelList && previewShowObj.labelList.filter((item)=>{
            return item.sequence == ''
		});
        let valueArr = previewShowObj && previewShowObj.labelList && previewShowObj.labelList.map(function(item){ return item.sequence });
        const isDuplicate = valueArr.some(function(item, idx){
            return valueArr.indexOf(item) != idx
        });

        this.isAnyItemQuestionCheck = previewShowObj && previewShowObj.labelList && previewShowObj.labelList.filter((item)=>{
            return item.isChecked && item.isChecked === true
        });

        this.logTypeDataArray = previewShowObj && previewShowObj.labelList && previewShowObj.labelList.filter((item)=>{
            return item.isTable && item.isTable === true
        });
        if(isSequenceEmpty && isSequenceEmpty.length > 0){
            common.clearNotification();
            NotificationManager.error('Sequence can not be blank');
        }else{
            if(!isDuplicate){
                if(this.isAnyItemQuestionCheck.length > 0){
                    if(this.state.isLogType || this.state.displayTableType){
                        if(this.logTypeDataArray.length > 0){
                            if(this.state.displayTableType){
                                if(this.state.inputs[0] && this.state.inputs[0].predefinedColumnName && this.state.inputs[0].predefinedColumnValues){

                                    let isDuplicatePredefinedValue =  this.checkForDuplicate(this.state.inputs[0].predefinedColumnValues);
                                               if(isDuplicatePredefinedValue){
                                                common.clearNotification();
                                                NotificationManager.error('Duplicate predefined column values not allowed');
                                               }else{
                                                this.goToElementPreviewModal(previewShowObj);
                                               }

                                }else{
                                    common.clearNotification();
                                    NotificationManager.error('Please enter required field for table type');
                                }
                            }else{this.goToElementPreviewModal(previewShowObj);}
                        } else{
                            common.clearNotification();
                            NotificationManager.error(`Please select atleast one item for ${this.state.elementIcon} Type`);
                        }
                    }else{
                        if(this.state.elementIcon === 'Table'){
                            if(this.state.inputs[0] && this.state.inputs[0].predefinedColumnName && this.state.inputs[0].predefinedColumnValues){
                                this.goToElementPreviewModal(previewShowObj);
                            }else{
                                common.clearNotification();
                                NotificationManager.error('Please enter required field for table type');
                            }
                        }else{this.goToElementPreviewModal(previewShowObj);}
                    }
                }else{
                    common.clearNotification();
                    NotificationManager.error('Please select atleast one item to complete the form setup');
                }

            }else{
                common.clearNotification();
                NotificationManager.error('Please enter unique sequence');
            }
        }

    }

    //get coloumn value
    getPredefineColumnValues= ()=>{
//this.state.inputs[0] ? (this.fromEditCheck ? (this.state.inputs[0].predefinedColumnValues ? this.state.inputs[0].predefinedColumnValues.split(','):[]) : this.state.inputs[0].predefinedColumnValues) : ''
        if(this.state.inputs[0] ){
            // if(this.fromEditCheck  ){}else{
                
            // }
                if(typeof(this.state.inputs[0].predefinedColumnValues)=="string" &&  this.state.inputs[0].predefinedColumnValues!=null){
                    let spt =   this.state.inputs[0].predefinedColumnValues.split(',');
                    return spt.length ? spt : []
                }
                else if(typeof(this.state.inputs[0].predefinedColumnValues)=="object" &&  this.state.inputs[0].predefinedColumnValues!=null) {
                    return this.state.inputs[0].predefinedColumnValues;
                }
                else{
                    return [];
                }
                //(this.state.inputs[0].predefinedColumnValues ? this.state.inputs[0].predefinedColumnValues.split(','):[])
            
        }

return []
    }
    renderForm = (formData,type)=>{
        if(this.state.elementIcon === 'Procedure' && formData.hasOwnProperty('columnList') && formData.columnList.length > 0){
            formData.columnList = [];
        }
        let customClassObject = {
                'textbox' : {
                    containerClass : 'p-0',
                    elementClass : 'form-control select-width'
                },
                'dropdown': {
                    containerClass : 'p-0',
                    elementClass : 'form-control select-width'
                },
                'date': {
                    containerClass : 'custonDate',
                    elementClass : 'p-0'
                },
                'radio': {
                    containerClass : 'col-auto d-flex flex-row p-0',
                    elementClass : 'p-0'
                },
                'textarea': {
                    containerClass : 'col pr-0 pl-0 display-inline',
                    elementClass : 'form-control'
                },
                'time': {
                    containerClass : '',
                    elementClass : 'select-width p-0'
                },
                'checkbox': {
                    containerClass : 'p-0',
                    elementClass : ''
                },
                'label': {
                    containerClass : 'p-0',
                    elementClass : ''
                },
                'file' : {
                    containerClass : 'input-group ml-0 position-relative',
                    elementClass : 'select-width custom-file-input'
                },
                'reminder' : {
                    containerClass : 'col-md-12 ml-0 position-relative pl-0',
                    elementClass : ''
                }
        }
        let predefinedTableData  = {
            predefinedColumnName : this.state.inputs[0] ? this.state.inputs[0].predefinedColumnName : '',
            predefinedColumnValues : this.getPredefineColumnValues()
        }
        if(Object.keys(formData).length === 0){
            return <div className='alert alert-info p-1 text-center'>Please Add Items</div>
        }else{
            return formData.columnList && formData.columnList.length > 0 ? <TableView displayElementIconTableType={this.state.displayTableType}  predefinedTableData={predefinedTableData} tableData={[formData]}/> :
            <div className='row col-xs-12 col-md-12 form-scroll'>
                <div className='form-group pt-2 row col-xs-12 col-md-12 position-relative ml-0 mr-0 p-0'>
                    { formData && formData.labelList && formData.labelList.length > 0  && common.sortByOrder(formData.labelList,'ASC').map((item,index)=>{
                            return (
                                item.isChecked && item.isChecked===true && <div key={index} className={this.getFormElementClasses(formData,item)} >
                                    {( item.inputType != ''&& item.inputType != 'reminder' || ( item.hasOwnProperty('codeDefinationList') && typeof item.codeDefinationList === 'object' &&
                                        item.codeDefinationList.length !== 0  &&  item.codeDefinationList[0].inputType !== 'checkbox')) && <label className={this.dynamicClassesForFieldName(item)}>{  item.updatedQuestion ?  item.updatedQuestion : item.question }</label> }
                                    <GenerateHtml labelText={item.label}  data={item} formId={formData.formId} formLabelId={formData.formLableId}
                                        customClassObject={customClassObject}
                                        itemDefIndex={index}
                                        fromWhichPage='popUp'
                                    />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        }
    }

    selectedOnPage = (optinalDataList)=>{
        var selectedOptinalItemCount=0;
		optinalDataList.forEach((optinalData)=>{
			if(optinalData.isChecked){
    			selectedOptinalItemCount++;
			}
		});
		return selectedOptinalItemCount;
    }

    onOptionalSingleCheck = (e,item,pindex,lableIndex,index)=>{
        let prevSt = this.state.inputs;
        prevSt[pindex].allOptionalChecked = false;
        prevSt[pindex].optional[lableIndex].itemDefinationList[index].isChecked = e.target.checked;
        if(!e.target.checked){
            prevSt[pindex].optional[lableIndex].itemDefinationList[index].isTable = false;
        }
        if(this.selectedOnPage(prevSt[pindex].optional[lableIndex].itemDefinationList) == prevSt[pindex].optional[lableIndex].itemDefinationList.length){
			prevSt[pindex].allOptionalChecked = true;
		}
        this.setState({
            inputs : prevSt
        })
        this.getPreviewViewData(prevSt[0]);
    }

    onOptionalAllCheck = (e,formLabelData)=>{
        let prevSt = this.state.inputs;
        formLabelData.allOptionalChecked = e.target.checked;
        if(formLabelData.allOptionalChecked){
            prevSt.forEach((formData,index)=>{
                formData.optional.forEach((formLabelData,lableIndex)=>{
                    formLabelData.itemDefinationList.forEach((optinalData,optIndex)=>{
                        optinalData.isChecked = true;
                    });
                });
            })
        }else{
            prevSt.forEach((formData,index)=>{
                formData.optional.forEach((formLabelData,lableIndex)=>{
                    formLabelData.itemDefinationList.forEach((optinalData,optIndex)=>{
                        optinalData.isChecked = false;
                        optinalData.isTable = false;
                    });
                });
            })
        }
        this.setState({
            inputs : prevSt
        })
        this.getPreviewViewData(prevSt[0]);
    }

    onTableCheck = (e,item,pindex,lableIndex,index,type)=>{
        let prevSt = this.state.inputs;
        if(type === 'custom'){
            prevSt[pindex][type][lableIndex].customItemDefinationList[index].isTable = e.target.checked;
        }else{
            prevSt[pindex][type][lableIndex].itemDefinationList[index].isTable = e.target.checked;
        }
        if(type === 'optional' && e.target.checked){
            prevSt[pindex].allOptionalChecked = false;
            prevSt[pindex][type][lableIndex].itemDefinationList[index].isChecked = e.target.checked;
            if(this.selectedOnPage(prevSt[pindex].optional[lableIndex].itemDefinationList) == prevSt[pindex].optional[lableIndex].itemDefinationList.length){
                prevSt[pindex].allOptionalChecked = true;
            }
        }
        this.setState({
            inputs : prevSt
        });
      this.getPreviewViewData(prevSt[0]);
    }


    getPreviewViewData = (prevSt)=>{
        var formData = prevSt && JSON.parse( JSON.stringify(prevSt));
        let columnList = [];
        let mandatoryDataList = [];
        let optionalDataList = [];
        let customDataList = [];
        if(formData){
            if(formData.hasOwnProperty('mandatory') && formData.mandatory && formData.mandatory.length > 0){
                formData.mandatory.forEach((formLabel,index)=>{
                    mandatoryDataList  = formLabel.itemDefinationList.filter((item) => { return item.isTable && item.isTable === true });
                });
            }
            if(formData.hasOwnProperty('optional')  && formData.optional && formData.optional.length > 0){
                formData.optional.forEach((formLabel,index)=>{
                    optionalDataList  = formLabel.itemDefinationList.filter((item) => { return item.isTable && item.isTable === true });
                });
            }
            if(formData.hasOwnProperty('custom') && formData.custom && formData.custom.length > 0){
                let getMergeCustomList = common.getSortedBySequenceFields(formData.custom);
                customDataList = getMergeCustomList.length > 0 && getMergeCustomList.filter((item)=>{ return item.isTable && item.isTable === true })
            }
            let columnMergeArray = [].concat(mandatoryDataList,optionalDataList,customDataList)
            common.sortByOrder(columnMergeArray,'ASC').forEach((item)=>{
                columnList.push(item.updatedQuestion ? item.updatedQuestion : item.question)
            });

            if(columnList.length > 0){
                formData.columnList = columnList;
                formData.formview = 'table';
            }
            const newUpdatedFormData = [].concat(formData.mandatory || [],formData.optional || [],formData.custom || []);
            formData['labelList'] = newUpdatedFormData;
            formData.labelList.forEach((label)=>{

            });
            this.previewDataList =  formData ;
        }else{
            this.previewDataList['labelList'] = [];
        }
        if(this.previewDataList.hasOwnProperty('mandatory')){
            delete this.previewDataList.mandatory
        }
        if(this.previewDataList.hasOwnProperty('optional')){
            delete this.previewDataList.optional
        }
        if(this.previewDataList.hasOwnProperty('custom')){
            delete this.previewDataList.custom
        }
    }

    onChangeFormSequence = (event,pindex,lableIndex,itemIndex,type)=>{
            let prevSt = this.state.inputs;
            if(prevSt[pindex][type][lableIndex].hasOwnProperty('itemDefinationList') && prevSt[pindex][type][lableIndex].itemDefinationList.length > 0){
                prevSt[pindex][type][lableIndex].itemDefinationList[itemIndex].sequence = event.target.value ? Number(event.target.value) : '';
            }
            if(prevSt[pindex][type][lableIndex].hasOwnProperty('customItemDefinationList')  && prevSt[pindex][type][lableIndex].customItemDefinationList.length > 0){
                prevSt[pindex][type][lableIndex].customItemDefinationList[itemIndex].sequence = event.target.value ? Number(event.target.value) : '';
            }
            this.setState({
                inputs : prevSt
            });
            this.getPreviewViewData(prevSt[0]);
    }

    onChangeTableSequence = (event,pindex,lableIndex,itemIndex,type)=>{
        let prevSt = this.state.inputs;
        prevSt[pindex][type][lableIndex].itemDefinationList[itemIndex]['tableSequence'] = Number(event.target.value);
        this.setState({
            inputs : prevSt
        });
    }

    onEditFormFeilds = (item,lableIndex,questionIndex,type)=>{
        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_EDIT_FORM_FEILDS, {
            onSave: (data) => {
                if(data){
                    let prevSt = this.state.inputs;
                    type === 'optional' ? prevSt[0][type][lableIndex].itemDefinationList[questionIndex].updatedQuestion = data.updatedQuestionFieldName :
                    prevSt[0][type][lableIndex].customItemDefinationList[questionIndex].updatedQuestion = data.updatedQuestionFieldName;
                    this.setState({
                        inputs : prevSt
                    });
                    this.getPreviewViewData(prevSt[0]);
                    this.props.modalAction.hideModal();
                }
            },
            hideModal: () => this.props.modalAction.hideModal(),
            className: 'editFormFieldModal',
            itemDefinationData : item,
            fullData : this.previewDataList
        });
    }

    onEditFormAnwerFields = (item,lableIndex,questionIndex,type)=>{
        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_EDIT_FORM_ANSWER_FIELDS, {
            onSave: (data) => {
                if(data){
                    let prevSt = this.state.inputs;
                    type === 'optional' ? prevSt[0][type][lableIndex].itemDefinationList[questionIndex].updatedQuestion = data.updatedQuestionFieldName :
                    prevSt[0][type][lableIndex].customItemDefinationList[questionIndex].updatedQuestion = data.updatedQuestionFieldName;
                    this.setState({
                        inputs : prevSt
                    });
                    this.getPreviewViewData(prevSt[0]);
                    this.props.modalAction.hideModal();
                }
            },
            hideModal: () => this.props.modalAction.hideModal(),
            className: 'editFormFieldModal',
            itemDefinationData : item,
            fullData : this.previewDataList
        });
    }
    dynamicClassesForFieldName = (item)=>{
        if(item.inputType == 'textBlockLong'){
            return 'p-0 overflow-ellipsis-multiple-line'
        }
        return 'pr-2 col-md-3 pl-0'
    }

    onChangePredefinedFields = (e,type)=>{
        let prevSt =  this.state.inputs;
        if(type == 'name'){
            prevSt[0]['predefinedColumnName'] = e.target.value;
        }else{
            prevSt[0]['predefinedColumnValues'] = e.target.value && e.target.value.split(',');
        }
        this.setState({
            inputs :  prevSt
        });
    }

    render({ props, state } = this) {
        let previewModalData = this.state.inputs && this.state.inputs[0];
        return (
            <div>
                <section className='element-setup iefixflex footpadb'>
                    <div className="border p-3 m-0 row justify-content-between">
                        <div className='col-12 form-row pb-1 px-0 m-0 justify-content-between border-bottom-dotted'>
                            <div className="col-md-5 col-lg-5  p-0">
                                <h5 className="col-12 px-0 c-p mb-0 pt-2">ItemGroup Details</h5>
                            </div>
                            <div className='col-md-5 pull-right justify-content-end p-0 mt-1'>
                                <h5 className="pt-1 headfright">Study:  <span className=" text-muted bluetxt pt-1" title={props.match.params.study}>
                                    {props.match &&  common.getSubString(props.match.params.study,15)} </span>
                                    <span className="text-muted  ml-1 mr-1"> | </span> Source Data Name:  <span className=" pt-1 bluetxt text-muted" title={props.match.params.protocolName}>
                                        {props.match && common.getSubString(props.match.params.protocolName,15)} </span> </h5>
                            </div>
                            <div className="col-md-auto justify-content-end p-0">
                                <div className="edit-btn-group  pull-right plcustom">
                                    <i className="material-icons" title='Edit existing Itemgroups' onClick={this.openElementListModal} >assignment</i>
                                    <i className="material-icons" title='Save' onClick={this.onSaveData}>save</i>
                                    <i className="material-icons" title='Cancel' onClick={() => { this.props.history.goBack();}}>
                                        clear</i>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 form-row p-0 m-0 mt-3">
                            <div className="form-group col-md-2 col-half-offset custred">
                                <label htmlFor="study">ItemGroup Domain</label>
                                <ReactSuperSelect
                                    placeholder="Select"
                                    clearSearchOnSelection={true}
                                    dataSource={state.domainList ? state.domainList : []}
                                    onChange={(option) => this.onDataTypeChange(option, 'domain')}
                                    searchable={true}
                                    keepOpenOnSelection={false}
                                    closeOnSelectedOptionClick={true}
                                    deselectOnSelectedOptionClick={false}
                                    customClass='select-container'
                                    disabled={this.state.disabledFilter}
                                    customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                    customOptionTemplateFunction={this.customOptionTemplateFunction}
                                    clearable={false}
                                    initialValue={(this.state.initDomainValue && this.state.initDomainValue != "null") ? this.state.initDomainValue : null}
                                />
                            </div>
                            <div className="form-group col-md-2 col-half-offset custred" onChange={this.onChangeElementIcon}>
                                <label htmlFor="study">ItemGroup Type</label>
                                <ReactSuperSelect
                                    placeholder="Select"
                                    clearSearchOnSelection={true}
                                    dataSource={state.iconList ? state.iconList : []}
                                    onChange={(option) => this.onChangeText(option, 'icon')}
                                    searchable={true}
                                    keepOpenOnSelection={false}
                                    closeOnSelectedOptionClick={true}
                                    deselectOnSelectedOptionClick={false}
                                    customClass='select-container'
                                    disabled={this.state.disabledFilter}
                                    customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                    clearable={false}
                                    initialValue={state.initElementIcon ? state.initElementIcon : null}
                                />
                            </div>
                            <div className="form-group col-md-2">
                                <label htmlFor="site">ItemGroup Name</label>
                                <input type="text" name='elementName' value={this.state.elementName} onChange={this.onChangeElementName} className="form-control reqfeild" disabled={this.state.disabledFilter}/>
                            </div>
                            <div className="form-group col-md-2 col-half-offset">
                                <label htmlFor="site">Who did it? CDASH Map</label>
                                <ReactSuperSelect
                                    placeholder="Select"
                                    clearSearchOnSelection={true}
                                    dataSource={state.whoCdashList ? state.whoCdashList : []}
                                    onChange={(option) => this.onChangeText(option, 'who_cdash')}
                                    searchable={true}
                                    disabled={this.state.disabledFilter}
                                    keepOpenOnSelection={false}
                                    closeOnSelectedOptionClick={true}
                                    deselectOnSelectedOptionClick={false}
                                    customClass='select-container'
                                    customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                    clearable={false}
                                    initialValue={state.initWhodidIt && state.initWhodidIt != "null" ? state.initWhodidIt : null}
                                />
                            </div>
                            <div className="form-group col-md-2 col-half-offset">
                                <label htmlFor="site">When was it done? CDASH Map</label>
                                <ReactSuperSelect
                                    placeholder="Select"
                                    clearSearchOnSelection={true}
                                    disabled={this.state.disabledFilter}
                                    dataSource={state.whenCdashList ? state.whenCdashList : []}
                                    onChange={(option) => this.onChangeText(option, 'when_cdash')}
                                    searchable={true}
                                    keepOpenOnSelection={false}
                                    closeOnSelectedOptionClick={true}
                                    deselectOnSelectedOptionClick={false}
                                    customClass='select-container'
                                    customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                    clearable={false}
                                    initialValue={state.initWhenWasDone && state.initWhenWasDone != "null" ? state.initWhenWasDone : null}
                                />
                            </div>
                        </div>
                        {this.state.showForm &&
                            <div className="row col-12 m-0 p-0 justify-content-between border-bottom-dotted">
                                <div className="col-8 p-0">
                                    <h5 className=" pb-2 px-0 c-p">Item Setup</h5>
                                </div>
                                <div className="col-auto text-right my-1 add-btn-bg">
                                    <span onClick={()=>this.openElementPreviewModal(this.previewDataList)}><span className="float-right c-w cursor-pointer">ItemGroup Preview</span>
                                        <span className="add-btn">
                                            <i className="material-icons">add</i>
                                        </span>
                                    </span>
                                </div>
                            </div>
                        }
                        {this.state.showPreviewMsg &&
                            <div className='alert alert-info col-md-12 text-center'>
                                {this.state.showPreviewMsg}
                            </div>
                        }
                        { !this.state.showPreviewMsg && <div className="col element-question p-0">
                            {
                                <div  className="col-xs-12 mt-3">
                                    {  state.showForm && <Accordion accordion={false} className='accordion'>
                                        {/* { this.state.inputs && this.state.inputs.length > 0 && this.state.inputs[0] && this.state.inputs[0].mandatory && this.state.inputs[0].mandatory.length > 0 &&
                                            <AccordionItem  expanded={true}>
                                                <AccordionItemTitle>
                                                    <h3 className='u-position-relative c-p'>
                                                        Mandatory Field
                                                        <div className="accordion__arrow" role="presentation"></div>
                                                    </h3>
                                                </AccordionItemTitle>
                                                <AccordionItemBody>
                                                    { this.state.inputs && this.state.inputs.length > 0 && this.state.inputs[0] && this.state.inputs[0].mandatory && this.state.inputs[0].mandatory.map((formLabelData,lableIndex)=>{
                                                            return <div key={lableIndex} className='form-group pt-2 row col-xs-12 col-md-12 position-relative'>
                                                                    <label className='vital-label-heading'> { this.getFormatedSubelementName(formLabelData.formLabelName) } </label>
                                                                    {formLabelData.customItemDefinationList = []}
                                                                    { formLabelData && formLabelData.itemDefinationList.map((item,index)=>{
                                                                            item.isChecked = true;
                                                                            const ManTableChckUniqId = 'table' + common.getRandomNumber();
                                                                            return (
                                                                                <div key={index} className={this.getFormElementClasses(this.state.inputs[0],item)} >
                                                                                    { item.inputType !== 'reminder' && <label className='pr-2 col-md-3 pl-0'>{ item.name }</label> }
                                                                                    <GenerateHtml labelText={item.label}  data={item} formId={this.state.inputs[0].formId} formLabelId={formLabelData.formLableId}
                                                                                        customClassObject={customClassObject}
                                                                                        itemDefIndex={index}
                                                                                        fromWhichPage='fromNewElementSetup'
                                                                                    />
                                                                                    <div className='sequence-container'>
                                                                                        <div className='formSequence'>
                                                                                            <i className="material-icons formseqicon" title='Form View'>library_books</i>
                                                                                            <input type='text' value={item.sequence ? Number(item.sequence) : ''} title='Form Item Sequence'
                                                                                                onChange={(event)=>this.onChangeFormSequence(event,0,lableIndex,index,'mandatory')}
                                                                                                    className='form-control' />
                                                                                        </div>
                                                                                        <div className='tableSequence position-relative'>
                                                                                            <i className="material-icons tableseqicon" title='Table View' >border_all</i>
                                                                                            <span className='istable-checkbox mr-1'>
                                                                                                <div className="custom-control custom-checkbox  mb-2">
                                                                                                    <input type="checkbox" checked={item.isTable || ''} className="custom-control-input" id={ManTableChckUniqId}
                                                                                                    onClick={(event)=>{this.onTableCheck(event,item,0,lableIndex,index,'mandatory')}} />
                                                                                                    <label className="custom-control-label" htmlFor={ManTableChckUniqId}></label>
                                                                                                </div>
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                            </div>
                                                        })
                                                    }
                                                </AccordionItemBody>
                                            </AccordionItem>
                                        } */}
                                        { this.state.inputs && this.state.inputs.length > 0 && this.state.inputs[0] && this.state.inputs[0].optional && this.state.inputs[0].optional.length > 0 &&
                                            <AccordionItem  expanded={true}>
                                                <AccordionItemTitle>
                                                    <h3 className='u-position-relative c-p'>
                                                        Optional Field
                                                        <div className="row float-right add-btn-bg sub-element-btn"  onClick={(e)=> { e.nativeEvent.stopImmediatePropagation();e.stopPropagation();}}>
                                                            <span className='optional-item-checkbox'>
                                                                <div className="custom-control custom-checkbox  mb-2">
                                                                    <input type="checkbox" className="custom-control-input" defaultChecked={this.state.inputs[0].allOptionalChecked || ''}  id='all'
                                                                        onClick={(e)=> { e.nativeEvent.stopImmediatePropagation();e.stopPropagation();this.onOptionalAllCheck(e,this.state.inputs[0])}}/>
                                                                    <label className="custom-control-label" htmlFor='all'>  All Optional Items</label>
                                                                </div>
                                                            </span>
                                                        </div>
                                                        <div className="accordion__arrow" role="presentation"></div>
                                                    </h3>
                                                </AccordionItemTitle>
                                                <AccordionItemBody>
                                                    <div className="form-header">
                                                        <div className='row col-xs-12 col-md-12 position-relative qhead'>
                                                            <div className="col-md-3 ">
                                                            CDASH Items
                                                            </div>
                                                            <div className="col-md-3 headerMarginLR">
                                                            Updated CDASH Items
                                                            </div>
                                                            <div className="col-md-3 ansHeaderMarginLR">
                                                            Answer Type
                                                            </div>
                                                            <div className="col-md-2 itemSeqMargin">
                                                            Item Sequence
                                                            </div>
                                                            <div className="col-md-1">
                                                            {!this.state.hideIsTableOptions ? "Log View":""}
                                                            </div>
                                                        </div>
                                                    </div>
                                      { this.state.inputs[0] && this.state.inputs[0].optional && this.state.inputs[0] && this.state.inputs[0].optional.map((formLabelData,lableIndex)=>{
                                                        return <div key={lableIndex} className='form-group pt-2 row col-xs-12 col-md-12 position-relative p-0'>
                                                                <label className='vital-label-heading'> { this.getFormatedSubelementName(formLabelData.formLabelName) } </label>
                                                                    {formLabelData.customItemDefinationList = []}
                                                                    { formLabelData && formLabelData.itemDefinationList.map((item,index)=>{
                                                                            item.isChecked = item.isChecked ? item.isChecked : false;
                                                                            const uniqueId = common.getRandomNumber();
                                                                            const OptionalTableChckUniqId = 'table' + common.getRandomNumber();
                                                                            return (
                                                                                <div key={index} className={this.getFormElementClasses(this.state.inputs[0],item)} >
                                                                                    <div className='col-md-3 pl-0 overflow-ellipsis'>
                                                                                        <span className="">
                                                                                            <i className="glyphicon glyphicon-edit pr-2 editicn editSetup" title="Edit CDASH Item" onClick={()=>this.onEditFormFeilds(item,lableIndex,index,'optional')}></i>
                                                                                        </span>
                                                                                        <span className='optional-item-checkbox optchekbx'>
                                                                                            <span className="custom-control custom-checkbox  mb-2 display-inline">
                                                                                                <input type="checkbox" checked={item.isChecked || false} className="custom-control-input" id={uniqueId}
                                                                                                    onChange={(event)=>{this.onOptionalSingleCheck(event,item,0,lableIndex,index)}} />
                                                                                                <label className="custom-control-label" htmlFor={uniqueId}>{item.decode}</label>
                                                                                            </span>
                                                                                        </span>
                                                                                        { item.inputType !== 'reminder' &&
                                                                                            <label className=''>
                                                                                                {item.question}
                                                                                            </label>
                                                                                        }
                                                                                    </div>
                                                                                   <div className='col-md-3'>
                                                                                        <input className='form-control select-width'  value={item.hasOwnProperty('updatedQuestion') && item.updatedQuestion || ''}  type='text' disabled/>
                                                                                   </div>
                                                                                    <GenerateHtml labelText={item.label}  data={item} formId={this.state.inputs[0].formId} formLabelId={formLabelData.formLableId}
                                                                                        customClassObject={customClassObject}
                                                                                        itemDefIndex={index}
                                                                                        fromWhichPage='fromNewElementSetup'
                                                                                    />

                                                                                    <div className='col-md-2 d-flex itemSeq pl-0'>

                                                                                    {item.isExtensible && <i className="glyphicon glyphicon-cog pr-3 mt-1 editicn editAns" title="Edit Controlled Term List" onClick={()=>this.onEditFormAnwerFields(item,lableIndex,index,'optional')}></i>}
                                                                                        <i className={`material-icons formseqicon ${!item.isExtensible ? 'pl31':''}`} title='Form View'>library_books</i>
                                                                                        <input type='text' value={item.sequence ? Number(item.sequence) : ''} title='Form Item Sequence'
                                                                                            onChange={(event)=>this.onChangeFormSequence(event,0,lableIndex,index,'optional')}
                                                                                                className='form-control itemSeqWidth'/>
                                                                                    </div>
                                                                                    { !this.state.hideIsTableOptions && <div className='col-md-1 position-relative'>
                                                                                        <i className="material-icons tableseqicon" title='Table View'>border_all</i>
                                                                                        <span className='istable-checkbox mr-1'>
                                                                                            <div className="custom-control custom-checkbox  mb-2">
                                                                                                <input type="checkbox" checked={item.isTable || false} className="custom-control-input" id={OptionalTableChckUniqId}
                                                                                                onChange={(event)=>{this.onTableCheck(event,item,0,lableIndex,index,'optional')}} />
                                                                                                <label className="custom-control-label" htmlFor={OptionalTableChckUniqId}></label>
                                                                                            </div>
                                                                                        </span>
                                                                                    </div>
                                                                                    }
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                            </div>
                                                        })
                                                    }
                                                </AccordionItemBody>
                                            </AccordionItem>
                                        }
                                        <AccordionItem  expanded={true}>
                                            <AccordionItemTitle>
                                                <h3 className='u-position-relative c-p'>
                                                    Custom Field
                                                    <div className="row float-right add-btn-bg sub-element-btn">
                                                        <div className="text-right" onClick={this.openSubElementModal}><span className="float-right  c-w cursor-pointer">Item</span>
                                                            <span className="add-btn">
                                                                <i className="material-icons">add</i>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="accordion__arrow" role="presentation"></div>
                                                </h3>
                                            </AccordionItemTitle>
                                            <AccordionItemBody>
                                                { this.state.inputs && this.state.inputs.length > 0 && this.state.inputs[0] && this.state.inputs[0].custom && this.state.inputs[0].custom.map((formLabelData,lableIndex)=>{
                                                    return <div key={lableIndex} className='form-group border pt-2 row col-xs-12 col-md-12 position-relative'>
                                                            <label className='vital-label-heading'> { this.getFormatedSubelementName(formLabelData.formLabelName) } </label>
                                                            <span className='pl-1 custom-close'>
                                                                <button type="button" className="close c-p" onClick={()=>this.onCloseFormLabel(lableIndex)}><span>×</span></button>
                                                            </span>
                                                            {formLabelData.itemDefinationList = []}
                                                            { formLabelData && formLabelData.customItemDefinationList && formLabelData.customItemDefinationList.map((item,index)=>{
                                                                        item.isChecked = true;
                                                                    const tableChckUniqId = 'table' + common.getRandomNumber();
                                                                    return (
                                                                        <div key={index} className={this.getFormElementClasses(this.state.inputs[0],item)} >
                                                                            {/* <div className="">
                                                                                <i className="glyphicon glyphicon-edit pr-2 editicn" onClick={()=>this.onEditFormFeilds(item,lableIndex,index,'custom')}></i>
                                                                            </div> */}
                                                                                { (item.inputType !== 'reminder' && item.inputType !== 'textBlockLong' )&&
                                                                                ( item.inputType != '' || item.hasOwnProperty('codeDefinationList') && typeof item.codeDefinationList === 'object' &&
                                                                                item.codeDefinationList.length !== 0  &&  item.codeDefinationList[0].inputType !== 'checkbox') &&
                                                                                <div className='col-md-3 pl-0 overflow-ellipsis'> <label className={this.dynamicClassesForFieldName(item)}>

                                                                                    { item.name }
                                                                                </label>   </div>}
                                                                                { item.inputType != '' && item.inputType == 'textBlockLong' &&
                                                                                <div className='col-md-9 p-0 overflow-ellipsis-multiple-line'> <label className={this.dynamicClassesForFieldName(item)}>
                                                                                    { item.name }
                                                                                </label>  </div>}
                                                                            <GenerateHtml labelText={item.label}  data={item} formId={this.state.inputs[0].formId} formLabelId={formLabelData.formLableId}
                                                                                customClassObject={customClassObject}
                                                                                itemDefIndex={index}
                                                                                fromWhichPage='fromNewElementSetup'
                                                                            />
                                                                            {item.inputType == 'reminder' || item.hasOwnProperty('codeDefinationList') && typeof item.codeDefinationList === 'object' &&
                                                                                item.codeDefinationList.length !== 0  && (item.codeDefinationList[0].inputType == 'checkbox') && <div className='col-md-3 pl-0 overflow-ellipsis'> </div>}

                                                                            { item.inputType && ( item.inputType == "textarea" || item.inputType == "textBlockLong") ? '' : <div className='col-md-3'></div>}

                                                                            <div className='col-md-2 d-flex itemSeq'>
                                                                                <i className="material-icons formseqicon" title='Form View'>library_books</i>
                                                                                <input type='text' value={item.sequence ? Number(item.sequence) : ''} title='Form Item Sequence'
                                                                                    onChange={(event)=>this.onChangeFormSequence(event,0,lableIndex,index,'custom')}
                                                                                        className='form-control itemSeqWidth' />
                                                                            </div>
                                                                            { !this.state.hideIsTableOptions && <div className='col-md-1 position-relative'>
                                                                                    <i className="material-icons tableseqicon" title='Table View'>border_all</i>
                                                                                    <span className='istable-checkbox mr-1'>
                                                                                        <div className="custom-control custom-checkbox  mb-2">
                                                                                            <input type="checkbox" defaultChecked={item.isTable || false} className="custom-control-input" id={tableChckUniqId}
                                                                                            onClick={(event)=>{this.onTableCheck(event,item,0,lableIndex,index,'custom')}} />
                                                                                            <label className="custom-control-label" htmlFor={tableChckUniqId}></label>
                                                                                        </div>
                                                                                    </span>
                                                                                </div>
                                                                            }
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    })
                                                }
                                            </AccordionItemBody>
                                        </AccordionItem>
                                        {this.state.displayTableType &&
                                        <AccordionItem  expanded={true}>
                                            <AccordionItemTitle>
                                                <h3 className='u-position-relative c-p'>
                                                     Predefined Table
                                                    <div className="accordion__arrow" role="presentation"></div>
                                                </h3>
                                            </AccordionItemTitle>
                                            <AccordionItemBody>
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <label className='form_required_class_after'> Predefined Column Name </label>
                                                    </div>
                                                    <div className="col-md-6 p-0">
                                                        <input type='text' value={(this.state.inputs[0] && this.state.inputs[0].predefinedColumnName) || ''} onChange={(event)=>this.onChangePredefinedFields(event,'name')} className="form-control"/>
                                                    </div>
                                                </div>
                                                <div className="row mt-2">
                                                    <div className="col-md-3">
                                                        <label className='form_required_class_after'> Predefined Column Values </label>
                                                    </div>
                                                    <div className="col-md-6 p-0">
                                                        <textarea row="2" onChange={(event)=>this.onChangePredefinedFields(event,'value')}  value={ ( this.state.inputs[0] && this.state.inputs[0].predefinedColumnValues) || ''} className="form-control"></textarea>
                                                    </div>
                                                </div>
                                            </AccordionItemBody>
                                        </AccordionItem>
                                        }

                                    </Accordion>
                                    }
                                </div>
                            }
                        </div>
                        }
                    </div>
                </section>
            </div>
        );
    }

}


function mapDispatchToProps(dispatch) {
    return {
        getForm: bindActionCreators(getFormAction, dispatch),
        modalAction: bindActionCreators(modalAction, dispatch)
    };
}


function mapStateToProps(state) {
    return {
        FormJson: state.getFormReducer,
        modal: state.modal
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ElementSetup);
