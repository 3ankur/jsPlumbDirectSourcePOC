/**
* Copyright (c) 2018
* @summary Use For Showing All Menu Options
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React, { h, Component } from 'react';
import { NavLink } from 'react-router-dom';

export default class MenuOptions extends Component {

    constructor(props){
        super(props);
    }

    checkRoleHasAccess(menuName,menuCode){

       try{

        if( this.props.loginUserInfo && !this.props.loginUserInfo.isGloabal){

            if(this.props.loginUserInfo && this.props.loginUserInfo.menuAccess && this.props.loginUserInfo.menuAccess.indexOf("STD")>-1 &&  (menuName === "StudySetup" || menuName === "Setup" )  ){
                return true;
                }
             else{
                     if( (this.props.loginUserInfo.menuAccess.indexOf("STD")>-1) &&  (menuName === "SourceDataSetup" || menuName === "ICF" )  ){
                        return false;
                    }
                    else {
                        return  this.props.loginUserInfo.menuAccess.indexOf(menuCode)>-1 ? true : false ;
                    }
             }

        }else{
            return true;
        }
    }
       catch(e){
           console.log(e)
        return true;
       }

    return true;

    }


  render({ active } = this.props ) {
    return (
        <nav className="navbar navbar-expand-lg bg-p p-0 position-sticky sticky-top nav-bar pl-3 fxIE">
            <ul className="navbar-nav mr-auto flex-row">
            { this.checkRoleHasAccess("Summary","SM") &&  <li className={ 'nav-item ' + ( active == '' ? 'active' : '')}>
                        <NavLink  onClick={ ()=>{localStorage.setItem("Patient_StudyName",""); localStorage.setItem("Patient_SiteName","");localStorage.setItem("Patient_Status","")} } className="nav-link arrow-select" to="/">Summary<span className="sr-only">(current)</span></NavLink>
                </li> }
            { this.checkRoleHasAccess("Patient List","PS") &&  <li className={ 'nav-item dropdown ' + (active && active == 'patientdetails'|| active === 'craPatientList' ? 'active' : '')} >
                    <a className="nav-link dropdown-toggle arrow-select" href="#" id="patientSource" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Patient Source
                    </a>
                    <div className="dropdown-menu" aria-labelledby="patientSource" role="menu">
                    {this.checkRoleHasAccess("Patient List","PL") &&  <NavLink  className="dropdown-item" to="/patientdetails">Patient List</NavLink>}    
                    {this.checkRoleHasAccess("Patient List","PLA") && <NavLink  className="dropdown-item"  to="/craPatientList">Patient List (Audit)</NavLink>}    
                    </div>
                </li> }
                 { this.checkRoleHasAccess("Activity List","AL") &&  <li className={ 'nav-item ' + ( active && active == 'activitylist' ? 'active' : '')}>
                        <NavLink onClick={ ()=>{localStorage.setItem("Patient_StudyName",""); localStorage.setItem("Patient_SiteName","");localStorage.setItem("Patient_Status","")} } className="nav-link arrow-select" to="/activitylist">
                        Activity List<span className="sr-only">(current)</span></NavLink>
                </li> }


                {/* { this.checkRoleHasAccess("Encounter Details") &&  <li className={ 'nav-item ' + ( active && active == 'encounterdetails' ? 'active' : '')}>
                    <NavLink  className="nav-link" to="/encounterdetails">Encounter Details<span className="sr-only">(current)</span></NavLink>
                </li>} */}

                {/* <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="patientSource" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Finance
                    </a>
                    <div className="dropdown-menu" aria-labelledby="patientSource" role="menu">
                        <a className="dropdown-item" href="#">Invoice-able Items</a>
                        <a className="dropdown-item" href="enrollment-projection-details.html">Enrollment Projection</a>
                        <a className="dropdown-item" href="#">Invoicing Wizard</a>
                    </div>
                </li>	 */}

                { this.checkRoleHasAccess("Setup","ST") && <li className={ 'nav-item dropdown ' + ( active && ( active === 'element-setup' || active ==='protocol-details' || active==="protocol-setup-new" || active ==='recruitment-setup' || active === 'studysitedetails' || active === 'irbSetup') ? 'active' : '')} >
                    <a className='nav-link dropdown-toggle arrow-select' href="#"  id="study" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> Setup </a>
                    <div className="dropdown-menu" aria-labelledby="study"  role="menu">
                    {this.checkRoleHasAccess("StudySetup","ST")  &&  <NavLink  className="nav-link" onClick={ ()=>{localStorage.setItem("fromMenu",true);localStorage.setItem("Patient_StudyName",""); localStorage.setItem("Patient_SiteName","");localStorage.setItem("Patient_Status","")} }  to="/studysitedetails">Study Setup</NavLink> }
                    {this.checkRoleHasAccess("SourceDataSetup","ST") && <NavLink  className="nav-link"  onClick={ ()=>{localStorage.setItem("fromMenu",true);localStorage.setItem("Patient_StudyName",""); localStorage.setItem("Patient_SiteName","");localStorage.setItem("Patient_Status","")} } to="/protocol-details">Source Data Details</NavLink> }
                    {/* { this.checkRoleHasAccess("ICF","ST")  &&  <NavLink  className="nav-link"  onClick={ ()=>{localStorage.setItem("fromMenu",true);localStorage.setItem("Patient_StudyName",""); localStorage.setItem("Patient_SiteName","");localStorage.setItem("Patient_Status","")} } to="/irbSetup">ICF Setup</NavLink> }   */}
                        {/* <NavLink  className="nav-link"  to="/elementSetupNew">Element Setup New</NavLink> */}
                        {/* <a className="dropdown-item" href="#">Finance Setup</a> */}
                        {/* <a className="nav-link" href="Study_Site_ICF_Setup.html">ICF Setup</a> */}
                    </div>
                </li> }
                {/* {   <li className={ 'nav-item dropdown ' + ( active && ( active === 'patientProgress' ||  active === 'studyMetrics' ) ? 'active' : '')} >
                        <a className='nav-link dropdown-toggle arrow-select' href="#"  id="study" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> Reports </a>
                        <div className="dropdown-menu" aria-labelledby="study"  role="menu">
                            {<NavLink  className="nav-link" to="/patientProgress">Patient Progress</NavLink> }
                            {<NavLink  className="nav-link"  to="/studyMetrics">Study Metrics</NavLink> }
                        </div>
                    </li>
                } */}
            </ul>
        </nav>
    );
  }
}
