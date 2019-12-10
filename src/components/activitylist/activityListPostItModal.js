/**
* Copyright (c) 2018
* @summary This file is use under  activitylist - postit modal
            Open modal when user click on addPostIt Button
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React,{Component} from 'react';
import { connect } from 'react-redux';
import Modal from '../modaldialog/modal';
import DateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import ApiService from '../../api';
import ReactSuperSelect from 'react-super-select';
import '../../../node_modules/react-super-select/lib/react-super-select.css';
import common from '../../common/common';
import { NotificationManager } from 'react-notifications';



class ActivityListPostIt extends Component{

    constructor(props){
        super(props);
        this.state = {
            openDueDatePicker : false,
            title:'',
            description : '',
            dueDate:'',
            study:'',
            studyIdentifier : '',
            site:'',
            siteIdentifier:'',
            patient:'',
            patientIdentifier:'',
            studySiteDetailsList:[],
            patientList:[],
            siteList:[]
        },
        this.editPostitResponse = '';
    }

    componentDidMount(){
        ApiService.get_all_studies().then((res)=>{
            res && res.data.response.forEach( (d)=>{
                d.id  = d.uniqueIdentifier;
                d.name = d.studyName;
            });
            this.setState({studySiteDetailsList:res.data.response},()=>{
                if(this.props.postItEditData){
                    ApiService.editPostit(this.props.postItEditData && this.props.postItEditData.uniqueIdentifier).then((res) => {
                        let studyFound = this.state.studySiteDetailsList.filter((o)=>{return o.id==res.data.response.studyIdentifier} )
                        this.editPostitResponse  = res.data && res.data.response;
                        //let siteFound = this.state.siteList.filter((o)=>{return o.id==res.data.response.siteIdentifier} )
                        //let patientFound = this.state.patientList.filter((o)=>{return o.id==res.data.response.sitePatientIdentifier} )
                        this.setState({
                            title : res.data.response.postitTitle,
                            description :  res.data.response.postitDescription,
                            dueDate : res.data.response.postitDueDate,
                           // patient :patientFound.length >0 ? patientFound[0]["name"] : null,
                            study :  studyFound.length >0 ? studyFound[0]["name"] : null,
                            //site:siteFound.length >0 ? siteFound[0]["name"] : null,
                            studyIdentifier:res.data.response.studyIdentifier
                        });
                      }, (error) => {
                          common.clearNotification();
                          NotificationManager.error('something went wrong');
                     });
                }
            });

        });


    }

    onClose = ()=>{
        this.props.hideModal && this.props.hideModal();
    }

    onSavePostIt = (done) =>{
        if(this.state.title && this.state.description && this.state.dueDate && this.state.study){
            this.props.onSave &&  this.props.onSave(this.state,done,this.props.postItEditData && this.props.postItEditData.uniqueIdentifier);
        }else{
            common.clearNotification();
            NotificationManager.error('Please fill the required fields');
        }
    }

    customOptionTemplateFunction = (item, search, searchRegex) => {
        return <span title={item.name}>{item.name}</span>
    }

    handleStudyChange = (options)=>{
        if(options){
            this.setState({
                study : options.name,
                studyIdentifier : options.id
            });
            let data = options.id;
            ApiService.GetPopulatedStudyDetails(data).then((res) => {
                res && res.data.response.listOfSites.forEach( (d)=>{
                    d.id  = d.unique_identifier;
                    d.name = d.site_name;
                });
              this.setState({ siteList : common.sortByOrder(res.data.response.listOfSites || [] ,'ASC','name') , patientList : [] , patient : '' ,patientIdentifier:''},()=>{
                    if(this.props.postItEditData){
                        let siteFound = this.state.siteList.filter((o)=>{return o.id == this.editPostitResponse.siteIdentifier} )
                        this.setState({site:siteFound.length >0 ? siteFound[0]["name"] : null ,
                        siteIdentifier: siteFound.length >0  ? this.editPostitResponse.siteIdentifier : ''})
                    }
                });
            },(error) => {
                NotificationManager.error('something went wrong');
            });
        }
    }

    handlePatientChange = (options)=>{
        if(options){
            this.setState({
                patient : options.name,
                patientIdentifier : options.id
            })
        }else{
            this.setState({
                patientIdentifier : '',
                patient : ''
            })
        }
    }

    onChangeTextVal = (e)=>{
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    onChangeDueDate = (moment) =>{
        this.setState({
            dueDate : moment && moment._d,//common.formatDate(moment && moment._d,'YYYY-MM-DD'),
            openDueDatePicker : false
        });
    }

    handleSiteChange = (options)=>{
        let parameter = {};
        if(options){
            this.setState({
                site : options.name,
                siteIdentifier : options.id
            },()=>{
                parameter.studyId = this.state.studyIdentifier;
                parameter.siteId = this.state.siteIdentifier;
                ApiService.getPatientListByStudySiteId(parameter).then((res)=>{
                    res&& res.data &&  res.data.response && res.data.response.forEach((d)=>{
                        d.id  = d.uniqueIdentifier;
                        d.name = d.patientName;
                    });
                    this.setState({patientList:res.data.response || []
                    },()=>{
                        if(this.props.postItEditData){
                            let patientFound = this.state.patientList.filter((o)=>{return o.id == this.editPostitResponse.sitePatientIdentifier} )
                            this.setState( { patient :patientFound.length > 0 ? patientFound[0]["name"] : null,
                            patientIdentifier: patientFound.length > 0 ? this.editPostitResponse.sitePatientIdentifier : ''
                         });
                        }
                    });
                })
            });
        }else{
            this.setState({patientList:[],siteIdentifier:'',patientIdentifier:''});
        }
    }

    customSelectedValueTemplateFunction = (selectedItmes) => {
        return (
            <div className='selected-dropdown-itmes'>
                {
                    selectedItmes.map((item) => {
                        return (
                            <span key={item.id ? item.id : common.getRandomNumber()}>
                                {item.name}
                                {selectedItmes.length > 1 ? ',' : ''}
                            </span>
                        )
                    })
                }
            </div>
        )
    }

    getSelectedOption = (id,dataSource)=>{
        let filterArray = dataSource && dataSource.length > 0 && dataSource.filter((o)=>{ return o.id === id });
        return filterArray && filterArray.length > 0 && filterArray[0] ? filterArray[0] : null
    }

    render({props,state} = this){
        let { afterClose, hideModal, onSave } = props;
        return (
            <Modal onClose={this.onClose} className={props.className}>
                <div className="modal-header border-bottom-p mx-4 p-0 py-3">
                    {props.postItEditData ? <h5 className="modal-title c-p" id="exampleModalLabel">Edit Postit</h5> :
                        <h5 className="modal-title c-p" id="exampleModalLabel">Add Postit</h5>
                    }
                    <button type="button" className="close c-p" data-dismiss="modal" aria-label="Close" onClick={this.onClose}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body px-4 text-left">
                    <form>
                        <div className="form-group ">
                            <label htmlFor="title">Title</label>
                            <input className="form-control reqfeild" type="text" value={state.title} onChange={this.onChangeTextVal} name='title' />
                        </div>
                        <div className="form-group">
                            <label htmlFor="desc">Description</label>
                            <textarea className="form-control reqfeild" value={state.description} name='description' onChange={this.onChangeTextVal} rows="3"></textarea>
                        </div>
                        <div className="form-group col-md-4 col-sm-6 p-0">
                                <label htmlFor="date">Due Date</label>
                                <DateTime dateFormat="DD/MMM/YYYY"
                                    timeFormat={false}
                                    onChange={(event)=>this.onChangeDueDate(event)}
                                    closeOnSelect={true}
                                    open={this.state.openDueDatePicker}
                                    input={true}
                                    className='reqfeild'
                                    value={state.dueDate}
                                    inputProps={{ readOnly: true }}
                                />
                                <i className="glyphicon glyphicon-calendar dateicon3 cursor-pointer" onClick={()=>this.setState({openDueDatePicker : !this.state.openDueDatePicker})}></i>
                        </div>
                    </form>
                </div>
                <div className="modal-footer text-left text-white footer-bg-light">
                    <div className="row col-12 p-0 justify-content-between">
                        <div className="col-md-8 col-sm-8 p-0">
                            <div className="form-row p-0 col-12">
                                <div className="form-group col-4 custred">
                                    <label htmlFor="title" className="c-p"><strong>Study</strong></label>
                                    <ReactSuperSelect
                                        placeholder="Select"
                                        clearSearchOnSelection={true}
                                        dataSource={this.state.studySiteDetailsList || [] }
                                        onChange={this.handleStudyChange}
                                        searchable={true}
                                        multiple={false}
                                        keepOpenOnSelection={false}
                                        closeOnSelectedOptionClick={false}
                                        deselectOnSelectedOptionClick={true}
                                        customClass='select-container'
                                        customOptionTemplateFunction={this.customOptionTemplateFunction}
                                        customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                        clearable = {false}
                                        initialValue={ this.state && this.state.studyIdentifier ? this.getSelectedOption(this.state.studyIdentifier,this.state.studySiteDetailsList) : null }
                                    />
                                </div>
                                <div className="form-group col-4">
                                    <label htmlFor="title" className="c-p"><strong>Site</strong></label>
                                    <ReactSuperSelect
                                        placeholder="Select"
                                        clearSearchOnSelection={true}
                                        dataSource={state.siteList || [] }
                                        onChange={this.handleSiteChange}
                                        searchable={true}
                                        multiple={false}
                                        keepOpenOnSelection={false}
                                        closeOnSelectedOptionClick={false}
                                        deselectOnSelectedOptionClick={true}
                                        customClass='select-container'
                                        customOptionTemplateFunction={this.customOptionTemplateFunction}
                                        customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                        clearable = {false}
                                        initialValue={ props.postItEditData && state.siteIdentifier ? this.getSelectedOption(this.state.siteIdentifier,state.siteList)  : null}
                                    />
                                </div>
                                <div className="form-group col-4">
                                        <label htmlFor="title" className="c-p"><strong>Patient</strong></label>
                                        <ReactSuperSelect
                                            placeholder="Select"
                                            clearSearchOnSelection={true}
                                            dataSource={this.state.patientList || [] }
                                            onChange={this.handlePatientChange}
                                            searchable={true}
                                            multiple={false}
                                            keepOpenOnSelection={false}
                                            closeOnSelectedOptionClick={false}
                                            deselectOnSelectedOptionClick={true}
                                            customClass='select-container'
                                            customOptionTemplateFunction={this.customOptionTemplateFunction}
                                            customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                            clearable = {false}
                                            initialValue={props.postItEditData && state.patientIdentifier ?this.getSelectedOption(this.state.patientIdentifier,state.patientList) : null}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 col-sm-4 mt-2">
                            <br/>
                            { props.postItEditData && <button type="button" className="btn text-white align-bottom bg-p mr-2" onClick={()=>this.onSavePostIt(true)}>Done</button>
                            }
                            <button type="button" className="btn text-white align-bottom bg-p mr-2" onClick={()=>this.onSavePostIt()}>
                                { props.postItEditData &&  'Save'  }
                                { !props.postItEditData &&  'Add'  }
                            </button>
                            <button type="button" className="btn text-white align-bottom bg-p" onClick={this.onClose}>Cancel</button>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }

}

export default connect(null, null )(ActivityListPostIt);