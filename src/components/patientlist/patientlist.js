/**
* Copyright (c) 2018
* @summary Application Patient List Component
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React, { Component } from 'react';


 class  PatientListItem extends Component{

    constructor(props){
        super(props);
        this.state = {
            PatientSelected : false
        }
    }

    render({props,state} = this){
        return (
            <div className="col-12 p-0 m-0 mt-2 row">
                <div className="col pl-2">
                    {/*pass patient id in onSelectPatient*/}
                    <div className={'input-group border d-flex justify-content-between ' + (props.active ? 'active' : '')} onClick={props.onSelectPatient}>
                        <div className="p-2">{props.item.name}</div>
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="">{props.item.study}</span>
                        </div>
                    </div>
                </div>
                <div className="col-auto border px-1 text-center">
                    {props.item.status &&
                        props.item.status == 'incomplete' ?
                            ( <i className="pt-2 c-r lense d-block rounded-circle mt-2"></i> ) : (
                                props.item.status == 'reject' ? <i className="material-icons pt-2 c-r">remove_circle_outline</i> : (
                                    props.item.status == 'shedule' ?  <i className="material-icons pt-2 c-g">check_circle</i> : (
                                            props.item.status == 'followup' ? <i className="material-icons pt-2 c-b">assignment</i> :
                                            ''
                                    )
                                )
                            )
                    }

                </div>
            </div>
        )}
    }

class PatientList extends Component {

  	constructor(props){
        super(props);
        this.state = {
            activeIndex : null
        }
    }

    onToggleHandler (index) {
        this.props.onSelectPatient();
        this.setState({activeIndex : index});
    }


  render({props,state} = this ) {
    return (
    	 <div className="col-md-12 col-lg-3 col-sm-12 px-0 border-right-transparent">
            <div className="border h-100 pb-sm-3">
                <h6 className="px-3 py-2 c-p">Patient Name</h6>
                <div className="bg-light-grey1 px-3 py-2">
                    <div className="row justify-content-between">
                        <div className="col">
                            <input type="text" placeholder="Search" className="px-2 form-control col-lg-8 col-md-auto" />
                        </div>
                        <div className="col-auto">
                            <select className="form-control">
                                <option>
                                    IN
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row m-0 mt-3 px-2 patient-name">
                   { patientList.map( (patient,index) => <PatientListItem item={patient}  key={patient.name} active={state.activeIndex == index} onSelectPatient={this.onToggleHandler.bind(this,index)} />) }
                </div>

            </div>
        </div>
    );
  }
}

const patientList = [
                        {
                            "name" : "Smith",
                            "status" : "incomplete",
                            "study" : "EL-123"
                        },
                            {
                            "name" : "Alish",
                            "status" : "reject",
                            "study" : "EL-123"
                        },
                        {
                            "name" : "Alex",
                            "status" : "reject",
                            "study" : "EL-123"
                        },
                            {
                            "name" : "Jexx",
                            "status" : "shedule",
                            "study" : "EL-123"
                        },
                        {
                            "name" : "William",
                            "status" : "followup",
                            "study" : "EL-123"
                        }
                ]

export default PatientList;
