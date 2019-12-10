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
import ReactTable from "react-table";
import 'react-table/react-table.css';



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

var compInst = null;
class UserFormTable  extends Component{

    constructor(props) {
        super(props);
        this.state = {
            showPreviewFormPopUpData : false,
            hasEdited:false,
            addFormButton:true,
            additionNotes:""
        }
        compInst  = this;
    }

    renderThead(){
        let thList = [];
        return this.props && this.props.tableHeaderColumn && this.props.tableHeaderColumn.columnList && this.props.tableHeaderColumn.columnList.map( (vs,ix)=>{
            return  <th style={{textAlign:"center"} } key={ix}>{vs}</th>
        })
    }

    getEditFormDetail(id){
this.setState({hasEdited:true,showPreviewFormPopUpData:false,addFormButton:false}) //hasEdited
this.props.onRowClickHandeler(id);
    }

    onChangeCOVAL_Handler =(e)=>{

        //additionNotes
        this.setState({additionNotes:e.target.value});
    }

    //this.props.tableHeaderColumn.tableData
    renderTbody(){
         var trList = []
         this.props &&  this.props.tableHeaderColumn && this.props.tableHeaderColumn.tableData.length && this.props.tableHeaderColumn.tableData.forEach( (item,idx)=>{
            var tdList = []
            this.props.tableHeaderColumn && this.props.tableHeaderColumn.columnList.length &&  this.props.tableHeaderColumn.columnList.forEach( (dt,Idx)=>{

               tdList.push(<td key={Math.random()*1000+90} onClick={this.getEditFormDetail.bind(this,item.frmGroupIdentifier)} >
                    {item[dt] ? item[dt] : "--"}
                   </td>)
          } )
            trList.push(<tr  key={Math.random()*1000+90}>{tdList}</tr>)
        } )
        return trList;
    }


    openFormPopup = (formData) => {
        //this.setState({showPreviewFormPopUpData : true });
        //this.renderForm(formData,'fromPopUp');
        if(!this.props.userEnd ){

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
        }else{
             this.props.resetRowFrmId();
             this.setState({showPreviewFormPopUpData : true,hasEdited:false,addFormButton:false});
             // this.setState({hasEdited:false,showPreviewFormPopUpData : false,addFormButton:false})
        }

    }

    dynamicClassesForFieldName = (item)=>{
        if(item.inputType == 'textBlockLong'){
            return 'pr-2 col-md-12 pl-0 overflow-ellipsis-multiple-line'
        }
        return 'pr-2 col-md-3 pl-0 overflow-ellipsis-multiple-line'
    }


    //filledQuestionsAns

    renderForm = (props)=>{
        return ( <div className='row col-xs-12 col-md-12 element-scroll'>
            <div className='form-group pt-2 row col-xs-12 col-md-12 position-relative ml-0 mr-0'>
                {
                    props.tableData && props.tableData[0].labelList && props.tableData[0].labelList.map((item,idx)=>{
                        return (
                            this.props.checkforFormValidation(item.uniqueIdentifier,item,props.tableData[0],this.props.formValidationRules,this.props.filledQuestionsAns) &&    item.isChecked && item.isChecked===true && <div key={idx} className={this.getFormElementClasses(props.tableData[0],item)} >
                                {/* { item.inputType !== 'reminder' && <label className='pr-2 col-md-4 pl-0'>{ item.name }</label> } */}
                                { item.inputType !== 'reminder' &&
                                                                                 ( item.inputType != '' || item.hasOwnProperty('codeDefinationList') && typeof item.codeDefinationList === 'object' &&
                                                                                  item.codeDefinationList.length !== 0  &&  item.codeDefinationList[0].inputType !== 'checkbox')
                                                                                  && <label className={ `${this.dynamicClassesForFieldName(item)} ${this.props.addRequiredClassOnEditCheckQuestion(item.uniqueIdentifier,this.props.formValidationRules) ? 'form_required_class' : '' }`  }  >{ item.name }</label> }
                               {

                            <GenerateHTML  labelText={item.label}  data={item} formId={props.tableData[0].formId} formLabelId={props.tableData[0].formLableId}
                            onChangeTextHandler={this.props.onChangeTextHandler}
                            onChangeDropDownHandler={this.props.onChangeDropDownHandler}
                            onDateChangeHandler={this.props.onDateChangeHandler}
                            onChangeRadioHandler={this.props.onChangeRadioHandler}
                            onchangeTimeHandler={this.props.onchangeTimeHandler}
                            onChangeFileHandler={this.props.onChangeFileHandler}
                            onCloseSelectedFile={this.props.onCloseSelectedFile}
                            deleteFile={this.props.deleteFile}
                            onchangeCheckboxHandler={this.props.onchangeCheckboxHandler}
                                customClassObject={customClassObject}
                                itemDefIndex={idx}
                                fromWhichPage='popUp'
                            />
                             }

                            </div>
                        )
                    })
                }
                {  props.tableData && props.tableData[0].labelList && props.tableData[0].labelList.length> 0  &&
                                                <div className="mt-0 mb-3 col-md-12 col-lg-12 pl-0 ">
                                                <label>Comment</label>
                                                <textarea name="COVAL" className="form-control" value={this.props.additionNotes}
                                                     onChange={(e)=>{this.props.onTblCovalChangeHandeler(e)}}

                                                 />
                                                </div>}
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

    componentDidMount(){
        if(!this.props.userEnd){
            this.setState({showPreviewFormPopUpData : true });
        }

    }

    cancelForm =()=>{
        this.props.cancelTableForm()
       this.setState({hasEdited:false,showPreviewFormPopUpData : false,addFormButton:true})

    }


      static resetFormView(){
        try{
            //reseting
            if(compInst){
                compInst.setState({hasEdited:false,showPreviewFormPopUpData : false,addFormButton:true})
            }

          }catch(e){

          }

      }


    render({state,props}=this){
        return(
            <div className="row col-12 p-0 m-0">
                {!this.props.hasTableType &&  this.props.userEnd && this.state.addFormButton && <div className="col float-right my-1 add-btn-bg">
                {
                   <span className='cursor-pointer' onClick={()=> this.openFormPopup() }>
                    <span className="float-right c-w cursor-pointer">Add</span>
                    <span className="add-btn"><i className="material-icons">add</i></span>
                </span>
                }

                {/* {


                } */}



                </div>}
                {
                    this.state.addFormButton && <div className='row col-12 p-0 m-0 previewTable-scroll form-table-wrapper-scroll-y '>

                    <table className="table table-responsive-lg border activity-table mb-2">
                        <thead>
                        <tr valign="middle">
                            {this.renderThead()}
                        </tr>
                        </thead>
                        <tbody className='text-center'>
                            {this.renderTbody()}


                          {
                              this.props.tableHeaderColumn && this.props.tableHeaderColumn.tableData.length == 0  && <tr>
                              <td colSpan={this.props &&  this.props.tableHeaderColumn && this.props.tableHeaderColumn.columnList.reduce((ac,currentV)=>{return ac+1},0 )} >No record found.</td>
                          </tr>
                          }
                        </tbody>
                    </table>


                    {/* <ReactTable
                            data={}
                            columns={columns}
                            minRows={1}
                            multiSort ={true}
                            showPagination={true}
                            nextText='>>'
                            previousText='<<'
                            noDataText='No Record Found'
                            defaultPageSize={10}
                        /> */}

                </div>

                }

                {  (this.state.hasEdited || this.state.showPreviewFormPopUpData) && <h5 className="subtitle mt-2 col-md-12"> {this.state.hasEdited ? (this.props.editedRowType ? this.props.editedRowType : 'Edit Details' )  : 'Add Details' }  : <span className='cursor-pointer float-right' onClick={()=> this.cancelForm() }>
                <span ><i  className="glyphicon glyphicon-remove"></i></span>
               </span></h5>

                 }

                { this.props.userEnd && (this.state.hasEdited || this.state.showPreviewFormPopUpData)   && this.renderForm(this.props) }
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


export default connect(mapStateToProps, mapDispatchToProps)(UserFormTable);