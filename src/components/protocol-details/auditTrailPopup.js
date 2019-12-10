/**
* Copyright (c) 2018
* @summary This file is use under  Setup -> Study Setup -> Site Deatils
          Open Popup and show form for add perssonel
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React,{Component} from 'react';
import { connect } from 'react-redux';
import Modal from '../modaldialog/modal';
import common from '../../common/common';
import ApiService from '../../api';
import {NotificationManager} from 'react-notifications';
import ReactTable from "react-table";
import 'react-table/react-table.css';
const columnKeys = {
    'EPOCHNAME':"Epoch Name",
    'ENCOUNTERNAME':"Encounter Name",
    'ENCOUNTERFROMVISIT':"From Visit",
    'ENCOUNTERTOVISIT':"To Visit",
    'ENCOUNTERFROMTYPE':"From Type",
    'ENCOUNTERTOTYPE':"To Type",
    'ENDINGSTATUS':"Ending Status",
    'DROPFROM':"Drop status",
    'ELEMENTNAME':"ItemGroup Name"
}



class AuditTrailModal extends Component{

    constructor(props){
        super(props);
        this.state = {
           comprision:[],
           versionList :[],
           currentVersion:"",
           oldVersion:"",
           currentVersionNo:"",
           oldVersionNo:"",

           levels:["Epoch","Encounter","ItemGroup"],
           selectedLevel:"Epoch",
           comprisionData:[],
           comprisionColumn:[]

        }
    }

    onClose = () => {
        this.props.hideModal && this.props.hideModal();
        if (this.props.afterClose) {
            this.props.afterClose();
        }
    };



    componentDidMount(){
        // ApiService.compareProtocol("22112c50a5e311e8a97fd59ef07aef3c","5af8f24ba5e811e8a97f0b23b40ebae5").then( (res)=>{
        //     const data = res.data && res.data.response ?  JSON.parse(res.data.response) : [];
        //    this.setState({comprision:data})
        // } )
        if(this.props.selectedStudy){
            ApiService.GetProtocolVersionListByStudyId(this.props.selectedStudy).then((res)=>{
                if(res.data && typeof(res.data.response)=="object"){
                    this.setState({versionList:res.data.response},()=>{
                        if(this.state.versionList && this.state.versionList.length && this.state.versionList.length>1  ){
                            this.setState({currentVersion:this.state.versionList[1]["uniqueIdentifier"],
                                oldVersion:this.state.versionList[0]["uniqueIdentifier"],
                                currentVersionNo:this.state.versionList[1]["version"],
                                oldVersionNo:this.state.versionList[0]["version"]
                            },()=>{this.doCompare();})
                        }
                    else if(this.state.versionList && this.state.versionList.length && this.state.versionList.length>0  ){
                            this.setState({currentVersion:this.state.versionList[0]["uniqueIdentifier"],
                                oldVersion:this.state.versionList[0]["uniqueIdentifier"]},()=>{
                                    this.doCompare();
                                })

                        }
                        else{

                        }
                    })
                }

            });
        }
    }


    doCompare(){

        if(this.state.currentVersion!="" && this.state.currentVersion!="select"
            && this.state.oldVersion!="" && this.state.oldVersion!="select" &&  this.state.selectedLevel!=""  ){
                let level = (this.state.selectedLevel).toLowerCase() == "itemgroup" ? "element" : (this.state.selectedLevel).toLowerCase()
ApiService.getAuditTrailDetails(level,this.state.currentVersion,this.state.oldVersion).then((res)=>{
    let tmp = [];
    if(res && res.data && res.data.response){

        res.data.response.added && res.data.response.added.forEach( (dt,di)=>{
            dt.flag = "added";
            if(dt.hasOwnProperty("encounterFromVisit") && dt.hasOwnProperty("encounterFromType") ){
                dt.encounterFromVisit = dt.encounterFromVisit+"-"+dt.encounterFromType;
            }
            if(dt.hasOwnProperty("encounterToVisit") && dt.hasOwnProperty("encounterToType") ){
                dt.encounterToVisit = dt.encounterToVisit+"-"+dt.encounterToType;
            }

            //encounterFromType encounterFromVisit
            tmp.push(dt)
       })
       res.data.response.added && res.data.response.removed.forEach( (dt,di)=>{
        dt.flag = "removed";
        if(dt.hasOwnProperty("encounterFromVisit") && dt.hasOwnProperty("encounterFromType") ){
            dt.encounterFromVisit = dt.encounterFromVisit+"-"+dt.encounterFromType;
        }
        if(dt.hasOwnProperty("encounterToVisit") && dt.hasOwnProperty("encounterToType") ){
            dt.encounterToVisit = dt.encounterToVisit+"-"+dt.encounterToType;
        }
        tmp.push(dt)
     })
     res.data.response.updated && res.data.response.updated.forEach( (dt,di)=>{
        dt.flag = "updated";
        if(dt.hasOwnProperty("encounterFromVisit") && dt.hasOwnProperty("encounterFromType") ){
            dt.encounterFromVisit = dt.encounterFromVisit+"-"+dt.encounterFromType;
        }
        if(dt.hasOwnProperty("encounterToVisit") && dt.hasOwnProperty("encounterToType") ){
            dt.encounterToVisit = dt.encounterToVisit+"-"+dt.encounterToType;
        }
        tmp.push(dt)
     })
     res.data.response.match && res.data.response.match.forEach( (dt,di)=>{
        dt.flag = "match";
        if(dt.hasOwnProperty("encounterFromVisit") && dt.hasOwnProperty("encounterFromType") ){
            dt.encounterFromVisit = dt.encounterFromVisit+"-"+dt.encounterFromType;
        }
        if(dt.hasOwnProperty("encounterToVisit") && dt.hasOwnProperty("encounterToType") ){
            dt.encounterToVisit = dt.encounterToVisit+"-"+dt.encounterToType;
        }
        tmp.push(dt)
     })

     let columnsKeys = [];
     let reactTblCol = [];

     if(res.data.response.added && res.data.response.added.length ){
        columnsKeys = Object.keys(res.data.response.added[0])
     }
     else if(res.data.response.removed && res.data.response.removed.length){
        columnsKeys = Object.keys(res.data.response.removed[0])
     }
     else if(res.data.response.updated && res.data.response.updated.length){
        columnsKeys = Object.keys(res.data.response.updated[0])
     }
     else if(res.data.response.match && res.data.response.match.length){
        columnsKeys = Object.keys(res.data.response.match[0])
     }


     columnsKeys.forEach( (colK,colI)=>{
       if(colK!="flag" && colK!= "encounterToType" &&  colK!= "encounterFromType" && colK!= "epochIdentifier" && colK!= "encounterIdentifier"
        && colK!="elementIdentifier" 
      ){
        let objTemp =   {
            Header: this.getColumnNameValueByKeys(colK.toUpperCase()) ,
            accessor: colK
          }
          reactTblCol.push(objTemp)
       }
     })
         this.setState({comprisionData:tmp,comprisionColumn:reactTblCol})
    }
})
            }
    }

    sourceVersionChangeHandeler =(e,type)=>{
        let  index = e.nativeEvent.target.selectedIndex;
        if(type=="current"){
            this.setState({currentVersion:e.target.value,currentVersionNo:e.nativeEvent.target[index].text},()=>{
                this.doCompare();
            })
        }
        else{
            this.setState({oldVersion:e.target.value,oldVersionNo:e.nativeEvent.target[index].text},()=>{
                this.doCompare();
            })
        }
    }

    levelChangeHandeler = (e)=>{
        this.setState({selectedLevel:e.target.value},()=>{
            this.doCompare();
        })

    }

    // get proper name for table columns
    getColumnNameValueByKeys(colKey){

       // columnKeys
        if(columnKeys.hasOwnProperty(colKey)){
            return columnKeys[colKey]
        }
      return colKey;
    }


    getRowColor =(rowInfo) =>{

        if(rowInfo && rowInfo.original.flag && rowInfo.original.flag=="added"){
            return "#d4edda";
        }
        else if( rowInfo && rowInfo.original.flag && rowInfo.original.flag=="removed"){
            return "#f8d7da";
        }
        else if(rowInfo && rowInfo.original.flag && rowInfo.original.flag=="updated"){
            return "#cce5ff";
        }
        else {
            return "";
        }
    }

    getCompareString(){
         if(this.state.currentVersionNo && this.state.oldVersionNo){
            let no1 = parseInt((this.state.currentVersionNo).split("V")[1]) ;
            let no2 = parseInt((this.state.oldVersionNo).split("V")[1]) ;
             return no1>=no2 ? `Comparing ${this.state.oldVersionNo} with ${this.state.currentVersionNo}` : `Comparing ${this.state.currentVersionNo} with ${this.state.oldVersionNo}`;
         }
         return "";
    }


    render({props,state} = this){
        let { afterClose, hideModal, onSave } = props;
        return (
            <Modal onClose={this.onClose} className={props.className}>
                <div className="modal-header border-bottom-p mx-4 p-0 py-3">
                    <h5 className="modal-title c-p" id="exampleModalLabel">Audit Trail</h5>
                    <button type="button" className="close c-p" data-dismiss="modal" aria-label="Close" onClick={this.onClose}>
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body px-4 text-left pt-1">

                <div className="header bg-light-grey   p-2 text-center d-flex ">

                <div className="float-left">
<span className="pt-1">Level</span>
<select value={this.state.selectedLevel} className="ml-2 p-1 " onChange={(e)=> this.levelChangeHandeler(e)}  >
{
this.state.levels && this.state.levels.map( (vl,vi)=>{
return <option key={vi} value={vl} >{vl}</option>
})
}
    </select>
</div>
                <div className="pull-right" style={ {marginLeft:"372px"}}>
                    <span className="pt-1">Source</span>
                    <select className="ml-2 p-1 "
                    value={this.state.currentVersion}
                    onChange={(e)=>{this.sourceVersionChangeHandeler(e,"current")}}>

                        <option>Select</option>
                        {
                            this.state.versionList && this.state.versionList.map( (vl,vi)=>{
                                return <option value={vl.uniqueIdentifier} key={vi}>{vl.version}</option>
                            })
                        }
                    </select>
                </div>
                <div className="pull-right" style={ {marginLeft:"80px"}}>

                    <span className="pt-1">Target</span>
                    <select className="ml-2 p-1 "
                     value={this.state.oldVersion}
                    onChange={(e)=>{this.sourceVersionChangeHandeler(e,"old")}}>
                    <option>Select</option>
                    {
                    this.state.versionList && this.state.versionList.map( (vl,vi)=>{
                    return <option key={vi} value={vl.uniqueIdentifier} >{vl.version}</option>
                    })
                    }
                                                    </select>
                </div>
                                                </div>

                                                <div className="col-12 py-2 p-0">
                                                <div className="row">
                                                <div className="col-8 c-p">
                                                {/* <h5>
                                                    {this.getCompareString()} </h5> */}
                                                    </div>
                                                <div className="col p-0">
                                                <div  className="float-left mt-1" style={{width:"14px",height:"14px",background:"#70b680"}}></div><span className="ml-1" style={{color:"#70b680"}}>Added</span>
                                                </div>
                                                <div className="col p-0">
                                                <div  className="float-left mt-1" style={{width:"14px",height:"14px",background:"#df8890"}}></div><span className="ml-1" style={{color:"#df8890"}}>Removed</span>
                                                </div>
                                                <div className="col p-0">
                                                <div  className="float-left mt-1" style={{width:"14px",height:"14px",background:"#2b73bf"}}></div><span className="ml-1" style={{color:"#2b73bf"}}>Updated</span>
                                                </div>

                                                </div>

                                                </div>

                                                <div className="col-12 p-0" style={  {maxHeight:"500px" , "overflow":"auto" , minHeight : "32px"} }>

                                                    {/* <table className="table jtable-bordered">
                                                        <thead>
                                                            <tr>
                                                            <th>
                                                                #
                                                            </th>

                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {

                                                             this.state.comprision && this.state.comprision.added && this.state.comprision.added.map((rd,idx)=>{
                                                                return <tr key={idx} style={{background:"#e2f7e2"}}>
                                                                               <td> {rd.epochName ? rd.epochName  : 'N/A' }</td>
                                                                              </tr>
                                                            })
                                                         }
                                                            {
                                                                this.state.comprision && this.state.comprision.removed && this.state.comprision.removed.map((rd,idx)=>{
                                                                    return <tr key={idx} style={{background:"#ffd9d9"}}>
                                                                                   <td> {rd.epochName ? rd.epochName  : 'N/A' }</td>
                                                                                 </tr>
                                                                })
                                                            }
                                                        </tbody>
                                                    </table> */}
                                                        <ReactTable
                                                            data={this.state.comprisionData}
                                                            columns={this.state.comprisionColumn}
                                                            minRows={1}
                                                            multiSort ={true}
                                                            showPagination={true}
                                                            nextText='>>'
                                                            previousText='<<'
                                                            noDataText='No Record Found'
                                                            defaultPageSize={10}
                                                            getTrProps={(state, rowInfo, column) => {
                                                                return {
                                                                  style: {
                                                                    background: this.getRowColor(rowInfo)
                                                                  }
                                                                };
                                                              }}
                                                        />
                                                </div>

                </div>
            </Modal>
        );
    }

}

export default connect(null, null )(AuditTrailModal);