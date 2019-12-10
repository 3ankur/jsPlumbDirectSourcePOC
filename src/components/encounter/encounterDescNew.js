/**
* Copyright (c) 2018
* @summary Apllication All Domain Element Boxes
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React, { Component } from 'react';
import Filter from '../filter/filter';
import MenuOptions from '../menuoptions/menuoptions';
import EncounterDetailList from './encounterdetaillist';
import ApiService from '../../api';
import * as modalAction from '../../actions/modalActions';
import * as patientInfo from '../../actions/getPatientInfo';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux' ;
import {NotificationManager} from 'react-notifications';
import { MODAL_TYPE_SHEDULE_ENCOUNTER } from '../../constants/modalTypes';
import DateTime from 'react-datetime';
import common from '../../common/common';
import 'react-datetime/css/react-datetime.css';

class EncounterDetails extends Component {

   constructor(props, context){
        super(props, context);
        this.state = {
            hideEncounterBlock : false,
            subheaderOptions : {
                study : true,
                site:true,
                encounter:true,
                epoch:true,
                button : {
                    name : 'Schedule Encounter',
                    id : '#encounter',
                },
                rediobtn : {
                    name : 'Patient Check In'
                },
                dropDownOptions:{
                    multiSelect:false
                }
            } ,
            studySiteDetailsList:[],
            studyIdentifier :'',
            siteList : [],
            siteIdentifier : '',
            epochIdentifier : '',
            elementSearchTxt:"",
            patientsList : [],
            epochList:[],
            encounterList :[],
            encounterDetailsList : [],
            hasPatientCheckIn:null,
            filterData : [],
            unexpectedEncounter : false,
            toggleDisabled:false,
            unExpectedEnounterName:'',
            unexpectedEncounterDate:'',
            openDateCalender : false,
            disabledUnExpectedEnounterName : false,
            selectedEncounterId:"",
            selectedEpochId:"",
            isUnexpected:false,
            fromSheduleEncounter : false
        }
    }

    componentDidMount(){
        let data = { formGroupIdentifer : '' } ;
        if(this.props.match && this.props.match.params.epochIdentifier === 'fromUnexpectedEncounter'){
            this.setState({
                unexpectedEncounter : true
            });
            if(this.props.match && this.props.match.params.patientId && this.props.match.params.patientId !== 'null'){
               // data['formGroupIdentifer'] = this.props.match.params.patientId;
              //  this.loadEncounterDetailsBoxes(data);
              let randomGroup = this.props.match.params.patientId;
                ApiService.getUnexpectedEncounterDeatils(this.props.match.params.studyIdentity,this.props.match.params.patDetailIdentity,randomGroup).then((res)=>{
                    res.data && res.data.response && res.data.response.forEach( (o) => {
                        o.url = `/patientdetails/patientdescription/patientEncounter/element/${o.uniqueIdentifier}/${o.formUniqueIdentifier ? (o.formUniqueIdentifier === 'N/A' ? null : o.formUniqueIdentifier) : null}/${o.encounterIdentifier}/${this.props.match.params.patDetailIdentity}/${this.props.match.params.studyIdentity}/${this.props.match.params.siteIdentifier}/${this.props.match.params.epochIdentifier}`; //:siteIdentifier/:epochIdentifier studyIdentity
                    });

                    this.props.patientInfo &&  this.props.patientInfo.patientInfoAction(res && res.data && res.data.userInfoResponse);

                    this.setState({
                        encounterDetailsList : res && res.data && res.data.response && res.data.response,
                        unExpectedEnounterName:res && res.data && res.data.response && res.data.response.length > 0 && res.data.response[0].unexpectedEncounterName,
                        disabledUnExpectedEnounterName : (res && res.data && res.data.response && res.data.response.length > 0 && res.data.response[0].unexpectedEncounterName) ?  true : false,
                    },()=>{
                        localStorage.setItem('unExpectedEncounterName',this.state.unExpectedEnounterName)
                    });

                })
            }else{
                let randomGroup = common.getRandomNumber();
                ApiService.getUnexpectedEncounterDeatils(this.props.match.params.studyIdentity,this.props.match.params.patDetailIdentity,randomGroup).then((res)=>{
                    res.data && res.data.response && res.data.response.forEach( (o) => {
                        o.url = `/patientdetails/patientdescription/patientEncounter/element/${o.uniqueIdentifier}/${o.formUniqueIdentifier ? (o.formUniqueIdentifier === 'N/A' ? null : o.formUniqueIdentifier) : null}/${o.encounterIdentifier}/${this.props.match.params.patDetailIdentity}/${this.props.match.params.studyIdentity}/${this.props.match.params.siteIdentifier}/${this.props.match.params.epochIdentifier}`; //:siteIdentifier/:epochIdentifier studyIdentity
                    });

                    this.props.patientInfo &&  this.props.patientInfo.patientInfoAction(res && res.data && res.data.userInfoResponse);

                    this.setState({
                        encounterDetailsList : res && res.data && res.data.response && res.data.response,
                        unExpectedEnounterName:res && res.data && res.data.response && res.data.response.length > 0 && res.data.response[0].unexpectedEncounterName,
                        disabledUnExpectedEnounterName : (res && res.data && res.data.response && res.data.response.length > 0 && res.data.response[0].unexpectedEncounterName) ?  true : false,
                    },()=>{
                        localStorage.setItem('unExpectedEncounterName',this.state.unExpectedEnounterName)
                    });

                })
            }
        }else{
            data['formGroupIdentifer'] = this.props.match.params.patientId;
            ApiService.getEncounterDeatilFilterData(data).then((res)=>{
                res && res.data.response.forEach((d)=>{
                    d.id  = d.studyIdentifier;
                    d.name = d.studyName;
                });
                this.setState({ filterData : res && res.data && common.sortByOrder(res.data.response,'ASC','name') },()=>{
                    this.setState({
                        studySiteDetailsList : res && res.data && common.sortByOrder(res.data.response,'ASC','name')
                    })
                });
            });
            this.loadEncounterDetailsBoxes(data);
        }
    }
    //load element forms
    filterEncounterFormElement(){
}

    loadEncounterDetailsBoxes = (data)=>{
            ApiService.getEncounterDetailBoxes(data).then((res)=>{
                res.data && res.data.response && res.data.response.forEach( (o) => {
                    let studyIdentifier = this.state && this.state.studyIdentifier ? this.state.studyIdentifier : this.props.match.params.studyIdentity ;
                    let siteIdentifier = this.state && this.state.siteIdentifier ? this.state.siteIdentifier : this.props.match.params.siteIdentifier;
                    let encounterId =  this.state && this.state.selectedEncounterId ? this.state.selectedEncounterId : this.props.match.params.patientId ;
                    let epochId = this.state && this.state.epochIdentifier ? this.state.epochIdentifier :this.props.match.params.epochIdentifier;
                     o.url = `/patientdetails/patientdescription/patientEncounter/element/${o.uniqueIdentifier}/${o.formUniqueIdentifier}/${encounterId}/${this.props.match.params.patDetailIdentity}/${studyIdentifier}/${siteIdentifier}/${epochId}`; //:siteIdentifier/:epochIdentifier studyIdentity
                     if(o.encounterStartStatus > 0){
                        this.setState({toggleDisabled :true});
                    }
                    else{
                        this.setState({toggleDisabled :false});
                    }
                });

              this.props.patientInfo &&  this.props.patientInfo.patientInfoAction(res && res.data && res.data.userInfoResponse);

                this.setState({
                     encounterDetailsList : res && res.data && res.data.response && res.data.response,
                     disabledUnExpectedEnounterName : this.props.match && this.props.match.params.patientId ? true : false,
                     unExpectedEnounterName   :  res && res.data && res.data.response && res.data.response.length > 0 && res.data.response[0].unexpectedEncounterName
                },()=>{
                    localStorage.setItem('unExpectedEncounterName',this.state.unExpectedEnounterName)
                });
            });
    }

    onPopUpBtnClick = ()=>{
        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_SHEDULE_ENCOUNTER,{
            onSave : (data) => {
                let obj = {
                    formGroupIdentifer : this.props.match.params.patientId
                }
                ApiService.getEncounterDeatilFilterData(obj).then((res)=>{
                    res && res.data.response.forEach((d)=>{
                        d.id  = d.studyIdentifier;
                        d.name = d.studyName;
                    });
                    this.props.modalAction.hideModal();
                    this.setState({ filterData : res && res.data && common.sortByOrder(res.data.response,'ASC','name') },()=>{
                        this.setState({
                            studySiteDetailsList : res && res.data && common.sortByOrder(res.data.response,'ASC','name'),
                            fromSheduleEncounter : true
                        })
                    });
                });
            },
            info:this.state.studyIdentifier,
            patSiteId:this.props.match.params.patDetailIdentity,
            hideModal : ()=>{
                this.props.modalAction.hideModal();
            }
        });
    }

    //for search the encounter elemenr
    onElementSearch(e){
        e.preventDefault();
        this.setState({elementSearchTxt:e.target.value})

    }

    filterEpochEncounter(epoch){
       const epochList = this.state.epochList;
       let found =  epochList.filter( (o)=>{return o.name === epoch.name } )
       this.setState({encounterList:  found[0]["encounter"]});
    }

    onStudyChange = (options) =>{
        if(options){
            let filterSiteList = [];
            let selectedSiteData =  this.state.filterData.filter((item)=>{return item.studyIdentifier === options.id});
            selectedSiteData.forEach((item)=>{
                let tempObj = {};
                tempObj['id'] = item.siteIdentifier;
                tempObj['name'] = item.siteName;
                filterSiteList.push(tempObj);
            });
            //patientEncounterFilterEpochResponseList
            let updatedEpochList = [];
            let updatedEncounterList = [];
            if(this.state.fromSheduleEncounter){
                let prevSt = this.state.studySiteDetailsList;
                let studies =  prevSt.filter((item)=>{ return  item.studyIdentifier === this.state.studyIdentifier});
                updatedEpochList = studies && studies.length > 0 && studies[0].patientEncounterFilterEpochResponseList;
                updatedEpochList && updatedEpochList.forEach((data)=>{
                    data.id = data.epochIdentifier;
                    data.name = data.epochName;
                });
                updatedEncounterList = updatedEpochList && updatedEpochList.filter((item )=>{return item.epochIdentifier === this.state.selectedEpochId});
                updatedEncounterList && updatedEncounterList.length > 0 && updatedEncounterList[0].encounter.forEach((data)=>{
                    data.id = data.formGroupIdentifier;
                    data.name = data.encounterName;
                });
            }
            this.setState({
                siteList : filterSiteList && common.sortByOrder(filterSiteList,'ASC','name'),
                studyIdentifier : options.id,
                epochList : updatedEpochList,
                encounterList : updatedEncounterList
            },()=>{
                this.setState({
                    fromSheduleEncounter : false
                })
            });
        }
    }

    onSiteChange = (options) =>{
        if(options){
            let filterEpochList = [];
            let selectedEpochData =  this.state.filterData.filter((item)=>{return item.siteIdentifier === options.id});
            selectedEpochData.length > 0 && selectedEpochData[0].patientEncounterFilterEpochResponseList.forEach((item)=>{
                let tempObj = {};
                tempObj['id'] = item.epochIdentifier;
                tempObj['name'] = item.epochName;
                filterEpochList.push(tempObj);
            });
            this.setState({
                epochList : common.sortByOrder(filterEpochList,'ASC','name'),
                siteIdentifier : options.id
            });
        }
    }

    onEpochChange = (options) =>{
        if(options){
            if(options.id && (options.id).indexOf("Unexpected") > -1){
                this.setState({isUnexpected:true,subheaderOptions:{
                    ...this.state.subheaderOptions,
                    rediobtn:{}
                }});
            }else{
                this.setState({isUnexpected:false,subheaderOptions:{
                    ...this.state.subheaderOptions,
                    rediobtn:{name : 'Patient Check In'}
                }});
            }

            let filterEncounterList = [];
            let siteData =  this.state.filterData.filter((item)=>{
                return item.siteIdentifier === this.state.siteIdentifier
            });
            let selectedEpochList = siteData.length && siteData[0].patientEncounterFilterEpochResponseList.filter((item)=>{
                return item.epochIdentifier === options.id
            });
            selectedEpochList.length && selectedEpochList[0].encounter.forEach((item)=>{
                let tempObj = {};
                tempObj['id'] = item.formGroupIdentifier  //item[Object.keys(item)[0]]
                tempObj['name'] = item.encounterName//Object.keys(item)[0];
                filterEncounterList.push(tempObj);
            });
            this.setState({
                encounterList : common.sortByOrder(filterEncounterList,'ASC','name'),
                epochIdentifier : options.id,
                selectedEpochId : options.id
            });
        }
    }

    patientCheckInHandler(e,type){
        let checktype="";
        if(e =="yes"){
         checktype = 1;
        }else if(e == "no"){
            checktype = 2;
        }else{
            checktype = 0;
        }
        let checkinData = {
            "checkinStatus": checktype,
            "patientFormGroupIdentefier": this.state.selectedEncounterId ? this.state.selectedEncounterId : this.props.match.params.patientId
        };
        ApiService.checkinPatient(checkinData).then((res) => {
            let data = {formGroupIdentifer : this.state.selectedEncounterId ? this.state.selectedEncounterId :  this.props.match.params.patientId}
                this.loadEncounterDetailsBoxes(data);
        },(error) => {
            NotificationManager.error('something went wrong');
        });
    }

    encounterChangeHandeler =(dt)=>{
        let data = {    formGroupIdentifer : dt.id}
        this.setState({selectedEncounterId:dt.id})
        this.loadEncounterDetailsBoxes(data)
    }

    onSaveUnexpectedEncounter = ()=>{
        if(this.state.unExpectedEnounterName){
            common.clearNotification();
            NotificationManager.success("Data save succesfully");
        }else{
            common.clearNotification();
            NotificationManager.error("Please fill the End Date fields");
        }
    }

    onChangeName = (event)=>{
        this.setState({
            [event.target.name] : event.target.value
        },()=>{
            localStorage.setItem('unExpectedEncounterName',this.state.unExpectedEnounterName)
        })
    }


    onChangeUnexpectedDate = (moment) =>{
        this.setState({
            unexpectedEncounterDate : common.formatDate(moment && moment._d,'DD/MMM/YYYY'),
            openDateCalender : false
        });
    }


  render({props,state} = this ) {
    let { subheaderOptions,encounterDetailsList } = state;
    // if(encounterDetailsList.length > 0){
    //     encounterDetailsList[2].domainCode="EREVPI";
    //     encounterDetailsList[2].SmPiEnabled = 0;
    // }
    // console.log("encounterDetailsList",encounterDetailsList);
      if(this.state.elementSearchTxt){
        encounterDetailsList = encounterDetailsList.filter( (row)=>{return  row.elementName && row.elementName.toLowerCase().indexOf(this.state.elementSearchTxt && this.state.elementSearchTxt.toLowerCase().trim())>-1 } )
      }
    return (
        <span>
            {state.unexpectedEncounter ?
               <section className='unexpected-enc'>
                    <div className="border p-3 m-0 row justify-content-between">
                        <div className="row col-12 justify-content-between  border-light-p m-0 mb-1 pb-1 px-0">
                            <div className="col-md-auto col-sm-auto p-0">
                                    <h5 className="c-p pt-2">Unexpected Encounter Details</h5>
                            </div>
                        </div>
                        <div className="col-12 form-row p-0 clearfix row m-0">
                            <div className="col-6 col-sm-12 col-md-6 mt-1">
                                <div className="form-row">
                                    <div className="col-2 text-right p-2 bg-light-pink border-white">
                                        <label className="mb-0 pt-1">Name</label>
                                    </div>
                                    <div className="col-md-10 col-sm-10 bg-light-grey1 p-2">
                                        <input type="text" disabled={state.disabledUnExpectedEnounterName} name='unExpectedEnounterName' value={this.state.unExpectedEnounterName} onChange={this.onChangeName} className="form-control col-sm-12 col-md-4 reqfeild"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section> : <Filter
                fullData = {this.state.encounterDetailsList}
                options={subheaderOptions}
                studySiteDetailsList={this.state.studySiteDetailsList}
                siteStudyChanged={this.onStudyChange}
                onSiteChange={this.onSiteChange}
                siteList = {this.state.siteList}
                onPopUpBtnClick={this.onPopUpBtnClick}
                patientList={this.state.patientsList}
                epochList={this.state.epochList}
                onEpochChange={this.onEpochChange}
                encounterList ={this.state.encounterList}
                filterEncounter={this.filterEpochEncounter.bind(this)}
                hasPatientCheckIn={this.patientCheckInHandler.bind(this)}
                toggleDisabled={this.state.toggleDisabled}
                encounterChangeHandeler={this.encounterChangeHandeler.bind(this)}
             />
            }
            <section className="encounter-details">
                <div className="row border p-3 m-0 my-2">
                    <div className="row col-md-12 m-0 p-0 justify-content-between">
                        <div className="col p-0"><h5 className=" c-p mb-0 pt-1">Encounter Details</h5></div>
                        <div className="col-auto d-flex flex-row">
                            <span className="px-2 pt-1">Search</span>
                            <div className="input-group border">
                                <input className="form-control border-0" placeholder="" onChange={this.onElementSearch.bind(this)}  />
                                <div className="input-group-addon px-2 bg-p search-icon"><i className="material-icons pt-2 text-white">search</i></div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 row justify-content-start pr-0">
                        { encounterDetailsList && encounterDetailsList.map((encounter,i) =><EncounterDetailList
                        unexpectedEncounter={this.state.unexpectedEncounter}
                        key={i} encounter={encounter} patientId={this.props.match && this.props.match.params.patientId}
                        loadEncounterDetailData={this.loadEncounterDetailsBoxes}
                        unExpectedEncounterData={this.state} /> )}
                    </div>
                </div>
            </section>
        </span>
    );
  }
}

function mapDispatchToProps(dispatch) {
    return { modalAction  : bindActionCreators(modalAction,dispatch),
             patientInfo  : bindActionCreators(patientInfo,dispatch)
     };
}


function mapStateToProps(state){
    return { modal : state.modal }
}

export default connect(mapStateToProps , mapDispatchToProps)(EncounterDetails);
