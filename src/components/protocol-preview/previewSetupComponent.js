/**
 * Copyright (c) 2018
 * @summary Preview page container component
 * @author Ankur Vishwakarma,Poonam Banode,Mangesh Pimprikar,Irfan Bagwan
 */

import React, { Component } from 'react';
import EpochComponent from './epochComponent';
import Common from '../../common/common';

class previewSetupComponent extends Component{


   constructor(props){
       super(props);
   }

   handelEndPoint(el){

this.props.updateEndPointHandler(el);
   }

   forNewEncounter(idx){
       this.props.addEncounterToEpoch(idx);
   }

   handelDeleteEpoch(nodeKey,id){
       this.props.deleteEpochData(nodeKey,id);
   }

   handelEpochDetails(nodeKey,id){
this.props.getEpochDetails(nodeKey,id)
   }

   handelEncounterDetails(id,dt,epochId){
  this.props.encounterDetailsHandler(id,dt,epochId);
   }
    render(){
        
        return(
                <div className="row col-md-12 border px-0 mx-0 mb-2 mb-4">
                    <div className="bg-light py-3 px-3 col-md-12">
                    {/* FOR the details */}
                    <span className="px-0">Source Data Name:</span> <span className="pl-1 bluetxt " style={ {color:"#333 !important",fontSize:"13px"} } title={this.props.protocolName}>{this.props.protocolName ? Common.getSubString(this.props.protocolName,15) : 'PN'}</span>&nbsp;
                    <span className="pl-4">Version:</span> <span className="pl-1 bluetxt " style={ {color:"#333 !important",fontSize:"13px"} }>{this.props.protocolVersion}</span>

                    <span className="pl-4">Publish Date:</span> <span className="pl-1 bluetxt " style={ {color:"#333 !important",fontSize:"13px"} }>{Common.formatDate(this.props.publishDate) }</span>
                </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 jtk-demo-canvas canvas-wide protocol-setup-container jtk-surface jtk-surface-nopan" id="canvas">
                         
                    <div className="start_window" id="startWindow">Start</div>
                     <div className="end_window"   id="endWindow">End</div>
                     {
                         
                         this.props.epochs && this.props.epochs.map( (vx,idx)=>{
                            return <EpochComponent key={idx}
                            endPointHandler={this.handelEndPoint.bind(this)}
                            epochInfo = {vx}
                            epochIdx ={idx}
                            />
                         })
                     }

                        <div className="col-md-12 row m-0 justify-content-start my-3"></div>
                    </div>
                  </div>
        

        )
    }


}

export default previewSetupComponent