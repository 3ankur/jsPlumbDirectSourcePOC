/**
 * Copyright (c) 2018
 * @summary setup component for drag & drop epoch
 * @author Ankur Vishwakarma,Poonam Banode,Mangesh Pimprikar,Irfan Bagwan
 */

import React, { Component } from 'react';
class SetupComponent extends Component{



  //handel on canvas scroll
   onCanvasScroll(e){
    let conavasScrollPos = document.getElementById("canvas").scrollLeft;
    let endWinPos = document.getElementById("endWindow");
    endWinPos.style.right = - conavasScrollPos+"px"; 
    this.props.jsPlumbRef ? this.props.jsPlumbRef.repaintEverything() : ''
 }

    /* Drag and Drop Component */

    onDragStart = (ev, id) => {
        
        ev.dataTransfer.setData("text", "dragEpoc");
    }

    onDragOver = (ev) => {
        ev.preventDefault();
    }

    onDrop = (ev, cat) => {
        //let id = ev.dataTransfer.getData("id");
        try{
            
            if(ev.dataTransfer.getData("text")=="dragEpoc"){
                this.props.epochDropHandler({left:ev.nativeEvent.offsetX,top:ev.nativeEvent.offsetY});
            }
            ev.preventDefault();
            
        }
        catch(e){
            console.log(e)
        }
       

        
    }

    _onMouseMove(e) {
        //const position = this.refs.elem.getDOMNode().getBoundingClientRect();
        this.setState({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
      }

/*END*/

    render(){
        return(

<div className="row col-md-12 border px-0 mx-0 mb-2">
                    
 <div className="bg-light py-2 px-3 col-md-12 text-right">

{/* <button type="button" onClick={()=>this.props.addNewEpochHandeler()} className="btn btn-default btn-sm pull-left">
<span className="glyphicon glyphicon-plus"></span> New Epoch
</button> */}
<span className="float-left pt-2 mr-2" >Name:</span>
<span className="float-left pt-1 mr-3"><input type="text" value={this.props.protocolName ? this.props.protocolName : "" } onChange={(e)=> this.props.changeVersionName(e.target.value) }  className="form-control text-bold" /> </span>


<span className="float-left pt-2 mr-2 pl-3 pb-2 sepEpoch">Version:</span>
<span className="float-left pt-2 pb-3 mr-1 text-muted bluetxt epoactxt">{this.props.currentVersion}</span>
<div
title="Drag to add new Epoch"
style={{background:"url(assets/images/icons/epoch-icon.png) no-repeat 7px 4px" }}
onDragStart = {(e) => this.onDragStart(e)}
draggable
className="draggable draggable-epoch epochicon float-right"
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
                        <div className="col-md-12 row m-0 justify-content-start my-3"></div>
                    </div>
                  </div>
        
                
        
            

        )
    }


}

export default SetupComponent