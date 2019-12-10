/**
* Copyright (c) 2018
* @summary Application skeleton description
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*/
import React, { Component } from 'react';
import Header from '../../header/header';
import Footer from '../../footer/footer';
import MenuOptions from '../../menuoptions/menuoptions';
import BreadCrumbs from '../../breadCrumbs/breadcrumbs';
import { connect } from 'react-redux' ;
import Common from '../../../common/common'




// const routes = {
//   '/': 'Home',
//   '/about': 'About',
//   '/studysitedetails': 'Study Setup',
//   '/studysitedetails/siteDetails/:siteName': 'Site Details',
//   '/protocol/:id/:verson/:name' : 'Protocol',
//   '/element-setup':'Element Setup',
//   '/protocol-details' : 'Protocol Details',
//   '/protocol-details/setup-preview/:study/:versionId/:studyId/:protocolVersion/:publishDate/:protocolName' : 'Protocol Preview',
//   '/protocol-details/protocol-setup-new/:study/:versionId/:studyId/:protocolVersion/:protocolName/:protocolIdentity' : 'Protocol Setup',
//   '/protocol-details/protocol-setup-new/protocol-encounter-setup/:study/:versionId/:studyId/:protocolVersion/:protocolName/:protocolIdentity' : 'Encounter Setup',
//   '/protocol-details/protocol-setup-new/protocol-element-setup/:study/:versionId/:studyId/:protocolVersion/:protocolName/:domain_key/:element_name':'ItemGroup Setup',
//   '/protocol-details/protocol-setup-new/protocol-encounter-setup/protocol-element-setup/:study/:versionId/:studyId/:protocolVersion/:protocolName/:domain_key/:element_name/:element_logo/:who_did/:when_did':'ItemGroup Setup',
//   '/encounterdetails' : 'Encounter Details',
//   '/encounterdetails/elements/:elementType/:studyId/:uniqIdenfier': getEncounterType('#/encounterdetails/elements/:elementType/:studyId/:uniqIdenfier'),
//   '/patientdetails' : 'Patient List',
//   '/patientdetails/patientdescription/:patientId' : 'Patient Info'
// };



class Layout extends Component {
  getActiveElement = ()=>{
    let str = this.props.location.pathname && this.props.location.pathname.split("/");
    return str && str[1];
  }

  matchBreadCrumbs = ()=>{
  }





  //get login user information
  getLoginUserInfo(){

    if(this.props.loginUserInfo && this.props.loginUserInfo.length){
      return this.props.loginUserInfo;
    }
    else if(localStorage.getItem("loginInfo")){
      return   JSON.parse(localStorage.getItem("loginInfo"))
    }
    else{

    }

  }

  componentDidMount(){
    
   Common.setLoginUserInfo(this.props.loginUserInfo)
  }

  render() {
    let activeElement =  this.getActiveElement();
    return (
      <div className="page-inner-container">
        <div className="page-content">
            {/* { (this.props.location.pathname=="/") ? "" : <Header  /> } */}
            {/* <Header  /> */}
            {/* <MenuOptions active={activeElement} loginUserInfo={this.props.loginUserInfo} /> */}
            {/* { (this.props.location.pathname=="/") ? "" : <MenuOptions active={activeElement} loginUserInfo={this.props.loginUserInfo} /> } */}
            <BreadCrumbs  loginUserInfo={this.props.loginUserInfo} />

            {this.props.location.pathname && this.props.location.pathname.indexOf("/patientdetails/patientdescription/patientEncounter/")>-1 && 
            <div className="blk-fnt patientname">
            <span className="c-p ft-500">&nbsp;{ this.props.patientInfo && this.props.patientInfo.name}&nbsp;</span>
            <span className="">|&nbsp; <span className="pt-sub"> {this.props.patientInfo && this.props.patientInfo.age} {this.props.patientInfo && this.props.patientInfo.age >1 ? 'years' : 'year'} &nbsp;</span></span>
            <span className="">|&nbsp; <span className="pt-sub">{this.props.patientInfo && this.props.patientInfo.dob}</span></span>
            </div>}

            {this.props.children}
            {/* { (this.props.location.pathname=="/") ? "" : <Footer /> } */}
            <Footer /> 
        </div>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
      loginUserInfo : state.login,
      patientInfo  : state.getPatientInfo
  }
}

export default  connect(mapStateToProps)(Layout);
