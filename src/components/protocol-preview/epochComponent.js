/**
 * Copyright (c) 2018
 * @summary Preview page epoch component
 * @author Ankur Vishwakarma,Poonam Banode,Mangesh Pimprikar,Irfan Bagwan
 */
import React  from 'react';
import EncounterComponent from './encounterComponent';
import Common from '../../common/common';

class  EpochComponent extends React.Component{
    constructor(props){
        super(props);
        this.pStyle = {
            left: '400px',
            top: '10px'
          };
          this.myProps = props;
    }

    componentDidMount(oldPr,newPro){
        this.props.endPointHandler(this.refs);
    }

    handelForEncounters(){
        this.props.addNewEncounterHandler();
    }

    // Delete  epoch handler
    deleteEpoch(){
        this.props.deleteEpochHandeler(this.props.epochInfo.nodeKey)
    }

    //getting the position of epoch
    getCurrentStyle(){
        if(this.props.epochInfo && this.props.epochInfo.position){
            return   {
                left: this.props.epochInfo.position.left ? this.props.epochInfo.position.left+'px' : "400px",
                top: this.props.epochInfo.position.top ? this.props.epochInfo.position.top+'px' : "10px"
              };
        }
        return {
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

    render(){
       return(
        <div  ref="epoch" id={this.props.epochInfo ?  this.props.epochInfo.nodeKey : ''} className="col-auto border mr-4 p-3 mt-3 protocol-epoch jtk-draggable jtk-endpoint-anchor" style={this.getCurrentStyle()}>
            <div className="col-12 p-0 d-flex justify-content-between border-bottom-p-dotted pb-2 mb-3">
                <h5 className=" col-auto p-0 c-p" id="epoch_1_title" title={this.props.epochInfo.name}>{this.props.epochInfo && Common.getSubString(this.props.epochInfo.name,12)}</h5>
                <div className="d-flex flex-row col-auto p-0 justify-content-between pt-1"></div>
            </div>
            <div className="py-0 enscroll" id="epoc_1_encounters">
            {
                this.props.epochInfo.encounters && this.props.epochInfo.encounters.map( (vx,idx)=>{
                  return   <EncounterComponent
                         encDt={vx}
                         key={idx}
                         enId={idx}
                         epochIdx={this.props.epochIdx}
                         />
                })
            }
            </div>
        </div>
    )
}

}

export default EpochComponent;