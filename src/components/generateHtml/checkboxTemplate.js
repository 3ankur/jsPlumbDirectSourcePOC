/**
* Copyright (c) 2018
* @summary Checkbox Template
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React from 'react';
import Common from '../../common/common';

class CheckBoxTemplate extends React.Component {

    render({props} = this) {
        return (<div className={props.customClassObject && props.customClassObject.containerClass ?  props.customClassObject.containerClass : ''}>
                {
                    this.props.templateData && Common.sortByOrder(this.props.templateData,'ASC').map((item,idx) => {
                        let uniqueId = Common.getRandomNumber();
                        return  <div className="custom-control custom-checkbox  mb-2" key={idx}>
                            <input type="checkbox" defaultChecked={ props.fullData && props.fullData.inputValue &&  JSON.parse(props.fullData.inputValue)   ?   true : false}
                            onChange={(event)=>props.onchangeCheckboxHandler(event.target.checked ,props.fullData)} className="custom-control-input" id={uniqueId} />
                            <label className="custom-control-label" htmlFor={uniqueId}>{item.decode}</label>
                        </div>
                    })
                }
           </div>
        )
    }
}

export default CheckBoxTemplate;