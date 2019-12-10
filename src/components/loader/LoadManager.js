/**
 * Copyright (c) 2018
 * @summary showing loader on page while rest call happen
 * @author Ankur Vishwakarma,Poonam Banode,Mangesh Pimprikar,Irfan Bagwan
 */
import React,{Component} from 'react';
import axios from 'axios';
import Loader from './loader';
import Common from '../../common/common'


class LoadManager extends Component{

constructor(props){
super(props);
this.state={
    loading:false
}
Common.setLoaderRef(this);
}


componentDidMount(){
var numberOfAjaxCAllPending = 0;
// Add a request interceptor
axios.interceptors.request.use( (config)=> {

   config.headers.common["X-Requested-With"] = 'XMLHttpRequest';
   config.headers.common["X-CSRF-TOKEN"] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  // Do something before request is sent
  numberOfAjaxCAllPending++
 this.showLoader();
  return config;
},  (error) =>{
    
    numberOfAjaxCAllPending--;
    this.hideLoader();
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use( (response)=>{
  // Do something with response data
  numberOfAjaxCAllPending--;

  if (numberOfAjaxCAllPending == 0) {
      //hide loader
      this.hideLoader();
  }
  return response;
},  (error)=> {
    
    numberOfAjaxCAllPending--;
    this.hideLoader();
    //check for session time out
    if(error && error.response && error.response.status===901){
        localStorage.setItem("Patient_StudyName","")
        localStorage.setItem("Patient_SiteName","")
        localStorage.setItem("Patient_Status","")
       // window.location.href = "login";
        
    }

  // Do something with response error
  return Promise.reject(error);
});
}



 showLoader(){
this.setState({loading:true});
}

 hideLoader(){
    this.setState({loading:false});
    }
//show={this.state.loading}

render(){
    
    return(
        this.state.loading ?  <Loader  /> : ''

    )
}



}



export default LoadManager;