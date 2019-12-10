/**
* Copyright (c) 2018
* @summary  Encounter Vital Sign Page
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
// import ApiService from '../../api';
import MenuOption from '../menuoptions/menuoptions';
import common from '../../../src/common/common';
import ReactTable from "react-table";
import 'react-table/react-table.css'
var compInst = null;
class CommentLogs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            commentsLogsdata : {},
            data:{},
            enComments:"",
            showCommentBox:false,
            hasEdited:false,
            addFormButton:true
        }
        compInst = this;
    }
    onChangeENComment_Handler =(e)=>{
        this.setState({enComments:e.target.value});
    }
 
    
    cancelForm =()=>{
        this.props.cancelTableForm()
       this.setState({hasEdited:false,showCommentBox : false,addFormButton:true})
    }
    openForm = ()=>{
        this.props && this.props.addNewComment && this.props.addNewComment()
        this.setState({hasEdited:false,showCommentBox : true,addFormButton:false})
    }

    onTRClick = (state, rowInfo, column) => {
        return {
            onClick: (e) => {
                
                if(rowInfo.original && rowInfo.original.formGroupIdentifier){
                    this.props.addNewComment();
                //FormGroupIdentifier
               // this.props.additionNotes = rowInfo.original.encounterName  //rowInfo.original.comments;
                 this.props.editAditionalNotes(rowInfo);
                this.setState({hasEdited:true,showCommentBox : true,addFormButton:false});
                return {
                    style: {
                      cursor: rowInfo.original.formGroupIdentifier ? 'pointer':'default'
                    }
                  }
                }

                
            }
        }
    }

    static resetFormView(){
        try{
            //reseting
            if(compInst){
                compInst.setState({hasEdited:false,showCommentBox : false,addFormButton:true})
            }

          }catch(e){

          }

      }

    render({props,state} = this) {
        
        return (
            <div className="row m-0 my-2">
                { this.state.addFormButton && <div className="col float-right my-1 add-btn-bg">
                
                   <span className='cursor-pointer' onClick={()=> this.openForm() }>
                    <span className="float-right c-w cursor-pointer">Add</span>
                    <span className="add-btn"><i className="material-icons">add</i></span>
                </span>
                </div>
                }
                
                {!this.state.showCommentBox && <div className="col-12 px-0">
                    <ReactTable
                            data={this.props.formData.listOfComments}
                            columns={columns}
                            minRows={1}
                            multiSort ={true}
                            showPagination={true}
                            nextText='>>'
                            previousText='<<'
                            noDataText='No Record Found'
                            defaultPageSize={10}
                            className={this.props.formData.listOfComments.uniqueIdentifier && this.props.formData.listOfComments.uniqueIdentifier !=="" ? "commenthover" : "ABC"}
                            getTrProps={this.onTRClick}
                        />
                </div>}
                {
                    this.state.showCommentBox && 
                      (this.state.hasEdited || this.state.showCommentBox) &&
                      <div className="col-md-12 m-0 p-0">
                       <h5 className="subtitle mt-2 col-md-12"> {this.state.hasEdited ? 'Edit Details' : 'Add Details' }  : <span className='cursor-pointer float-right' onClick={()=> this.cancelForm() }>
                <span ><i  className="glyphicon glyphicon-remove"></i></span> 
               </span></h5>
               
               <div className="col-12 mt-3 p-0">
                <div className="form-group">
                <label className="">Comment</label>
                <textarea name="COVAL" className="form-control" value={this.props.additionNotes}
                     onChange={(e)=>{this.props.onTblCovalChangeHandeler(e)}}
                 />
                </div>
                </div>
                </div>

               
               
                }
                 
                {/* <div className="col-12 mt-3 p-0">
                <div className="form-group">
                <label className="c-p">Encounter Comment</label>
                <textarea name="COVAL" className="form-control" value={this.props.additionNotes}
                     onChange={(e)=>{this.props.onTblCovalChangeHandeler(e)}}
                 />
                </div></div> */}
            </div>
        );
    }

}



export default CommentLogs;

const columns = [
  {
    Header: 'Encounter',
    accessor: 'encounterName',
    Cell:row =>{
        return row.row._original.encounterName ? <span> {row.row._original.encounterName}</span> : '--'
    }
  },
  {
    Header: 'Epoch',
    accessor: 'epochName', 
    Cell:row =>{
        return row.row._original.epochName ? <span> {row.row._original.epochName}</span> : '--'
    }
  },
  {
    Header: 'ItemGroup',
    accessor: 'itemGroupName',
    Cell:row =>{
        return row.row._original.itemGroupName ? <span> {row.row._original.itemGroupName}</span> : '--'
    }
  },
  {
    Header: 'Comments',
    accessor: 'comments',
    Cell:row =>{
        return row.row._original.comments ? <div className="wordcss" title={row.row._original.comments}> {row.row._original.comments}</div> : '--'
    }
  }
]