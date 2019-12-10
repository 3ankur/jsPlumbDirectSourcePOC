/**
 * Copyright (c) 2018
 * @summary encounter details modal popup
 * @author Ankur Vishwakarma,Poonam Banode,Mangesh Pimprikar,Irfan Bagwan
 */

import React from 'react';
import { connect } from 'react-redux';
import { hideModal } from '../../actions/modalActions';
import Modal from '../modaldialog/modal';
import { NotificationManager } from 'react-notifications';
import Common from '../../common/common'
import ReactSuperSelect from 'react-super-select';
import '../../../node_modules/react-super-select/lib/react-super-select.css';

class  EncounterDetailsModal extends React.Component {


    constructor(props){
        super(props);

        this.state = {
            encounterName:"",
            encounterDesc:"",
            fromVisit:"",
            toVisit:"",
            fromType:"",
            toType:"",
            type:"",
            timeWindowString:"",
            baselineWindow:"",
            initialSelection:null,
            parentEnNodeKey:""

        }
    this.errorMsg = "";
    this.textHandleChange = this.textHandleChange.bind(this);
    this.selectHanderChanges = this.selectHanderChanges.bind(this);
    }

   onClose = () => {
    this.props.hideModal();
    if (this.props.afterClose) {
      this.props.afterClose();
    }
  };

  validateEncounterForm(){
    if( this.state.encounterName && this.state.encounterName!="" &&
        this.state.fromVisit && this.state.fromVisit!="" &&
        this.state.fromType && this.state.fromType!="" &&
         this.state.toType && this.state.toType!=""){

            if(this.props.previousEpochEncounterList.length>0){
                if(this.state.baselineWindow && this.state.parentEnNodeKey && this.state.timeWindowString!='NA'){
                    return true;
                }
                else{
                    this.errorMsg ="Invalid From Epoch Encounter";
                  return false;
                }
            }
        return true;
    }
    else{
        this.errorMsg = "Please fill required fields";
        return false;
    }
  }

  onSaveEncounter = () =>{

    if(this.validateEncounterForm()){
        this.props.onSaveEncounter && this.props.onSaveEncounter(this.state);
        this.onClose();
    }else{
        Common.clearNotification();
        if(this.errorMsg){
            NotificationManager.error(this.errorMsg);
        }
        else{
            NotificationManager.error("Please fill required fields")
        }
    }

  }

//   const onEpochNameChange = (e)=>{
//     epocData(e);
//   }

textHandleChange (evt) {
    if(evt.target.validity.valid){
        this.setState({ [evt.target.name]: evt.target.value });
    }

  }

  selectHanderChanges(evt){

    this.setState({ [evt.target.name]: evt.target.value });
  }


componentDidMount(){


    if(this.props.enInfo && this.props.enInfo.length)
    {
        let  prevSt = this.state;
        Object.assign(prevSt,this.props.enInfo[0]);
        this.setState(prevSt,()=>{
            if(this.state.encounterName==""){
                this.setState({encounterName:this.state.displayName})
            }
        })
        //this.state.encounterName ? this.state.encounterName : this.state.displayName
        console.log("PrevEnc List",this.props.previousEpochEncounterList)
            console.log("Selec Inb",this.props.enInfo)
        if(this.props.enInfo.length && this.props.enInfo[0]["baselineWindow"] && this.props.previousEpochEncounterList.length){

            let foundEn =  this.props.previousEpochEncounterList.filter((p)=>{return this.props.enInfo[0]["baselineWindow"]["name"]===p.name});

            if(foundEn.length>0){
                    this.setState({initialSelection:this.props.enInfo[0]["baselineWindow"]})
                }
                else{
                    this.setState({initialSelection:null,baselineWindow:"",parentEnNodeKey:""})
                }
        }
		else if(this.props.enInfo.length && this.props.previousEpochEncounterList && this.props.previousEpochEncounterList.length){
			let filterResult = this.props.previousEpochEncounterList.filter((p)=>{return this.props.enInfo[0]["parentEnNodeKey"]===p.info.enNodeKey});
			if(filterResult.length>0){
			this.setState({initialSelection:filterResult[0],baselineWindow:filterResult[0]})
			}
			else{
			this.setState({initialSelection:null,baselineWindow:"",parentEnNodeKey:""})
			}
		}
    }
    this.setState({timeWindowString:""})

}

customOptionTemplateFunction = (item, search, searchRegex) => {
    return <span title={item.name}>{item.name}</span>
}

customSelectedValueTemplateFunction = (selectedItmes) =>{
    return(
        <div className='selected-dropdown-itmes'>
            { selectedItmes.map((item)=>{
                return(
                    <span key={item.id}>
                        {item.name}
                        { selectedItmes.length > 1 ? ',' : ''}
                    </span>
                )
                })
            }
        </div>
    )
}

handleEpochEncounterChange = (opt)=>{

if(opt && opt.info && opt.info.fromVisit &&  opt.info.toVisit){
    let str = opt.info.fromVisit &&  opt.info.toVisit && opt.info.fromType ?  `${opt.info.fromVisit} - ${opt.info.toVisit} ${opt.info.fromType}` : 'NA';
    this.setState({timeWindowString:str,baselineWindow:opt,parentEnNodeKey:opt.info.enNodeKey});
}
else{
    let msg = opt && opt.name ? `${opt.name} is not configured` : "Invalid form";
    this.errorMsg = msg;
    this.setState({baselineWindow:"",parentEnNodeKey:""})
    Common.clearNotification();
    NotificationManager.warning(msg)
}
}


  render(){

    return (
        <Modal onClose={this.onClose}>
            <div className="modal-header border-bottom-p mx-4 p-0 py-3">
                <h5 className="modal-title c-p" id="exampleModalLabel">Encounter Details</h5>
                <button type="button" className="close c-p" data-dismiss="modal" aria-label="Close" onClick={this.onClose}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body px-3 text-left">

                            <form className=" form-row">
                                <div className="form-group col-md-12 col-sm-12">
                                    <label  className="col-sm-12 col-form-label text-left fontweight500">Encounter Name</label>
                                    <div className="col-sm-12">
                                       <input type="text" name="encounterName"  value={ this.state.encounterName } className="form-control"
                                        onChange={this.textHandleChange} />
                                    </div>
                                </div>

                                {/* <div className="form-group col-md-12 col-sm-12">
                                    <label  className="col-sm-12 col-form-label text-left">Encounter Description</label>
                                    <div className="col-sm-12">
                                       <textarea type="text" name="encounterDesc"  value={this.state.encounterDesc}  className="form-control" onChange={this.textHandleChange}  />
                                    </div>
                                </div>
                            this.props.previousEpochEncounterList.length
                            */}

                                <div className="form-group col-md-12 col-sm-12">

                                    <div className={ this.props.previousEpochEncounterList&&this.props.previousEpochEncounterList.length ? `col-6 float-left custred` : `col-6 float-left` } >
                                    <label  className="col-form-label text-left fontweight500">From Epoch Encounter</label>
                                       {/* <textarea type="text" name="encounterDesc"  value={this.state.encounterDesc}  className="form-control" onChange={this.textHandleChange}  /> */}
                                       <ReactSuperSelect
                                        placeholder="Select"
                                        clearSearchOnSelection={true}
                                        dataSource={this.props.previousEpochEncounterList || []}
                                        closeOnSelectedOptionClick={false}
                                        clearable={false}
                                        onChange={this.handleEpochEncounterChange}
                                        searchable={true}
                                        multiple={false}
                                        keepOpenOnSelection={false}
                                        closeOnSelectedOptionClick={false}
                                        customOptionTemplateFunction={this.customOptionTemplateFunction}
                                        deselectOnSelectedOptionClick={false}
                                        customClass='select-container'
                                        customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                        initialValue={this.state.initialSelection}
                                    />

                                    </div>
                                    {/* <div className="col-6 float-right">
                                    <label  className="col-form-label text-left fontweight500">Encounter Window</label>
                                    <div className="">{this.state.timeWindowString}</div>
                                    </div> */}

                                </div>

                                <div className="form-group col-12  m-0">
                                <label className="col-sm-12 col-form-label text-left fontweight500">From Visit</label>
                                <div className="col-12 m-0 row">
                                    <div className="col-md-6 col-sm-12 p-0 d-flex flex-row pb-3">
                                        <span className=" float-left mt-1 mr-2">Min</span>
                                        <input style={requiredStyle}  type="text" pattern="[0-9]*" name="fromVisit"  value={this.state.fromVisit} onChange={this.textHandleChange}   className="float-left form-control col-lg-4 mr-3" />

                                        <select style={requiredStyle}  className=" form-control float-left col-lg-4" name="fromType"  value={this.state.fromType} onChange={this.selectHanderChanges} >
                                           <option value="">Select</option>
                                            <option>Days</option>
                                            <option>Month</option>
                                        </select>
                                    </div>

                                    <div className="col-md-6 col-sm-12 d-flex flex-row p-0 pb-3">
                                            <span className=" float-left mt-1 mr-2">Max</span>
                                            <input style={requiredStyle}  type="text" pattern="[0-9]*"   name="toVisit"  value={this.state.toVisit} onChange={this.textHandleChange} className="float-left form-control col-lg-4  mr-3" />
                                            <select style={requiredStyle} className=" form-control float-left col-lg-4" name="toType"  value={this.state.toType} onChange={this.selectHanderChanges} >
                                            <option value="">Select</option>
                                                <option>Days</option>
                                                <option>Month</option>
                                            </select>
                                        </div>
                                </div>
                            </div>

                            </form>


                        </div>
            <div className="modal-footer text-left text-white ">
                <div className="row col-12 p-0 justify-content-between">

                    <div className="col-12 pull-right text-right">

                        <button type="button" disabled={this.state.fromType!=this.state.toType} className="btn text-white align-bottom bg-p mr-2" onClick={this.onSaveEncounter}>Save</button>
                        <button type="button" className="btn text-white align-bottom bg-p" onClick={this.onClose}>Cancel</button>
                    </div>
                </div>

            </div>
        </Modal>
      )

  }

}
export default connect(null, { hideModal })(EncounterDetailsModal);
const requiredStyle = {borderLeft:"3px solid #f52433"}
