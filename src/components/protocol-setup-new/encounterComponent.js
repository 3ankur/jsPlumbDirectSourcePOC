/**
 * Copyright (c) 2018
 * @summary encounter component
 * @author Ankur Vishwakarma,Poonam Banode,Mangesh Pimprikar,Irfan Bagwan
 */

import React  from 'react';
//import default from 'react-redux/lib/components/Provider';

const EncounterComponent = (props)=>{
    return(
        <div className="d-inline position-relative encounter epoc_1_encounters enmargin">
        <span className="bg-dark rounded px-2 py-1 mr-4 protocol-box-overlay" onClick={(e)=>{props.deleteEncounterDetails(props.encDt && props.encDt.enId,props.encDt && props.encDt.props,props.epochIdx);e.preventDefault();e.stopPropagation();}}>
            <i  className="glyphicon glyphicon-remove" onClick={(e)=>{props.deleteEncounterDetails(props.encDt && props.encDt.enId,props.encDt && props.encDt.props,props.epochIdx);e.preventDefault();e.stopPropagation();}}></i>
        </span>
        
        <span className="bg-light-grey rounded px-2 py-1 mr-4 enboxgrey" onClick={(e)=>{props.addEncounterDetails(props.encDt && props.encDt.enId,props.encDt && props.encDt.props,props.epochIdx) ; e.preventDefault();e.stopPropagation()}}>
        {props.encDt && props.encDt.displayName}
        <i  className="glyphicon glyphicon-edit edit_encounter_icon" onClick={(e)=>{props.addEncounterDetails(props.encDt && props.encDt.enId,props.encDt && props.encDt.props,props.epochIdx);e.preventDefault();e.stopPropagation()}}></i>
        </span>
    </div>
  )
}
export default EncounterComponent;