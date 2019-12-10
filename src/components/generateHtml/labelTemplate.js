/**
* Copyright (c) 2018
* @summary Label Template
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React from 'react';
import Common from '../../common/common';

class LabelTemplate extends React.Component {

    render({props} = this) {
        return (<div className={props.customClassObject && props.customClassObject.containerClass ?  props.customClassObject.containerClass : ''}>
                {props.templateData.inputValue || props.templateData.value  }
           </div>
        )
    }
}
export default LabelTemplate;