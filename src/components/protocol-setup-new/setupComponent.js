/**
 * Copyright (c) 2018
 * @summary setup component for drag & drop epoch
 * @author Ankur Vishwakarma,Poonam Banode,Mangesh Pimprikar,Irfan Bagwan
 */

import React, { Component } from 'react';
import EpochComponent from './epochComponent';

class SetupComponent extends Component{
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


   //handel on canvas scroll
   onCanvasScroll(e){
    let conavasScrollPos = document.getElementById("canvas").scrollLeft;
    let endWinPos = document.getElementById("endWindow");
    endWinPos.style.right = - conavasScrollPos+"px"; 
    this.props.jsPlumbRef ? this.props.jsPlumbRef.repaintEverything() : ''
 }


   //function for epoch details 
    handelEncounterDetails(id,dt,epochId){
        //console.log("Encounter Details ..!.!>!>",id,dt,epochId);
    this.props.encounterDetailsHandler(id,dt,epochId);
    }

    //function for encounter details 
   handelDeleteEncounterDetails(id,dt,epochId){
     //console.log("Encounter Details ..!.!>!>",id,dt,epochId);
        this.props.deleteEncounterDetailsHandler(id,dt,epochId);
   }

   //

    /* Drag and Drop Component */
  onDragStart = (ev, id) => {
       // console.log('dragstart:',id);
        ev.dataTransfer.setData("text", "dragEpoc");
    }

    onDragOver = (ev) => {
        ev.preventDefault();
    }

    onDrop = (ev, cat) => {
        //let id = ev.dataTransfer.getData("id");
        // console.log(ev.target);
        // console.log("its the drop");
        // console.log(ev.nativeEvent.offsetX, ev.nativeEvent.offsetY);
        // console.log("Droping state=========>");
        // this.props.epochDropHandler({left:ev.nativeEvent.offsetX,top:ev.nativeEvent.offsetY});


        try{
            
            if(ev.dataTransfer.getData("text")=="dragEpoc"){
                this.props.epochDropHandler({left:ev.nativeEvent.offsetX,top:ev.nativeEvent.offsetY});
            }
            ev.preventDefault();
            
        }
        catch(e){
            console.log(e)
        }

        // let tasks = this.state.tasks.filter((task) => {
        // if (task.name == id) {
        // task.category = cat;
        // }
        // return task;
   // });

    // this.setState({
    // ...this.state,
    // tasks
    // });
    }

    _onMouseMove(e) {
        //const position = this.refs.elem.getDOMNode().getBoundingClientRect();
       // console.log(e.nativeEvent.offsetX, e.screenX);
    
        this.setState({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
      //  console.log(this.state);
      }

/*END*/

    render(){
        //console.log(this.props);
        return(

       
                
                <div className="row col-md-12 border px-0 mx-0 mb-2">
                    <div className="bg-light py-2 px-3 col-md-12">

                    {/* <button type="button" onClick={()=>this.props.addNewEpochHandeler()} className="btn btn-default btn-sm pull-left">
          <span className="glyphicon glyphicon-plus"></span> New Epoch
        </button> */}
        <span className="float-left pt-2 mr-2" >Protocol Version Name:</span>
        <span className="float-left pt-1 mr-2"><input type="text" className="form-control text-bold" value={this.props.protocolName ? this.props.protocolName : "Protocol" } onChange={(e)=> this.props.changeVersionName(e.target.value) } /> </span>


        <span className="float-left pt-2 mr-2">Version:</span>
        <span className="float-left pt-2 mr-4 bluetxt"> {this.props.currentVersion} </span>
                <div
                 title="Add new epoch"
                    style={{background:"url(assets/images/icons/epoch-icon.png) no-repeat 7px 4px" }}
                   onDragStart = {(e) => this.onDragStart(e)}
                   draggable
                   className="draggable draggable-epoch epochicon"
                  >Epoch
                 </div>
                        {/* <button type="button" className="float-right ml-3 py-2 mr-2 c-p common-btn-bg bg-p btn btn-sm text-white" data-toggle="modal" data-target="#auditTrail">Audit Trail</button> */}
                       
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 jtk-demo-canvas canvas-wide protocol-setup-container jtk-surface jtk-surface-nopan" id="canvas"
                    onDragOver={(e)=>this.onDragOver(e)}
                    onDrop={(e)=>{this.onDrop(e, "wip")}}
                    onScroll={this.onCanvasScroll.bind(this)}
                    >
                         
                    <div className="start_window" id="startWindow">Start</div>
                     <div className="end_window"   id="endWindow">End</div>
                     {
                         
                         this.props.epochs && this.props.epochs.map( (vx,idx)=>{
                            return <EpochComponent key={idx}
                            endPointHandler={this.handelEndPoint.bind(this)}
                            addNewEncounterHandler={this.forNewEncounter.bind(this,idx)}
                            deleteEpochHandeler={this.handelDeleteEpoch.bind(this,vx.nodeKey,idx)}
                            epochDetailsHandeler={this.handelEpochDetails.bind(this,vx.nodeKey,idx)}
                            addEncounterDetails={this.handelEncounterDetails.bind(this)}
                            deleteEncounterDetails={this.handelDeleteEncounterDetails.bind(this)}
                            epochInfo = {vx}
                            epochIdx ={idx + "_"+Math.random()*100+12} 
                            jsPlumbRef={this.props.jsPlumbRef}
                            />
                         })
                     }

                        <div className="col-md-12 row m-0 justify-content-start my-3"></div>
                    </div>
                  </div>
        

        )
    }


}

export default SetupComponent