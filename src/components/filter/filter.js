/**
* Copyright (c) 2018
* @summary Add filter according to custom options
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React, { Component } from 'react';
import ReactSuperSelect from 'react-super-select';
import '../../../node_modules/react-super-select/lib/react-super-select.css';
import * as site_actions from '../../actions/getAllSites';
import * as study_actions from '../../actions/getAllStudies';
import * as modalAction from '../../actions/modalActions';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux' ;
import { MODAL_TYPE_Add_Patient } from '../../constants/modalTypes';
import { withLastLocation } from 'react-router-last-location';
import RouteParser from 'route-parser';

class Filter extends Component {
    constructor(props){
        super(props);
        this.state={
            slectedSiteOption:'',
            persistStudyName:null,
            isPatientCheckIn:0,
            persistEpochName:null,
            persistSiteName:null,
            persistEncounterName : null

        }
        this.epochFilterChangeCount =0;
        this.siteFilterChangeCount =0;
        this.encounterPath = false;
    }
    componentDidMount(){
        if(this.props.location && this.props.location.pathname.indexOf("/patientdetails/patientdescription/patientEncounter/")>-1){
            this.encounterPath = true;
        }
        this.props.getAllSites.getAllSitesAction();
        this.props.getAllStudies.getAllStudiesAction();
        if(this.props.fullData && this.props.fullData.length && this.props.fullData[0].patientCheckInStatus == 1 ){
            this.setState({isPatientCheckIn:1})
        }
        else if(this.props.fullData && this.props.fullData.length && this.props.fullData[0].patientCheckInStatus == 2 ){
            this.setState({isPatientCheckIn:2})
        }
        //
    }

    componentWillReceiveProps(nextProps) {
        try{
        let foundEncounterData = [];
        let menuLevel = localStorage.getItem("fromMenu") && JSON.parse(localStorage.getItem("fromMenu")) ;
        if(!menuLevel){
            if (nextProps.studySiteDetailsList !== this.props.studySiteDetailsList ) {
                if(nextProps.lastLocation){
                     if(nextProps.lastLocation && nextProps.lastLocation.pathname.indexOf("/protocol-details/protocol-setup-new/protocol-encounter-setup/protocol-element-setup/")>-1
                    && nextProps.location && nextProps.location.pathname==="/protocol-details"){
                        var route = new RouteParser('/protocol-details/protocol-setup-new/protocol-encounter-setup/protocol-element-setup/:study/:versionId/:studyId/:protocolVersion/:protocolName/:protocolIdentity/:domain_key/:element_name/:element_logo/:who_did/:when_did/:element_identifier');
                        const params =  route.match(nextProps.lastLocation.pathname)
                        const foundRd = nextProps.studySiteDetailsList && nextProps.studySiteDetailsList.filter( (o)=>{
                            return o.studyName ==params.study;
                        })
                        foundRd.length ? this.setState({persistStudyName:foundRd[0]}) : null
                    }

                    else  if(nextProps.lastLocation && nextProps.lastLocation.pathname.indexOf("/protocol-details/protocol-setup-new/protocol-element-setup/")>-1
                    && nextProps.location && nextProps.location.pathname==="/protocol-details"){
                        var route = new RouteParser('/protocol-details/protocol-setup-new/protocol-element-setup/:study/:versionId/:studyId/:protocolVersion/:protocolName/:protocolIdentity/:domain_key/:element_name');
                        const params =  route.match(nextProps.lastLocation.pathname)
                        const foundRd = nextProps.studySiteDetailsList && nextProps.studySiteDetailsList.filter( (o)=>{
                            return o.studyName ==params.study;
                        })
                        foundRd.length ? this.setState({persistStudyName:foundRd[0]}) : null
                    }

                    else  if(nextProps.lastLocation && nextProps.lastLocation.pathname.indexOf("/protocol-details/protocol-setup-new/protocol-encounter-setup/")>-1
                    && nextProps.location && nextProps.location.pathname==="/protocol-details"){
                        var route = new RouteParser('/protocol-details/protocol-setup-new/protocol-encounter-setup/:study/:versionId/:studyId/:protocolVersion/:protocolName/:protocolIdentity');
                        const params =  route.match(nextProps.lastLocation.pathname)
                        const foundRd = nextProps.studySiteDetailsList && nextProps.studySiteDetailsList.filter( (o)=>{
                            return o.studyName ==params.study;
                        })
                        foundRd.length ? this.setState({persistStudyName:foundRd[0]}) : null
                    }

                    else if(nextProps.lastLocation && nextProps.lastLocation.pathname.indexOf("/protocol-details/protocol-setup-new/")>-1
                    && nextProps.location && nextProps.location.pathname==="/protocol-details"
                ){
                    var route = new RouteParser('/protocol-details/protocol-setup-new/:study/:versionId/:studyId/:protocolVersion/:protocolName/:protocolIdentity');
                    const params =  route.match(nextProps.lastLocation.pathname)
                    const foundRd = nextProps.studySiteDetailsList && nextProps.studySiteDetailsList.filter( (o)=>{
                        return o.studyName ==params.study;
                    })
                    foundRd.length ? this.setState({persistStudyName:foundRd[0]}) : null
                } else if(nextProps.lastLocation && nextProps.lastLocation.pathname.indexOf("/protocol-details/setup-preview/")>-1
                    && nextProps.location && nextProps.location.pathname==="/protocol-details"){
                        var route = new RouteParser('/protocol-details/setup-preview/:study/:versionId/:studyId/:protocolVersion/:publishDate/:protocolName/:protocolStatus/:protocolIdentity');
                        const params =  route.match(nextProps.lastLocation.pathname)
                        const foundRd = nextProps.studySiteDetailsList && nextProps.studySiteDetailsList.filter( (o)=>{
                            return o.studyName ==params.study;
                        })
                        foundRd.length ? this.setState({persistStudyName:foundRd[0]}) : null
                    }  else if(nextProps.lastLocation && nextProps.lastLocation.pathname.indexOf("/studysitedetails/siteDetails/")>-1
                    && nextProps.location && nextProps.location.pathname==="/studysitedetails"){
                        var route = new RouteParser('/studysitedetails/siteDetails/:siteName/:studyName');
                        const params =  route.match(nextProps.lastLocation.pathname)
                        const foundRd = nextProps.studySiteDetailsList && nextProps.studySiteDetailsList.filter( (o)=>{
                            return o.uniqueIdentifier ==params.studyName;
                        })
                        foundRd.length ? this.setState({persistStudyName:foundRd[0]}) : null
                    }
                    else if(nextProps.location && nextProps.location.pathname.indexOf("/patientdetails/patientdescription/")>-1
                ){
                    var route = new RouteParser('/patientdetails/patientdescription/patientEncounter/:patientId/:patDetailIdentity/:studyIdentity/:siteIdentifier/:epochIdentifier');
                    const params =  route.match(nextProps.location.pathname)

                    const foundRd = nextProps.studySiteDetailsList && nextProps.studySiteDetailsList.filter( (o)=>{
                        return o.studyIdentifier ==params.studyIdentity;
                    })
                    foundRd.length ? this.setState({persistStudyName:foundRd[0]}) : null

                    const foundSiteData = nextProps.studySiteDetailsList && nextProps.studySiteDetailsList.filter( (o)=>{
                        return o.siteIdentifier == params.siteIdentifier;
                    })

                    // foundSiteData.length &&  foundSiteData.forEach((siteItem)=>{
                    //     siteItem.id = siteItem.siteIdentifier;
                    //     siteItem.name = siteItem.siteName;
                    // });
                    foundSiteData.length ? this.setState({ persistSiteName :{ id : foundSiteData[0].siteIdentifier , name : foundSiteData[0].siteName}}) : null;

                    const foundEpochData = foundSiteData && foundSiteData.length && foundSiteData[0].patientEncounterFilterEpochResponseList.filter( (o)=>{
                        return o.epochIdentifier == params.epochIdentifier;
                    });
                    foundEpochData.length && foundEpochData.forEach((epochItem)=>{
                        epochItem.id = epochItem.epochIdentifier;
                        epochItem.name = epochItem.epochName;
                    });
                    foundEpochData.length ? this.setState({persistEpochName :foundEpochData[0]}) : null;

                    foundEncounterData = foundEpochData && foundEpochData.length && foundEpochData[0].encounter.filter( (o)=>{
                        return o.formGroupIdentifier == params.patientId;
                    });
                    foundEncounterData.length && foundEncounterData.forEach((enounterItem)=>{
                        enounterItem.id = enounterItem.formGroupIdentifier;
                        enounterItem.name = enounterItem.encounterName;
                    });
                    foundEncounterData.length ? this.setState({persistEncounterName :foundEncounterData[0]}) : null;
                   // this.epochFilterChangeCount++;
                }

                //condition for patient filter
                else if(nextProps.location && nextProps.location.pathname.indexOf("/patientdetails")>-1){
                    if(localStorage.getItem("Patient_StudyName") && localStorage.getItem("Patient_StudyName")!=""){
                        let selectedStudy = JSON.parse(localStorage.getItem("Patient_StudyName"));
                        selectedStudy ? this.setState({persistStudyName:selectedStudy}) : null
                    }else{
                        this.setState({persistStudyName:{name:"Select",id:"9999999999"} })
                    }
                    if(localStorage.getItem("Patient_SiteName") && localStorage.getItem("Patient_SiteName")!=""){
                        let selectedSite = JSON.parse(localStorage.getItem("Patient_SiteName"));
                        selectedSite ? this.setState({persistSiteName:selectedSite}) : null
                    }
                    else{
                        this.setState({persistSiteName:{name:"Select",id:"9999999999"} })
                    }
                    if(localStorage.getItem("Patient_Status") && localStorage.getItem("Patient_Status")!=""){
                        let selectedPatientStatus = JSON.parse(localStorage.getItem("Patient_Status"));
                        selectedPatientStatus ? this.setState({persistPatientStatus:selectedPatientStatus}) : null
                    }
                    else{
                        this.setState({persistPatientStatus:{name:"Select",id:"9999999999"} })
                    }
                    localStorage.setItem("Patient_StudyName","")
                    localStorage.setItem("Patient_SiteName","")
                    localStorage.setItem("Patient_Status","")
                }

                }
                else{
                     if(nextProps.location && nextProps.location.pathname.indexOf("/patientdetails/patientdescription/")>-1){
                        var route = new RouteParser('/patientdetails/patientdescription/patientEncounter/:patientId/:patDetailIdentity/:studyIdentity/:siteIdentifier/:epochIdentifier');
                        const params =  route.match(nextProps.location.pathname)

                        const foundRd = nextProps.studySiteDetailsList && nextProps.studySiteDetailsList.filter( (o)=>{
                            return o.studyIdentifier ==params.studyIdentity;
                        })
                        foundRd.length ? this.setState({ persistStudyName:foundRd[0]} ) : null;

                        const foundSiteData = nextProps.studySiteDetailsList && nextProps.studySiteDetailsList.filter( (o)=>{
                            return o.siteIdentifier == params.siteIdentifier;
                        })

                        foundSiteData.length ? this.setState({ persistSiteName : { id : foundSiteData[0].siteIdentifier , name : foundSiteData[0].siteName}}) : null;

                        const foundEpochData = foundSiteData && foundSiteData.length && foundSiteData[0].patientEncounterFilterEpochResponseList.filter( (o)=>{
                            return o.epochIdentifier == params.epochIdentifier;
                        });
                        foundEpochData.length && foundEpochData.forEach((epochItem)=>{
                            epochItem.id = epochItem.epochIdentifier;
                            epochItem.name = epochItem.epochName;
                        });
                        foundEpochData.length ? this.setState({persistEpochName :foundEpochData[0]}) : null;

                        foundEncounterData = foundEpochData && foundEpochData.length && foundEpochData[0].encounter.filter( (o)=>{
                            return o.formGroupIdentifier == params.patientId;
                        });
                        foundEncounterData.length && foundEncounterData.forEach((enounterItem)=>{
                            enounterItem.id = enounterItem.formGroupIdentifier;
                            enounterItem.name = enounterItem.encounterName;
                        });
                        foundEncounterData.length ? this.setState({persistEncounterName :foundEncounterData[0]}) : null;
                    }

                     if(nextProps.location.pathname === "/patientdetails"){
                         localStorage.setItem("Patient_StudyName","")
                        localStorage.setItem("Patient_SiteName","")
                        localStorage.setItem("Patient_Status","")
                        this.setState({persistStudyName:{name:"Select",id:"9999999999"} })
                        this.setState({persistSiteName:{name:"Select",id:"8888888888"}})

                    }


                }
            }

            if( nextProps.fullData != this.props.fullData) {
                if(nextProps.fullData && nextProps.fullData.length && nextProps.fullData[0].patientCheckInStatus == 1 ){
                    this.setState({isPatientCheckIn:1})
                }
                else if(nextProps.fullData && nextProps.fullData.length && nextProps.fullData[0].patientCheckInStatus == 2 ){
                    this.setState({isPatientCheckIn:2})
                }
                else{
                    this.setState({isPatientCheckIn:0})
                }
            }
        }else{

            localStorage.setItem("fromMenu","false")
        }

     }
     catch(e){
        console.log(e)
     }
    }

    handleSiteChange =(options)=>{
        var route = new RouteParser('/patientdetails/patientdescription/patientEncounter/:patientId/:patDetailIdentity/:studyIdentity/:siteIdentifier/:epochIdentifier');
        const params =  route.match(this.props.location.pathname);
        const prevst = this.props.studySiteDetailsList;

        const newSite = options && prevst && prevst.filter((o)=>{
            return o.siteIdentifier === options.id
        });
        const epochlist = newSite && newSite.length && newSite[0].patientEncounterFilterEpochResponseList.filter((o)=>{
            return o.epochIdentifier === params.epochIdentifier;
        })
        this.setState({ persistEpochName : epochlist && epochlist.length > 0 ? {id: epochlist[0].id || epochlist[0].epochIdentifier , name : epochlist[0].name || epochlist[0].epochName } : null} )

        options && this.props.onSiteChange && this.props.onSiteChange(options);
    }

    handleStudyChange =(options)=>{
        if(this.props.location.pathname!="/patientdetails"){
            var route = new RouteParser('/patientdetails/patientdescription/patientEncounter/:patientId/:patDetailIdentity/:studyIdentity/:siteIdentifier/:epochIdentifier');
            const params =  route.match(this.props.location.pathname);
            const foundRd = options && options.studyIdentifier === params.siteIdentifier ? params.siteIdentifier : '';
            this.setState({ persistSiteName: foundRd ? {id: options.studyIdentifier , name : options.siteName } : null} )
         }
          else{
              if(this.siteFilterChangeCount>0){
                this.setState({persistSiteName : null})
              }
            this.siteFilterChangeCount++;
         }
        this.props.siteStudyChanged ? this.props.siteStudyChanged(options) : ''
    }


    handleStatusChange = (options)=>{
        this.props.statusChange ? this.props.statusChange(options) : ''
    }


    handlePatientChange =(opt)=>{
    }



    handleEpochChange =  (options)=>{
        // var route = new RouteParser('/patientdetails/patientdescription/patientEncounter/:patientId/:patDetailIdentity/:studyIdentity/:siteIdentifier/:epochIdentifier');
        // const params =  route.match(this.props.location.pathname);
        // const foundEncounterData = options && options.encounter && options.encounter.filter( (o)=>{
        //     return o.formGroupIdentifier == params.patientId;
        // });
        // foundEncounterData && foundEncounterData.length && foundEncounterData.forEach((enounterItem)=>{
        //     enounterItem.id = enounterItem.formGroupIdentifier;
        //     enounterItem.name = enounterItem.encounterIdentifier;
        // });
        // this.setState({persistEncounterName :  options ?  options : null });

        options ? this.epochFilterChangeCount++ : '';
        if(options && this.epochFilterChangeCount>2){
            this.setState({persistEncounterName :  null });
        }
        this.props.onEpochChange ? this.props.onEpochChange(options) : '';

    }

    //try to use count to fix this
    handleEncounterChange =(opt)=>{
        try{
            this.props.encounterChangeHandeler ?  this.props.encounterChangeHandeler(opt) : ''
        }catch(e){

        }

    }

    customSelectedValueTemplateFunction = (selectedItmes) =>{
        return(
            <div className='selected-dropdown-itmes'>
                { selectedItmes.map((item)=>{
                    return(
                        <span key={item.id}>
                            {item.name}
                            { selectedItmes.length > 1 ? ',' : ''}
                        </span>
                    )
                    })
                }
            </div>
        )
    }
    handlePatientCheckInChange =(type)=>{
        if(type=="yes"){
            this.setState({isPatientCheckIn:1});

        }
        else if(type=="no"){
            this.setState({isPatientCheckIn:2});
        }
        else if(type==null){
            this.setState({isPatientCheckIn:0})
        }
        this.props.hasPatientCheckIn && this.props.hasPatientCheckIn(type)

    }
    customOptionTemplateFunction = (item, search, searchRegex) => {
        return <span title={item.name}>{item.name}</span>
    }
    render({props} = this) {
        let { options } = props;
        return (
            <section className='filter-section'>
                <div className="border px-3 pt-3 pb-1 m-0 row justify-content-between">
                    <div className="col-8 col-md-8 col-sm-8 form-row p-0 ipadnd8">
                        {options.study  &&  <div className="form-group  col-auto filterwidth">
                                <label htmlFor="study">Study</label>
                                <ReactSuperSelect
                                    placeholder="Select"
                                    clearSearchOnSelection={true}
                                    dataSource={this.props.studySiteDetailsList || [] }
                                    onChange={this.handleStudyChange}
                                    searchable={true}
                                    multiple={options && options.dropDownOptions && props.options.dropDownOptions.multiSelect}
                                    keepOpenOnSelection={options && options.dropDownOptions && props.options.dropDownOptions.keepOpenOnSelection}
                                    closeOnSelectedOptionClick={false}
                                    deselectOnSelectedOptionClick={options && options.dropDownOptions && props.options.dropDownOptions.multiSelect ? true : false}
                                    customClass='select-container'
                                    customOptionTemplateFunction={this.customOptionTemplateFunction}
                                    customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                    clearable = {options && options.dropDownOptions && props.options.dropDownOptions.multiSelect ? true : false}
                                    onClear={options && options.dropDownOptions && props.options.dropDownOptions.onClearDropdown}
                                    initialValue={  this.props.byDefaultNoSelected ? null : ( this.state.persistStudyName ?  this.state.persistStudyName :
                                        (this.props && this.props.studySiteDetailsList ? this.props.studySiteDetailsList && this.props.studySiteDetailsList[0]:null)  ) }
                                    />
                                    {/* initialValue={ this.props && this.props.allStudyLists ? this.props.allStudyLists && this.props.allStudyLists[0]:{}} */}
                            </div>
                        }
                        {options.site  && <div className="form-group col-auto filterwidth">
                                <label htmlFor="study">Site</label>
                                <ReactSuperSelect
                                    placeholder="Select"
                                    clearSearchOnSelection={true}
                                    dataSource={this.props.siteList || []}
                                    onChange={this.handleSiteChange}
                                    searchable={true}
                                    deselectOnSelectedOptionClick={false}
                                    clearable = {options && options.dropDownOptions && props.options.dropDownOptions.multiSelect ? true : false}
                                    multiple={options && options.dropDownOptions && options.dropDownOptions.multiSelect}
                                    keepOpenOnSelection={options && options.dropDownOptions && props.options.dropDownOptions.keepOpenOnSelection}
                                    closeOnSelectedOptionClick={false}
                                    customClass='select-container'
                                    customOptionTemplateFunction={this.customOptionTemplateFunction}
                                    customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                    clearSelectedValueOnDataSourceChange={this.state.persistSiteName  ? false  : true}
                                    initialValue={ this.props.byDefaultNoSelected ? null : ( this.state.persistSiteName ?  this.state.persistSiteName :
                                        (this.props && this.props.siteList ? this.props.siteList[0]  : null)  ) }
                                />
                            </div>
                        }
                        {/* {options.study && options.protocolDetails && <div className="form-group  col-md-4 col-sm-6">
                                <label htmlFor="study">Study</label>
                                <ReactSuperSelect
                                    placeholder="Select"
                                    clearSearchOnSelection={true}
                                    dataSource={this.props.studyListItems ? this.props.studyListItems : []}
                                    onChange={this.handleStudyChange}
                                    searchable={true}
                                    multiple={options && options.dropDownOptions && props.options.dropDownOptions.multiSelect}
                                    keepOpenOnSelection={options && options.dropDownOptions && props.options.dropDownOptions.keepOpenOnSelection}
                                    closeOnSelectedOptionClick={false}
                                    deselectOnSelectedOptionClick={false}
                                    customClass='select-container'
                                    customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                    clearable = {options && options.dropDownOptions && props.options.dropDownOptions.multiSelect ? true : false}
                                    onClear={options && options.dropDownOptions && props.options.dropDownOptions.onClearDropdown}
                                    initialValue={ this.props && this.props.studyListItems ? this.props.studyListItems && this.props.studyListItems[0]:{}}
                                    />

                            </div>
                        } */}
                        {options.patient && <div className="form-group  col-auto filterwidth">
                                <label htmlFor="study">Patient</label>
                                {/* <select className="form-control" >
                                    <option>Smith</option>
                                </select> */}

                                 <ReactSuperSelect
                                    placeholder="Select"
                                    clearSearchOnSelection={true}
                                    dataSource={this.props.patientList ? this.props.patientList : [] }
                                    onChange={this.handlePatientChange}
                                    searchable={true}
                                    multiple={options && options.dropDownOptions && props.options.dropDownOptions.multiSelect}
                                    keepOpenOnSelection={options && options.dropDownOptions && props.options.dropDownOptions.keepOpenOnSelection}
                                    closeOnSelectedOptionClick={false}
                                    deselectOnSelectedOptionClick={false}
                                    customClass='select-container'
                                    customOptionTemplateFunction={this.customOptionTemplateFunction}
                                    customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                    clearable = {options && options.dropDownOptions && props.options.dropDownOptions.multiSelect ? true : false}
                                    onClear={options && options.dropDownOptions && props.options.dropDownOptions.onClearDropdown}
                                    initialValue={  this.props.byDefaultNoSelected ? null : ( this.state.persistStudyName ?  this.state.persistStudyName :
                                        (this.props && this.props.patientList ? this.props.patientList && this.props.patientList[0]:null)  ) }
                                  />
                            </div>
                        }
                       {options.epoch && <div className="form-group col-auto filterwidth">
                                <label htmlFor="study">Epoch</label>
                                {/* <select className="form-control" >
                                    <option>Epoch1</option> epochList
                                </select> */}

                                <ReactSuperSelect
                                    placeholder="Select"
                                    clearSearchOnSelection={true}
                                    dataSource={this.props.epochList ? this.props.epochList : [] }
                                    onChange={this.handleEpochChange}
                                    searchable={true}
                                    multiple={options && options.dropDownOptions && props.options.dropDownOptions.multiSelect}
                                    keepOpenOnSelection={options && options.dropDownOptions && props.options.dropDownOptions.keepOpenOnSelection}
                                    closeOnSelectedOptionClick={false}
                                    deselectOnSelectedOptionClick={false}
                                    customClass='select-container'
                                    customOptionTemplateFunction={this.customOptionTemplateFunction}
                                    customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                    clearable = {options && options.dropDownOptions && props.options.dropDownOptions.multiSelect ? true : false}
                                    onClear={options && options.dropDownOptions && props.options.dropDownOptions.onClearDropdown}
                                    clearSelectedValueOnDataSourceChange={this.state.persistEpochName  ? false  : true}
                                    initialValue={  this.props.byDefaultNoSelected ? null : ( this.state.persistEpochName ?  this.state.persistEpochName : (this.props && this.props.epochList ?
                                        this.props.epochList && this.props.epochList[0]:null) )}
                                    />
                            </div>
                        }
                        {options.encounter && <div className="form-group  col-auto filterwidth">
                                <label htmlFor="study">Encounter</label>
                                <ReactSuperSelect
                                    placeholder="Select"
                                    clearSearchOnSelection={true}
                                    dataSource={this.props.encounterList ? this.props.encounterList : [] }
                                    onChange={this.handleEncounterChange}
                                    searchable={true}
                                    multiple={options && options.dropDownOptions && props.options.dropDownOptions.multiSelect}
                                    keepOpenOnSelection={options && options.dropDownOptions && props.options.dropDownOptions.keepOpenOnSelection}
                                    closeOnSelectedOptionClick={false}
                                    deselectOnSelectedOptionClick={false}
                                    customClass='select-container'
                                    customOptionTemplateFunction={this.customOptionTemplateFunction}
                                    customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                    clearable = {false}
                                    onClear={options && options.dropDownOptions && props.options.dropDownOptions.onClearDropdown}
                                    initialValue={  this.props.byDefaultNoSelected ? null : ( this.state.persistEncounterName ? this.state.persistEncounterName : (this.props && this.props.encounterList ?
                                        this.props.encounterList && this.props.encounterList[0]:null) )}
                                />
                            </div>
                        }
                        {options.status && <div className="form-group  col-auto filterwidth">
                                    <label htmlFor="status">Status</label>
                                    <ReactSuperSelect
                                        placeholder="Select"
                                        clearSearchOnSelection={true}
                                        dataSource={this.props.statusList || []}
                                        onChange={this.handleStatusChange}
                                        clearable = {false}
                                        deselectOnSelectedOptionClick={true}
                                        searchable={true}
                                        multiple={options && options.dropDownOptions && options.dropDownOptions.multiSelect}
                                        keepOpenOnSelection={options && options.dropDownOptions && props.options.dropDownOptions.keepOpenOnSelection}
                                        closeOnSelectedOptionClick={false}
                                        customOptionTemplateFunction={this.customOptionTemplateFunction}
                                        customClass='select-container'
                                        customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                        initialValue={   this.state.persistPatientStatus ? this.state.persistPatientStatus : null }
                                    />
                                </div>
                        }
                    </div>
                    {options.rediobtn  && options.rediobtn.name && <div className="col pt-3 d-flex flex-row justify-content-end">
                            <span>{options.rediobtn.name}</span>
                            <div className="pr-1">
                                <div className="col-auto d-flex flex-row p-0">
                                    <span className="float-left px-2 text-right">Yes</span>
                                    <div className="radio-wrapper">
                                        <input type="radio" name="name2"  className="yes" id="id4"
                                             checked={ this.state.isPatientCheckIn ==1 ? true : false} disabled={this.props.toggleDisabled} onChange={this.handlePatientCheckInChange.bind(this,"yes")} />
                                        <label htmlFor="id4" className={this.props.toggleDisabled ? 'disabledToggle': ''}></label>
                                        <input type="radio" name="name2" className="neutral"  id="id5"
                                            checked={ this.state.isPatientCheckIn == 0 ? true : false} disabled={this.props.toggleDisabled}  onChange={this.handlePatientCheckInChange.bind(this,null)}  />
                                        <label htmlFor="id5" className={this.props.toggleDisabled ? 'disabledToggle': ''}></label>
                                        <input type="radio" name="name2" className="no" id="id6"
                                            checked={ this.state.isPatientCheckIn == 2 ? true : false} disabled={this.props.toggleDisabled} onChange={this.handlePatientCheckInChange.bind(this,"no")} />
                                        <label htmlFor="id6" className={this.props.toggleDisabled ? 'disabledToggle': ''}></label>
                                    </div>
                                    <span className="px-2 text-right">No</span>
                                </div>
                            </div>
                        </div>
                    }
{/* {options.rediobtn  &&
    <div >
                    <span className="float-left text-left pl-0 pr-1">
                        Yes
                    </span>
                    <div className="radio-wrapper">
                        <input type="radio" name="radiothree" className="yes" id="radio-yes-radiothree"
                        defaultChecked={this.props.fullData && this.props.fullData.length>0 && this.props.fullData[0].patientCheckInStatus == 1 ?   true : false}
                         onChange={(event)=>this.props.hasPatientCheckIn && this.props.hasPatientCheckIn(event,1)} />
                        <label htmlFor="radio-yes-radiothree"></label>

                        <input type="radio" name="radiothree" className="neutral" value="0"   id="radio-neutral-radiothree"
                        defaultChecked={ this.props.fullData && this.props.fullData.length>0 && (this.props.fullData[0].patientCheckInStatus == 0 || this.props.fullData.patientCheckInStatus=="")  ?   true : false}
                        onChange={(event)=>this.props.hasPatientCheckIn && this.props.hasPatientCheckIn(event,0)}
                       />
                        <label htmlFor="radio-neutral-radiothree"></label>

                        <input type="radio"  name="radiothree" className="no" id="radio-no-radiothree"
                        defaultChecked={  this.props.fullData && this.props.fullData.length>0 && this.props.fullData[0].patientCheckInStatus== 2 ?   true : false}
                        onChange={(event)=>this.props.hasPatientCheckIn && this.props.hasPatientCheckIn(event,2)}  />
                        <label htmlFor="radio-no-radiothree"></label>
                    </div>
                    <span className="px-2 text-left">No</span>
           </div>
} */}

                    {options.button && !this.encounterPath &&
                    <span className="text-right pt-3" onClick={props.onPopUpBtnClick}>
                        <span className="float-right  c-b cursor-pointer">{options.button.name}</span>
                        <span className="add-btn"><i className="material-icons">add</i></span>
                    </span>
                    }

                    {options.button && this.encounterPath && this.props.fullData && this.props.fullData.length && this.props.fullData[0].withdrawStatus == 0 ?
                    <span className="text-right pt-3" onClick={props.onPopUpBtnClick}>
                        <span className="float-right  c-b cursor-pointer">{options.button.name}</span>
                        <span className="add-btn"><i className="material-icons">add</i></span>
                    </span> : ''
                    }

                    {options.simpleButton &&
                        <div className="col-md-auto pt-2 px-0">
                            <button type="button" onClick={props.onAuditTrailClick}  className={options.simpleButton.classes}>{options.simpleButton.name}</button>
                        </div>
                    }
                </div>
            </section>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getAllSites   : bindActionCreators(site_actions, dispatch),
        getAllStudies : bindActionCreators(study_actions, dispatch),
        getStudyById : bindActionCreators(study_actions,dispatch),
        modalAction  : bindActionCreators(modalAction,dispatch)
    };
}

function mapStateToProps(state){
    return {
        allSiteLists : state.getAllSites,
        allStudyLists : state.getAllStudies,
        modal : state.modal
    }
}

export default  connect(mapStateToProps,mapDispatchToProps)(withLastLocation(Filter));
