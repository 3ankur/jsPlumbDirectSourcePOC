/**
* Copyright (c) 2018
* @summary Application Header Functionality
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React, { Component } from 'react';
import { connect } from 'react-redux' ;

class Header extends Component {

    constructor(props){
        super(props);
    }

    logout(){
        localStorage.setItem("loginInfo","")
    }

    removeClientCookies = (name)=>{
        window.userLoggedOut = true;
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    getLoginUserInfo(){

        //     if(this.props.loginUserInfo && this.props.loginUserInfo.length && this.props.loginUserInfo[0]["role"] ==="ADMIN"){
        //         return "Admin"
        //     }
        //    else if(this.props.loginUserInfo && this.props.loginUserInfo.length){

        //         return this.props.loginUserInfo[0]["firstname"]+","+this.props.loginUserInfo[0]["lastname"]
        //    }
        //    else if( localStorage.getItem("loginInfo")){
        //          const info = JSON.parse(localStorage.getItem("loginInfo"));
        //          return info[0]["role"] ==="ADMIN" ? "Admin" : info[0]["firstname"]+","+info[0]["lastname"]
        //     }
        //     else{
        //         window.location.href = "/";
        //         return "";
        //     }

        if(this.props.loginUserInfo && this.props.loginUserInfo.firstName && this.props.loginUserInfo.lastName ){
           return  `${ this.props.loginUserInfo.lastName},  ${ this.props.loginUserInfo.firstName}`
        }

        return "N/A"
    }

  render() {
      
    return (
    	 <nav className="navbar navbar-expand-lg navbar-light header-bor position-sticky sticky-top fxIE">
            <div className="row col-12 justify-content-between">
                <div className="col-4 pt-1">
                    <a className="navbar-brand mt-1" href="javascript:void(0);"><img src="assets/images/elogo.png" /></a>
                </div>
                <div className="col-4 py-2 text-right d-flex justify-content-end">
                    <span className="py-1">{this.getLoginUserInfo()} <br />
                    <span>{this.props.loginUserInfo && this.props.loginUserInfo.roleDescription}</span></span>
                    <i  className="material-icons px-2 py-1 mt-2">person_outline</i>
                    <span className="border-left border-secondary mb-2"></span>
                    <a href="logout" onClick={ ()=>{ this.removeClientCookies("sessionExpiry");localStorage.setItem("Patient_StudyName",""); localStorage.setItem("Patient_SiteName","");localStorage.setItem("Patient_Status","")} }  className="material-icons px-2 py-1 mt-2">power_settings_new</a>
                </div>
            </div>
        </nav>
    );
  }
}


function mapStateToProps(state){
    return {
        loginUserInfo : state.login
    }
  }

export default connect(mapStateToProps)(Header);
