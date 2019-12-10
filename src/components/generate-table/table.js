/**
* Copyright (c) 2018
* @summary Application Domain Element Table Structure
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React,{Component} from 'react';
import DateTime from 'react-datetime';
import GenerateHTML from '../generateHtml/generatehtml';
import common from '../../common/common';
import { MODAL_TYPE_ELEMENT_FORM } from '../../constants/modalTypes' ;
import * as modalAction from '../../actions/modalActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as getFormAction from '../../actions/getDynamicDomainFormAction';



const  customClassObject = {
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


class DomainTable  extends Component{

    constructor(props) {
        super(props);
        this.state = {
            showPreviewFormPopUpData : false
        }
        this.predefinedRows = [];
    }

    renderThead(){
        return this.props.tableData && this.props.tableData[0]["columnList"].map( (vs,ix)=>{
            return  <th key={ix}>{vs}</th>
        })
    }

    renderTbody(){
        var trList = []
        this.props.tableData && this.props.tableData[0]["formlabel"][0]["itemDefinationList"].forEach( (item,idx)=>{
            trList.push(<td key={idx}>
            {/* <GenerateHTML  data={item}  /> */}
            </td>)
        })
        return  <tr key={Math.random()*1000+90}>{trList}</tr>
    }


    openFormPopup = (formData) => {
        //this.setState({showPreviewFormPopUpData : true });
        //this.renderForm(formData,'fromPopUp');
        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_ELEMENT_FORM, {
            onSave: (data) => {

            },
            hideModal: () => {
                this.props.modalAction.hideModal();
            },
            className: 'element_setup_modal',
            renderFormData: this.renderForm(this.props),
            header: this.state.domainElement
        });
    }

    dynamicClassesForFieldName = (item)=>{
        if(item.inputType == 'textBlockLong'){
            return 'pr-2 col-md-12 pl-0 overflow-ellipsis-multiple-line'
        }
        return 'pr-2 col-md-4 pl-0 overflow-ellipsis-multiple-line'
    }

    renderForm = (props)=>{
        return ( <div className='row col-xs-12 col-md-12 element-scroll'>
            <div className='form-group pt-2 row col-xs-12 col-md-12 position-relative ml-0 mr-0'>
                {
                    props.tableData && props.tableData[0].labelList && common.sortByOrder(props.tableData[0].labelList,'ASC').map((item,idx)=>{
                        return (
                            item.isChecked && item.isChecked===true && <div key={idx} className={this.getFormElementClasses(props.tableData[0],item)} >
                                { (item.inputType == 'reminder' || ( item.hasOwnProperty('codeDefinationList') && typeof item.codeDefinationList === 'object' &&
                                item.codeDefinationList.length !== 0  &&  item.codeDefinationList[0].inputType == 'checkbox') ) ? '' : <label className={this.dynamicClassesForFieldName(item)}>{  item.updatedQuestion ?  item.updatedQuestion : item.name }</label> }
                                <GenerateHTML labelText={item.label}  data={item} formId={props.tableData[0].formId} formLabelId={props.tableData[0].formLableId}
                                    customClassObject={customClassObject}
                                    itemDefIndex={idx}
                                    fromWhichPage='popUp'
                                />
                            </div>
                        )
                    })
                }
            </div>
        </div>
        )
    }
    getFormElementClasses = (formData, itm) => {
        let cls = `input-group mt-0 mb-3 col-md-12 col-lg-12 pl-0 ${formData.name}-form-grp`;
        // if (formData.name === 'CO' && itm.name === "Notes" && itm.inputType === "textarea") {
        //     cls = `form-group mt-0 col-md-12 col-lg-12 pl-0 ${formData.name}-form-grp`;
        // }
        return cls;
    }

    getFormatedSubelementName = (name) => {
        let numbers = name && name.match(/\d+/g)
        if (numbers) {
            let updatedName = name && `${name.split(numbers && numbers[0])[0]} ${numbers && numbers[0]}`;
            return updatedName
        }
        return name;
    }

    //get column value
    getColValues = ()=>{
        if(typeof(this.props.predefinedTableData.predefinedColumnValues)=="string"){
             return this.props.predefinedTableData.predefinedColumnValues.split(",")
        }
        else if(typeof(this.props.predefinedTableData.predefinedColumnValues)=="object"){
            return this.props.predefinedTableData.predefinedColumnValues
        }
        else{
 return []
        }
    }

    componentDidMount(){
        if(!this.props.userEnd){
            this.setState({showPreviewFormPopUpData : true });
        }
        if(this.props.displayElementIconTableType && this.props.predefinedTableData && this.props.predefinedTableData.predefinedColumnName){
            this.props.tableData && this.props.tableData[0]["columnList"].unshift(this.props.predefinedTableData.predefinedColumnName);
            this.predefinedRows = this.getColValues() //this.props.predefinedTableData.predefinedColumnValues
        }
    }

    componentWillUnmount(){
        if(this.props.displayElementIconTableType && this.props.predefinedTableData && this.props.predefinedTableData.predefinedColumnName){
            this.props.tableData && this.props.tableData[0]["columnList"].shift();
        }
    }


    render({state,props}=this){
        return(
            <div className="row col-12 p-0 m-0 table-view">
                {this.props.userEnd && <div className="col float-right my-1 add-btn-bg">
                    <span className='cursor-pointer' onClick={()=>this.openFormPopup()}>
                        <span className="float-right c-w cursor-pointer">Add</span>
                        <span className="add-btn"><i className="material-icons">add</i></span>
                    </span>
                </div>}
                {this.state.showPreviewFormPopUpData && <h5 className="subtitle mt-2 col-md-12">Table View </h5>}
                <div className='row col-12 p-0 m-0 previewTable-scroll'>
                    <table className="table table-responsive-lg border activity-table predefined-table mb-2">
                        <thead>
                            <tr valign="middle">
                             {this.renderThead()}
                            </tr>
                        </thead>
                        {props.displayElementIconTableType  ? <tbody className='text-center'>
                            {this.predefinedRows && this.predefinedRows.map((item,index)=>{
                                return <tr key={index}>
                                        <td>{item}</td>
                                        <td  colSpan={this.props.tableData[0]["columnList"].reduce((ac,currentV)=>{return ac+1},0 )}></td>
                                    </tr>
                            })}
                            </tbody>
                            :  <tbody className='text-center'><tr>
                                    <td colSpan={this.props.tableData[0]["columnList"].reduce((ac,currentV)=>{return ac+1},0 )} >No record found.</td>
                                </tr> </tbody>
                        }
                    </table>
                </div>
                { this.state.showPreviewFormPopUpData && <h5 className="subtitle mt-2 col-md-12">Form Popup View (+Add) : </h5> }
                { this.state.showPreviewFormPopUpData && this.renderForm(this.props) }
            </div>
        )
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


export default connect(mapStateToProps, mapDispatchToProps)(DomainTable);