/**
* Copyright (c) 2018
* @summary This Component Decide Which Html template render
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React,{Component} from 'react';
import GenerateHtml from './generatehtml';
import RadioTemplate from './radioTemplate';
import TextTemplate from './textTemplate';
import DropDownTemplate from './dropdownTemplate'
import DateTemplate from './dateTemplate';
import TextareaTemplate from "./textAreaTemplate";
import TimeTemplate from './timeTemplate';
import CheckBoxTemplate from './checkboxTemplate';
import LabelTemplate from './labelTemplate'
import FileTemplate from './fileTemplate';
import ReminderTemplate from './reminderTemplate';

class App extends Component{

     getElementByName(data,type,props){
        switch(type){
            case 'textbox':
                return (<TextTemplate templateData={data}
                            onChangeTextHandler={props.onChangeTextHandler}
                            formId={props.formId}
                            formLabelId={props.formLabelId}
                            itemId={props.itemId}
                            customClassObject = { props.customClassObject && props.customClassObject['textbox']}

                        />)
                break;
            case 'dropdown':
                return (<DropDownTemplate templateData={data}
                    fullData={props.data}
                    formId={props.formId}
                    formLabelId={props.formLabelId}
                    itemId={props.itemId}
                    onChangeDropDownHandler={props.onChangeDropDownHandler}
                    customClassObject = { props.customClassObject && props.customClassObject['dropdown']}
                    />)
                break;
            case 'date':
                return (<DateTemplate templateData={data}
                         onDateChangeHandler={props.onDateChangeHandler}
                         formId={props.formId}
                         formLabelId={props.formLabelId}
                         itemId={props.itemId}
                         customClassObject = { props.customClassObject && props.customClassObject['date']}
                         />)
                break;
            case 'radio':
                return (<RadioTemplate templateData={data}
                            onChangeRadioHandler={props.onChangeRadioHandler}
                            fullData={props.data}
                            formId={props.formId}
                            formLabelId={props.formLabelId}
                            labelText = {props.labelText}
                            itemId={props.itemId}
                            customClassObject = { props.customClassObject && props.customClassObject['radio']}
                        />)
                break;
            case 'textarea':
                return (<TextareaTemplate
                            templateData={data}
                            onChangeTextHandler={props.onChangeTextHandler}
                            formId={props.formId}
                            formLabelId={props.formLabelId}
                            itemId={props.itemId}
                            customClassObject = { props.customClassObject && props.customClassObject['textarea']}
                        />)
                break;
            case 'time':
                return (<TimeTemplate templateData={data}
                            onchangeTimeHandler={props.onchangeTimeHandler}
                            formId={props.formId}
                            formLabelId={props.formLabelId}
                            itemId={props.itemId}
                            customClassObject = { props.customClassObject && props.customClassObject['time']}
                        />)
                break;
            case 'checkbox':
                return (<CheckBoxTemplate templateData={data}
                            onchangeCheckboxHandler={props.onchangeCheckboxHandler}
                            fullData={props.data}
                            formId={props.formId}
                            formLabelId={props.formLabelId}
                            itemId={props.itemId}
                            customClassObject = { props.customClassObject && props.customClassObject['checkbox']}
                        />)
                break;
            case 'label':
                return (<LabelTemplate templateData={data}
                            formId={props.formId}
                            formLabelId={props.formLabelId}
                            itemId={props.itemId}
                            customClassObject = { props.customClassObject && props.customClassObject['label']}
                        />)
                break;
            case 'file':
                return (<FileTemplate templateData={data}
                            onChangeFileHandler={props.onChangeFileHandler}
                            onCloseSelectedFile={props.onCloseSelectedFile}
                            formId={props.formId}
                            fullData={props.data}
                            formLabelId={props.formLabelId}
                            itemId={props.itemId}
                            customClassObject = { props.customClassObject && props.customClassObject['file']}
                            itemDefIndex={props.itemDefIndex}
                            deleteFile={props.deleteFile}
                        />)
                break;
            case 'reminder':
                return (<ReminderTemplate templateData={data}
                            onChangeFileHandler={props.onChangeFileHandler}
                            formId={props.formId}
                            formLabelId={props.formLabelId}
                            itemId={props.itemId}
                            customClassObject = { props.customClassObject && props.customClassObject['reminder']}
                            itemDefIndex={props.itemDefIndex}
                        />)
                break;
            case 'multiselect':
                return (<DropDownTemplate templateData={data}
                        fullData={props.data}
                        formId={props.formId}
                        formLabelId={props.formLabelId}
                        itemId={props.itemId}
                        onChangeDropDownHandler={props.onChangeDropDownHandler}
                        customClassObject = { props.customClassObject && props.customClassObject['multiselect']}
                    />)
                break;
            default:
                return ''
        }
     }

    renderElement(ele,props){
        var  eleList = [];
        if(ele.hasOwnProperty("inputType") && ele["inputType"]!="" && ele['inputType'] != 'checkbox'){
            eleList.push(this.getElementByName(ele,ele.inputType,props));
        }
        if(ele.hasOwnProperty("measurementDefinitionList") && Object.keys(ele.measurementDefinitionList).length>0){
            eleList.push(this.getElementByName(ele.measurementDefinitionList,ele.measurementDefinitionList && ele.measurementDefinitionList.length > 0 && ele.measurementDefinitionList[0].inputType,props))
        }
        if(ele.hasOwnProperty("codeDefinationList") && Object.keys(ele.codeDefinationList).length>0){
            eleList.push(this.getElementByName(ele.codeDefinationList,ele.codeDefinationList && ele.codeDefinationList[0].inputType,props));
        }
        return eleList;
    }


    getRenderElementClasses(dt,page){
        if(dt.name === "Notes" ||  dt.inputType === "textarea" || dt.inputType === "reminder"){
            return "col-md-6 p-0"
        }
        if(page && (page === 'encounterDetail' || page === 'fromNewElementSetup' || page === 'popUp')){// || page === 'popUp'
            if(dt.hasOwnProperty('measurementDefinitionList') && dt.measurementDefinitionList.length>0){
                return "col-md-4 p-0"
            }
            else if(dt.inputType === "file"){
                return "col-md-3 p-0"
            }
        }
        if(dt.inputType === 'textBlockLong'){
            return ''
        }
        return "col-md-3 p-0"
    }


    render({props,state} = this){
        const listRl = this.renderElement(this.props.data,props);
        return(
            <div className={this.getRenderElementClasses(props.data,props.fromWhichPage)} style={{'display' : 'inherit' }}>
                {  listRl.map( (v,idx)=>{
                        return v && <div key={idx}
                        className={props.data.hasOwnProperty('measurementDefinitionList')&& props.data.measurementDefinitionList.length > 0 ?
                        'pr-1 col-md-6 pl-0':'pr-1 col-md-12 pl-0' }>{v}
                                    { this.props.data && this.props.data.measurementUnitDefinition && this.props.data.measurementUnitDefinition.unit && <span className='ml-2'> {this.props.data.measurementUnitDefinition.unit} </span> }
                                </div>
                    })
                }
            </div>
        );
    }
}

export default App;
