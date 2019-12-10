/**
* Copyright (c) 2018
* @summary TThis file is use under  Setup -> Protocol setup -> element Setup
           Open modal when user click on sub element button after select perticular domain element.
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React,{Component} from 'react';
import { connect } from 'react-redux';
import Modal from '../modaldialog/modal';
import ReactSuperSelect from 'react-super-select';
import '../../../node_modules/react-super-select/lib/react-super-select.css';
import ApiService from '../../api';
import { NotificationManager } from 'react-notifications';
import common from '../../common/common';


class SubElementModal extends Component{
    constructor(props){
        super(props);
        this.state = {
           subElementformData : {
                formLabel :'',
                answerType:'',
                fieldName:'',
                fieldCdash:'',
                answerCdash:''
           },
           formLabel:'',
           AnswerTypeList : [
              {
                name : 'CheckList',
                value:'checkbox'
              },
              {
                name : 'Date',
                value:'date'
              },
              {
                name : 'DropDown',
                value:'dropdown'
              },
              {
                name : 'Drop Down Controlled Term',
                value:'dropdownCT',
                isDefaultSlect : true
              },
              {
                name : 'File Upload',
                value:'file'
              },
              {
                name : 'Free Text',
                value:'textbox'
              },
              {
                name : 'Free Text Long',
                value:'textarea'
              },
              {
                name : 'MultiSelect',
                value:'multiselect'
              },
              {
                name : 'Multi Select Controlled Term',
                value:'multiselectCT',
                isDefaultSlect : true
              },
               {
                name : 'Reminder',
                value:'reminder'
              },

              {
                name : 'Text Block Long',
                value:'textBlockLong'
              },
              {
                name : 'Text Block',
                value:'label'
                 },
              {
                name : 'Toggle',
                value:'radio'
              }
           ],
           showSubelementHtml : false,
           initialCounter : 0,
           subElementformDataList : [],
           whoCdashList: [],
           whenCdashList: [],
           controlledTermList : [],
           selectedTerm : ''
        }

    }

    validateSubElementData(){
        let isValid = false;
        let validationArry = [];
        this.state.subElementformDataList.length && this.state.subElementformDataList.forEach((data,index)=>{
            if(data.answerType.value && data.answerType.value != 'select' && data.fieldName.value){
                if(data.answerType.value != 'label' && data.answerType.value != 'dropdown' && data.answerType.value != 'multiselect' && data.answerType.value != 'multiselectCT' && data.answerType.value != 'dropdownCT'){
                    if(data.answerType.hasOwnProperty('cdashMappingList') && data.answerType.cdashMappingList.length > 0 ){
                        if(data.answerType.hasOwnProperty('codeDefinationList') && data.answerType.codeDefinationList.length > 0){
                            validationArry.push(true);
                        }else{
                            validationArry.push(false);
                        }
                    }else{
                        validationArry.push(true);
                    }
                }else{
                    if(data.answerType.value === 'multiselectCT' || data.answerType.value === 'dropdownCT'){
                        if(this.state.selectedTerm){
                            validationArry.push(true);
                        }else{
                            validationArry.push(false);
                        }
                    }else{
                        if(data.answerType.labelVal){
                            validationArry.push(true);
                        }else{
                            validationArry.push(false);
                        }
                    }
                }
            }else{
                validationArry.push(false);
            }
        });
        if(validationArry && validationArry.indexOf(false)>-1){
            isValid = false
        }
        else{
            isValid = true
        }
        return isValid;
    }

    onChangeToggleValue = (option,index)=>{
        if(option && index > -1){
            if(option.name === 'CLINSIG'){
                this.state.subElementformDataList[index].answerType.codeDefinationList = [
                    {
                        "name": "No Yes Response",
                        "codelist_defination_id": 9,
                        "codeListOid": "",
                        "inputType": 'radio',
                        "codedValue": 'CS',
                        "decode": 'CS',
                        "term_ref": "",
                        "extensible": "",
                        "language": "",
                        "sequence": 1
                    },
                    {
                        "name": "No Yes Response",
                        "codelist_defination_id": 10,
                        "codeListOid": "",
                        "inputType": 'radio',
                        "codedValue": 'NCS',
                        "decode": 'NCS',
                        "term_ref": "",
                        "extensible": "",
                        "language": "",
                        "sequence": 2

                    }
                ]
            }else if(option.name === 'NORMABNM'){
              this.state.subElementformDataList[index].answerType.codeDefinationList = [
                        {
                            "name": "No Yes Response",
                            "codelist_defination_id": 9,
                            "codeListOid": "",
                            "inputType": 'radio',
                            "codedValue": 'NORMAL',
                            "decode": 'NORMAL',
                            "term_ref": "",
                            "extensible": "",
                            "language": "",
                            "sequence": 1
                        },
                        {
                            "name": "No Yes Response",
                            "codelist_defination_id": 10,
                            "codeListOid": "",
                            "inputType": 'radio',
                            "codedValue": 'ABNORMAL',
                            "decode": 'ABNORMAL',
                            "term_ref": "",
                            "extensible": "",
                            "language": "",
                            "sequence": 2
                        }
                    ]
            } else if(option.name === 'NY'){
                this.state.subElementformDataList[index].answerType.codeDefinationList = [
                    {
                        "name": "No Yes Response",
                        "codelist_defination_id": 9,
                        "codeListOid": "",
                        "inputType": 'radio',
                        "codedValue": 'YES',
                        "decode": 'YES',
                        "term_ref": "",
                        "extensible": "",
                        "language": "",
                        "sequence": 1
                    },
                    {
                        "name": "No Yes Response",
                        "codelist_defination_id": 10,
                        "codeListOid": "",
                        "inputType": 'radio',
                        "codedValue": 'No',
                        "decode": 'No',
                        "term_ref": "",
                        "extensible": "",
                        "language": "",
                        "sequence": 2
                    }
                ]
            }
        }
    }

    addSubElement = () =>{
        if(this.validateSubElementData()){
            this.props.onSave && this.props.onSave(this.state);
        }else{
            common.clearNotification();
            NotificationManager.error('Please fill the required fields');
        }
    }

    onClose = ()=>{
        this.props.hideModal && this.props.hideModal();
    }

    componentDidMount(){
        const tempObj = {
            fieldName : {
                value : ''
            },
            fieldCdash :{
                value : ''
            },
            answerType : {
                value : ''
            },
            answerCdash:{
                value : ''
            }
        }
        ApiService.getCdashMapping().then((res) => {
            res && res.data.length && res.data.forEach((d) => {
                d.name = d.cdashigVariableLabel
            })
            this.setState({ whoCdashList: res.data, whenCdashList: res.data })
        }, (error) => {
            common.clearNotification();
            NotificationManager.error('something went wrong');
        });
        let tempArray = [];
        tempArray.push(tempObj);
        this.setState({ subElementformDataList : tempArray });
    }

    onChangeTermList = (option,pindex,updatedType)=>{
        let controlCodeDefinationList = [];
        let tempctMenu = [];
        if(option){
            option.ctMenu &&  option.ctMenu.forEach((item,index)=>{
                let ControlItem =   {
                    "codeId": 0,
                    "codeOid": "",
                    "codedValue": item.ctValue,
                    "decode": item.ctValue,
                    "name": item.ctValue,
                    "inputType": updatedType,
                    "sequence": index,
                    "language": null
                }
                controlCodeDefinationList.push(ControlItem);
                tempctMenu.push(item.ctValue);
            });
            let prevSt = this.state.subElementformDataList;
            prevSt[pindex]['answerType']['codeDefinationList'] = controlCodeDefinationList;
            prevSt[pindex]['answerType']['controlledTermValues'] = tempctMenu && tempctMenu.join(',');
            this.setState( {
                selectedTerm : option.name ,
                subElementformDataList : prevSt
            })
        }
    }

    onChangeDropDown = (option,type,index)=>{
        if(option && option.name!="Select"){
            const prevSt = this.state.subElementformDataList;
           if(type === 'who_cdash'){
            this.state.subElementformDataList.map((item)=>{
                prevSt[index].fieldCdash.value = option.name
            });
            }else if(type === 'when_cdash'){
                this.state.subElementformDataList.map((item)=>{
                    prevSt[index].answerCdash.value = option.name
                });
            }
            this.setState({ subElementformDataList : prevSt });
        }
    }

    onChangeText = (e,type,index)=>{
        const prevSt = this.state.subElementformDataList;
            prevSt[index][`${type}`].value = e.target.value
            if(type === 'answerType'){
                if(prevSt[index][`${type}`] && (prevSt[index][`${type}`].value == 'label' || prevSt[index][`${type}`].value === 'dropdown' || prevSt[index][`${type}`].value === 'multiselect' ||  prevSt[index][`${type}`].value === 'multiselectCT' ||  prevSt[index][`${type}`].value === 'dropdownCT')){
                    if(!prevSt[index][`${type}`].hasOwnProperty('labelVal')){
                        prevSt[index][`${type}`].labelVal = '';
                    }
                    if(prevSt[index][`${type}`].value === 'multiselectCT' || prevSt[index][`${type}`].value === 'dropdownCT'){
                        ApiService.getContollTermList().then((res) => {
                            prevSt[index][`${type}`].isDefaultSlect = true;
                            prevSt[index][`${type}`].controlledTermValues = ''
                            if(res && res.data && res.data.response && res.data.response.length > 0){
                                res.data.response.forEach((item,index)=>{
                                    item['id'] = index;
                                    item['name'] = item.ctName;
                                 });
                                this.setState({
                                    controlledTermList : res.data.response
                                },()=>{});
                            }
                        }, (error) => {
                            common.clearNotification();
                            NotificationManager.error('something went wrong');
                        });
                    }
                }else{
                    delete prevSt[index][`${type}`]['labelVal'];
                }
                if(prevSt[index][`${type}`] &&prevSt[index][`${type}`].value === 'radio'){
                    if(!prevSt[index][`${type}`].hasOwnProperty('cdashMappingList')){
                        prevSt[index][`${type}`].cdashMappingList = [
                            {
                                "id": 1,
                                "name" : 'CLINSIG',
                                "codelist_defination_id" : 9
                            },
                            {
                                "id": 2,
                                "name" : 'NORMABNM',
                                "codelist_defination_id" : 10
                            },
                            {
                                "id": 3,
                                "name" : 'NY',
                                "codelist_defination_id" : 11
                            }
                        ]
                    }
                }else{
                    delete  prevSt[index][`${type}`]['cdashMappingList'];
                }
                if(prevSt[index][`${type}`] && prevSt[index][`${type}`].value === 'checkbox'){
                    let checkListObj = {
                        codeId : 0,
                        codeOid : "",
                        codedValue :  prevSt[index][`${type}`].value ,
                        decode : prevSt[index][`${type}`].value  ,
                        inputType : prevSt[index][`${type}`].value,
                        language : null,
                        name : prevSt[index][`${type}`].value ,
                        sequence :1
                    }
                    prevSt[index]['answerType']['codeDefinationList'] = [checkListObj];
                }else{
                    delete  prevSt[index][`${type}`]['codeDefinationList'];
                }
            }
        this.setState({subElementformDataList : prevSt });
    }

    handleSublementHtml = ()=>{
        let tempObj =  {
            fieldName : {
                value : ''
            },
            fieldCdash :{
                value : ''
            },
            answerType : {
                value : ''
            },
            answerCdash:{
                value : ''
            },
            showCancel: true
        }
        let prevSt = this.state.subElementformDataList;
        prevSt.push(tempObj);
        this.setState({ subElementformDataList : prevSt });
    }

    onChangeLabel = (e)=>{
        this.setState({formLabel : e.target.value})
    }

    closeSubElement = (index)=>{
        let prevSt = this.state.subElementformDataList;
        if(index > -1){
            prevSt && prevSt.splice(index, 1);
        }
        this.setState({ subElementformDataList : prevSt});
    }

    onChangeSetLabel = (e,type,index,answerTypeVal) =>{
        try{
            const prevSt = this.state.subElementformDataList;
            prevSt[index][`${type}`].labelVal = e.target.value
            if(prevSt[index][`${type}`]['value'] === 'dropdown'  || prevSt[index][`${type}`]['value'] === 'multiselect'){
                let dropdownOptionArray = e.target.value && e.target.value.split(',');
                prevSt[index][`${type}`].labelVal = dropdownOptionArray;
                let codeDefinationForDropdown = [];
                dropdownOptionArray && typeof dropdownOptionArray === 'object' &&  dropdownOptionArray.forEach((item)=>{
                    if(item){
                        let dropDownObj = {
                            codeId : 0,
                            codeOid : "",
                            codedValue : item ,
                            decode : item ,
                            inputType : prevSt[index][`${type}`]['value'],
                            language : null,
                            name : item,
                            sequence :1
                        }
                        codeDefinationForDropdown.push(dropDownObj);
                    }
                })
                prevSt[index]['answerType']['codeDefinationList'] = codeDefinationForDropdown;
            }
            this.setState({subElementformDataList : prevSt});
        }catch(e){
            console.log(e);
        }

    }

    onChangeRadioInput = (event,type,pindex,index)=>{
        const prevSt = this.state.subElementformDataList;
        prevSt[pindex][`${type}`].codeDefinationList[index].codedValue = event.target.value;
        prevSt[pindex][`${type}`].codeDefinationList[index].inputType = 'radio';
        this.setState({subElementformDataList : prevSt});
    }

    render({props,state} = this){
        let { afterClose, hideModal, onSave } = props;
        return (
            <Modal onClose={this.onClose} className={props.className}>
                <div className="modal-header border-bottom-p mx-4 p-0 py-3">
                    <h5 className="modal-title c-p" id="exampleModalLabel"> Add Item </h5>
                    <button type="button" className="close c-p" data-dismiss="modal" aria-label="Close" onClick={this.onClose}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body px-4 text-left pt-1">
                    <div className="my-3">
                        <div className="form-group row flable">
                            <label htmlFor="staticEmail" className="col-sm-3 col-form-label text-right">Form Label</label>
                            <div className="col-sm-9 p-0">
                                <input className='form-control col-sm-5 p-0' type='text' name='formLabel' value={state.formLabel} onChange={this.onChangeLabel}/>
                            </div>
                        </div>
                        <div className='popScroll'>
                            {this.state.subElementformDataList.map((subEle,pindex)=>{
                                    return (
                                        <div className='border pt-3 position-relative mb-2' key={pindex}>
                                            { subEle.showCancel ? <button type="button" className="close c-p label-close" onClick={()=>this.closeSubElement(pindex)}><span>×</span></button>
                                            :  <button className='btn text-white form-addition-btn sub-ele-repeat-btn cursor-pointer' onClick={this.handleSublementHtml}>
                                                <span className='plus-sign cursor-pointer'>+</span></button>
                                            }
                                            <div className="form-group row">
                                                <label htmlFor="staticEmail" className="col-sm-3 col-form-label text-right">Answer Type</label>
                                                <div className="col-sm-9 p-0">
                                                    <select className="form-control col-sm-5 p-0 reqfeild" name='answerType' value={subEle.answerType.value} onChange={(event)=>this.onChangeText(event,'answerType',pindex)} >
                                                        <option value='select'> Select </option>
                                                        {
                                                            this.state.AnswerTypeList.map((item,index)=>{
                                                                return   <option key={index} value={item.value} >{item.name}</option>
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="" id='freeText'>
                                                { subEle.answerType.value !== 'textBlockLong' && <div className="form-group row">
                                                    <label htmlFor="staticEmail" className="col-sm-3 col-form-label text-right">Field Name</label>
                                                    <div className="col-sm-9 p-0">
                                                        <input className='form-control col-sm-5 p-0 reqfeild' name='fieldName' type='text' value={subEle.fieldName.value}
                                                         onChange={(event)=>this.onChangeText(event,'fieldName',pindex)} />
                                                    </div>
                                                </div>
                                                }
                                                {subEle.answerType.value == 'textBlockLong' && <div className="form-group row">
                                                    <label htmlFor="staticEmail" className="col-sm-3 col-form-label text-right">Field Name</label>
                                                    <div className="col-sm-9 p-0">
                                                        {/* <input className='form-control col-sm-5 p-0 reqfeild' name='fieldName' type='text' value={subEle.fieldName.value}
                                                         onChange={(event)=>this.onChangeText(event,'fieldName',pindex)} /> */}
                                                        <textarea row='4' className='form-control col-sm-8 p-0 reqfeild' name='fieldName'  value={subEle.fieldName.value}
                                                        onChange={(event)=>this.onChangeText(event,'fieldName',pindex)}>
                                                        </textarea>
                                                    </div>
                                                </div> }
                                                { subEle.answerType.hasOwnProperty('labelVal')  && ( subEle.answerType.value === 'label') && <div className="form-group row">
                                                    <label htmlFor="staticEmail" className="col-sm-3 col-form-label text-right">Field Value</label>
                                                    <div className="col-sm-9 p-0">
                                                        <textarea row='4' className='form-control col-sm-8 p-0 reqfeild' name='fieldName' type='text' value={subEle.answerType.labelVal} onChange={(event)=>this.onChangeSetLabel(event,'answerType',pindex,subEle.answerType && subEle.answerType.value)} >
                                                        </textarea>
                                                    </div>
                                                </div>
                                                }
                                                { subEle.answerType.hasOwnProperty('labelVal')  && ( subEle.answerType.value === 'dropdown' || subEle.answerType.value === 'multiselect' ) && <div className="form-group row">
                                                    <label htmlFor="staticEmail" className="col-sm-3 col-form-label text-right">Field Value</label>
                                                    <div className="col-sm-9 p-0">
                                                        <textarea row='4' className='form-control col-sm-8 p-0 reqfeild' name='fieldName' type='text' value={subEle.answerType.labelVal} onChange={(event)=>this.onChangeSetLabel(event,'answerType',pindex,subEle.answerType && subEle.answerType.value)} >
                                                        </textarea>
                                                        <div className='fvalMsg'> * Please enter comma seperated value for dropdown options</div>
                                                    </div>
                                                </div>
                                                }
                                                {subEle.answerType.hasOwnProperty('labelVal') && ( subEle.answerType.value === 'multiselectCT'  || subEle.answerType.value === 'dropdownCT') && subEle.answerType.isDefaultSlect &&
                                                    <div className="form-group row custred">
                                                        <label htmlFor="staticEmail" className="col-sm-3 col-form-label text-right">Term List</label>
                                                        <div className="col-sm-9 p-0">
                                                            <ReactSuperSelect
                                                                placeholder="Select"
                                                                clearSearchOnSelection={true}
                                                                dataSource={this.state.controlledTermList}
                                                                onChange={(option)=>this.onChangeTermList(option,pindex,subEle.answerType.value === 'multiselectCT' ? 'multiselect' : 'dropdown')}
                                                                searchable={true}
                                                                keepOpenOnSelection={false}
                                                                closeOnSelectedOptionClick={true}
                                                                deselectOnSelectedOptionClick={false}
                                                                customClass='select-container col-sm-5 p-0'
                                                                customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                                                clearable = {false}
                                                            />
                                                        </div>
                                                    </div>
                                                }
                                                { subEle.answerType.hasOwnProperty('labelVal')  && ( subEle.answerType.value === 'multiselectCT'  || subEle.answerType.value === 'dropdownCT') && subEle.answerType.isDefaultSlect && <div className="form-group row">
                                                    <label htmlFor="staticEmail" className="col-sm-3 col-form-label text-right">Term Value</label>
                                                    <div className="col-sm-9 p-0">
                                                        <div className='controllTerm'>
                                                                { subEle.answerType.controlledTermValues}
                                                        </div>
                                                    </div>
                                                </div>
                                                }
                                                { subEle.answerType.cdashMappingList && subEle.answerType.cdashMappingList.length > 0 &&
                                                    <div className="form-group row custred">
                                                        <label htmlFor="staticEmail" className="col-sm-3 col-form-label text-right">Value</label>
                                                        <div className="col-sm-9 p-0">
                                                            <ReactSuperSelect
                                                                placeholder="Select"
                                                                clearSearchOnSelection={true}
                                                                dataSource={subEle.answerType.cdashMappingList}
                                                                onChange={(option)=>this.onChangeToggleValue(option,pindex)}
                                                                searchable={true}
                                                                keepOpenOnSelection={false}
                                                                closeOnSelectedOptionClick={true}
                                                                deselectOnSelectedOptionClick={false}
                                                                customClass='select-container col-sm-5 p-0'
                                                                customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                                                clearable = {false}
                                                            />
                                                        </div>
                                                    </div>
                                                }
                                                <div className="form-group row">
                                                    <label htmlFor="staticEmail" className="col-sm-3 pt-2 col-form-label text-right">Field CDASH</label>
                                                    <div className="col-sm-9 p-0">
                                                        <ReactSuperSelect
                                                            placeholder="Select"
                                                            clearSearchOnSelection={true}
                                                            dataSource={this.state.whoCdashList ? this.state.whoCdashList : [] }
                                                            onChange={(option)=>this.onChangeDropDown(option,'who_cdash',pindex)}
                                                            searchable={true}
                                                            keepOpenOnSelection={false}
                                                            closeOnSelectedOptionClick={true}
                                                            deselectOnSelectedOptionClick={false}
                                                            customClass='select-container col-sm-5 p-0'
                                                            customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                                            clearable = {false}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="staticEmail" className="col-sm-3 col-form-label text-right pt-2">Answer CDASH</label>
                                                    <div className="col-sm-9 p-0">
                                                        <ReactSuperSelect
                                                            placeholder="Select"
                                                            clearSearchOnSelection={true}
                                                            dataSource={this.state.whoCdashList ? this.state.whoCdashList : [] }
                                                            onChange={(option)=>this.onChangeDropDown(option,'when_cdash',pindex)}
                                                            searchable={true}
                                                            keepOpenOnSelection={false}
                                                            closeOnSelectedOptionClick={true}
                                                            deselectOnSelectedOptionClick={false}
                                                            customClass='select-container col-sm-5 p-0'
                                                            customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                                            clearable = {false}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="modal-footer pr-0 pt-0">
                    <button type="button" className="btn text-white align-bottom bg-p mr-2" onClick={this.addSubElement}>Add</button>
                    <button type="button" className="btn text-white align-bottom bg-p mr-4" onClick={this.onClose}>Cancel</button>
                </div>
            </Modal>
        );
    }

}

export default connect(null, null )(SubElementModal);