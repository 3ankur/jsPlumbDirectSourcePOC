
/**
* Copyright (c) 2018
* @summary Preview Page Encounter Component
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/

import React  from 'react';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';

const EncounterComponent = (props)=>{
    return(
        <Tooltip
          placement="top"
          mouseEnterDelay={0}
          mouseLeaveDelay={0.1}
          destroyTooltipOnHide={false}
          trigger={Object.keys({hover: 1})}
          overlay={<div >{props.encDt && props.encDt.encounterName ? props.encDt.encounterName : props.encDt && props.encDt.displayName }</div>}
          align={{
            offset: [0, -3],
          }}
        >
            <span className="bg-light-grey rounded px-2 py-1 mr-4 enprev">{props.encDt && props.encDt.displayName}</span>
    </Tooltip>)
}

export default EncounterComponent;