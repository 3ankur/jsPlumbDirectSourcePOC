/**
* Copyright (c) 2018
* @summary Application Patient Description component
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React, { Component } from 'react';

class PatientDetails extends Component {


  render({props,state} = this) {
    return (
    	 <div className="col-md-12 col-lg-9 col-sm-12 row m-0 border pb-3 patient-info">
            <div className="col-md-12 p-0 mt-2">
                <h6 className="border-p py-2 c-p c-p">Patient Activity History</h6>
                <div className="row col-12 m-0 pt-2 mt-3 d-flex justify-content-between">
                    <div className="col-md-10 col-sm-9 px-0 row border-right-dotted patient-activity-history">
                        <div className="col-md-12 p-0 d-flex flex-row">
                            <div className="pl-3">
                                <img src="/assets/images/icons/icon1.png" />
                            </div>
                            <div className=" pl-3 pt-0">
                                Smith Call : 14 Feb 2018 <span className="c-b">Left Message</span>
                            </div>
                        </div>
                        <div className="col-md-12 p-0 d-flex flex-row">
                            <div className="pl-3">
                                <img src="/assets/images/icons/icon2.png" />
                            </div>
                            <div className=" pl-3 pt-0">
                                Smith Call : 15 Feb 2018 <span className="c-g">Answer</span>
                            </div>
                        </div>
                        <div className="col-md-12 p-0 d-flex flex-row">
                            <div className="pl-3">
                                <img src="/assets/images/icons/icon2.png" />
                            </div>
                            <div className=" pl-3 pt-0">
                                Smith Call : 16 Feb 2018 <span className="c-g">Answer</span>
                            </div>
                        </div>
                        <div className="col-md-12 p-0 d-flex flex-row">
                            <div className="pl-3">
                                <img src="/assets/images/icons/icon3.png" />
                            </div>
                            <div className=" pl-3 pt-0">
                                Smith Call : 17 Feb 2018 <span className="c-r">No Answer</span>
                            </div>
                        </div>
                        <div className="col-md-12 p-0 d-flex flex-row">
                            <div className="pl-3">
                                <img src="/assets/images/icons/icon4.png" />
                            </div>
                            <div className=" pl-3 pt-0">
                                Smith Call : 18 Feb 2018 <span className="c-r">No Answer</span>
                            </div>
                        </div>
                        <div className="c-p col-md-12 text-right"><strong>See More >></strong></div>
                    </div>
                    <div className="col-md-2 col-sm-3 text-center d-flex align-items-start flex-column">
                        <div className="m-md-auto m-sm-auto">
                            <img src="/assets/images/icons/no-ans-icon.png" className="" />
                            <div className="c-r mt-1">No Answer</div>
                        </div>
                        <div className="m-md-auto m-sm-auto">
                            <img src="/assets/images/icons/ans-icon.png" className="" />
                            <div className="c-g mt-1">Answer</div>
                        </div>
                        <div className="m-md-auto m-sm-auto">
                            <img src="/assets/images/icons/left-message-icon.png" className="" />
                            <div className="c-b mt-1">Left Message</div>
                        </div>
                        <div className="m-md-auto m-sm-auto">
                            <img src="/assets/images/icons/ofc-icon.png" className="" />
                            <div className="c-b mt-1 greytxt">In Office</div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="col-md-12 p-0 mt-2">
                <h6 className="border-p py-2 c-p">Patient Questionair</h6>
                <div className="row m-0 d-flex flex-row py-2 justify-content-between">
                    <div className="border-bottom-dotted col mr-2 d-flex flex-row pb-1">
                        <img src="/assets/images/icons/icons5.png" />
                        <h6 className="c-p pt-1 mb-0 px-3"> Do have this?</h6>
                    </div>
                    <div className="col-md-auto col-sm-3 baseline-container d-flex align-items-end p-0">
                        <div className="btn-group float-right " role="group" aria-label="status">
                            <button type="button" className="btn bg-light-r p-1"><small><i className="material-icons text-white">close</i></small></button>
                            <button type="button" className="btn bg-light-g p-1"><i className="material-icons text-white">done</i></button>
                            <button type="button" className="btn bg-grey p-1 text-white" >N/A</button>
                        </div>
                    </div>
                </div>
                <div className="row m-0 d-flex flex-row py-2">
                    <div className="col-md-auto c-p font-weight-bold">
                        A.
                    </div>
                    <div className="col pr-0">
                        <span className="float-left px-2 text-right">Yes</span>
                            <label className="switch float-left">
                                <input type="checkbox" />
                                <span className="slider"></span>
                            </label>
                            <span className="float-left px-2">No</span>
                    </div>
                </div>
                <div className="row m-0 d-flex flex-row py-2 justify-content-between">
                    <div className="border-bottom-dotted col mr-2 d-flex flex-row pb-1">
                        <img src="/assets/images/icons/icons5.png" />
                        <h6 className="c-p pt-1 mb-0 px-3"> Describe Something?</h6>
                    </div>
                    <div className="col-md-auto baseline-container col-sm-3 d-flex align-items-end p-0">
                        <div className="btn-group float-right " role="group" aria-label="status">
                            <button type="button" className="btn bg-light-r p-1"><small><i className="material-icons text-white">close</i></small></button>
                            <button type="button" className="btn bg-light-g p-1"><i className="material-icons text-white">done</i></button>
                            <button type="button" className="btn bg-grey p-1 text-white" >N/A</button>
                        </div>
                    </div>
                </div>
                <div className="row m-0 d-flex flex-row py-2">
                    <div className="col-md-auto c-p font-weight-bold">
                        A.
                    </div>
                    <div className="col pr-0">
                        <textarea className="form-control" rows="3"></textarea>
                    </div>
                </div>
                <div className="row m-0 d-flex flex-row py-2 justify-content-between">
                    <div className="border-bottom-dotted col mr-2 d-flex flex-row pb-1">
                        <img src="/assets/images/icons/icons5.png" />
                        <h6 className="c-p pt-1 mb-0 px-3"> How Many?</h6>
                    </div>
                    <div className="col-md-auto baseline-container col-sm-3 d-flex align-items-end p-0">
                        <div className="btn-group float-right " role="group" aria-label="status">
                            <button type="button" className="btn bg-light-r p-1"><small><i className="material-icons text-white">close</i></small></button>
                            <button type="button" className="btn bg-light-g p-1"><i className="material-icons text-white">done</i></button>
                            <button type="button" className="btn bg-grey p-1 text-white" >N/A</button>
                        </div>
                    </div>
                </div>
                <div className="row m-0 d-flex flex-row py-2">
                    <div className="col-md-auto c-p font-weight-bold">
                        A.
                    </div>
                    <div className="col pr-0">
                        <textarea className="form-control" rows="3"></textarea>
                    </div>
                </div>
                <div className="row m-0 d-flex flex-row py-2 justify-content-between">
                    <div className="border-bottom-dotted col mr-2 d-flex flex-row pb-1">
                        <img src="/assets/images/icons/icons5.png" />
                        <h6 className="c-p pt-1 mb-0 px-3"> What is PH?</h6>
                    </div>
                    <div className="col-md-auto baseline-container col-sm-3 d-flex align-items-end p-0">
                        <div className="btn-group float-right " role="group" aria-label="status">
                            <button type="button" className="btn bg-light-r p-1"><small><i className="material-icons text-white">close</i></small></button>
                            <button type="button" className="btn bg-light-g p-1"><i className="material-icons text-white">done</i></button>
                            <button type="button" className="btn bg-grey p-1 text-white" >N/A</button>
                        </div>
                    </div>
                </div>
                <div className="row m-0 d-flex flex-row pt-2 pb-3 border-bottom-dotted ">
                    <div className="col-md-auto c-p font-weight-bold">
                        A.
                    </div>
                    <div className="col-md-10">
                        <input type="text" className="col-md-1" />
                    </div>
                </div>
                <div className="row m-0 d-flex flex-row py-2">
                    <div className="form-group col-md-12 p-0">
                        <label>Notes</label>
                        <textarea className="form-control" rows="3"></textarea>
                    </div>
                </div>
            </div>
            <div className="row m-0 col-md-12 p-0 justify-content-end mt-4">
                <div className="col-md-auto p-0">
                    <button type="button" className="btn text-white align-bottom bg-p"  data-toggle="modal" data-target="#patiendDetails">Incomplete</button>
                    <button type="button" className="btn text-white align-bottom bg-p">Schedule</button>
                    <button type="button" className="btn text-white align-bottom bg-p" data-toggle="modal" data-target="#reject">Reject</button>
                    <button type="button" className="btn text-white align-bottom bg-p" data-toggle="modal" data-target="#followUp">Follow Up</button>
                </div>
            </div>
        </div>
    );
  }
}

export default PatientDetails;
