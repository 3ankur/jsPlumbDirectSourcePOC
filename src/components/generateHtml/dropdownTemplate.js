/**
* Copyright (c) 2018
* @summary Dropdown Template
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React from 'react';
import Common from '../../common/common';
import ReactSuperSelect from 'react-super-select';
import '../../../node_modules/react-super-select/lib/react-super-select.css';
//../../node_modules/react-super-select/lib/react-super-select.css

class DropDownTemplate extends React.Component {

    constructor(props) {
        super(props);
    }

    getCommaOnAfterItem=(length,itemIndex)=>{
        if(length > 1){
            if((length - 1) === itemIndex){
                return ''
            }else{
                return ','
            }
        }
        return ''
    }

    customSelectedValueTemplateFunction = (selectedItmes) =>{
        return(
            <div className='selected-dropdown-itmes'>
                {
                    selectedItmes.map((item,index)=>{
                        return(
                            <span key={item.id ? item.id : Common.getRandomNumber()}>
                                {item.name}
                                {/* { selectedItmes.length > 1 ? ',' : ''} */}
                                {this.getCommaOnAfterItem(selectedItmes.length,index)}
                            </span>
                        )
                    })
                }
            </div>
        )
    }

    getoptionList = ()=>{
        Common.sortByOrder(this.props.templateData,'ASC').forEach((item,index)=>{
            item.id = item.codeId || item.measurement_def_id || 'dId'+Common.getRandomNumber();
            item.name = item.decode || item.symbol || item.name;
        })
        return this.props.templateData;
    }
    customOptionTemplateFunction = (item, search, searchRegex) => {
        return <span title={item.name}>{item.name}</span>
    }

    getInitValue(){
        try{
            if( this.props.fullData && this.props.fullData.hasOwnProperty("codeDefinationList") &&  this.props.fullData.codeDefinationList[0]["inputType"]=="multiselect" ){

             let parseData =     this.props.fullData.inputValue && JSON.parse(this.props.fullData.inputValue);
             let tmp=[]
             parseData.forEach( (d,ix)=>{
               let found =   this.props.fullData.codeDefinationList.filter((a)=>{return a.name ==d} )
              // found && found.length ?  tmp.push(found[0]) : ""

              if(found.length){
                // let obj = {
                //     id: found[0].codeId  ||  found[0].measurement_def_id || 'dId'+found.getRandomNumber() ,
                //     name : found[0].decode || found[0].symbol || found[0].name
                //    }
                   tmp.push(found[0])
              }


             })
             return tmp;
            }
            else{

                let filterData = this.props.templateData.filter( (o)=> {return  o.name && (o.name).trim() == (this.props.fullData.inputValue).trim()})

            if(filterData.length ){

                 let obj = {
                     id: filterData[0].codeId  ||  filterData[0].measurement_def_id || 'dId'+Common.getRandomNumber() ,
                     name : filterData[0].decode || filterData[0].symbol || filterData[0].name
                    }
                    return obj

            }else{
                return null
            }

            }

        }
        catch(e){
            return null
        }


    }
    render({props,state} = this) {
        let OptionList = this.getoptionList();
        let isMultiSelect = props.templateData && props.templateData[0].inputType === 'multiselect' ? true : false;
        return (<div className={props.customClassObject && props.customClassObject.containerClass ?  props.customClassObject.containerClass : ''}>
               {/* <select className={props.customClassObject && props.customClassObject.elementClass ? props.customClassObject.elementClass : ''}
                    onChange={(event)=>this.props.onChangeDropDownHandler(event,props.formId,props.formLabelId,this.props.templateData.oid)}
                    value={this.props.templateData.value} >
                        <option value="">Select</option>
                        {   props.templateData && Common.sortByOrder(props.templateData,'ASC').map((item,idx) => {
                                return <option key={idx}  value={item.decode}>{item.decode || item.name}</option>
                            })
                        }
               </select> */}
                 <ReactSuperSelect
                    placeholder="Select"
                    clearSearchOnSelection={true}
                    dataSource={OptionList ? OptionList : [] }
                    onChange={(option)=>this.props.onChangeDropDownHandler && this.props.onChangeDropDownHandler(option,props.formLabelId,props.itemId,this.props.fullData)}
                    searchable={true}
                    keepOpenOnSelection={false}
                    closeOnSelectedOptionClick={true}
                    deselectOnSelectedOptionClick={isMultiSelect ? true : false}
                    customClass='select-container'
                    customOptionTemplateFunction={this.customOptionTemplateFunction}
                    customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                    clearable = {false}
                    initialValue={this.getInitValue()}
                    multiple={isMultiSelect}
                    closeOnSelectedOptionClick={!isMultiSelect ? true : false}
                    keepOpenOnSelection={isMultiSelect ? true : false}
                />
           </div>
        )
    }
}

export default DropDownTemplate;