/**
* Copyright (c) 2018
* @summary TextArea Template
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React from 'react';

class TextAreaTemplate extends React.Component {

    render({props} = this) {
        return (

           <div className={props.customClassObject && props.customClassObject.containerClass ?  props.customClassObject.containerClass : ''}>
                <textarea  className={props.customClassObject && props.customClassObject.elementClass ? props.customClassObject.elementClass : ''}
                 onChange={(event)=>props.onChangeTextHandler && props.onChangeTextHandler(event,this.props.formId,this.props.formLabelId,this.props.templateData)}
                 value={props.templateData.inputValue || ''}  />
           </div>
        )
    }
}
export default TextAreaTemplate;