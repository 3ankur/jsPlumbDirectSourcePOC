import React from 'react';
import Common from '../../common/common';
import DateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

class PatientInfo extends React.Component{
    constructor(props, context){
        super(props, context);
        this.state = {
            patientList : [],
        }
    }

    componentDidMount(){
    }

    getPatientCallType(type){
        if(type.never_call_again && type.never_call_again==="N/A"){
            return `radio-neutral`
        }
        else if(type.never_call_again && type.never_call_again.toLowerCase() ==="yes"){
            return `radio-yes`
        }
        else{
            return  `radio-no`
        }

    }

    replacebr(str,id){
        try{
            var s = document.getElementById(id)
            s.innerHTML= str;
        }
        catch(e){

        }}

     oneditBtnClick = (pinfo) => {
            this.props.editPatient && this.props.editPatient(pinfo);
        }

    render({props,state} = this){
        const pinfo = props.patientInfo;
        return(
            <div className="f-flex align-items-stretch col-12 p-0 row m-0">
                <div className="col-lg-6 col-sm-12 col-md-12 mt-2  p-0 ">
                    <div className="form-row m-0">
                        <div className="col-md-12 col-lg-3 col-sm-3 text-right p-lg-1 px-2 bg-light-pink border-white text-md-left text-lg-right">
                            <label className="pt-1">Name</label>
                        </div>
                        <div className="col-md-12 col-lg-9 col-sm-9 bg-light-grey1 pt-1 px-2">
                            <label className="pt-1">{pinfo && pinfo.patientName ? pinfo.patientName : '--' } <i className="glyphicon glyphicon-edit editicn editPatient" title="Edit Patient Info" onClick={(e)=>this.oneditBtnClick(pinfo)}></i></label>
                        </div>
                    </div>
                    <div className="form-row m-0">
                        <div className="col-md-12 col-lg-3 col-sm-3 text-right p-lg-1 px-2 bg-light-pink border-white text-md-left text-lg-right">
                            <label className="pt-1">Address</label>
                        </div>
                        <div className="col-md-12 col-lg-9 col-sm-9 bg-light-grey1 p-1 px-2">
                                <label className="pt-1 ptAdd" id="patientAdd">{pinfo && pinfo.fullAddress && this.replacebr(pinfo.fullAddress,"patientAdd") ? this.replacebr(pinfo.fullAddress,"patientAdd") : '--' } </label>
                        </div>
                    </div>
                    <div className="form-row m-0">
                        <div className="col-md-12 col-lg-3 col-sm-3 text-right p-lg-1 px-2 bg-light-pink border-white text-md-left text-lg-right">
                            <label className="pt-1">Primary Contact</label>
                        </div>
                        <div className="col-md-12 col-lg-9 col-sm-9 bg-light-grey1 p-1 px-2">
                              <label className=" pt-1"> { pinfo && pinfo.contact ? pinfo.contact : '--'} </label>
                        </div>
                    </div>
                    <div className="form-row m-0">
                        <div className="col-md-12 col-lg-3 col-sm-3 text-right p-lg-1 px-2 bg-light-pink border-white text-md-left text-lg-right">
                            <label className="pt-1">Date of Birth</label>
                        </div>
                        <div className="col-md-12 col-lg-9 col-sm-9 bg-light-grey1 p-1 px-2">
                            <label className=" pt-1">{ pinfo && pinfo.dob ? pinfo.dob : '--'}</label>
                        </div>
                    </div>
                    <div className="form-row m-0">
                        <div className="col-md-12 col-lg-3 col-sm-3 text-right p-lg-1 px-2 bg-light-pink border-white text-md-left text-lg-right">
                            <label className="pt-1">Email</label>
                        </div>
                        <div className="col-md-12 col-lg-9 col-sm-9 bg-light-grey1 p-1 px-2">
                            <label className=" pt-1">{pinfo && pinfo.email ? pinfo.email : '--'}</label>
                        </div>
                    </div>
                </div>
                <div className=" col-sm-12 col-md-12 col-lg-6 mt-md-2 mt-sm-0 p-sm-0">
                    <div className="form-row m-0">
                        <div className="col-md-12 col-lg-3 col-sm-3 text-right p-lg-1 px-2 bg-light-pink border-white text-md-left text-lg-right">
                            <label className="pt-1">SSN</label>
                        </div>
                        <div className="col-md-12 col-lg-9 col-sm-9 bg-light-grey1 p-1 px-2">
                            { props.onEdit ? <input type='text' onChange={(e)=>props.textChangeHandler(e,pinfo.ssn) } value={pinfo.ssn} placeholder='Enter SSN' className='form-control' /> : <label className=" pt-1">{ pinfo && pinfo.ssn ? pinfo.ssn : '--'}</label>  }
                        </div>
                    </div>
                    <div className="form-row m-0">
                        <div className="col-md-12 col-lg-3 col-sm-3 text-right p-lg-1 px-2 bg-light-pink border-white text-md-left text-lg-right">
                            <label className="pt-1 ">GreenPhire</label>
                        </div>
                        <div className="col-md-12 col-lg-9 col-sm-9 bg-light-grey1 px-2">
                            <label className="pt-2">{pinfo && pinfo.greenphire ? pinfo.greenphire : '--'}
                            </label>
                        </div>
                    </div>
                    <div className="form-row m-0">
                        <div className="col-md-12 col-lg-3 col-sm-3 text-right p-lg-1 px-2 bg-light-pink border-white text-md-left text-lg-right">
                            <label className="pt-1 ">Emergency Contact</label>
                        </div>
                        <div className="col-md-12 col-lg-9 col-sm-9 bg-light-grey1 p-1 px-2">
                             <label className=" pt-1">{pinfo && pinfo.emergencyContact ? pinfo.emergencyContact : '--'}</label>
                        </div>
                    </div>
                    <div className="form-row m-0">
                        <div className="col-md-12 col-lg-3 col-sm-3 text-right p-lg-1 px-2 bg-light-pink border-white text-md-left text-lg-right">
                            <label className="pt-1">Actual Sites</label>
                        </div>
                        <div className="col-md-12 col-lg-9 col-sm-9 bg-light-grey1 p-1 px-2">
                               <label className="pt-1 ">{pinfo && pinfo.siteName ? pinfo.siteName : '--'}</label>
                        </div>
                    </div>
                    <div className="form-row m-0">
                        <div className="col-md-12 col-lg-3 col-sm-3 text-right p-lg-1 px-2 bg-light-pink border-white text-md-left text-lg-right">
                            <label className="pt-1">Never Call Again</label>
                        </div>

                        <div className="col-md-12 col-lg-9 col-sm-9 bg-light-grey1 p-1 px-2"><label className="pt-1 ">
                            {pinfo.never_call_again && pinfo.never_call_again == 1 ? "Yes" : (pinfo.never_call_again == 2 ?  "No" : "--")}
                        </label></div>
                    </div>
                    <div className="form-row m-0">
                        <div className="col-md-12 col-lg-3 col-sm-3 text-right p-lg-1 px-2 bg-light-pink border-white text-md-left text-lg-right">
                            <label className="pt-1"></label>
                        </div>

                        <div className="col-md-12 col-lg-9 col-sm-9 bg-light-grey1 p-1 px-2"><label className="pt-1 ">
                        </label></div>
                    </div>
                    <div className="form-row m-0">
                        <div className="col-md-12 col-lg-3 col-sm-3 text-right p-lg-1 px-2 bg-light-pink border-white exPad text-md-left text-lg-right">
                            <label className="pt-1"></label>
                        </div>

                        <div className="col-md-12 col-lg-9 col-sm-9 bg-light-grey1 p-1 px-2"><label className="pt-1 ">
                        </label></div>
                    </div>
                </div>
            </div>
        );

    }
}

export default PatientInfo;