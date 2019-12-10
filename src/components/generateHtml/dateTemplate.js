/**
* Copyright (c) 2018
* @summary Date Template
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React from 'react';
import DateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

class DateTemplate extends React.Component {

    constructor(props){
        super();
        this.state = {
            openStartDateCalender:false
        }
    }

    //updating code for fixes
    updateDateChanges = (event,props)=>{
        this.setState({openStartDateCalender : false})
        this.props.onDateChangeHandler && this.props.onDateChangeHandler(event,props.formLabelId,props.itemId,props.templateData)

    }

    render({props} = this) {
        return (<div className={props.customClassObject && props.customClassObject.containerClass ?  props.customClassObject.containerClass : ''}>
                  <DateTime dateFormat="DD-MMM-YYYY"
                        timeFormat={false}
                        onChange={(event)=>this.updateDateChanges(event,props)}
                        closeOnSelect={true}
                        className={props.customClassObject && props.customClassObject.elementClass ? props.customClassObject.elementClass : ''}
                        open={this.state.openStartDateCalender}
                        input={true}
                        inputProps={{ readOnly: true }}
                        value={props.templateData  && props.templateData.inputValue}
                    />
                    <i className="glyphicon glyphicon-calendar dateicon3 cursor-pointer" onClick={()=>this.setState({openStartDateCalender : !this.state.openStartDateCalender})}></i>
                </div>
        )
    }
}
export default DateTemplate;