/**
* Copyright (c) 2018
* @summary  Encounter Vital Sign Page
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
// import ApiService from '../../api';
import MenuOption from '../menuoptions/menuoptions';
import common from '../../../src/common/common';
import PrintFullEncounterData from '../../../src/components/patientdetails/fullEncounterPrintFun';
import {MODAL_AUTHENTICATION} from '../../constants/modalTypes';
import * as modalAction from '../../actions/modalActions';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux' ;
import ApiService from '../../api'
var currentContxt= null;

class ReviewPI extends Component {

    constructor(props) {
        super(props);
        this.state = {
            patientFEDetails : {},
            revierAuthorityIdentifier:"",
            studySiteIdentifier:"",
            encounterIdentifier:"",
            signatureTxt : "Signature"

        };
        currentContxt = this
    }



    componentDidMount() {
      
        // ApiService.getEncounterFEDetails(this.props.patientEncounterId).then((res)=>{
        //     this.setState({patientFEDetails:res.data.response},()=>{
        //         this.getFormattedListItem();
        //     })
        // });
if(this.props.fullData && this.props.fullData.smPi){

    let btnTxt = "Signature"
    if(this.props.fullData.smPi.revierAuthorityIdentifier.indexOf("0001")>-1){
        btnTxt= "Signature";//Signature
    }else if(this.props.fullData.smPi.revierAuthorityIdentifier.indexOf("0002")>-1){
        btnTxt= "PI-Signature"
    }

    this.setState({revierAuthorityIdentifier:this.props.fullData.smPi.revierAuthorityIdentifier,
        studySiteIdentifier:this.props.fullData.smPi.studySiteIdentifier,
        encounterIdentifier: this.props.fullData.smPi.encounterIdentifier,
        signatureTxt:btnTxt
    })
}

    }


    openAuthentication = ()=>{
        window.openSignaturePopUp(this.state.revierAuthorityIdentifier,this.state.studySiteIdentifier,this.state.encounterIdentifier)

        // this.props.modalAction && this.props.modalAction.showModal(MODAL_AUTHENTICATION,{
        //     onSave : (data) => {},
        //     hideModal: () => {
        //         this.props.modalAction.hideModal();
        //     }
        // });
    }


    approveSignature(approveData){
        
        ApiService.approveSM_PI_Signature(approveData).then(res=>{
           // if(res.status)
        
           if(res.status==200){
            NotificationManager.success("Sucessfully updated.")
            setTimeout(()=>{
                window.location.reload();
            },1500)
           }

        })
    }

    checkForValidReview=(propsData)=>{
        if(this.props.fullData.formDefinition && this.props.fullData.formDefinition.domainCode=="EREVPI" && this.props.fullData.smPi.revierAuthorityIdentifier.indexOf("0002")>-1 ){
            return true;
        }
        else if(this.props.fullData.formDefinition && this.props.fullData.formDefinition.domainCode=="EREVSM" && this.props.fullData.smPi.revierAuthorityIdentifier.indexOf("0001")>-1 ){
            return true;
        }
        return false;
    }

    render({props,state} = this) {
        return (
            <section className="col-12 m-0 review-pi">
                <div className="row m-0 row justify-content-between">
                    <div className="col-12 review-data-scroll p-0">
                        <PrintFullEncounterData reviewPage={true} encounterGroupIdentifier={this.props.patientEncounterId}/>
                    </div>

                    <div className="row col-12 justify-content-start p-0 mt-2">
                    <div className="col-9">
                        <div className="form-group ">
                            <label>Comment</label>
                            <textarea className="form-control"  rows="4" value={this.props.additionNotes}
                 onChange={(e)=>{this.props.onTblCovalChangeHandeler(e)}}></textarea>
                        </div>
                    </div>
                    <div className="col-3 pl-0">
                        <div className="form-group col-12 p-0">
                            {/* <label></label> */}
                             {/*<textarea className="form-control" rows="4"></textarea> {this.state.signatureTxt}  */  }

                             {this.checkForValidReview(props) &&
                            <div className='mt-5 text-center'>
                                <button type="button" onClick={this.openAuthentication}  className="btn text-white align-bottom bg-p mr-2">Signature</button>
                            </div>
                              }
                        </div>
                    </div>
                </div>

                </div>
            </section>
        );
    }

}



function mapDispatchToProps(dispatch) {
    return { modalAction  : bindActionCreators(modalAction,dispatch) };
}


function mapStateToProps(state){
    return { modal : state.modal }
}





export default connect(mapStateToProps , mapDispatchToProps)(ReviewPI);

var __CHILD_WINDOW_HANDLE = null;
window.openSignaturePopUp = function(aId,spId,encId){

    var w = 500;
    var h = 500;
     var left = (screen.width - w) / 2;
                var top = (screen.height - h) / 4;  // for 25% - devide by 4  |  for 33% - devide by 3
              __CHILD_WINDOW_HANDLE= window.open(`review/${spId}/${aId}/${encId}/null`, "Review Sign", 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

                /*
    window.open("popMe.html",null,
    "height=500,width=500,status=yes,toolbar=no,menubar=no,location=no");

    */

    // This will call the function ProcessParentMessage on the child
     //__CHILD_WINDOW_HANDLE.ProcessParentMessage('Message to the child');
    }

    // This event hander will listen for messages from the child
    window.addEventListener('message', function(e) {
        window.ProcessChildMessage_2(e.data); // e.data hold the message
    } , false);

    window. ProcessChildMessage_2 = (message)=>{
    
    try{
        currentContxt.approveSignature(message)
    }catch(e){}

    if(__CHILD_WINDOW_HANDLE){
        __CHILD_WINDOW_HANDLE.close();
    }
    //alert(message);
        // do something with the message
    }