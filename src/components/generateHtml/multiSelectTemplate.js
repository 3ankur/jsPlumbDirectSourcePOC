/**
* Copyright (c) 2018
* @summary MultiSelect Template
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React from 'react';

class MultiSelectTemplate extends React.Component {

    render({props} = this) {
        return (<div>
                { props.templateData.items.map((item) => {
                    return(
                        <div key={item}>
                            <input type={props.templateData.type} name={props.templateData.name} value="" />
                            {item}
                        </div>
                    )
                })
                }
           </div>
        )
    }
}

export default MultiSelectTemplate;