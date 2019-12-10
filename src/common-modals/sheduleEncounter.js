import React from 'react';
import { connect } from 'react-redux';
import { hideModal } from '../actions/modalActions';
import Modal from '../components/modaldialog/modal';
import DateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import ApiService from '../api';
import Common from '../common/common'
import {NotificationManager} from 'react-notifications';
import moment from 'moment';

var yesterday = DateTime.moment().subtract(1, 'day');
var valid = function( current ){
    return current.isAfter( yesterday );
};

class  ConfirmModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            selectedEpoch:"",
            sheduleDate : '',
            epochData:[],
            epochInfo:"",
            encounterList :[],
            selectedEncounter:"",
            hasCalenderOpened:false,
            operationStatus:0,
            allowed:true,
            reasonForSkipEncouner:"",
            encounterWindow:"",
            minDate:"",
            maxDate:"",
            scheduleTime:"",
            hasTimePickerOpened:false
        }
        this.lastEnDate={}
        this.timeConstraints = {
            minutes: {
              step: 15
            }
          }
    }

   onClose = () => {
    this.props.hideModal();
    if (this.props.afterClose) {
      this.props.afterClose();
    }
  };

  onSaveSheduleEncounter = () =>{

      if (this.state.selectedEpoch && this.state.sheduleDate &&  this.state.sheduleTime && this.state.selectedEncounter && this.state.selectedEncounter!="Select") {
          const scDt = Common.formatDate(this.state.sheduleDate, "DD/MMM/YYYY")+" "+ this.convert12H_To_24H(this.state.sheduleTime)
          // Common.formatDate(this.state.sheduleDate, "YYYY-MM-DD") //DD/MMM/YYYY
          
         
          const obj = {
              "encounter_unique_identefier": this.state.selectedEncounter,
              "is_scheduled_encounter": 0,
              "scheduled_date": scDt ? scDt : new Date(),
              "site_patient_unique_identefier": this.props.patSiteId,
              "studyIdentefier": this.props.info
          }
          
        if(!this.state.allowed && this.state.reasonForSkipEncouner=="" ){
            NotificationManager.warning("Please fill the required fields.");
              return false;
          }

          if(!this.hasSelectedTimePassed()){
            NotificationManager.warning("Selected time has passed."); 
            return false;
          }

          if(this.state.reasonForSkipEncouner && !this.state.allowed){
            obj.reasonForOutOfrange = this.state.reasonForSkipEncouner;
          }

          ApiService.schedulePatientEncounter(obj).then((res) => {
              if(res && res.data && res.data.response){
                this.props.onSave &&  this.props.onSave({encounter_unique_identefier:this.state.selectedEncounter,sheduleDate:scDt});
            }
         },
              (err) => {
                  console.log(err)
              })
        }
      else {
          NotificationManager.warning("Please select required fields.")
      }
  }

  onChangeDate = (e) =>{
    this.setState({hasCalenderOpened:false})
    this.setState({sheduleDate : e,allowed:true});
        if(this.state.minDate && this.state.maxDate){
            let selectedDate = Common.formatDate(e, "YYYY-MM-DD")
            let isInRange =   moment(selectedDate).isBetween(this.state.minDate, this.state.maxDate);
            let isSameStartDate = moment(selectedDate).isSame(this.state.minDate);
            let isSameEndDate = moment(selectedDate).isSame(this.state.maxDate);

            if(isInRange || isSameStartDate || isSameEndDate){
                this.setState({allowed:true})
            }else{
                this.setState({allowed:false})
            }
        }
  }

  //time change handeler
  onChangeTime = (e)=>{
    this.setState({sheduleTime : moment(e).format("hh:mm A")});
  }

  //check time has alrady passedd 
  hasSelectedTimePassed =()=>{
    if(Common.formatDate(this.state.sheduleDate, "YYYY-MM-DD") ===  Common.formatDate(new Date(), "YYYY-MM-DD")){

    let sDt = Common.formatDate(this.state.sheduleDate, "YYYY-MM-DD")+" "+ this.convert12H_To_24H(this.state.sheduleTime) ;
    let curDt = Common.formatDate(new Date(), "YYYY-MM-DD HH:mm") 
    let a = moment(sDt, "YYYY-MM-DD HH:mm");//now
    let b = moment(curDt,"YYYY-MM-DD HH:mm");
        if(a.diff(b, 'minutes')>0){
            return true;
        }
        else{
            return false;
        }
   }
    return true;
  }

  
  componentDidMount(){
if(this.props.info){
    ApiService.getPatientEpochDetails(this.props.info,this.props.patSiteId).then((res)=>{
        this.lastEnDate = res.data.custommessages;
        if(res.data.response ){
            const objKeys = Object.keys(res.data.response) 
            this.setState({epochData:objKeys,epochInfo:res.data.response})
            }
    })
}
      
  }

  convert12H_To_24H = (t)=>{

    var momentObj = moment(t, ["h:mm A"]);
    return momentObj.format("HH:mm");

  }

  getEncounterList =(e)=>{

    try{

        if(e.target.value !== "Select"){
            const prevInfo = this.state.epochInfo;
            let encArr = [];
            for(var l in prevInfo[e.target.value]){
                //E1$$#$$1$$#$$6
                let splDt = l.split("$$#$$")
                let enName =  splDt.length ? splDt[0] : "E";
                let minV  =  splDt.length &&  splDt[1] ? splDt[1] : "--";
                let maxV  =  splDt.length && splDt[2]  ? splDt[2] : "--";
                let typeV  =  splDt.length && splDt[3]  ? splDt[3] : "--";
            encArr.push({name:enName,identity:prevInfo[e.target.value][l] ,min:minV,max:maxV,type:typeV})
            }
            this.setState({encounterList:encArr,selectedEpoch:e.target.value,allowed:true,encounterWindow:""})
        }else{
            this.setState({encounterList:[],allowed:true,encounterWindow:"",sheduleDate:"",sheduleTime:""})
        }
    }
    catch(e){

    }
   
}

//encounter change
encounterChangeHandeler = (e)=>{
    if(e.target.value!="Select"){
        let found =  this.state.encounterList.filter((o)=>{return o.identity===e.target.value})
        if(found.length){
         let window = found[0]["min"]+" - "+found[0]["max"]+ "  "+found[0]["type"];
         // this.setState({encounterWindow:window})
        }
    this.getEncounterDateRange(this.props.info,this.props.patSiteId, e.target.value).then((res)=>{
        let  compareDate =  moment("28/Sep/2018").format("YYYY-MM-DD")  //moment("29/Sep/2018", "DD/MM/YYYY");
        let  startDate   = moment(res.data.response.minimumDate,"DD/MMM/YYYY").format("YYYY-MM-DD")  //moment(res.data.response.minimumDate, "DD/MM/YYYY");
        let  endDate     =  moment(res.data.response.maximumDate,"DD/MMM/YYYY").format("YYYY-MM-DD")  //moment(res.data.response.maximumDate, "DD/MM/YYYY");
      //compareDate.isBetween(startDate, endDate); //false in this case

      //setting on sate for min & max date
       this.setState({minDate:startDate,maxDate:endDate,encounterWindow:res.data.response.masageString})
    })
        
        // encounterWindow
     this.setState({selectedEncounter:e.target.value,allowed:true})
    }
    else{
        this.setState({allowed:true,encounterWindow:"",selectedEncounter:"",sheduleDate:"",sheduleTime:""})
    }
   
}

//get encounter date range
getEncounterDateRange(studyId,patentId,encounterId){

   return  ApiService.checkForScheduleDate(studyId,patentId,encounterId);
}


//reason handeler 
reasonTxtHandeler = (evt)=>{

    this.setState({reasonForSkipEncouner:evt.target.value})

}
  render(){
    let lastEncounter='';
    let lastEncounterDate='';
      for (let variable in this.lastEnDate) { 
        lastEncounter = variable;
        lastEncounterDate = this.lastEnDate[variable];
    }

    return (
        <Modal onClose={this.onClose}>                      
            <div className="modal-header border-bottom-p mx-4 p-0 py-3">
                <h5 className="modal-title c-p" id="exampleModalLabel">Schedule Encounter</h5>
                <button type="button" className="close c-p" onClick={this.onClose}> 
                    <span aria-hidden="true">&times;</span> 
                </button>
            </div>
            <div className="modal-body px-3 pb-0 text-left">
                <div className="row col-md-12 m-0 p-0">
                    <div className="col-md-6 col-sm-6 pull-left">
                        <div className="form-group">
                            <label>Last Encounter Name</label>
                            <input type="text" className="form-control" value={lastEncounter} disabled/>
                        </div>
                        
                    </div>
                    <div className="col-md-6 col-sm-6">
                        <div className="form-group">
                            <label>Last Encounter Date</label>
                            <input type="text" className="form-control" value={lastEncounterDate} disabled/>
                        </div>
                    </div>
                </div>
                <div className="row col-md-12 m-0 p-0">
                    <div className="col-md-6 col-sm-6 pull-left">
                        <div className="form-group pb-0">
                            <label>Epoch</label>
                            <select style={requiredStyle} className="form-control" onChange={this.getEncounterList.bind(this)}>
                                <option>Select</option>
                                {
                                    this.state.epochData && this.state.epochData.map( (epo,idx)=>{
                                        return <option value={epo} title={epo} key={idx}>{epo}</option>
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div className="col-md-6 col-sm-6">
                        <div className="form-group pb-0 mb-0">
                            <label>Encounter</label>
                            <select style={requiredStyle} className="form-control" onChange={this.encounterChangeHandeler.bind(this)}>
                                <option>Select</option>
                                {
                                    this.state.encounterList &&   this.state.encounterList.map( (enc,indx)=>{
                                        return <option value={enc.identity} title={enc.name} key={enc.identity}>{enc.name}</option>
                                    })
                                }
                                
                            </select>
                            
                        </div>
                    </div>
                    
                </div>
   {/* for time picker*/}

   <div className="row col-md-12 m-0 p-0">
        <div className="col-md-6 col-sm-6 pull-left">
            <div className="form-group">
                <label>Schedule Date</label>
                <DateTime dateFormat="DD/MMM/YYYY"
                    timeFormat={false}   
                    onChange={this.onChangeDate}
                    value={this.state.sheduleDate}
                    closeOnSelect={true}
                    open={this.state.hasCalenderOpened}
                    className={`reqfeild ${ !this.state.encounterWindow ?  "disabled-schedule-dt" : '' }`}
                    isValidDate={ valid }
                    inputProps={{ readOnly: true,disabled: !this.state.encounterWindow ?  true : false }}

                />
                <i className="glyphicon glyphicon-calendar dateicon2" onClick={(e)=> this.state.encounterWindow && this.setState({hasCalenderOpened:!this.state.hasCalenderOpened})}></i>
            </div>
        </div>
   <div className="col-md-6 col-sm-6">
                        <div className="form-group">
                            <label>Schedule Time</label>
                            
                            <DateTime 
                                timeConstraints={this.timeConstraints}
                                dateFormat={false}
                                timeFormat={true} 
                                inputProps={{ readOnly: true,disabled: !this.state.encounterWindow ?  true : false }}
                                onChange={this.onChangeTime}
                                value={this.state.sheduleTime}
                                className={`reqfeild ${ !this.state.encounterWindow ?  "disabled-schedule-dt" : '' }`} 
                            />
                            {/* <i className="glyphicon glyphicon-time dateicon2" onClick={(e)=>this.setState({hasTimePickerOpened:!this.state.hasTimePickerOpened})} ></i> */}
                        </div>
                    </div>
   </div>

                {
                    this.state.encounterWindow && <div className="row col-md-12 m-0 p-0">
                    
                    <div className="col-md-12 col-sm-12"> 
                    <div className="c-w rangeInfo p-1 text-center">{this.state.encounterWindow}</div>
                    {/* <div className="text-bold ml-4"> {this.state.encounterWindow}</div> */}
                    
                    </div></div>
                }

                {
                    !this.state.allowed && <div className="row col-md-12 mt-3 ml-0">
                    <label>Reason</label>
                     <textarea style={requiredStyle} value={this.state.reasonForSkipEncouner}  className="form-control" onChange={this.reasonTxtHandeler.bind(this)} ></textarea>
                    </div>
                }
                

            </div>
            <div className="modal-footer border-0 mt-2 pr-4">
                <button type="button" className="btn text-white align-bottom bg-p" onClick={this.onSaveSheduleEncounter}>Add</button>
                <button type="button" className="btn text-white align-bottom bg-p" onClick={this.onClose}>Cancel</button>
            </div>                               
        </Modal>
      )

  }
  
}
export default connect(null, { hideModal })(ConfirmModal);
const requiredStyle = {borderLeft:"3px solid #f52433"}
