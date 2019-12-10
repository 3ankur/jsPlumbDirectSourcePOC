/**
* Copyright (c) 2018
* @summary Text Template
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React from 'react';

class TextTemplate extends React.Component {

    render({props} = this) {
        return (
           <div className={props.customClassObject && props.customClassObject.containerClass ?  props.customClassObject.containerClass : ''}>
               <input className={props.customClassObject && props.customClassObject.elementClass ? props.customClassObject.elementClass : ''} type='text' uid={this.props.formId + '##' + this.props.templateData.oid}
                    onChange={(event)=>this.props.onChangeTextHandler && this.props.onChangeTextHandler(event,this.props.formLabelId,this.props.templateData.itemId,this.props.templateData)}
                    value={this.props.templateData.inputValue || ''}  />
           </div>
        )
    }
}

export default TextTemplate;