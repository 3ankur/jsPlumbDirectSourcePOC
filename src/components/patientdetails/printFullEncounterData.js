import React from 'react';
import Common from '../../common/common';
// import DateTime from 'react-datetime';
// import 'react-datetime/css/react-datetime.css';
import '../../../src/index.css';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import ApiService from '../../api';

//import {connect} from 'react-redux';
//import default from './patientDetails';



const status = {
    "0": "--",
    "1" : "Completed",
    "2" : "Not performed",
    "3" : "Never Get",
    "4" : "Incomplete"
}

class PrintFullEncounterData extends React.Component{


        constructor(props){
            super(props);
            this.state = {
                patientFEDetails : {},
                formattedListItemData : []
            }
        }


        getAnswerValues(data){
            if(data){

                if(data.indexOf("$$###$$")>-1){
                   return  data.split("$$###$$").join(",")
                }
            }
                return data;

            }

            getFormattedListItem = ()=>{
                let prevState = this.state.patientFEDetails;
                let tempArray = [];
                if(prevState && prevState.hasOwnProperty('formList') && prevState.formList && prevState.formList.length > 0){
                    prevState.formList.forEach((formElement)=>{
                        formElement.encounterAttribute.forEach((formQuestion)=>{
                            formQuestion.encounterAttributeValue.forEach((formAnswer)=>{
                                let tempFormElementObj = {};
                                tempFormElementObj['domainName'] = formElement.domainName;
                                tempFormElementObj['questionString'] = formQuestion.questionString ? formQuestion.questionString : '--';
                                tempFormElementObj['updatedDateTime'] = formAnswer.updatedDateTime;
                                tempFormElementObj['performedUser'] = formAnswer.performedUser ? formAnswer.performedUser : "SYSTEM";
                                tempFormElementObj['previousValue'] = formAnswer.previousValue ? this.getAnswerValues(formAnswer.previousValue)  : "--" ;
                                tempFormElementObj['currentValue'] =   formAnswer.currentValue ? this.getAnswerValues(formAnswer.currentValue ) : "--" ;
                                tempFormElementObj['performStatus'] = status[formAnswer.performStatus];
                                tempFormElementObj['subelement'] = formAnswer.subelement;
                                tempFormElementObj['alldata'] = formAnswer;
                                tempArray.push(tempFormElementObj);
                            });
                        });
                        this.setState({
                            formattedListItemData : tempArray
                        },()=>{});
                    });
                }
            }


        componentDidMount(){
            if(this.props.encounterGroupIdentifier){
                ApiService.getEncounterFEDetails(this.props.encounterGroupIdentifier).then((res)=>{
                    this.setState({patientFEDetails:res.data.response},()=>{
                       this.getFormattedListItem();
                    })
                });
            }
        }

    render({props,state} = this){
        let reviewList=[{"review":"A"},{"review":"b"}]
        return(
           <div className='col-12 p-0 printPagePadding'>
                <h5 className="modal-title c-p" id="exampleModalLabel">Encounter Information </h5>
                <div className="col-12 p-0 m-0">
                    <div className="col-12 form-row p-0 clearfix row m-0 d-flex patient-info">
                        <div className="col-6 col-sm-12 col-md-6 mt-2 align-items-stretch p-0 ">
                            <div className="form-row">
                                <div className="col-md-3 col-sm-3 text-right p-1 px-2 bg-light-pink border-white">
                                    <label className="pt-1 ">Study </label>
                                </div>
                                <div className="col-md-9 col-sm-9 bg-light-grey1 p-1 px-2">
                                    <label className=" pt-1" >{this.state.patientFEDetails && this.state.patientFEDetails.study}</label>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-md-3 col-sm-3 text-right p-1 px-2 bg-light-pink border-white">
                                    <label className="pt-1">Subject ID</label>
                                </div>
                                <div className="col-md-9 col-sm-9 bg-light-grey1 p-1 px-2">
                                    <label className=" pt-1">{this.state.patientFEDetails && this.state.patientFEDetails.subjectId}</label>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-md-3 col-sm-3 text-right p-1 px-2 bg-light-pink border-white">
                                    <label className="pt-1">Epoch</label>
                                </div>
                                <div className="col-md-9 col-sm-9 bg-light-grey1 p-1 px-2">
                                    <label className=" pt-1" title={this.state.patientFEDetails && this.state.patientFEDetails.epoch}>{this.state.patientFEDetails && Common.getSubString(this.state.patientFEDetails.epoch,20)}</label>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-md-3 col-sm-3 text-right p-1 px-2 bg-light-pink border-white">
                                    <label className="pt-1">Encounter Date</label>
                                </div>
                                <div className="col-md-9 col-sm-9 bg-light-grey1 p-1 px-2">
                                    <label className=" pt-1">{this.state.patientFEDetails && this.state.patientFEDetails.encounterDate && this.state.patientFEDetails.encounterDate !=(null || "") ? this.state.patientFEDetails.encounterDate : '--'}</label>
                                </div>
                            </div>

                        </div>
                        <div className="col-6 col-sm-12 col-md-6 mt-md-2 mt-sm-0 p-sm-0  align-items-stretch">
                        <div className="form-row">
                                <div className="col-md-3 col-sm-3 text-right p-1 px-2 bg-light-pink border-white">
                                    <label className="pt-1">Site</label>
                                </div>
                                <div className="col-md-9 col-sm-9 bg-light-grey1 p-1 px-2">
                                    <label className=" pt-1">{this.state.patientFEDetails && this.state.patientFEDetails.site}</label>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-md-3 col-sm-3 text-right p-1 px-2 bg-light-pink border-white">
                                    <label className="pt-1">Patient</label>
                                </div>
                                <div className="col-md-9  col-sm-9 bg-light-grey1 p-1 px-2">
                                    <label className=" pt-1">{this.state.patientFEDetails && this.state.patientFEDetails.patient}</label>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="col-md-3 col-sm-3 text-right p-1 px-2 bg-light-pink border-white">
                                    <label className="pt-1">Encounter</label>
                                </div>
                                <div className="col-md-9 col-sm-9 bg-light-grey1 p-1 px-2">
                                    <label className=" pt-1" title={this.state.patientFEDetails && this.state.patientFEDetails.encounter}>{this.state.patientFEDetails && Common.getSubString(this.state.patientFEDetails.encounter,20)}</label>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="col-md-3 col-sm-3 text-right p-1 px-2 bg-light-pink border-white">
                                    <label className="pt-1">Check In</label>
                                </div>
                                <div className="col-md-9 col-sm-9 bg-light-grey1 p-1 px-2">
                                    <label className=" pt-1">{this.state.patientFEDetails && this.state.patientFEDetails.checkinStatus}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <h5 className="modal-title c-p mt-2 mb-2" id="exampleModalLabel">Line Item Changes</h5>
                <div className="row table-border col-12 p-0 m-0">
                       <ReactTable
                            data={this.state.formattedListItemData}
                            columns={listItemColumns}
                            minRows={1}
                            multiSort ={true}
                            className='table table-responsive-sm activity-table mb-0'
                            showPagination={true}
                            nextText='>>'
                            previousText='<<'
                            defaultPageSize={5}
                            noDataText='No Record Found'
                            defaultSorted={[
                                {
                                  id: "updatedDateTime",
                                  desc: false
                                }
                              ]}
                        />
                </div>
                
                <h5 className="modal-title c-p mt-2" id="exampleModalLabel">Date of Next Encounter </h5>
                <div className="col-12 p-0 m-0">
                    <div className="col-12 form-row p-0 clearfix row m-0 d-flex patient-info">
                        <div className="col-12 col-sm-12 col-md-12 mt-2 align-items-stretch p-0 ">
                            <div className="form-row">
                                <div className="col-md-3 col-sm-3 text-right p-1 px-2 bg-light-pink border-white">
                                <label className="pt-1 ">Date of Next Encounter </label>
                                </div>
                                <div className="col-md-9 col-sm-9 bg-light-grey1 p-1 px-2">
                                <label className=" pt-1" >{this.state.patientFEDetails && this.state.patientFEDetails.nextEncounterDate ? this.state.patientFEDetails.nextEncounterDate : '--'}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
           </div>
        );

    }
}



const listItemColumns = [
    {
        Header: 'Date Time',
        accessor: 'updatedDateTime',
        Cell:row =>{
            return row.row._original.updatedDateTime ? <span> {row.row._original.updatedDateTime}</span> : '--'
        }
    },
    {
        Header: 'ItemGroup',
        accessor: 'domainName',
        Cell:row =>{
            return row.row._original.domainName ? <span> {row.row._original.domainName}</span> : '--'
        }
    },
    // {
    //     Header: 'Item',
    //     accessor: 'subelement',
    //     Cell:row =>{

    //         return(
    //             row.row._original.subelement ? <span className=''> { row.row._original.subelement} </span> : '--'
    //         )
    //     }
    // },
    {
        Header: 'Item',
        accessor: 'questionString',
        Cell:row =>{
            return row.row._original.questionString ? <span> {row.row._original.questionString}</span> : '--'
        }
    },
    {
        Header: 'Previous Answer',
        accessor: 'previousValue',
        Cell:row =>{
            return row.row._original.previousValue ? <span> {row.row._original.previousValue}</span> : '--'
        }
    },
    {
        Header: 'New Answer',
        accessor: 'currentValue',
        Cell:row =>{
            return row.row._original.currentValue ? <span> {row.row._original.currentValue}</span> : '--'
        }
    },
    {
        Header: 'Previous State',
        accessor: 'performStatus',
        Cell:row =>{
            return(
                status[row.original.alldata.previousState]
            )
        }
    },
    {
        Header: 'New State',
        accessor: 'performStatus',
        Cell:row =>{
            return(
                status[row.original.alldata.currentState]
            )
        }
    },
    {
        Header: 'By User',
        accessor: 'performedUser',
        Cell:row =>{
            return row.row._original.performedUser ? <span> {row.row._original.performedUser}</span> : '--'
        }
    }
]

export default PrintFullEncounterData;
