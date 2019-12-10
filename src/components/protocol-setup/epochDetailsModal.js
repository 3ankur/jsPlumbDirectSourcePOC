/**
 * Copyright (c) 2018
 * @summary Epoch details modal popup
 * @author Ankur Vishwakarma,Poonam Banode,Mangesh Pimprikar,Irfan Bagwan
 */
import React from 'react';
import { connect } from 'react-redux';
import { hideModal } from '../../actions/modalActions';
import Modal from '../modaldialog/modal';
import { NotificationManager } from 'react-notifications';
import Common from '../../common/common';
import ReactSuperSelect from 'react-super-select';
import '../../../node_modules/react-super-select/lib/react-super-select.css';

class  EpochDetailsModal extends React.Component {


    constructor(props){
        super(props);

        this.state = {
            name:"",
            description:"",
            during_status:"",
            ending_status:"",
            drop_from:"",
            initialEndingStatus:null,
            initialDropStatus:null
        }

    this.textHandleChange = this.textHandleChange.bind(this);
    this.selectHanderChanges = this.selectHanderChanges.bind(this);
    }

   onClose = () => {
    this.props.hideModal();
    if (this.props.afterClose) {
      this.props.afterClose();
    }
  };

  onSaveEpoch = () =>{
      
    Common.clearNotification();
      if(this.state.name!="" && this.state.ending_status!="" && this.state.drop_from!=""){
        this.props.onSave && this.props.onSave(this.state);
    this.onClose();
      }
      else{
      NotificationManager.error("Please fill required fields");
      }
    
  }

//   const onEpochNameChange = (e)=>{
//     epocData(e);
//   }

textHandleChange (evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  selectHanderChanges(evt,type){
      if(evt){

        if(type === "DROP_STATUS"){
            this.setState({drop_from:evt.id});
        }else{
            this.setState({ending_status:evt.id});
        }

      }
    

    // this.setState({ [evt.target.name]: evt.target.value });
    

  }

  
customOptionTemplateFunction = (item, search, searchRegex) => {
  return <span key={item.uniqueIdentifier+"-"+Common.getRandomNumber()} title={item.name}>{item.name}</span>
}

customSelectedValueTemplateFunction = (selectedItmes) =>{
    return(
        <div className='selected-dropdown-itmes'>
            { selectedItmes.map((item,index)=>{
                return(
                    <span key={item.uniqueIdentifier+"-"+index}>
                        {item.name}
                        { selectedItmes.length > 1 ? ',' : ''}
                    </span>
                )
                })
            }
        </div>
    )
}


componentDidMount(){
   
    if(this.props.selectedEpochData && this.props.selectedEpochData.length){

        let  prevSt = this.state;
        Object.assign(prevSt,this.props.selectedEpochData[0]);
        this.setState(prevSt)
        if(this.props.selectedEpochData[0]["drop_from"]){
            let dropStFound =  this.props.epochStatusList.drop_from_status.filter((df)=>{return df.id === this.props.selectedEpochData[0]["drop_from"]})
            let dropStatus =  dropStFound.length ? dropStFound[0] : null
            this.setState({initialDropStatus:dropStatus})
        }
        if( this.props.selectedEpochData[0]["ending_status"]){
          let endStFound =  this.props.epochStatusList.ending_status.filter((es)=>{return es.id === this.props.selectedEpochData[0]["ending_status"]})
          let endStatus =  endStFound.length ? endStFound[0] : null
           this.setState({initialEndingStatus:endStatus}) 
          //  initialEndingStatus:null,
          //  initialDropStatus:null
        }
        
       
    }

    //this.props.epochStatusList.ending_status 

}


  render(){

    return (
        <Modal onClose={this.onClose}>
            <div className="modal-header border-bottom-p mx-4 p-0 py-3">
                <h5 className="modal-title c-p" id="exampleModalLabel">Epoch Details</h5>
                <button type="button" className="close c-p" data-dismiss="modal" aria-label="Close" onClick={this.onClose}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body px-3 text-left">
                    
                            <form className=" form-row">
                                <div className="form-group col-md-12 col-sm-12">
                                    <label  className="col-sm-12 col-form-label text-left fontweight500">Epoch Name</label>
                                    <div className="col-sm-12">
                                       <input type="text" name="name" value={this.state.name}  onChange={this.textHandleChange} className="form-control" />
                                    </div>
                                </div>
                                {/* <div className="form-group col-md-8 col-sm-12">
                                    <label  className="col-sm-12 col-form-label text-left">Description</label>
                                    <div className="col-sm-12">
                                       <input type="text" name="description"  value={this.state.description} onChange={this.textHandleChange} className="form-control" />
                                    </div>
                                </div> */}
                            
                            </form>
                            
                            <form className=" form-row">
                                {/* <div className="form-group col-md-4 col-sm-12">
                                    <label  className="col-sm-12 col-form-label text-left">During Status</label>
                                    <div className="col-sm-12">
                                        <select className="form-control" value={this.state.during_status}   name="during_status" onChange={this.selectHanderChanges}>
                                            <option>Pre Screen</option>
    <option>Screened</option>
    <option>Randomized</option>
    <option>Completed</option>
                                        </select>
                                    </div>
                                </div> */}
                                <div className="form-group col-md-4 col-sm-12 custred ">
                                    <label  className="col-sm-12 col-form-label text-left fontweight500">Ending Status</label>
                                    <div className="col-sm-12">
                                        {/* <select style={validStyle} value={this.state.ending_status}  className="form-control" name="ending_status" onChange={this.selectHanderChanges}>
                                        <option  value="">Select</option>
                                            

                                            {
                                                this.props.epochStatusList && this.props.epochStatusList.ending_status.map((st,idx)=>{
                                                    return  <option key={st.uniqueIdentifier+'_'+idx}>{st.name}</option>
                                            })
                                            }
                                        </select> */}

                                         <ReactSuperSelect
                                        placeholder="Select"
                                        clearSearchOnSelection={true}
                                        dataSource={this.props.epochStatusList.ending_status || []}
                                        closeOnSelectedOptionClick={false}
                                        clearable={false}
                                        onChange={(o)=> this.selectHanderChanges(o,"ENDING_STATUS")}
                                        searchable={true}
                                        deselectOnSelectedOptionClick={false}
                                        multiple={false}
                                        keepOpenOnSelection={false}
                                        closeOnSelectedOptionClick={false}
                                        customOptionTemplateFunction={this.customOptionTemplateFunction}
                                        customClass='select-container'
                                        customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                        initialValue={this.state.initialEndingStatus}
                                    />
                                    </div>
                                </div>
                                <div className="form-group col-md-4 col-sm-12 custred">
                                    <label  className="col-sm-12 col-form-label text-left fontweight500">Drop Status</label>
                                    <div className="col-sm-12">
                                        {/* <select style={validStyle}  value={this.state.drop_from}  className="form-control" name="drop_from" onChange={this.selectHanderChanges}>
                                            <option value="">Select</option>
                                            
                                            {
                                                this.props.epochStatusList && this.props.epochStatusList.drop_from_status.map((st,idx)=>{
                                                    return  <option key={st.uniqueIdentifier+'_'+idx}>{st.name}</option>
                                            })
                                            }
                                        </select> */}


                                        <ReactSuperSelect
                                        placeholder="Select"
                                        clearSearchOnSelection={true}
                                        dataSource={this.props.epochStatusList.drop_from_status || []}
                                        closeOnSelectedOptionClick={false}
                                        clearable={false}
                                        onChange={(o)=> this.selectHanderChanges(o,"DROP_STATUS")}
                                        searchable={true}
                                        multiple={false}
                                        deselectOnSelectedOptionClick={false}
                                        keepOpenOnSelection={false}
                                        closeOnSelectedOptionClick={false}
                                        customOptionTemplateFunction={this.customOptionTemplateFunction}
                                        customClass='select-container'
                                        customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                        initialValue={this.state.initialDropStatus}
                                    />
                                    </div>
                                </div>
                            
                            </form>
    {
        /*
        <div className="col-12 row m-0 " > 
                                <label className="">Encounter  Details</label>
                                <div className="col-12 p-0">
                                    <table className="table activity-table border  table-bordered ">
                                        <thead>
                                            <tr><th>Name</th>
                                            <th>Description</th>
                                        </tr></thead>
                                        <tbody>
                                            <tr>
                                                <td>E0</td>
                                                <td>--</td>
                                            </tr>
                                            <tr>
                                                <td>E1</td>
                                                <td>--</td>
                                            </tr>
                                            <tr>
                                                <td>E2</td>
                                                <td>--</td>
                                            </tr>
                                            <tr>
                                                <td>E3</td>
                                                <td>--</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
        */
    }
                            
                        </div>
            <div className="modal-footer text-left text-white ">
                <div className="row col-12 p-0 justify-content-between">
                    <div className="col-12 pull-right text-right">
                        <button type="button" className="btn text-white align-bottom bg-p mr-2" onClick={this.onSaveEpoch}>Save</button>
                        <button type="button" className="btn text-white align-bottom bg-p" onClick={this.onClose}>Cancel</button>                                                
                    </div>
                </div>
            </div>
        </Modal>
      )
  }
}
export default connect(null, { hideModal })(EpochDetailsModal);
const validStyle = {borderLeft: "3px solid rgb(245, 36, 51)"}