/**
* Copyright (c) 2018
* @summary Time Template
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React from 'react';
import DateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

class TimeTemplate extends React.Component {

    render({props} = this) {
        return (
           <div className={props.customClassObject && props.customClassObject.containerClass ?  props.customClassObject.containerClass : ''}>
                    <DateTime dateFormat={false}
                        onChange={(event)=>this.props.onchangeTimeHandler && this.props.onchangeTimeHandler(event,props.formLabelId,props.itemId,this.props.templateData)}
                        value={this.props.templateData.inputValue}
                        inputProps={{ readOnly: true }}
                        //timeFormat="HH:mm"
                        timeFormat={true}
                        className={props.customClassObject && props.customClassObject.elementClass ? props.customClassObject.elementClass : ''}
                    />
                    {/* <i className="glyphicon glyphicon-time dateicon3 cursor-pointer"></i> */}
           </div>
        )
    }
}

export default TimeTemplate;