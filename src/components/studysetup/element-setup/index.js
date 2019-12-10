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
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux' ;
import ApiService from '../../../api';
import _ from 'lodash';
import 'react-datetime/css/react-datetime.css';
import ReactSuperSelect from 'react-super-select';
import '../../../../node_modules/react-super-select/lib/react-super-select.css';
import common from '../../../common/common';
import TableView from '../../generate-table/table';
import * as modalAction from '../../../actions/modalActions';
import { MODAL_TYPE_ELEMENT_FORM, MODAL_TYPE_SUBELEMENT,MODAL_TYPE_ELEMENT_LIST } from '../../../constants/modalTypes';
//import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
//import type {DroppableProvided, DraggableProvided ,  DropResult} from 'react-beautiful-dnd';


const domainList = [
    {
        id: 1,
        name:'VS-Vital Sign',
        value:'VS4'
    },
    {
        id: 2,
        name:'CM-Concomitant Medications',
        value:'CM'
    },
    {
        id: 3,
        name:'DM-Demographics',
        value:'DM'
    },
    {
        id: 4,
        name:'SU-Substance Use',
        value:'SU'
    },
    {
        id: 5,
        name:'AE-Adverse Events',
        value:'AE'
    },
    {
        id: 6,
        name:'MH-Medical History',
        value:'MH'
    }
    ,
    {
        id: 7,
        name:' DA-Drug Accountability',
        value:'DA'

    },{
        id: 8,
        name:'IE-Inclusion/Exclusion',
        value:'IE'

    },{
        id: 9,
        name:'PE-Physical Exam',
        value:'PE'

    },{
        id: 10,
        name:'DV-Deviations',
        value:'DV'

    },
    {
        id: 11,
        name:'ER-Elligo Reminder',
        value:'ER'

    },{
        id: 12,
        name:'CO-Comments',
        value:'CO'

    },
    {
        id: 13,
        name:'ERV-Elligo Review',
        value:'ERV'

    },
    {
        id: 14,
        name:'EI-Elligo ICF',
        value:'EI'

    },{
        id: 15,
        name:'CD-Custom Domain',
        value:'CD'

    }
];
const iconList = [
    {
        id: 1,
        name:'Procedure'
    },
    {
        id: 2,
        name:'Review'
    },
    {
        id: 3,
        name:'Logs'
    },
    {
        id: 4,
        name:'ICF'
    },
    {
        id: 5,
        name:'Checklist'
    },
    {
        id: 6,
        name:'Reminder'
    }
];
const whoCdashList = [
    {
        id: 1,
        name:'James'
    },
    {
        id: 2,
        name:'Martin'
    },
    {
        id: 3,
        name:'John'
    },
    {
        id: 4,
        name:'Deo'
    }
];
const whenCdashList = [
    {
        id: 1,
        name:'Today'
    },
    {
        id: 2,
        name:'Tommorrow'
    }
]
class ElementSetup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showForm : false,
            inputs : [],
            dataSaveObj : {},
            repeatForm : 1,
            repeatFormLabel:1,
            domain:'',
            elementName:'',
            domainElement:'',
            elementIcon:null,
            whoDidIt:'',
            whenWasDone:'',
            domainList:domainList,
            iconList:iconList,
            whoCdashList : [],
            whenCdashList : [],
            initDomainValue:null,
            initWhodidIt:null,
            initWhenWasDone:null,
            initProcdure:null,
            customDomainList : [],
            showPreviewMsg : ''
        };
        this.domainArray= [];
        this.customDomainKey='';
    }
    componentDidMount(){
        ApiService.getCdashMapping().then((res) => {
            res && res.data.response.length && res.data.response.forEach( (d)=>{
                d.name = d.cdashigVariableLabel
            })
            this.setState({ whoCdashList : res.data.response,whenCdashList:res.data.response})
        },(error) => {
            NotificationManager.error('something went wrong');
        });

        if(this.props.match && this.props.match.params &&
            this.props.match.params.domain_key &&  this.props.match.params.domain_key !="null"
            &&  this.props.match.params.element_name && this.props.match.params.element_name!="null"){
                let  forDomain ;
            if(this.props.match.params.domain_key && this.props.match.params.domain_key.indexOf("-Custom Domain")>-1){
                forDomain = [{name:"CD-Custom Domain"}]
            } else {
                if(this.props.match.params.domain_key && this.props.match.params.domain_key.indexOf("-Elligo Reminder")>-1){
                    forDomain = [{name:"ER-Elligo Reminder"}]
                } else {
                    forDomain = domainList.filter( (o)=>{return o.name===this.props.match.params.domain_key})
                }
                //forDomain = domainList.filter( (o)=>{return o.name===this.props.match.params.domain_key})
            }
            this.setState({initDomainValue: forDomain && forDomain.length ? forDomain[0] :  null })
            setTimeout( ()=>{
                this.setState({elementName:this.props.match.params.element_name,
                initProcdure : this.props.match.params && this.props.match.params.element_logo ?{name: this.props.match.params.element_logo }  : null ,
                initWhodidIt : this.props.match.params && this.props.match.params.who_did!="null" && this.props.match.params.who_did ?{name: this.props.match.params.who_did }  : null,
                initWhenWasDone : this.props.match.params && this.props.match.params.when_did!="null" && this.props.match.params.when_did ?{name: this.props.match.params.when_did }  : null,});
            },100)
        } else {
            this.setState({initDomainValue: {name:"Select"},initProcdure: {name:"Select"},initWhenWasDone: {name:"Select"},initWhodidIt: {name:"Select"}})
        }
    }

    onDataTypeChange = (option)=>{
        if(option && option.name!="Select"){
            let domain = option.value;
            if(option && option.fromEditElement){
                this.setState({ showForm : true,dataSaveObj:{},domain : domain,domainElement:option.name ,elementName:this.state.elementName,repeatFormLabel:1,
                    initProcdure: this.state.initProcdure,initWhenWasDone: this.state.initWhenWasDone,initWhodidIt: this.state.initWhodidIt,showPreviewMsg : ''},(s)=>{
                        this.domainArray = this.state.domainElement && this.state.domainElement.split('-');
                });
            }else{
                this.setState({ showForm : true,dataSaveObj:{},domain : domain,domainElement:option.name ,elementName:'',repeatFormLabel:1,
                    initProcdure: {name:"Select"},initWhenWasDone: {name:"Select"},initWhodidIt: {name:"Select"},showPreviewMsg : ''},(s)=>{
                        this.domainArray = this.state.domainElement && this.state.domainElement.split('-');
                });
            }
            if(option && (option.value == 'Select' || option.value === 'EI' || option.value === 'ERV')){
                this.setState({inputs : [],showForm : false, showPreviewMsg : 'No preview for this element'});
            } else {
                if(!option.hasOwnProperty("id") && !option.hasOwnProperty("value") && option.name=="CD-Custom Domain" ){
                    domain = this.props.match.params && this.props.match.params.domain_key.split("-")[0];
                }
                if(!option.hasOwnProperty("id") && !option.hasOwnProperty("value") && option.name=="ER-Elligo Reminder" ){
                    domain = this.props.match.params && this.props.match.params.domain_key.split("-")[0];
                }
                if(option && option.value != 'Custom'){
                    let temp = {
                        "domainName":domain
                    }
                  this.getFormJson(temp);
                } else{
                    this.setState({inputs : []});
                }
            }
        }
    }

    getFormJson = (data,fromRepeatForm,fromRepeatFormLabel)=>{
        ApiService.getFormJson(data).then((res) => {
            if(fromRepeatForm){
                var tempArray = this.state.inputs;
                tempArray.push(res.data[0]);
                this.setState( { inputs : tempArray });
            }else if(fromRepeatFormLabel){
                var tempArray = this.state.inputs;
                this.setState( { inputs : tempArray });
            }else{
                res.data[0] ?  this.setState({ inputs: [res.data[0]] }) : this.setState({ inputs: [] }) ;
            }
        },(error) => {
            NotificationManager.error('something went wrong');
        });
    }

    findLastIndexHandler = (x,currentLabelId)=>{
        var lableId = x.formLabelName.replace(/[^a-zA-Z]+/g, '');
        return currentLabelId == lableId;
    }

    getFormLabelJson = (data) =>{
        ApiService.getFormLabelJson(data).then((res) => {
            let tempArray = this.state.inputs;
            tempArray.map((form,index)=>{
               // res.data[0].formlabel[0].formLableId.replace(/[^a-zA-Z]+/g, '');
                var currentLabelId = res.data.formLabelName.replace(/[^a-zA-Z]+/g, '');
                let testIndex = _.findLastIndex(form.formlabel,(x)=>{return this.findLastIndexHandler(x,currentLabelId)} );
                //res.data[0].formlabel[0]
                form.formlabel.splice(testIndex+1,0,res.data);
                form.formlabel[testIndex+1].closeBtn = true
            })
            this.setState({inputs : tempArray});
        },(error) => {
            NotificationManager.error('something went wrong');
        });
    }

    onRepeateForm = ()=>{
        this.setState({repeatForm : ++this.state.repeatForm});
        let temp ={
            "domain":this.state.domain,
            "iteration": this.state.repeatForm
        }
        this.getFormJson(temp,true);
    }

    onRepeateFormLabel = (labelName) =>{
        this.setState({repeatFormLabel : ++this.state.repeatFormLabel});
        let temp ={
            "labelName":labelName ? labelName : '',
            "repeatCounter" : this.state.repeatFormLabel
        }
        this.getFormLabelJson(temp);
    }

    onChangeTextHandler = (e,formId,formLabelId,oid) =>{
		const prevSt = this.state.inputs;
		/*this.state.inputs.map((obj,index) => {
			if(obj.formId == formId){
				obj.formlabel.map((obj2,index1)=>{
					if(obj2.formLableId == formLabelId){
						let index2 = obj2.itemDefinationList.findIndex(x => x.oid == oid )
                       // prevSt[index]['formlabel'][index1]['itemDefinationList'][index2]['value'] = e.target.value;
                        if(index2 > -1){
                            prevSt[index]['formlabel'][index1]['itemDefinationList'][index2].value = e.target.value;
                        }else {
                            obj2.itemDefinationList.map((obj3,index3)=>{
                                if (obj3.measurementUnitDefinition ){
                                    if(obj3.measurementUnitDefinition.oid == oid){
                                        prevSt[index]['formlabel'][index1]['itemDefinationList'][index3]['measurementUnitDefinition']['value'] = e.target.value;
                                    }
                                }
                                if(obj3.codeDefination){
                                    if(obj3.codeDefination.oid == oid){
                                        prevSt[index]['formlabel'][index1]['itemDefinationList'][index3]['codeDefination']['value'] = e.target.value;
                                    }
                                }
                            });
                        }
					}
				})
			}
		});
        this.setState({inputs:prevSt});*/
	}

	onChangeDropDownHandler = (option,formId,formLabelId,oid) =>{
         const prevSt = this.state.inputs;
        // this.state.inputs.map((obj,index) => {
		// 	if(obj.formId == formId){
		// 		obj.formlabel.map((obj2,index1)=>{
		// 			if(obj2.formLableId == formLabelId){
        //                 let index2 = obj2.itemDefinationList.findIndex(x => x.oid == oid )
        //                 if(index2 > -1){
        //                     prevSt[index]['formlabel'][index1]['itemDefinationList'][index2].value = e.target.value;
        //                 }else {
        //                     obj2.itemDefinationList.map((obj3,index3)=>{
        //                         if (obj3.measurementUnitDefinition ){
        //                             if(obj3.measurementUnitDefinition.oid == oid){
        //                                 prevSt[index]['formlabel'][index1]['itemDefinationList'][index3]['measurementUnitDefinition']['value'] = e.target.value;
        //                             }
        //                         }
        //                         if(obj3.codeDefination){
        //                             if(obj3.codeDefination.oid == oid){
        //                                 prevSt[index]['formlabel'][index1]['itemDefinationList'][index3]['codeDefination']['value'] = e.target.value;
        //                             }
        //                         }
        //                     });
        //                 }

		// 			}
		// 		})
		// 	}
        // });
        this.setState({inputs:prevSt});
    }

    onChangeRadioHandler = (e,formId,formLabelId,oid) =>{
        const prevSt = this.state.inputs;
		this.state.inputs.map((obj,index) => {
			if(obj.formId == formId){
				obj.formlabel.map((obj2,index1)=>{
					if(obj2.formLableId == formLabelId){
                        let index2 = obj2.itemDefinationList.findIndex(x => x.oid == oid );
                        if(index2 > -1){
                            prevSt[index]['formlabel'][index1]['itemDefinationList'][index2]['value'] = e.target.value;
                        }else{
                            obj2.itemDefinationList.map((obj3,index3)=>{
                                if (obj3.codeDefination ){
                                    if(obj3.codeDefination.oid == oid){
                                       const hasChecked  = e.target.checked ?  "N" : "Y";
                                        prevSt[index]['formlabel'][index1]['itemDefinationList'][index3]['codeDefination']['value'] = hasChecked;
                                    }
                                }
                            });
                        }
					}
				})
			}
        });
        this.setState({inputs:prevSt});
	}

	onDateChangeHandler=(e,formId,formLabelId,oid)=>{
        const prevSt = this.state.inputs;
		/* this.state.inputs.map((obj,index) => {
			if(obj.formId == formId){
				obj.formlabel.map((obj2,index1)=>{
					if(obj2.formLableId == formLabelId){
						let index2 = obj2.itemDefinationList.findIndex(x => x.oid == oid )
						prevSt[index]['formlabel'][index1]['itemDefinationList'][index2]['value'] = e;
					}
				})
			}
        });
        this.setState({inputs:prevSt});*/
    }

    onchangeTimeHandler=(e,formId,formLabelId,oid)=>{
        const prevSt = this.state.inputs;
		this.state.inputs.map((obj,index) => {
			if(obj.formId == formId){
				obj.formlabel.map((obj2,index1)=>{
					if(obj2.formLableId == formLabelId){
						let index2 = obj2.itemDefinationList.findIndex(x => x.oid == oid )
                       // prevSt[index]['formlabel'][index1]['itemDefinationList'][index2]['value'] = e.target.value;
                        if(index2 > -1){
                            prevSt[index]['formlabel'][index1]['itemDefinationList'][index2].value = e;
                        } else {
                            obj2.itemDefinationList.map((obj3,index3)=>{
                                if (obj3.measurementUnitDefinition ){
                                    if(obj3.measurementUnitDefinition.oid == oid){
                                        prevSt[index]['formlabel'][index1]['itemDefinationList'][index3]['measurementUnitDefinition']['value'] = e;
                                    }
                                }
                                if(obj3.codeDefination){
                                    if(obj3.codeDefination.oid == oid){
                                        prevSt[index]['formlabel'][index1]['itemDefinationList'][index3]['codeDefination']['value'] = e;
                                    }
                                }
                            });
                        }
					}
				})
			}
		});
        this.setState({inputs:prevSt});
    }

    onChangeFileHandler = (event,itemDefIndex)=>{
       // const prevSt = this.state.inputs;
      // input_type
        // prevSt && prevSt[0].formlabel && prevSt[0].formlabel.map((obj,index) => {

        //     obj.itemDefinationList[itemDefIndex].value = event.target.value;
        // });
        // const prevSt = this.state.inputs;
        // this.state.inputs.map((obj,index) => {
		// 	if(obj.formId == formId){
		// 		obj.formlabel.map((obj2,index1)=>{
		// 			if(obj2.formLableId == formLabelId){
		// 				let index2 = obj2.itemDefinationList.findIndex(x => x.oid == oid )
        //                // prevSt[index]['formlabel'][index1]['itemDefinationList'][index2]['value'] = e.target.value;
        //                 if(index2 > -1){
        //                     prevSt[index]['formlabel'][index1]['itemDefinationList'][index2].value = event.target.value;
        //                 } else {
        //                     obj2.itemDefinationList.map((obj3,index3)=>{
        //                         if (obj3.measurementUnitDefinition ){
        //                             if(obj3.measurementUnitDefinition.oid == oid){
        //                                 prevSt[index]['formlabel'][index1]['itemDefinationList'][index3]['measurementUnitDefinition']['value'] = event.target.value;
        //                             }
        //                         }
        //                         if(obj3.codeDefination){
        //                             if(obj3.codeDefination.oid == oid){
        //                                 prevSt[index]['formlabel'][index1]['itemDefinationList'][index3]['codeDefination']['value'] = event.target.value;
        //                             }
        //                         }
        //                     });
        //                 }
		// 			}
		// 		})
		// 	}
		// });
        //this.setState({inputs:prevSt});
    }

	onSaveData = ()=>{
        let tempObj = {
            name:this.state.elementName,
            domain_key: this.state.domain === 'CD' ||  this.state.domain === 'ER' ? this.customDomainKey : this.domainArray[0],
            description:this.domainArray[1],
            element_icon:this.state.elementIcon,
            who_did_it_cdash: (this.state.whoDidIt && this.state.whoDidIt !== 'Select' )? this.state.whoDidIt : '',
            when_was_this_done_cdash:this.state.whenWasDone
        }
        if(this.state.domainElement && this.state.domainElement !== 'Select' && this.state.elementName  &&
             this.state.elementIcon && this.state.elementIcon !== 'Select'){
            ApiService.saveElementMaster(this.props.match.params.versionId,JSON.stringify(tempObj)).then((res) => {
                if(res.status == 200){
                    NotificationManager.success('Data saved successfully');
                    this.setState({
                        elementName : '',
                        elementIcon:null ,
                        domainElement : null,
                        whoDidIt : '',
                        whenWasDone : '',
                        inputs : [],
                        showForm : false,
                        initDomainValue:this.state.initDomainValue!=null ? null : {name:"Select"} ,
                        initProcdure:  this.state.initProcdure!=null ? null : {name:"Select"} ,
                        initWhodidIt:this.state.initWhodidIt!=null ? null : {name:"Select"},
                        initWhenWasDone:this.state.initWhenWasDone!=null ? null : {name:"Select"}
                     })
                } else {
                    NotificationManager.error('Something went wrong');
                }
            },(error) => {
                if (error.response && error.response.status == '404') {
                    NotificationManager.warning(error.response.data && error.response.data.apierror && error.response.data.apierror.message);
                } else {
                    NotificationManager.error('Something went wrong');
                }
            });
        }else{
            NotificationManager.error('Please fill the required fields');
        }

    }

    onChangeText = (option,type)=>{
        if(option && option.name!="Select"){
            if(type === 'icon'){
                this.setState({ elementIcon : option.name });
            }else if(type === 'who_cdash'){
                this.setState({ whoDidIt : option.name });
            }else if(type === 'when_cdash'){
                this.setState({ whenWasDone : option.name });
            }
        }
    }

    onChangeElementName = (e)=>{
        this.setState({ [e.target.name] : e.target.value });
    }

    onCloseFormLabel = (index)=>{
        let prevSt = this.state.inputs;
        if(index > -1){
            prevSt && prevSt[0].formlabel.splice(index, 1);
        }
        this.setState({ inputs : prevSt});
    }

    getFormatedSubelementName = (name) =>{
        let numbers = name && name.match(/\d+/g)
        if(numbers){
            let updatedName = name && `${name.split(numbers && numbers[0])[0]} ${numbers && numbers[0]}`;
            return updatedName
        }
        return name;
    }

    getFormElementClasses = (formData,itm)=>{
        let cls = `form-group mt-0 col-md-4 col-lg-4 pl-0 ${formData.name}-form-grp`;
        if(formData.name === 'CO' && itm.name==="Notes" && itm.input_type==="textarea"){
            cls = `form-group mt-0 col-md-12 col-lg-12 pl-0 ${formData.name}-form-grp`;
        }
        return cls;
    }

    renderForm = (formData,type)=>{
        let customClassObject = {};
        if(type === 'fromPopUp'){
            customClassObject = {
                'textbox' : {
                    containerClass : '',
                    elementClass : 'form-control select-width'
                },
                'dropdown': {
                    containerClass : '',
                    elementClass : 'form-control select-width'
                },
                'date': {
                    containerClass : '',
                    elementClass : 'col-md-8 col-lg-8 col-xs-12 p-0'
                },
                'radio': {
                    containerClass : '',
                    elementClass : 'col-md-8 col-lg-8 col-xs-12 p-0'
                },
                'textarea': {
                    containerClass : '',
                    elementClass : 'form-control'
                },
                'Time': {
                    containerClass : '',
                    elementClass : 'select-width col-md-8 col-lg-8 col-xs-12 p-0'
                },
                'checkbox': {
                    containerClass : '',
                    elementClass : ''
                },
                'label': {
                    containerClass : '',
                    elementClass : ''
                },
                'file' : {
                    containerClass : 'file btn btn-default',
                    elementClass : 'select-width custom-file-input'
                },
                'reminder' : {
                    containerClass : 'col-md-12 ml-0 position-relative pl-0',
                    elementClass : ''
                }
            }
        }else{
            customClassObject = {
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
                'Time': {
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
        }
        return formData && formData.formlabel && common.sortByOrder(formData.formlabel,'ASC').map((formLabelData,idx)=>{
            return (
               // <Draggable key={formLabelData.formlabelid} draggableId={idx} index={idx}>
                 // {(provided: DraggableProvided) => (
                     //ref={provided.innerRef}   {...provided.dragHandleProps}
                        <div key={idx} className='form-group border pt-2 row col-xs-12 col-md-12 position-relative'>
                            { formLabelData && type != 'fromPopUp' ? <span className='pl-1'>
                                <button type="button" className="close c-p formLabel-close" onClick={()=>this.onCloseFormLabel(idx)}><span>×</span></button>
                                </span> : ''
                            }
                            { formLabelData.formLabelName && <div className='col-md-12 col-xs-12 pl-0 pr-0'>
                                <label className='vital-label-heading'> { this.getFormatedSubelementName(formLabelData.formLabelName) } </label>
                                { formLabelData && formLabelData.isRepeat ? <span className='pl-2'>
                                    <button className='btn text-white form-addition-btn position-relative' onClick={()=>this.onRepeateFormLabel(formLabelData.formLabelName)}> <span className='plus-sign'>+</span></button>
                                    </span> : ''
                                }
                            </div> }
                            <div  className={type === 'fromPopUp' ? 'col-md-12 col-xs-12 row' : `col-md-12 col-xs-12 row pl-0 ${formData.name}`}>
                                { formLabelData && common.sortByOrder(formLabelData.itemDefinationList,'ASC').map((item,index)=>{
                                        return (
                                                <div key={index} className={type === 'fromPopUp' ? 'input-group mt-2 pl-0' : this.getFormElementClasses(formData,item)} >
                                                    { item.input_type !== 'reminder' && <label className='pr-2 col-md-4 pl-0'>{ item.name }</label> }
                                                    <GenerateHtml labelText={item.label}  data={item} formId={formData.formId} formLabelId={formLabelData.formLableId}
                                                        onChangeTextHandler={this.onChangeTextHandler}
                                                        onChangeDropDownHandler={this.onChangeDropDownHandler}
                                                        onDateChangeHandler={this.onDateChangeHandler}
                                                        onChangeRadioHandler={this.onChangeRadioHandler}
                                                        onchangeTimeHandler={this.onchangeTimeHandler}
                                                        onChangeFileHandler={this.onChangeFileHandler}
                                                        customClassObject={customClassObject}
                                                        itemDefIndex={index}
                                                    />
                                                        {/* { item.measurementUnitDefinition &&
                                                            <span className='pl-1'> {item.measurementUnitDefinition.unit} </span>
                                                        } */}
                                                </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                //  )}
               // </Draggable>
            )
        })
    }


    customSelectedValueTemplateFunction = (selectedItmes) =>{
        return(
            <div className='selected-dropdown-itmes'>
                {
                    selectedItmes.map((item)=>{
                        return(
                            <span key={item.id ? item.id : common.getRandomNumber()}>
                                {item.name}
                                { selectedItmes.length > 1 ? ',' : ''}
                            </span>
                        )
                    })
                }
            </div>
        )
    }
    customOptionTemplateFunction = (item, search, searchRegex) =>{
        return <span title={item.name}>{item.name}</span>
        }

    openFormPopup = (formData)=>{
        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_ELEMENT_FORM,{
            onSave : (data) => {
            },
            hideModal : ()=>{
                this.props.modalAction.hideModal();
            },
            className:'element_setup_modal',
            renderFormData :  this.renderForm(formData,'fromPopUp'),
            header : this.state.domainElement
        });
    }

    getCodeDefinationList = (data) =>{
        let codeDef = [];
        data && data.map((subData,index)=>{
            let tempObj = {
                    "name": "No Yes Response",
                    "codelist_defination_id": subData.codelist_defination_id ,
                    "codeListOid": "",
                    "data_type": subData.data_type,
                    "coded_value": subData.coded_value,
                    "decode": subData.coded_value,
                    "term_ref": "",
                    "extensible": "",
                    "language": "",
                    "sequence": index + 1
                }
            codeDef.push(tempObj);
        });
        return codeDef;
    }

    getItemDefinationList = (data)=>{
        let itemDef = [];
        data && data.map((subData,index)=>{
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
                "input_type": (subData.answerType.codeListDefination && subData.answerType.codeListDefination.length !== 0) ? '' : subData.answerType.value,
                "sequence": 1,
                "ref_oid": "",
                "codeListDefination": this.getCodeDefinationList(subData.answerType && subData.answerType.codeListDefination),
                "isRepeat": true,
                "isElligoStandard": true,
                "value":subData.answerType.labelVal
            }
            itemDef.push(tempObj);
        });
        return itemDef;
    }

    openSubElementModal = ()=>{
        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_SUBELEMENT,{
            onSave : (data) => {
                let labelObj = {};
                var prevSt = this.state.inputs;
                    labelObj =  {
                        "formLabelName": data && data.formLabel,
                        "isRepeat": false,
                        "sequence": 1,
                        "itemDefinationList": this.getItemDefinationList(data.subElementformDataList)
                    }
                    if(prevSt.length === 0){
                        prevSt = [{
                            name: this.domainArray[0],
                            formview: "grid",
                            description:this.domainArray[1],
                            formlabel : [labelObj]
                        }]

                    } else {
                        prevSt.map((item,index)=>{
                            item['formlabel'].push(labelObj);
                        });
                    }
                ApiService.addDomainElement(prevSt[0]).then((res) => {
                    this.customDomainKey = res && res.data
                    this.setState({inputs : prevSt});
                    this.props.modalAction.hideModal();
                },(error) => {
                    NotificationManager.error('something went wrong');
                });

            },
            hideModal : ()=>{
                this.props.modalAction.hideModal();
            },
            className:'sub_element_modal',
        });
    }

    openElementListModal = ()=>{
        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_ELEMENT_LIST,{
            onSave : (data) => {if(data){
                this.setState({
                    elementName : data._original.name,
                    domain : data._original.domain_key,
                    elementIcon : data._original.element_icon,
                    whoDidIt : data._original.who_did_it_cdash,
                    whenWasDone : data._original.when_was_this_done_cdash,
                    initDomainValue :{ name: `${data._original.domain_key}-${data._original.description}` ,value:data._original.domain_key, fromEditElement : true},
                    initProcdure : { name : data._original.element_icon },
                    initWhodidIt: { name : data._original.who_did_it_cdash },
                    initWhenWasDone:{ name : data._original.when_was_this_done_cdash }
                },()=>{
                    this.props.modalAction.hideModal();
                })
            }
        },
            hideModal : ()=>{
                this.props.modalAction.hideModal();
            },
            vId:this.props.match.params && (this.props.match.params.versionId).trim(),
            className:'element_list_modal',
        });
    }

    renderCustomDomain = () =>{
        return (<div>dfgd</div>)
    }



    reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    }


    // onDragEnd = (result: DropResult) => {
    //     // dropped outside the list
    //     if (!result.destination) {
    //     return;
    //     }

    //     const items = this.reorder(
    //         this.state.inputs[0].formlabel,
    //         result.source.index,
    //         result.destination.index
    //     );


    //     this.setState({
    //         inputs : items
    //     });
    // }

    render({props,state}= this) {
        return (
            <div>
                <section className='element-setup iefixflex'>
                    <div className="border p-3 m-0 row justify-content-between">
                            <div className='col-12 form-row pb-1 px-0 m-0 justify-content-between border-bottom-dotted'>
                                <div className="col-md-6 col-lg-6  p-0">
                                    <h5 className="col-12 px-0 c-p mb-0 pt-2">ItemGroup Details
                                     </h5>
                                </div>
                                <div className='col-md-4 pull-right justify-content-end p-0 mt-1'>
                                    <h5 className="pt-1 headfright">Study:  <span  className="small text-muted bluetxt pt-1">
                                    { props.match && props.match.params.study} </span>
                                    <span className="text-muted small ml-1 mr-1"> | </span> Protocol Version Name:  <span  className="small pt-1 bluetxt text-muted">
                                    { props.match && props.match.params.protocolName} </span> </h5>
                                </div>
                                <div className="col-md-auto justify-content-end p-0">
                                    <div className="edit-btn-group  pull-right plcustom">
                                         {/* <span className="arrow d-flex flex-row">
                                        <i className="material-icons">chevron_right</i>
                                        <i className="material-icons">chevron_right</i>
                                        </span>  */}
                                        {/* <i className="material-icons active">mode_edit</i>  */}
                                        {/* <div data-toggle="modal" data-target="#saveaction" class="material-icons elelistbtn">assignment</div>  */}
                                        <i className="material-icons" title='Element List' onClick={this.openElementListModal} >assignment</i>
                                        <i className="material-icons" title='Save' onClick={this.onSaveData}>save</i>
                                        <i className="material-icons" title='Cancel' onClick={()=>{this.props.history && this.props.match && this.props.history.push(`/protocol-details/protocol-setup-new/${this.props.match.params.study}/${this.props.match.params.versionId}/${this.props.match.params.studyId}/${this.props.match.params.protocolVersion}/${this.props.match.params.protocolName}`)}}>
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
                                            dataSource={state.domainList ? state.domainList : [] }
                                            onChange={(option)=>this.onDataTypeChange(option,'domain')}
                                            searchable={true}
                                            keepOpenOnSelection={false}
                                            closeOnSelectedOptionClick={true}
                                            deselectOnSelectedOptionClick={false}
                                            customClass='select-container'
                                            customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                            customOptionTemplateFunction={this.customOptionTemplateFunction}
                                            clearable = {false}
                                            initialValue={( this.state.initDomainValue &&  this.state.initDomainValue !="null" )  ?  this.state.initDomainValue   : null }
                                        />

                                </div>
                                <div className="form-group col-md-2 col-half-offset custred" onChange={this.onChangeElementIcon}>
                                    <label htmlFor="study">ItemGroup Icon</label>
                                     <ReactSuperSelect
                                            placeholder="Select"
                                            clearSearchOnSelection={true}
                                            dataSource={state.iconList ? state.iconList : [] }
                                            onChange={(option)=>this.onChangeText(option,'icon')}
                                            searchable={true}
                                            keepOpenOnSelection={false}
                                            closeOnSelectedOptionClick={true}
                                            deselectOnSelectedOptionClick={false}
                                            customClass='select-container'
                                            customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                            clearable = {false}
                                            initialValue={state.initProcdure ? state.initProcdure : null}
                                        />
                                </div>
                                <div className="form-group col-md-2">
                                    <label htmlFor="site">ItemGroup Name</label>
                                    <input type="text" name='elementName' value={this.state.elementName} onChange={this.onChangeElementName} className="form-control reqfeild"/>
                                </div>
                                <div className="form-group col-md-2 col-half-offset">
                                    <label htmlFor="site">Who did it? CDASH Map</label>

                                     <ReactSuperSelect
                                        placeholder="Select"
                                        clearSearchOnSelection={true}
                                        dataSource={state.whoCdashList ? state.whoCdashList : [] }
                                        onChange={(option)=>this.onChangeText(option,'who_cdash')}
                                        searchable={true}
                                        keepOpenOnSelection={false}
                                        closeOnSelectedOptionClick={true}
                                        deselectOnSelectedOptionClick={false}
                                        customClass='select-container'
                                        customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                        clearable = {false}
                                        initialValue={state.initWhodidIt && state.initWhodidIt!="null" ? state.initWhodidIt : null }

                                    />

                                </div>
                                <div className="form-group col-md-2 col-half-offset">
                                    <label htmlFor="site">When was it done? CDASH Map</label>
                                    <ReactSuperSelect
                                        placeholder="Select"
                                        clearSearchOnSelection={true}
                                        dataSource={state.whenCdashList ? state.whenCdashList : [] }
                                        onChange={(option)=>this.onChangeText(option,'when_cdash')}
                                        searchable={true}
                                        keepOpenOnSelection={false}
                                        closeOnSelectedOptionClick={true}
                                        deselectOnSelectedOptionClick={false}
                                        customClass='select-container'
                                        customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}

                                        clearable = {false}
                                        initialValue={state.initWhenWasDone && state.initWhenWasDone!="null" ? state.initWhenWasDone : null}
                                    />
                                </div>
                            </div>{this.state.showForm &&
                                <div className="row col-12 m-0 p-0 justify-content-between border-bottom-dotted">
                                    <div className="col-8 p-0">
                                        <h5 className=" pb-2 px-0 c-p">Item Setup</h5>
                                    </div>
                                    <div className="col-auto text-right my-1 add-btn-bg">
                                        <span onClick={this.openSubElementModal}><span className="float-right c-w cursor-pointer">Item</span>
                                            <span className="add-btn">
                                                <i className="material-icons">add</i>
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            }
                            {this.state.showPreviewMsg &&
                                <div className='alert alert-info col-md-12 text-center'>
                                    { this.state.showPreviewMsg}
                                </div>
                            }
                            <div className="col element-question p-0">
                                    <div className="col-xs-12 mt-3">
                                            {
                                                (this.state.inputs && this.state.inputs.length > 0 )?
                                                this.state.inputs.map((formData,index)=>{
                                                    return (
                                                       // <DragDropContext onDragEnd={this.onDragEnd}>
                                                            // <Droppable droppableId='droppable'>
                                                              //  {(dropProvided: DroppableProvided) => (
                                                                  //ref={dropProvided.innerRef}
                                                                    <div  key={index}>
                                                                        { state.domain === 'DM' ?  <DM formData={formData} type='fromDropDown' /> :
                                                                            state.domain === 'IE' ? <IE formData={formData} type='fromDropDown' /> :
                                                                            ( formData &&  formData.formview==="table" ?
                                                                                <div> <div className="col float-right my-1 add-btn-bg">
                                                                                    <span className='cursor-pointer' onClick={()=>this.openFormPopup(formData)}>
                                                                                        <span className="float-right c-w cursor-pointer">Add</span>
                                                                                        <span className="add-btn"><i className="material-icons">add</i></span>
                                                                                    </span>
                                                                                </div>
                                                                                <TableView  tableData={state.inputs}/> </div>
                                                                                : this.renderForm(formData)
                                                                            )
                                                                        }
                                                                    </div>
                                                                //)}
                                                           // </Droppable>
                                                       // </DragDropContext>
                                                    )
                                                }) :
                                                this.state.showForm &&
                                                <div className="input-group mt-2 col-md-6 col-lg-6 pl-0" >
                                                     {/* <span className='pr-2 col-md-4 pl-0'>Custom Domain</span>
                                                      {this.renderCustomDomain()} */}

                                                </div>
                                            }
                                            {/* <div>
                                                <button onClick={this.onSaveData}>
                                                    Save
                                                </button>
                                                <button className='ml-3'>
                                                    Edit
                                                </button>
                                            </div>   */}


   { this.state.inputs && this.state.inputs.length > 0 && this.state.inputs[0].name!=="CO" && this.state.inputs[0]["formview"]!=="table" && <div className="row m-0 d-flex flex-row py-2">
                                                <div className="form-group col-md-12 p-0">
                                                    <label>Notes</label>
                                                    <textarea className="form-control" rows="3"></textarea>
                                                </div>
                                            </div> }

                                    </div>
                            </div>
                    </div>
                </section>
            </div>
        );
    }

}


function mapDispatchToProps(dispatch) {
    return {
        getForm   : bindActionCreators(getFormAction, dispatch),
        modalAction : bindActionCreators(modalAction,dispatch)
    };
  }


  function mapStateToProps(state){
    return {
        FormJson : state.getFormReducer,
        modal : state.modal
    }
  }


export default connect(mapStateToProps,mapDispatchToProps)(ElementSetup);

