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
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux' ;
import { MODAL_TYPE_SHEDULE_ENCOUNTER } from '../../constants/modalTypes'

class EncounterDetails extends Component {

   constructor(props, context){
        super(props, context);


        this.state = {
            studyId : '',
            hideEncounterBlock : false,
            subheaderOptions : {
                study : true,
                patient: true,
                encounter:true,
                epoch:true,
                button : {
                    name : 'Schedule Encounter',
                    id : '#encounter',
                    rediobtn : {
                        name : 'Patient Check In'
                    }
                },
                dropDownOptions:{
                    multiSelect:false
                }
            } ,
            studySiteDetailsList:[],
            elementSearchTxt:"",
            patientsList : [],
            epochList:[{name:"Epoch1",id:"23232",encounter:[{id:1233,name:"E0"},{id:132,name:"E1"},{id:133,name:"E3"}]},
                        {name:"Epoch2",id:"9090",encounter:[{id:1233,name:"E0"},{id:132,name:"Screening Encounter"}]},
                        {name:"Epoch3",id:"34443",encounter:[{id:1233,name:"E0"}]}],
            encounterList :[],
            encounterDetailsList : [
                {
                    "redpercent" : "100",
                    "greypercent" : "20",
                    "logo" : "assets/images/icon/fill-icon1.png",
                    "type":"procedure",
                    "total" : "7",
                    "completed" : "0",
                    "name" : "Vital Signs",
                    "url" : `/encounterdetails/elements/VitalSign/_replace_/4912a2f0-a1e9-11e8-b974-454d9506d307`
                },
                {
                    "redpercent" : "100",
                    "greypercent" : "20",
                    "logo" : "assets/images/icon/fill-icon1.png",
                    "type":"procedure",
                    "total" : "3",
                    "completed" : "3",
                    "name" : "Demographics",
                    "url" : `/encounterdetails/elements/Demographics/_replace_/389945dd-9fc6-11e8-b974-9d7c5c52cd63`
                },
                {
                    "redpercent" : "80",
                    "greypercent" : "20",
                    "logo" : "assets/images/icon/fill-icon1.png",
                    "total" : "10",
                    "completed" : "8",
                    "name" : "Adverse Event",
                    "type":"procedure",
                    "url" : `/encounterdetails/elements/Adverse Event/_replace_/4d74c980-a448-11e8-80b1-81beb4da82ff`
                }
            ]
        }


    }

    componentDidMount(){
        ApiService.get_all_studies().then((res)=>{
            res && res.data.response.forEach( (d)=>{
                d.id  = d.uniqueIdentifier;
                d.name = d.studyName
            })
            this.setState({studySiteDetailsList:res.data.response});
        });
        ApiService.getStudySitePatientList().then((res)=>{
            res && res.data.response.forEach((d)=>{
                d.id  = d.uniqueIdentifier;
                d.name = d.patientName;
            });
            this.setState({patientsList:res.data.response},()=>{});
        })

    }

    onPopUpBtnClick = ()=>{
        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_SHEDULE_ENCOUNTER,{
            onSave : () => {
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
             const prevSt = this.state.encounterDetailsList;
             let uniqIdentifier = 'f9ca4069-a5e7-11e8-a97f-839eab8846e3';
             prevSt.forEach( (o,i)=>{
                 o.url = `encounterdetails/elements/${o.name}/${options.name}/${uniqIdentifier}`;
             });
             this.setState({encounterDetailsList:prevSt},()=>{
             });
        }
    }

    render({props,state} = this ) {
        let { subheaderOptions,encounterDetailsList } = state;
        if(this.state.elementSearchTxt){
            encounterDetailsList = encounterDetailsList.filter( (row)=>{return  row.name && row.name.toLowerCase().indexOf(this.state.elementSearchTxt && this.state.elementSearchTxt.toLowerCase())>-1 } )
        }
        return (
            <div>
                <Filter
                byDefaultNoSelected={true}
                options={subheaderOptions}
                studySiteDetailsList={this.state.studySiteDetailsList}
                siteStudyChanged={this.onStudyChange}
                onPopUpBtnClick={this.onPopUpBtnClick}
                patientList={this.state.patientsList}
                epochList={this.state.epochList}
                encounterList ={this.state.encounterList}
                filterEncounter={this.filterEpochEncounter.bind(this)}
                />
                <section className="encounter-details">
                    <div className="row border p-3 m-0 my-2">
                        <div className="row col m-0 p-0 justify-content-between">
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
                            { encounterDetailsList && encounterDetailsList.map(encounter => <EncounterDetailList key={encounter.name} encounter={encounter} /> )}
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return { modalAction  : bindActionCreators(modalAction,dispatch) };
}


function mapStateToProps(state){
    return { modal : state.modal }
}

export default connect(mapStateToProps , mapDispatchToProps)(EncounterDetails);
