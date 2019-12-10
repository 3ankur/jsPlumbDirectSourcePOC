/**
* Copyright (c) 2018
* @summary File Template
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React from 'react';

class ReminderTemplate extends React.Component {

    render({props} = this) {
        return (<div className={props.customClassObject && props.customClassObject.containerClass ?  props.customClassObject.containerClass : ''}>
                <div className="">
                    <i className="glyphicon glyphicon-ok mr-1"> </i>&nbsp; {props.templateData.question}
                </div>
           </div>
        )
    }
}

export default ReminderTemplate;