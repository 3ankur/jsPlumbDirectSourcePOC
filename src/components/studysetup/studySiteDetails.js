/**
* Copyright (c) 2018
* @summary This file is use under  Setup -> Study Setup
           contains all study data.
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React,{Component} from 'react';
import Filter from '../filter/filter';
import MenuOptions from '../menuoptions/menuoptions';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import { NavLink } from 'react-router-dom';
import siteDetails from './siteDetails';
import ApiService from '../../api';
import { NotificationManager } from 'react-notifications';
import Common from '../../common/common';
import moment from 'moment'


class StudySiteDetails extends Component{
    constructor(props){
        super(props);
        this.state = {
            subheaderOptions : {
                studySiteDetailPage:true,
               site : false,
               study : true,
               dropDownOptions:{
                   multiSelect : false,
                   keepOpenOnSelection:false
               }
           },
           SiteDetailsColumns:[],
           studyDetails : {},
           studySiteDetailsList:[]
       }
    }

    componentDidMount() {
        ApiService.get_all_studies().then((res)=>{
            res && res.data.response.forEach( (d)=>{
                d.id  = d.uniqueIdentifier;
                d.name = d.studyName;
            })
            this.setState({studySiteDetailsList:res.data.response});
        })
    }

    onStudyChange = (options) =>{
        var that = this;
        if(options){
            let data = options.id;
            ApiService.GetPopulatedStudyDetails(data).then((res) => {
                const SiteDetailsColumns = [
                    {
                        Header: 'Site',
                        accessor: 'site_name',
                        Cell:row =>{
                            return(
                                row.row.site_name ? <NavLink className="nav-link" to={`/studysitedetails/siteDetails/${row.row._original.unique_identifier}/${data}`}>{row.row.site_name}</NavLink> : '--'
                            )
                        },
                        className: 'activelink'
                    },
                    {
                        Header: 'Status',
                        accessor: 'site_status',
                        Cell:row =>{
                            return row.row.site_status ? <span> {row.row.site_status}</span> : '--'
                        }
                    },
                    {
                        Header: 'Principal Investigator',
                        accessor: 'primary_investigator',
                        Cell:row =>{
                            return row.row.primary_investigator ? <span> {row.row.primary_investigator}</span> : '--'
                        }
                    },{
                        Header: 'Qualification Date',
                        accessor: 'qualification_date',
                        Cell:row =>{
                            return(
                                row.row.qualification_date ? <span>{row.row.qualification_date}</span> : '--'
                            )
                        },
                        sortMethod: (a,b,c)=>{
                            let fomatedOldDate  = a && moment(a,"DD/MMM/YYYY");
                            let formattedNewDate =  b && moment(b,"DD/MMM/YYYY");
                            let oldDate = fomatedOldDate &&  Date.parse(fomatedOldDate);
                            let newDate =  formattedNewDate && Date.parse(formattedNewDate);
                            return oldDate - newDate
                        }
                    },{
                        Header: 'Initiation Date',
                        accessor: 'initiation_date',
                        Cell:row =>{
                            return(
                                row.row.initiation_date ? <span>{row.row.initiation_date}</span> : '--'
                            )
                        },
                        sortMethod: (a,b,c)=>{
                            let fomatedOldDate  = a && moment(a,"DD/MMM/YYYY");
                            let formattedNewDate =  b && moment(b,"DD/MMM/YYYY");
                            let oldDate = fomatedOldDate &&  Date.parse(fomatedOldDate);
                            let newDate =  formattedNewDate && Date.parse(formattedNewDate);
                            return oldDate - newDate
                        }
                    }
                ]
               this.setState({ studyDetails : res.data.response , SiteDetailsColumns:SiteDetailsColumns});
            },(error) => {
                NotificationManager.error('something went wrong');
            });
        }
    }

    render({props,state} = this){
        let { subheaderOptions, studyDetails } = state;
        var divStyle = {minHeight: '444px',border:'1px solid #dee2e6',marginTop:'15px',paddingTop:'146px',};
        return(
            <div className='studySiteDetails footpadb iefixflex'>
                <Filter siteStudyChanged={this.onStudyChange} options={subheaderOptions} studySiteDetailsList={this.state.studySiteDetailsList}  />
                <section>
                    {
                        Object.keys(studyDetails).length === 0 ? <div style={divStyle} align="center"> <div className='col-md-3 text-center mt-5 custummsg'> Please select the study.</div></div>
                        : ( <div className="p-3 m-0 mt-2 border row justify-content-between">
                            <div className="row border-bottom-dotted col-12 m-0 p-0 justify-content-between mb-3">
                                <h5 className="pt-2 c-p">Study Details: <span className="text-muted bluetxt">{studyDetails.study_name}</span></h5>
                            </div>
                            <div className="row">
                                <div className="col-2">
                                    <div className="form-group">
                                        <label htmlFor="site">Name</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" value={studyDetails.study_name || ''} disabled/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-2">
                                    <div className="form-group">
                                        <label htmlFor="site">Phase</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" value={studyDetails.study_phase || ''} disabled/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-2">
                                    <div className="form-group">
                                        <label htmlFor="site">Project Code</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control"  value={studyDetails.project_code || ''} disabled/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-2">
                                    <div className="form-group">
                                        <label htmlFor="site">Therapeutic Area</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" value={studyDetails.therapeutic_area || ''} disabled/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-2">
                                    <div className="form-group">
                                        <label htmlFor="site">Customer</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control"  value={studyDetails.customer || ''} disabled/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-2">
                                    <div className="form-group">
                                        <label htmlFor="site">Sponsor</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" value={studyDetails.sponsor || ''} disabled/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-2">
                                    <div className="form-group">
                                        <label htmlFor="site">Status</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" value={studyDetails.status || ''} disabled/>
                                        </div>
                                    </div>
                                </div>
                                <div  className="col-2 col-half-offset">
                            <div  className="form-group">
                                <label htmlFor="site">Screen Failure Rate (%)</label>
                                <div  className="input-group">
                                    <input type="text"  value={studyDetails.screen_failure_rate} className="form-control" disabled/>
                                </div>
                            </div>
					    </div>
                        <div  className="col-2 col-half-offset">
                            <div  className="form-group">
                                <label htmlFor="site">Drop Out Rate (%)</label>
                                <div  className="input-group">
                                    <input type="text" value={studyDetails.drop_out_rate}  className="form-control" disabled/>
                                </div>
                            </div>
					    </div>
                                <div className="row col-12 m-0 px-3 p-1 ">
                                    <div className="col-md-12 row m-0 p-0 mb-2 pb-0 border-bottom-dotted justify-content-between">
                                        <h5 className="mt-0 col-md-8 col-sm-auto p-0 c-p ">Site Details</h5>
                                    </div>
                                    <div className="col-12 table-border p-0">
                                        <ReactTable
                                            data={this.state.studyDetails.listOfSites}
                                            columns={this.state.SiteDetailsColumns}
                                            minRows={1}
                                            multiSort ={true}
                                            noDataText='No Record Found'
                                            className='table table-responsive-sm activity-table mb-0'
                                            showPagination={true}
                                            nextText='>>'
                                            previousText='<<'
                                            defaultPageSize={10}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div> )
                    }
                </section>
            </div>
        );
    }
}

export default StudySiteDetails;