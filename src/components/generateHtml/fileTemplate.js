/**
* Copyright (c) 2018
* @summary File Template
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/



import React from 'react';

class FileTemplate extends React.Component {
    constructor(props){
        super(props);
    }

    render({props} = this) {

        return (<div>
                    <div className='input-group ml-0 position-relative'>
                            <input className={props.customClassObject && props.customClassObject.elementClass ? props.customClassObject.elementClass : ''} type='file'
                            name="myfile"  title=" " style={{zIndex:1}}
                                onChange={(event)=>this.props.onChangeFileHandler && this.props.onChangeFileHandler(event,props.itemDefIndex,props.fullData)}
                                />
                                <div className='fileInputVal'>
                                    <span className='fileText'>{this.props.templateData.inputValue}</span>
                                    {this.props.templateData.inputValue &&
                                        <span aria-hidden="true" className='cursor-pointer ml-2 fileClose' onClick={()=>props.onCloseSelectedFile && props.onCloseSelectedFile(props.fullData)}>&times;</span>
                                    }
                                </div>
                            <label className="custom-file-label mb-0"></label>
                    </div>

                    { this.props.templateData && this.props.templateData.fileList && this.props.templateData.fileList.map((item,index)=>{
                            return (<div className=''>
                                <a href={`download/media/${item.uniqueIdentifier}`} > {item.fileName}</a>
                                <span aria-hidden="true" className='cursor-pointer ml-2 fileClose' onClick={()=>this.props.deleteFile(this.props.templateData,item,index)}>&times;</span>
                            </div>)
                        })
                    }
                </div>
            )
    }
}

export default FileTemplate;