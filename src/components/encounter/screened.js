/**
* Copyright (c) 2018
* @summary Add filter according to custom options
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

class Screened extends Component {

    constructor(props){
        super(props);
        this.state = {
            startDate :''
        }
    }

    handleChange =(date) => {
        this.setState({
            startDate: date
        });
    }

  render() {
    return (
    	<div>
            <section className=" baseline-container">
                <div className="border p-3 m-0 row justify-content-between">
                    <div className="row col-12 justify-content-between border-bottom-dotted m-0 mb-3 pb-2 px-0">
                        <div className="col-md-auto col-sm-auto p-0">
                            <h5 className="pt-2 c-p">Inclusion Exclusion Criteria</h5>
                        </div>
                        <div className="col-md-auto col-sm-auto text-right p-0">
                            <div className="edit-btn-group d-flex flex-row">
                                <span className="arrow d-flex flex-row">
                                    <i className="material-icons">chevron_right</i>
                                    <i className="material-icons">chevron_right</i>
                                </span>
                                <i className="material-icons active">mode_edit</i>
                                <i className="material-icons">save</i>
                                <i className="material-icons">clear</i>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 justifiy-content-between row ">
                        <div className="col-md-6 col-sm-12 p-0">
                            <div className="form-group ">
                                <label>When did subject first seek medical diagnosis/treatment?</label>
                                <div className="input-group col-md-6 col-lg-4 col-sm-6 p-0">
                                   <DatePicker
                                         onChange={this.handleChange}
                                         selected={this.state.startDate}
                                         placeholderText="DD/MMM/YYY"
                                         dateFormat="DD/MMM/YYYY"
                                      />
                                    <i className="glyphicon glyphicon-calendar dateicon"></i>
                                </div>
                            </div>
                            <div className="form-group ">
                                <label>First diagnosis of endometriosi</label>
                                 <div className="input-group col-md-6 col-lg-4 col-sm-6 p-0">
                                    <input type="text" className="form-control datepicker" placeholder="DD/MMM/YYYY" />
                                    <i className="glyphicon glyphicon-calendar dateicon"></i>
                                </div>
                            </div>
                            <div className="form-group ">
                                <label>When were the symptons first experienced?</label>
                                <input type="date" className="form-control col-md-6 col-lg-4 col-sm-6" />
                            </div>
                            <div className="form-group ">
                                    <label>When were the symptons first experienced?</label>
                                <input type="date" className="form-control col-md-6 col-lg-4 col-sm-6" />
                            </div>
                            <div className="form-group ">
                                    <label>When were the symptons first experienced?</label>
                                <input type="date" className="form-control col-md-6 col-lg-4 col-sm-6" />
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-12 p-sm-0">
                            <div className="form-group ">
                                <label>First surgical diagnosis</label>
                                <input type="date" className="form-control col-md-6 col-lg-4 col-sm-6" />
                            </div>
                            <div className="form-group ">
                                <label>What endometriosis symptons were experienced?</label>
                                <input type="text" className="form-control col-md-6 col-lg-4 col-sm-6" />
                            </div>
                            <div className="form-group  ">
                                <label>Dysmenorrhea</label>
                                <div className="col-md-4 col-sm-6 p-0 clearfix">
                                    <label className="switch arrow float-left">
                                        <input type="checkbox" />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>
                            <div className="form-group ">
                                <label>Non-menstrual pelvic pain</label>
                                <div className="col-md-4 col-sm-6 p-0 clearfix">
                                    <label className="switch arrow float-left">
                                        <input type="checkbox" />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>
                            <div className="form-group ">
                                <label>Infertility</label>
                                <div className="col-md-4 col-sm-6 p-0 clearfix">
                                    <label className="switch arrow float-left">
                                        <input type="checkbox" />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 p-0 mt-1">
                        <div className="form-group">
                            <label>Notes</label>
                            <textarea className="form-control" id="desc" rows="2"></textarea>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
  }
}

export default Screened;
