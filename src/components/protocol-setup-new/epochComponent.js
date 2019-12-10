/**
 * Copyright (c) 2018
 * @summary epoch component
 * @author Ankur Vishwakarma,Poonam Banode,Mangesh Pimprikar,Irfan Bagwan
 */

import React  from 'react';
//import default from 'react-redux/lib/components/Provider';
import EncounterComponent from './encounterComponent'

class  EpochComponent extends React.Component{


    constructor(props){
        super(props);

        this.pStyle = {
            left: '400px',
            top: '10px'
          };

          this.myProps = props;
          this.textInput = null;


          this.setTextInputRef = element => {
            this.textInput = element;
          };

          this.focusTextInput = () => {
            // Focus the text input using the raw DOM API
            if (this.textInput) this.textInput.focus();
          };

    }

    componentWillReceiveProps(props) {
        // Update the chart with new data every time we receive props.
      }

    componentDidMount(oldPr,newPro){
        this.props.endPointHandler(this.refs);
        //this.props.endPointHandler(this.props.epochInfo.nodeKey); // this.textInput this.refs
    }

    handelForEncounters(e){
        e.preventDefault();
        e.stopPropagation();
        this.props.addNewEncounterHandler();
    }

    // Delete  epoch handler
    deleteEpoch(){
        this.props.deleteEpochHandeler(this.props.epochInfo.nodeKey) // this.textInput this.props.epochInfo.nodeKey
    }

    //getting the position of epoch
    getCurrentStyle(){

        if(this.props.epochInfo && this.props.epochInfo.position){
            return   {
                left: this.props.epochInfo.position.left+'px',
                top: this.props.epochInfo.position.top+'px'
              };
        }
        return   {
            left: '400px',
            top: '10px'
          };  //this.props.epochInfo.positions
    }

    getEpochDetail(){
        this.props.epochDetailsHandeler(this.props.epochInfo.nodeKey);
    }

    encounterDetailsHandler(idx,edata,epochId){
        this.props.addEncounterDetails(idx,edata,epochId);
    }

    deleteEncounterDetailsHandler(idx,edata,epochId){

        this.props.deleteEncounterDetails(idx,edata,epochId);
    }





render(){
       //"left: 400px; top: 10px;" style={{maxWidth:"240px"}}
       return(

                <div ref="epoch" id={this.props.epochInfo ?  this.props.epochInfo.nodeKey : ''} className="col-auto border mr-4 p-3 mt-3 protocol-epoch jtk-draggable jtk-endpoint-anchor" style={this.getCurrentStyle()}>
                <div className="row p-0 d-flex justify-content-between border-bottom-p-dotted pb-2">
                <h5 className="pl-2 col-auto p-0 c-p" id="epoch_1_title">{this.props.epochInfo && this.props.epochInfo.name}</h5>
                <div className="d-flex flex-row col-auto p-0 justify-content-between pt-1">
                    <button className="glyphicon glyphicon-edit pr-2 c-p protocol-setup-btn" onClick={this.getEpochDetail.bind(this)} ></button>
                    <button className="glyphicon glyphicon-remove c-p protocol-setup-btn" onClick={this.deleteEpoch.bind(this) } ></button>
                </div>
            </div>
            <div className="py-4 enlength" id="epoc_1_encounters" >
            {
                this.props.epochInfo.encounters && this.props.epochInfo.encounters.map( (vx,idx)=>{
                  return   <EncounterComponent
                         encDt={vx}
                         key={idx}
                         enId={idx}
                         addEncounterDetails={this.encounterDetailsHandler.bind(this,idx,vx,this.props.epochIdx)}
                         deleteEncounterDetails ={this.deleteEncounterDetailsHandler.bind(this,idx,vx,this.props.epochIdx)}
                         epochIdx={this.props.epochIdx}
                         />
                })
            }
            </div>
            <div className="addiconnline">
            <button className="enaddbtn" title="Add new encounter" onClick={this.handelForEncounters.bind(this)} ></button></div>
            </div>

            )
    }
}
export default EpochComponent;