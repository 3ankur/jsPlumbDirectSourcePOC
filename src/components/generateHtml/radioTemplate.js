/**
* Copyright (c) 2018
* @summary Radio Template
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React from 'react';
import Common from '../../common/common';

class RadioTemplate extends React.Component {
    render({props} = this) {
        const yesTxt =  props.labelText && props.labelText.indexOf('Clinically Significant') > -1 ? 'CS' : props.templateData[0] && props.templateData[0].decode
        const noTxt =  props.labelText && props.labelText.indexOf('Clinically Significant') > -1 ? 'NCS' : props.templateData[1] && props.templateData[1].decode
        let radioName = props.fullData.uniqueIdentifier + '#' + Common.getRandomNumber();
        return (<div className={props.customClassObject && props.customClassObject.containerClass ?  props.customClassObject.containerClass : ''}>
                    <span className="float-left text-left pl-0 pr-1">
                        { yesTxt}
                    </span>
                    <div className="radio-wrapper">
                        <input type="radio" name={radioName} className="yes" id={`radio-yes${radioName}`}
                        defaultChecked={ props.fullData && props.fullData.inputValue=="1" ?   true : false}
                         onChange={(event)=>this.props.onChangeRadioHandler && this.props.onChangeRadioHandler(event,props.formLabelId,props.itemId,1,props.fullData)} />
                        <label htmlFor={`radio-yes${radioName}`}></label>

                        <input type="radio" name={radioName} className="neutral" value="0"   id={`radio-neutral${radioName}`}
                        defaultChecked={ props.fullData && props.fullData.inputValue==0 || props.fullData.inputValue=="" || props.fullData.inputValue==null  ?   true : false}
                        onChange={(event)=>this.props.onChangeRadioHandler && this.props.onChangeRadioHandler(event,props.formLabelId,props.itemId,0,props.fullData)}
                       />
                        <label htmlFor={`radio-neutral${radioName}`}></label>

                        <input type="radio"  name={radioName} className="no" id={`radio-no${radioName}`}
                        defaultChecked={ props.fullData && props.fullData.inputValue=="2" ?   true : false}
                        onChange={(event)=>this.props.onChangeRadioHandler && this.props.onChangeRadioHandler(event,props.formLabelId,props.itemId,2,props.fullData)}  />
                        <label htmlFor={`radio-no${radioName}`}></label>
                    </div>
                    <span className="px-2 text-left">{ noTxt}</span>
           </div>
        )
    }
}
export default RadioTemplate;