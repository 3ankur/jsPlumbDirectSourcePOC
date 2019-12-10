import React from 'react';
import Common from '../../common/common';
import DateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import '../../../src/index.css';
import ReactTable from "react-table";
import 'react-table/react-table.css';

//import {connect} from 'react-redux';
//import default from './patientDetails';

class PrintPatientEncounterSummaryData extends React.Component{

    checkinStatus(type){
        let checktype="";
        if(type == 1){
         checktype = "Yes";
        }else if(type == 2){
            checktype = "No";
        }else{
            checktype = "--";
        }
        return checktype
    }
    checkforNoData(){
        if(this.props.peDetails.hasOwnProperty('attendingMedicle')){
            if(this.props.peDetails.attendingMedicle.length == 0){
                return false;
            }
            else{
                return true;
            }
        }else{
            return false;
        }
    }

    render({props,state} = this){
        return(
           <div className='col-12 p-0 printPagePadding' id='printSection' >
                <h5 className="modal-title c-p" id="exampleModalLabel">Encounter Information </h5>
                <div className="col-12 p-0 m-0">
                    <div className="col-12 form-row p-0 clearfix row m-0 d-flex patient-info">
                        <div className="col-6 col-sm-12 col-md-6 mt-2 align-items-stretch">
                            <div className="form-row">
                                <div className="col-md-3 col-sm-3 text-right p-1 px-2 bg-light-pink border-white">
                                    <label className="pt-1 ">Study </label>
                                </div>
                                <div className="col-md-9 col-sm-9 bg-light-grey1 p-1 px-2">
                                    <label className=" pt-1" >{this.props.peDetails && this.props.peDetails.study }</label>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-md-3 col-sm-3 text-right p-1 px-2 bg-light-pink border-white">
                                    <label className="pt-1">Subject ID</label>
                                </div>
                                <div className="col-md-9 col-sm-9 bg-light-grey1 p-1 px-2">
                                    <label className=" pt-1">{this.props.peDetails && this.props.peDetails.subjectId } </label>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-md-3 col-sm-3 text-right p-1 px-2 bg-light-pink border-white">
                                    <label className="pt-1">Epoch</label>
                                </div>
                                <div className="col-md-9 col-sm-9 bg-light-grey1 p-1 px-2">
                                    <label className=" pt-1" title={this.props.peDetails.epoch}>{this.props.peDetails && Common.getSubString(this.props.peDetails.epoch,20) }</label>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-md-3 col-sm-3 text-right p-1 px-2 bg-light-pink border-white overflow-ellipsis">
                                    <label className="pt-1">Encounter Date</label>
                                </div>
                                <div className="col-md-9 col-sm-9 bg-light-grey1 p-1 px-2">
                                    <label className=" pt-1">{ this.props.peDetails && this.props.peDetails.encounterDate !== (null && "") ? this.props.peDetails.encounterDate:"--" }</label>
                                </div>
                            </div>


                        </div>
                        <div className="col-6 col-sm-12 col-md-6 mt-2 align-items-stretch">
                            <div className="form-row">
                                <div className="col-md-3 col-sm-3 text-right p-1 px-2 bg-light-pink border-white">
                                    <label className="pt-1">Site</label>
                                </div>
                                <div className="col-md-9 col-sm-9 bg-light-grey1 p-1 px-2">
                                    <label className=" pt-1">{this.props.peDetails && this.props.peDetails.site }</label>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="col-md-3 col-sm-3 text-right p-1 px-2 bg-light-pink border-white">
                                    <label className="pt-1">Patient</label>
                                </div>
                                <div className="col-md-9  col-sm-9 bg-light-grey1 p-1 px-2">
                                    <label className=" pt-1">{this.props.peDetails && this.props.peDetails.patient }</label>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="col-md-3 col-sm-3 text-right p-1 px-2 bg-light-pink border-white">
                                    <label className="pt-1">Encounter</label>
                                </div>
                                <div className="col-md-9 col-sm-9 bg-light-grey1 p-1 px-2">
                                    <label className=" pt-1" title={this.props.peDetails.encounter}>{this.props.peDetails && Common.getSubString(this.props.peDetails.encounter,20) }</label>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-md-3 col-sm-3 text-right p-1 px-2 bg-light-pink border-white">
                                    <label className="pt-1">Check In</label>
                                </div>
                                <div className="col-md-9 col-sm-9 bg-light-grey1 p-1 px-2">
                                    <label className=" pt-1">{this.props.peDetails.checkinStatus}</label>
                                </div>
                            </div>
                            {/* <div className="form-row">
                                <div className="col-md-3 col-sm-3 text-right p-1 px-2 bg-light-pink border-white">
                                    <label className="pt-1">&nbsp;</label>
                                </div>
                                <div className="col-md-9 col-sm-9 bg-light-grey1 p-1 px-2">
                                    <label className=" pt-1">&nbsp;</label>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-md-3 col-sm-3 text-right p-1 px-2 bg-light-pink border-white">
                                    <label className="pt-1 ">&nbsp;</label>
                                </div>
                                <div className="col-md-9 col-sm-9 bg-light-grey1">
                                    <div className="col-sm-5 py-2" >
                                        <span className="float-left col-md-4 text-right">&nbsp;</span>
                                        <span className="float-left px-2">&nbsp;</span>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
                    {this.props.peDetails.reminders && this.props.peDetails.reminders.length > 0 && <h5 className="modal-title c-p my-2" id="exampleModalLabel" >Patient Reminder</h5>}
                    {this.props.peDetails.reminders && this.props.peDetails.reminders.length > 0 && <div className="row col-12 p-0 m-0">
                        <ul className="list-group fepeulli" >
{
    this.props.peDetails.reminders.map((item) => {
                        return (
                            <li className="list-group-item py-2 px-1"> <i className="glyphicon glyphicon-ok"> </i>&nbsp; {item} </li>
                        )
                    })
}
                        </ul>
                    </div>
                    }
                    <h5 className="modal-title c-p mt-2 mb-2" id="exampleModalLabel" >Line Item Changes</h5>
                    <div className="row border col-12 p-0 m-0">
                        {/* <table className="table table-responsive-sm activity-table mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">ItemGroup</th>
                                    <th scope="col">Date Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.peDetails.procedures && this.props.peDetails.procedures.map( (ele,eleIdx)=>{
                                        return<tr key={eleIdx}>
                                        <td>{ele.element}</td>
                                        <td>{ ele.dateTime}</td>
                                        </tr>
                                    } )
                                }
                            </tbody>
                        </table> */}
                        <ReactTable
                            data={this.props.peDetails.procedures}
                            columns={listItemColumns}
                            minRows={1}
                            multiSort ={true}
                            className='table table-responsive-sm activity-table mb-0'
                            showPagination={true}
                            nextText='>>'
                            previousText='<<'
                            defaultPageSize={5}
                            noDataText='No Record Found'
                        />
                    </div>
                    <h5 className="modal-title c-p mt-2 mb-2" id="exampleModalLabel" >Attending Medical Professionals</h5>
                    <div className="row border col-12 p-0 m-0">
                    {/* <table className="table table-responsive-sm activity-table mb-0">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">ItemGroup</th>
                                <th scope="col">Contact Number</th>
                            </tr>
                        </thead>
                        <tbody>
                        {  !this.checkforNoData() && <tr>
                              <td colSpan="3" style={{textAlign:'center'}}>No Record Found</td>
                          </tr>
                          }
                            {this.props.peDetails.attendingMedicle && this.props.peDetails.attendingMedicle.map( (ele,eleIdx)=>{
                                    return <tr key={eleIdx}>
                                    <td>{ele.whoDidItInCDASH}</td>
                                    <td>{ ele.element}</td>
                                    <td>{ ele.contactNumber}</td>
                                    </tr>
                                } )
                            }
                        </tbody>
                    </table> */}
                    <ReactTable
                        data={this.props.peDetails.attendingMedicle}
                        columns={attendingMedicleColumn}
                        minRows={1}
                        multiSort ={true}
                        className='table table-responsive-sm activity-table mb-0'
                        showPagination={true}
                        nextText='>>'
                        previousText='<<'
                        defaultPageSize={5}
                        noDataText='No Record Found'
                    />
                </div>
                    <h5 className="modal-title c-p mt-2 mb-2" id="exampleModalLabel" >Date of Next Encounter </h5>
                    <div className="col-12 p-0 m-0">
                        <div className="col-12 form-row p-0 clearfix row m-0 d-flex patient-info">
                            <div className="col-12 col-sm-12 col-md-12 mt-2 align-items-stretch">
                                <div className="form-row">
                                    <div className="col-md-3 col-sm-3 text-right p-1 px-2 bg-light-pink border-white">
                                        <label className="pt-1 ">Date of Next Encounter </label>
                                    </div>
                                    <div className="col-md-9 col-sm-9 bg-light-grey1 p-1 px-2">
                                        <label className=" pt-1" >{this.props.peDetails.nextEncounterDate && this.props.peDetails.nextEncounterDate !=(null || '') ? this.props.peDetails.nextEncounterDate:'--'}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
           </div>
        );

    }
}

export default PrintPatientEncounterSummaryData;

const listItemColumns = [
    {
        Header: 'ItemGroup',
        accessor: 'element'
    },
    {
        Header: 'Date Time',
        accessor: 'dateTime'
    }
]

const attendingMedicleColumn = [
    {
        Header: 'Name',
        accessor: 'whoDidItInCDASH'
    },
    {
        Header: 'ItemGroup',
        accessor: 'element'
    },
    {
        Header: 'Contact Number',
        accessor: 'contactNumber'
    }
]