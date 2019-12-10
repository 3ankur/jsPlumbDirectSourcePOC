/**
* Copyright (c) 2018
* @summary Application login functionality
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*/
import React, { Component } from 'react';
import {FormattedMessage, injectIntl, intlShape } from 'react-intl';
import * as loginAction from '../../../actions/loginAction';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux' ;
import {NotificationManager} from 'react-notifications';

class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
        logindata: {email: '', password: ''},
        emailerr:'',passworderr:'',
        loginTypes:[
          {firstname:"Doe",lastname:"Smith", username:"dsmith",password:"demo",role:"PI", access:[{pages:"Encounter Details,Activity List"}]},
          {firstname:"John",lastname:"Smith",username:"sjohn",password:"demo", role:"SM", access:[{pages:"Patient Source,Activity List"}]},
          {firstname:"Admin",lastname:"Admin",username:"admin",password:"admin",role:"ADMIN", access:[{pages:"all"}]},
      ]
    }
  }
//Doe,

componentDidMount(){
  localStorage.setItem("loginInfo","")
}

  handleErrors(){
    var email = this.state.logindata.email;
    var password = this.state.logindata.password;

    var formerr=false;

    // if(email.trim()==""){
    //   this.setState({emailerr:'Please enter an email'});
    //   formerr = true;
    //   return true;
    // }else{
    //   this.setState({emailerr:''});
    //   formerr= false;
    // }

    // var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    // if (!emailRegex.test(email)){
    //   this.setState({emailerr:'Please enter valid email'});
    //   formerr = true;
    //   return true;
    // }
    // else {
    //   this.setState({emailerr:''});
    //   formerr= false;
    // }

    if(password.trim()==""){
      this.setState({passworderr:'Please enter a password'});
      formerr = true;
    }else{
      this.setState({passworderr:''});
      formerr = false;
    }

    if(password.trim().length===""){
      this.setState({passworderr:'Minimum 6 characters required'});
      formerr = true;
    }else{
      this.setState({passworderr:''});
      formerr = false;
    }
    return formerr;
  }

  login = () =>{
    let tempUsr = {
     username : this.state.logindata.email,
     password : this.state.logindata.password
   }

  const  foundData = this.state.loginTypes && this.state.loginTypes.filter( (o)=>  tempUsr.username === o.username &&  tempUsr.password === o.password)

  if(foundData.length>0){
    const loginUser = {username:foundData[0]["username"],role:foundData[0]["role"],access:foundData[0]["access"],
                      firstname:foundData[0]["firstname"],lastname:foundData[0]["lastname"]};
    localStorage.setItem("loginInfo", JSON.stringify([loginUser]));
    this.props.loginService.login(loginUser)
  }
  else{

    var s = document.querySelector(".notification-container");
    var t = s.childNodes[0];
    if(t.childNodes && t.childNodes.length>0){
      t.childNodes && t.childNodes.forEach((vx)=>{
       vx.style.display = "none";
      })
    }
    //s && s.childNodes ? s.childNodes[0].style.display = "none" : ''
   // document.getElementById("myDIV").style.display = "none";
    NotificationManager.error("Invalid credentials")
  }
  }
  onSignIn = (e) =>{
    e.preventDefault();
    if(this.handleErrors()){
      return;
    }
    this.login();
  }
  onChange = (event) =>{
		const field = event.target.name;
		const logindata = this.state.logindata;
		logindata[field] = event.target.value;
		return this.setState({logindata: logindata});
  }
  render({props} = this) {
    return (
      <div className='text-center d-flex justify-content-center pt-5'>
        <div className="form-signin col-lg-6 col-xl-3 col-md-6 col-sm-7 align-self-center ">
            <img className="mb-4" src="assets/images/elogo.png" alt="" />
            <div className="border p-5 bg-white">
                <h1 className="h5 mb-3 font-weight-normal text-left c-b">
                    <FormattedMessage id="login.signin" />
                </h1>

                <form onSubmit={(e) => {this.onSignIn(); e.preventDefault();}}>
                <label htmlFor="inputEmail" className="sr-only">Email address</label>
                <input type="email"  name="email" value={this.state.logindata.email} onChange={this.onChange} className="form-control  mb-2"
                   placeholder={props.intl.formatMessage({id: 'login.emailId'})} required="" />
                <label className='error-message'>{this.state.emailerr}</label>

                <label htmlFor="inputPassword" className="sr-only">Password</label>
                <input type="password"  name="password" value={this.state.logindata.password} onChange={this.onChange} className="form-control" placeholder="Password" required="" />
                <label className='error-message'>{this.state.passworderr}</label>

                {/* <div className="checkbox my-3 d-flex jutify-content-end">
                    <label>
                    <input type="checkbox" value="remember-me" /> <FormattedMessage
                        id="login.rememberMe"
                    />
                    </label>
                </div> */}
                <button className="btn btn-lg bg-ligh-blue text-white btn-block" type="submit" onClick={this.onSignIn}>
                    <FormattedMessage
                        id="login.signin"
                    />
                </button>
                </form>

            </div>
            <footer className="sticky-footer text-center py-4 text-muted">
                   <FormattedMessage
                      id="login.footerText"
                   />
            </footer>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  intl: intlShape.isRequired
};

function mapDispatchToProps(dispatch) {
  return {
      loginService   : bindActionCreators(loginAction, dispatch)
  };
}

function mapStateToProps(state){
  return {
      loginUserInfo : state.login
  }
}

export default connect(mapStateToProps , mapDispatchToProps)(injectIntl(Login));
