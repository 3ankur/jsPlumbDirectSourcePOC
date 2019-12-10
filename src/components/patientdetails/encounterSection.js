/**
* Copyright (c) 2018
* @summary Application Patient Details Encounter Section
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React,{Component} from 'react';
import { connect } from 'react-redux';
import * as modalAction from '../../actions/modalActions';
import { MODAL_TYPE_SHEDULE_ENCOUNTER, MODAL_TYPE_FULL_ENCOUNTER,MODAL_TYPE_PATIENT_ENCOUNTER } from '../../constants/modalTypes';
import {bindActionCreators} from 'redux';
import ReactTable from "react-table";
import 'react-table/react-table.css'
import ApiService from '../../api';
import {isIE, isEdge, isFirefox, isSafari} from 'react-device-detect';
import { NavLink } from 'react-router-dom';
import _ from 'lodash';
import moment from 'moment'



class EncounterSection extends Component{

    constructor(props){
        super(props);
        this.state = {encounterTableColumns:[],encounterTableData:[],selectedPatientStudyIdef:"",patientEncounterList:[]}
       // this.onShowFullEncounter = this.onShowFullEncounter.bind(this);
        //this.onShowPatientEncounter = this.onShowPatientEncounter.bind(this);

    }


    componentWillMount(){
    }

    getPatientEncounterInfo(pid){
        ApiService.getPatientEncounterDetails(pid).then((res)=>{
            if(res && res.data && res.data.response && typeof res.data.response==="object"){
                this.setState({patientEncounterList:res.data.response},()=>{
                    this.checkAccessInfo(this.state.patientEncounterList);
                });
            }else{
                this.checkAccessInfo([]);
            }
        })
    }

    checkAccessInfo(info){

        let encounterTableColumns =  [{
            Header: 'Study',
            accessor: 'studyName',
            Cell:row =>{
                return row.row._original.studyName ? <span> {row.row._original.studyName}</span> : '--'
            }
          }, {
            Header: 'Site',
            accessor: 'siteName',
            Cell:row =>{
                return row.row._original.siteName ? <span> {row.row._original.siteName}</span> : '--'
            }
          },
          {
            Header: 'Epoch Name',
            accessor: 'epochName',
            Cell:row =>{
                return row.row._original.epochName ? <span> {row.row._original.epochName}</span> : '--'
            }
          },
          {
            Header: 'Encounter Name',
            accessor: 'encounterName',
            className: "enpad0",
             Cell : row=>(
               row.original && row.original.isAccessEncounterDetails  ?   <div className="fillColorTd" title={row.original.totalNumberOfCompletdFields+' / '+ row.original.totalNumberOfFields} style={this.getColor(row)}
                        onClick={(e)=> this.props.gotoEncounterDetailPage && this.props.gotoEncounterDetailPage(row.original)}>
                        <a style={ {textDecoration:"underline"} }> {row.original.encounterName}</a>
                </div> : <span> {row.original.encounterName}</span>
             )
          }, {
            Header: 'Encounter Start Date',
            accessor: 'encounterStartDate',
            Cell : row=>(
                <div> {row.original.encounterStartDate !==(null && "")?row.original.encounterStartDate :"--"}</div>
            ),
            sortMethod: (a,b,c)=>{
                let fomatedOldDate  = a && moment(a,"DD/MMM/YYYY");
                let formattedNewDate =  b && moment(b,"DD/MMM/YYYY");
                let oldDate = fomatedOldDate &&  Date.parse(fomatedOldDate);
                let newDate =  formattedNewDate && Date.parse(formattedNewDate);
                return oldDate - newDate
            }
          },
          {
            Header: 'Encounter Complete Date',
            accessor: 'visitCompleteDate',
            Cell : row=>(
                <div> {row.original.visitCompleteDate !==(null && "")?row.original.visitCompleteDate :"--"}</div>
            ),
            sortMethod: (a,b,c)=>{
                let fomatedOldDate  = a && moment(a,"DD/MMM/YYYY");
                let formattedNewDate =  b && moment(b,"DD/MMM/YYYY");
                let oldDate = fomatedOldDate &&  Date.parse(fomatedOldDate);
                let newDate =  formattedNewDate && Date.parse(formattedNewDate);
                return oldDate - newDate
            }
          },
          ]

        //  )
        if(info.length && info[0].hasOwnProperty("isAccessEncounterSummary") && info[0]["isAccessEncounterSummary"]){

    let tmp = {
        Header: 'Summary Reports',
        accessor: 'summeryReports',
        Cell : row =>(
          row.original && row.original.isAccessEncounterSummary &&  <div>
                    <span className="bg-light-p rounded px-2 py-1 text-white cursor-pointer" onClick={this.onShowFullEncounter.bind(this,row)} >
                        FE
                    </span>
                    <span className="bg-light-p rounded px-2 py-1 text-white mx-2 cursor-pointer" onClick={this.onShowPatientEncounter.bind(this,row)}>
                        PE
                    </span>
                </div>
        )
      }

      encounterTableColumns.push(tmp)
        }

        this.setState({encounterTableColumns:encounterTableColumns,encounterTableData:info});

    }

    componentWillReceiveProps(nextProps) {
        try{
            if(nextProps.patientStudies !== this.props.patientStudies) {
              // nextProps.myProp has a different value than our current prop
              // so we can perform some calculations based on the new value

              if(nextProps.patientStudies && nextProps.patientStudies.uniqueIdentifier){

                this.setState({selectedPatientStudyIdef:nextProps.patientStudies.studyUniqueIdentifier});
                this.getPatientEncounterInfo(nextProps.patientStudies.uniqueIdentifier);
              }
            }
        }
        catch(e){

        }
      }

    //getPatientEpochDetails
    onShowSheduleEncounter=()=>{
        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_SHEDULE_ENCOUNTER,{
            onSave : (data) => {

// const found = this.props.patientStudies && this.props.patientStudies.filter( (o)=>{return o.study_identifier === this.state.selectedPatientStudyIdef} );

if(data){

    // const obj = {
    //                 "encounter_unique_identefier": data.encounter_unique_identefier,
    //                 "is_scheduled_encounter": 0,
    //                 "scheduled_date": data.sheduleDate ? data.sheduleDate : new Date(),
    //                 "site_patient_unique_identefier": this.props.patientStudies.uniqueIdentifier,
    //                 "studyIdentefier":this.state.selectedPatientStudyIdef
    //                }

    //                ApiService.schedulePatientEncounter(obj).then( (res)=>{
    //             this.getPatientEncounterInfo(this.props.patientStudies.uniqueIdentifier);
    //                },
    //             (err)=>{
    //                 console.log(err)
    //             })
    this.getPatientEncounterInfo(this.props.patientStudies.uniqueIdentifier);
    this.props.loadPatientStatus && this.props.loadPatientStatus(this.props.patientStudies.uniqueIdentifier);
    this.props.modalAction.hideModal();

}
            },
            info:this.state.selectedPatientStudyIdef,
            patSiteId:this.props.patientStudies.uniqueIdentifier,
            hideModal : ()=>{
                this.props.modalAction.hideModal();
            }
        });
    }

    onShowFullEncounter(obj,row) {
        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_FULL_ENCOUNTER,{
            hideModal : ()=>{
                this.props.modalAction.hideModal();
            },
            encounterGroupIdentifier:obj,
            className:'full-encounter-modal'
        });
    }
    onShowPatientEncounter(obj,row) {
        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_PATIENT_ENCOUNTER,{
            hideModal : ()=>{
                this.props.modalAction.hideModal();
            },
            encounterGroupIdentifier:obj,
            className:'patient-encounter-modal'
        });
    }

    getcolorForBrowser(percentage,hexaColor,rgbaColor){
        let  iconStyle={};
        if(isIE){
              iconStyle={background:`-ms-linear-gradient(left,${hexaColor} 0%, ${hexaColor} ${percentage}%, ${rgbaColor} ${percentage}%, ${rgbaColor} 100%)`}
        }else if(isFirefox){
              iconStyle={background:`-moz-linear-gradient(to right, ${hexaColor} 0%, ${hexaColor} 0%, ${hexaColor} ${percentage}%, ${rgbaColor} ${percentage}%, ${rgbaColor} 100%)`}
        }else{
              iconStyle={background:`linear-gradient(to right,${hexaColor} 0%, ${hexaColor} ${percentage}%, ${rgbaColor} ${percentage}%, ${rgbaColor} 100%)`}
        }
        return iconStyle
    }


    getColor(row){
        if(row.original.color=="GRN"){
            return this.getcolorForBrowser(row.original.completedPercentage,"#c5e0a8","rgba(197,224,168,0)");
        }else if(row.original.color=="YEL"){
            return this.getcolorForBrowser(row.original.completedPercentage,"#FAE79B","rgba(250,231,155,0)");
        }else if(row.original.color=="RED"){
            return this.getcolorForBrowser(row.original.completedPercentage,"#FFA1A1","rgba(255,161,161,0)");
        }else{
            return this.getcolorForBrowser(row.original.completedPercentage,"#FFFFFF","rgba(255,255,255,0)");
        }
    }


    componentDidMount(){

        //
    }

    studiesChangeHandeler=(e)=>{
this.setState({selectedPatientStudyIdef:e.target.value});
    }

    renderEncounterBtns = ()=>{

    }


    onRowClick = (state, rowInfo, column) => {
        return {
            onClick: (e) => {
                this.props.gotoEncounterDetailPage && this.props.gotoEncounterDetailPage(rowInfo.original);
            }
        }
    }

    render({props} = this){
        return (
         <div className='col-md-12 p-0 row ml-mr-0'>
            <div className="col-md-12 row m-0 p-0 justify-content-between">
                <div className="col-md-7 col-sm-12 col-lg-4 p-0"><h5 className="mt-4 p-0 c-p">Encounter</h5></div>
                <div className="d-flex flex-row justify-content-end col-lg-8 p-0">
                    <span className="col col-sm-auto iewdrop p-0">
                        <span className="form-row pt-2 mt-0">
                                <span className="pr-2 text-right pt-2">
                                    {/* <label>Study</label> */}
                                </span>
                                <span className="pr-1 text-right pt-2">
                                {/* <label class="text-bold  mt-0">{this.props.patientStudies.studyName}</label> */}
                                    {/* <select className="form-control" onChange={this.studiesChangeHandeler}>
                                      <option value={this.props.patientStudies.studyUniqueIdentifier}>{this.props.patientStudies.studyName}</option>
                                      </select> */}
                                      {/* {  this.props.patientStudies && this.props.patientStudies.map( (studyData,sidx)=>{
                                              return <option key={studyData.study_identifier} value={studyData.study_identifier}>{studyData.study}</option>
                                          } )
                                      } */}

                                </span>
                        </span>
                    </span>



                    { (this.props.patientStudies &&  this.props.patientStudies.withDrawStatus === 0 ) ?

                    <span className="col col-sm-auto add-btn-bg mt-3" onClick={this.onShowSheduleEncounter.bind(this)}>
                    <span className="float-right c-w cursor-pointer">Schedule Encounter</span> <span className="add-btn"><i className="material-icons">add</i></span>
                   </span> : ''}
                   {/* { (this.props.patientStudies && this.props.patientStudies.withDrawStatus===0 ) ? */}
                   <NavLink to={this.props.gotoEncounterDetailPage && this.props.gotoEncounterDetailPage('unexpectedPage')} className="col col-sm-auto add-btn-bg mt-3 ml-1 pr-0"> <span className="float-right c-w">
                    Unexpected Encounter</span> <span className="add-btn"><i className="material-icons">add</i></span>
                    </NavLink>
                    {/* : ''
                 } */}

                </div>
            </div>
            <div className="col-12 row justify-content-start p-0 table-border px-2 m-0">
                 <ReactTable
                    data={this.state.patientEncounterList}
                    columns={this.state.encounterTableColumns}
                    minRows={1}
                    multiSort ={true}
                    className='table activity-table mb-0'
                    showPagination={true}
                    nextText='>>'
                    previousText='<<'
                    defaultPageSize={5}
                    noDataText='No Record Found'
                    // getTrProps={this.onRowClick}
                />
            </div>
         </div>
        );
    }

}

function mapDispatchToProps(dispatch) {
    return {
        modalAction : bindActionCreators(modalAction,dispatch)
    };
}


function mapStateToProps(state){
    return {
        modal : state.modal
    }
}



const encounterTableData = [
    {
        'study':'EL-12',
        'site':'St. Hospital',
        'encounterName':'Encounter 0',
        'encounterStartDate':'23/Feb/2018',
        'visitCompleteDate':'28/Feb/2018',
    },
    {
        'study':'EL-12',
        'site':'St. Hospital',
        'encounterName':'Encounter 1',
        'encounterStartDate':'22/Feb/2018',
        'visitCompleteDate':'27/Feb/2018',
    },
    {
        'study':'EL-12',
        'site':'St. Hospital',
        'encounterName':'Encounter 2',
        'encounterStartDate':'21/Feb/2018',
        'visitCompleteDate':'26/Feb/2018',
    }
]
//const encounterTableColumns = []
export default connect(mapStateToProps , mapDispatchToProps)(EncounterSection);