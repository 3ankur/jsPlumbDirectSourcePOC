/**
 * Copyright (c) 2018
 * @summary Protocol encounter setup for assign elements to encounters
 * @author Ankur Vishwakarma,Poonam Banode,Mangesh Pimprikar,Irfan Bagwan
 */

import React,{Component}  from 'react';
import EpochEncounterTable from './epochEncounterTable';
import './protocol-encounter.css';
import _ from 'lodash';
import * as modalAction from '../../actions/modalActions';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux' ;
import { MODAL_TYPE_CONFIRM_POPUP,MODAL_TYPE_NOTIFY} from '../../constants/modalTypes';
import ApiService from '../../api';
import { NotificationManager } from 'react-notifications';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';
import { NavLink } from 'react-router-dom';
import Common from '../../common/common';

class EncounterSetup extends Component{


constructor(props){
    super(props);
    this.state = {
        epochData:[],
        elements:[],
        definedElementList:[],
        selectedElement:null,
        protocolVersion:"",
        versionId:"",
        fullResponse:"",
        fullEpochData:"",
        epochElementList:[],
        formattedEpochOrder:[]
    }
    this.elementTitle="Hove the element";
    this.oldEpochData  = []
    this.currentDragIndex = null;
    this.currentDropIndex = null;

}

componentDidMount(){

    localStorage.setItem("fromMenu",false)

    try{
ApiService.getProtocolSetupByVersionAndStatus(this.props.match.params.studyId,this.props.match.params.protocolIdentity,'Draft').then( (res)=>{
    if(res.data.responsecode===200 && res.data.status==="success" && res.data.response && typeof(res.data.response)==="object"){
        this.oldEpochData =  res.data.response.epochData ?  res.data.response.epochData : [] //JSON.stringify(res.data.jsonData);
         const epochInfo =   res.data.response.epochData ?  JSON.parse(res.data.response.epochData) : []
        this.setState({
            epochData: epochInfo, protocolVersion: this.props.match.params.versionId,
            versionId: res.data.response.versionId,
            fullResponse: res.data.response,
            fullEpochData:res.data.response.epochData
        },()=>{
            this.checkEpochSequence();
           // console.log("temm me Epoch info",epochInfo)
        });
        
         let vid = this.props.match.params && (this.props.match.params.versionId).trim()
         ApiService.getAllItemGroups(this.props.match.params.studyId).then((resEle) => {
            if(resEle.data.responsecode===200 && resEle.data.status==="success" && resEle.data.response && typeof(resEle.data.response)==="object"){
               // this.setState({elements:resEle.data.response});
                let actualResEle = resEle.data.response;
                let prevEpochEle = this.state.epochElementList;
                let existingElement=[];
                let addedElements = [];
                epochInfo.forEach((epElx)=>{
                    if (epElx.encounters && epElx.encounters.length) {
                        epElx.encounters.forEach((encInfo, encIdx) => {
                            if (encInfo.elements && encInfo.elements.length) {
                                encInfo.elements.forEach((encElementItr)=>{
                                    console.log(prevEpochEle,encElementItr)
                                let eleFoundIdx = _.findIndex(prevEpochEle,(f)=>{return f.elementUniqueIdentifier == encElementItr.elementUniqueIdentifier });
                                eleFoundIdx==-1 ? prevEpochEle.push(encElementItr) : ""
                                })
                            }
                        });
                    }
                });

                //update the original response
                actualResEle && actualResEle.forEach((originalEle,originalEleIdx)=>{
                  let tmpFoundEleIdx  =  _.findIndex(prevEpochEle,(p)=>{return p.elementUniqueIdentifier === originalEle.uniqueIdentifier && p.hasOwnProperty("itemGroupSequence") })
                    if(tmpFoundEleIdx>-1){
                        originalEle["itemGroupSequence"]  = prevEpochEle[tmpFoundEleIdx]["itemGroupSequence"] ;
                        existingElement.push(originalEle);
                    }
                    else{
                        addedElements.push(originalEle)
                    }
                });

               // actualResEle  = _.orderBy(actualResEle,'itemGroupSequence','asc');
                existingElement = _.orderBy(existingElement, 'itemGroupSequence', 'asc');
                addedElements = _.orderBy(addedElements, 'elementName', 'asc');
                let allElemetnsList = existingElement.concat(addedElements);
                this.setState({ elements: allElemetnsList });
            }
         },(error) => {
             Common.clearNotification();
             NotificationManager.error('Something went wrong');
         });
    }
        },(error)=>{
            Common.clearNotification();
            NotificationManager.error("Something went wrong")

        });
   }
    catch(e){
    }
}

componentWillUnmount(){

}

//for manipulating the sequence
checkEpochSequence =()=>{
    let fullEpDt  =  JSON.parse(this.state.fullEpochData)
    //find the epoch, those starting from start window
    var startWindEpocs = [];
  fullEpDt.forEach((ep)=>{
    let foundStEp =   ep.parent.filter((p)=>{return p == "startWindow" });
       if(foundStEp.length){
        startWindEpocs.push(ep);
       }
  })
startWindEpocs.forEach((st)=>{
    let idx = _.findIndex(fullEpDt,(r)=>{return r.nodeKey === st.nodeKey});
    if(idx>-1){
     //       console.log("inside  for update...",st)
            this.getChildEpochs(st.nodeKey)
    }
})
//console.log("Returing back to calling function rec..!!!");
   if(this.state.formattedEpochOrder.length === fullEpDt.length){
    this.setState({epochData:this.state.formattedEpochOrder})
   }else{
    this.setState({epochData:fullEpDt})
   }
  }
    //get child elements
    getChildEpochs = (epKey) => {
        //        console.log("Ep KEys===>",epKey)
        if (epKey.nodeKey === "endWindow") {
            return false;
        }
        else {
            let updatedEpochList = this.state.formattedEpochOrder;
            let allEpcData = JSON.parse(this.state.fullEpochData);
            let filterEp = allEpcData.filter((f) => { return f.nodeKey === epKey });
            //console.log(filterEp)
            if (filterEp.length && filterEp[0]["child"].length) {
                //formattedEpochOrder
                let foundIfExists = updatedEpochList.filter((ef) => { return ef.nodeKey === filterEp[0]["nodeKey"] });
                if (!foundIfExists.length) {
                    updatedEpochList.push(filterEp[0]);
                    this.setState({ formattedEpochOrder: updatedEpochList }, () => {
                        //          console.log("Updated Sequence",this.state.formattedEpochOrder);
                    })
                }

                filterEp[0]["child"].forEach((chKey) => {
                    this.getChildEpochs(chKey);
                })
            }
        }
    }

    checkForElementClass(epochElement, eleName) {
        const filterEle = epochElement.filter((f) => { return f.elementName === eleName.elementName });
        return filterEle.length ? 'bg-success align-middle text-center' : '';
    }

    updateEpochEncounterDetails(epochId, encounterId, element, itemGrpIdx) {
        let prevSt = this.state.epochData;
        // if(epochId && encounterId && element){ }
        const filterEle = prevSt[epochId]["encounters"][encounterId]["elements"].filter((d) => { return d.elementName === element.elementName });
        if (filterEle.length) {
            const eleIdx = _.findIndex(prevSt[epochId]["encounters"][encounterId]["elements"], (o) => { return o.elementName === element.elementName })
            if (eleIdx > -1) {
                prevSt[epochId]["encounters"][encounterId]["elements"].splice(eleIdx, 1);
            }
        }
        else {
            prevSt[epochId]["encounters"][encounterId]["elements"].push({ domainName: element.domainName, elementName: element.elementName, elementUniqueIdentifier: element.uniqueIdentifier, elementIcon: element.elementIcon, itemGroupSequence: itemGrpIdx });
        }

        this.setState({ epochData: prevSt });
    }


    deleteEpochElementData(eleData) {
        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_CONFIRM_POPUP, {
            onOkay: () => {
                const prevDt = this.state.epochData;
                const prevEleSt = this.state.elements;
                const eleIdx = _.findIndex(prevEleSt, (n) => { return n.name === eleData.name })
                if (eleIdx > -1) {
                    prevEleSt.splice(eleIdx, 1)
                    this.setState({ elements: prevEleSt });
                    const prevElements = this.state.definedElementList;
                    prevElements.push(eleData);
                    this.setState({ definedElementList: prevElements, selectedElement: "Select Element" });
                }
                prevDt.forEach((edata, idx) => {
                    edata["encounters"].forEach((v, ix) => {
                        const foundIdx = _.findIndex(v["elements"], (o) => { return o.name === eleData.name });
                        if (foundIdx > -1) {
                            v["elements"].splice(foundIdx, 1);
                        }
                    });
                });
                this.setState({ epochData: prevDt });
            }
        });
    }

    //build the url params
    buildUrlParams(el) {
        if (this.props.match.params) {
            let who_did_it_cdash = el.whoCdashMap ? el.whoCdashMap : null;
            let when_was_this_done_cdash = el.whenCdashMap ? el.whenCdashMap : null;
            let element_identifier = el.uniqueIdentifier ? el.uniqueIdentifier : null;
            return `/protocol-details/protocol-setup-new/protocol-encounter-setup/protocol-element-setup/${this.props.match.params.study}/${this.props.match.params.versionId}/${this.props.match.params.studyId}/${this.props.match.params.protocolVersion}/${this.props.match.params.protocolName}/${this.props.match.params.protocolIdentity}/${el.domainName}/${el.elementName}/${el.elementIcon}/${who_did_it_cdash}/${when_was_this_done_cdash}/${element_identifier}`
        }
        return "";
    }

    rednerElementListItemForEpoch(ele,itemGrpIdx) {
        const elementEncounterList = [];
        let toolTipTxt = "";
        let itemGropTooltip = "";
        itemGropTooltip = ele.elementName;
        if (ele.domainName === "Custom Domain") {
            toolTipTxt = "CD-Custom Domain";
        }
        else {
            if (ele.domainName === "Elligo Reminder") {
                toolTipTxt = "ER-Elligo Reminder";
            } else {
                toolTipTxt = ele.domainName + (ele.description ? "-" + ele.description : "");
            }
        }

        let tmpSt = {};
        if (this.refs.enTable) {
            let tableRef = this.refs.enTable;
            let tbodyScrollPos = tableRef.children[1].scrollLeft;
            tmpSt = tbodyScrollPos > 0 ? { "left": tbodyScrollPos + "px" } : {}
        }

        elementEncounterList.push(<td title="" onMouseOver={(e)=>{this.elementNameMouseOver(e)}} key={Math.floor((Math.random() * 10000) + 1)} className='align-middle text-right position-relative enc_tbl_padding move_element' style={tmpSt}>

            <Tooltip
                placement="top"
                mouseEnterDelay={0}
                mouseLeaveDelay={0.1}
                destroyTooltipOnHide={false}
                trigger={Object.keys({ hover: 1 })}
                onVisibleChange={this.onVisibleChange}
                overlay={<div className="tooltipOver">ItemGroup Domain: {toolTipTxt ? toolTipTxt : 'Domain'}<div>ItemGroup Name: {itemGropTooltip}</div></div>}
                align={{
                    offset: [0, -3],
                }}
            >
                <label className="encounter_elements"><NavLink to={this.buildUrlParams(ele)}> {ele.elementName}</NavLink></label>
            </Tooltip>


        </td>);

        this.state.epochData.forEach((epochInf, epid) => {
            epochInf.encounters.forEach((ec, idx) => {
                const uniqueKey = epochInf.nodeKey + "-" + epochInf.name + "-" + epid + "-" + idx;
                elementEncounterList.push(<td className={this.checkForElementClass(ec["elements"], ele)} key={uniqueKey} onClick={this.updateEpochEncounterDetails.bind(this, epid, idx, ele,itemGrpIdx)}><i className={this.checkForElementClass(ec["elements"], ele) ? 'glyphicon glyphicon-ok white-text' : ''} ></i></td>)
            });

        });
        return elementEncounterList;
    }

hasElementOnEachEncounter(){
    let validationArry = [];
    if(this.state.epochData.length >0){

        this.state.epochData.forEach((epc,epIdx)=>{
            const hasEncounter      = epc.encounters.length ? true : false;
           const hasEpochConnected = epc.parent.length && epc.child.length ? true : false;
           if( hasEncounter && hasEpochConnected){
               validationArry.push(true);
           }
           else{
               validationArry.push(false);
             }

             if( epc.encounters.length){
                epc.encounters.forEach( (elx,inx)=>{
                   elx.elements.length ?  validationArry.push(true) : validationArry.push(false) ;
                })

            }
        })

        if(validationArry.indexOf(false)>-1){
            return false
        }
        return true;

    }else{
        return false;
    }
}

// function for the saving the prefrence
saveProtocolEncounterSetup(){
    try {
        if (this.hasElementOnEachEncounter() && this.state.epochData.length > 0 && this.state.elements) {
            let prevEpochs = this.state.epochData;
            this.state.elements.forEach((eIterator, eIteratorIdx) => {
                prevEpochs.forEach((epochInfo, epochId) => {
                    if (epochInfo.encounters && epochInfo.encounters.length) {
                        epochInfo.encounters.forEach((encInfo, encIdx) => {
                            if (encInfo.elements && encInfo.elements.length) {
                                let foundIdx = _.findIndex(encInfo.elements, (f) => { return !f.hasOwnProperty("itemGroupSequence") });
                                if (foundIdx > -1) {
                                    encInfo.elements[foundIdx]["itemGroupSequence"] = eIteratorIdx;
                                }
                            }
                        });
                    }
                });
            });

           // console.log("swdsajidasnd==>",prevEpochs)
            this.setState({ epochData: prevEpochs }, () => {
                let data = {}
                data.protocolId = this.props.match.params.versionId;
                data.studyIdentifier = this.props.match.params.studyId;
                data.uniqueIdentifier = this.props.match.params.protocolIdentity;
                data.sourceIdentifier = null
                data.language = "EN";
                data.version = this.props.match.params.protocolVersion;
                data.name = this.props.match.params.protocolName;
                data.status = "Draft"
                data.epochData = JSON.stringify(this.state.epochData);
                data.lastModifiedOn = new Date()
                data.lastModifiedBy = "Admin";
                data.epoch = this.state.epochData;
                data.versionId = this.state.versionId;
                this.oldEpochData = JSON.stringify(this.state.epochData);
                ApiService.saveProtocolSetupJSON(this.props.match.params.studyId, this.props.match.params.protocolIdentity, data).then((res) => {
                    if (res.data.responsecode == "200" && res.data.status === "success") {
                        Common.clearNotification();
                        NotificationManager.success("Setup saved successfully");
                    }
                }, (err) => {
                });
            });
        } else {
            NotificationManager.warning("Every encounter should contain at least one element.")
        }
    }
    catch (e) {
    }
}

elementChangeHandler(e){
this.setState({selectedElement:e.target.value});
}

addElementForSetup(){

if(this.state.selectedElement && this.state.selectedElement==="Custom Element"){
     Common.clearNotification();
   NotificationManager.warning("Redirecting to element setup page for creating new element")
}
    else if(this.state.selectedElement && this.state.selectedElement!=="Select Element"){

    const prevDefEle = this.state.definedElementList;
    const prevEle   = this.state.elements;
    const idx = _.findIndex(prevDefEle,(o)=>{return o.name===this.state.selectedElement});
    if(idx>-1){

        //prevDefEle
        prevEle.push({id:null,name:this.state.selectedElement});
        prevDefEle.splice(idx,1);
        this.setState({elements:prevEle,definedElementList:prevDefEle,selectedElement:"Select Element"});
    }
    }
    else{
        Common.clearNotification();
        NotificationManager.warning("Select an ItemGroup")
    }
}

//rendering the header data Epoch & encounter
renderEpochHeaderDataSet(){

    const epochList= [];
    let tmpSt ={}
        if(this.refs.enTable){
            let tableRef =  this.refs.enTable;
            let tbodyScrollPos =  tableRef.children[1].scrollLeft;
             tmpSt = tbodyScrollPos>0 ? {"left": tbodyScrollPos+"px" } : {}
        }
    epochList.push(<th width="200" key={Math.random()} rowSpan="2" className="align-middle text-right table-bordered" style={tmpSt}>ItemGroup</th>)
    ///style={ {height:"36px",width:"50px"} }
              this.state.epochData && this.state.epochData.map( (epochData,idx)=>{
                epochList.push(<th style={ {background:"#f7f7f7"}} key={idx} colSpan={epochData.encounters.length} title={epochData.name}>{ epochData.name ? Common.getSubString(epochData.name,6) : 'Epoch'+idx}</th>)

            })
            return epochList;
}

//render list item
renderListItem(){
    const encounterList = [];
    this.state.epochData && this.state.epochData.forEach( (epd,epid)=>{
        epd.encounters.forEach( (ec,idx)=>{
            //style={ {height:"36px",width:"50px"} }
            encounterList.push(<th  style={ {textAlign: "center"} } key={epid+''+idx}>
            <Tooltip
          placement="top"
          mouseEnterDelay={0}
          mouseLeaveDelay={0.1}
          destroyTooltipOnHide={false}
          trigger={Object.keys({hover: 1})}
          onVisibleChange={this.onVisibleChange}
          overlay={<div >{ec.encounterName ? ec.encounterName : 'Encounter '+(encounterList.length+1) }</div>}
          align={{
            offset: [0, -3],
          }}
        >
            <span className="bg-light-grey rounded px-2 py-1">{   ec.displayName ? ec.displayName :  'E'+idx}</span>
            </Tooltip>
            </th>)
        });
    })
    return encounterList;
}

//render encounter  header
renderEncounterHeader(){
    return(<tr className="text-black">
    {
        this.renderListItem()
    }
    </tr>)
}

myFunction(e){
     let tableRef =  this.refs.enTable;
     let tbodyScrollPos =  tableRef.children[1].scrollLeft;
     tableRef.children[0].style.left  = -tbodyScrollPos+"px";
     tableRef.children[0].children[0].children[0].style.left =  tbodyScrollPos+"px";
     tableRef.children[0].children[0].children[0].style.left =  tbodyScrollPos+"px";
      for(let i=0;i<tableRef.children[1].children.length;i++){
       tableRef.children[1].children[i].children[0].style.left  = tbodyScrollPos+"px";
      }
     }

     //for cancel the setup
     cancelProtocolEncounterSetup(){
        const oldData = this.oldEpochData && JSON.parse(this.oldEpochData);
        let validationArr = []
        this.state.epochData &&   this.state.epochData.forEach((edt,idx)=>{
            edt.encounters  && edt.encounters.forEach((en,inx)=>{
              let currLength =   en.elements &&  en.elements.length
              let oldLength  =  oldData&&  oldData[idx]["encounters"][inx]["elements"] && oldData[idx]["encounters"][inx]["elements"].length ;
              if(currLength!=oldLength){
                validationArr.push(false);
              }
              else{
                validationArr.push(true);
              }
            })
        })

        if(validationArr.indexOf(false)>-1){
            this.checkForRedirect();
        }
        else{

            Common.clearNotification();
            NotificationManager.info("Redirecting to Protocol Setup page.", '',400)
            setTimeout(()=>{

                this.props.history.goBack();
            },400)
        }
     }

     //for redirecting page
     checkForRedirect(){
        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_NOTIFY,{
            onOkay : () => {
           this.props.history.goBack();
        }
        });
     }

     //onTrDragStart
     onTrDragStart = (e,dgIdx)=>{
        e.dataTransfer.setData("text", "dragRow");
        if(dgIdx!=null){
            e.dataTransfer.effectAllowed = "move";
            this.currentDragIndex = dgIdx
        }
     }

     //onTrDragOver
     onTrDragOver =(event)=>{
        if(event.nativeEvent &&  event.nativeEvent.dataTransfer.effectAllowed === 'move'){

        }
        event.preventDefault()
     }

     onTrDrop = (e,l,_dindex)=>{
         try{
           console.log("onTrDrop",e,l,_dindex)
            if(_dindex!=null && this.currentDragIndex !=null && _dindex!=this.currentDragIndex){
                const prevElemSt = this.state.elements;
                let prevEpochInfo = this.state.epochData;
                this.currentDropIndex = _dindex;
                const refEl = this.state.elements[this.currentDragIndex];
                 prevElemSt.splice(this.currentDragIndex,1)
                 prevElemSt.splice(_dindex,0,refEl) 
                prevElemSt.forEach((eIterator,eIteratorIdx)=>{
                    prevEpochInfo.forEach((epochInfo,epochId)=>{
                        if(epochInfo.encounters &&  epochInfo.encounters.length){
                            epochInfo.encounters.forEach((encInfo,encIdx)=>{
                                if(encInfo.elements && encInfo.elements.length){
                                    let foundIdx = _.findIndex(encInfo.elements,(f)=>{return f.elementName === eIterator.elementName })
                                    if(foundIdx>-1){
                                        encInfo.elements[foundIdx]["itemGroupSequence"]  = eIteratorIdx;
                                    }
                                }
                            });

                            }
                        });
                });

                //updating changes on state.
                this.setState({elements:prevElemSt,epochData:prevEpochInfo},()=>{
                    this.currentDragIndex = null;
                    this.currentDropIndex = null;
                })
            }
            this.refs.enTable.children[1]["children"][_dindex].classList.remove('over')
            e.preventDefault();

         }catch(e){

         }

     }

     //dragenter
     onTrDragEnter =(e,tIdx)=>{
        this.refs.enTable.children[1]["children"][tIdx].classList.add('over')
     }

     //onTrDragLeave
     onTrDragLeave = (e,idx)=>{
        this.refs.enTable.children[1]["children"][idx].classList.remove('over')
     }

    // adding and removing title on element name hover
    elementNameMouseOver = (e) => {
        if (e.target.tagName == "TD") {
            e.target.title = "Drag & Drop ItemGroup to reorder"
        }
        else {
            e.target.title = ""
        }
    }

render({props,state} = this){
    const style = { textAlign:"center"}
    return(
        <div>
            <section className=" baseline-container">
                <div className="border p-3 m-0 row justify-content-between elementtbl">
                    <div className="row col-12 justify-content-between border-bottom-dotted m-0 mb-3 pb-2 px-0">
                        <div className="col-md-5 col-lg-5 d-flex flex-row p-0">
                            <h5 className="pt-2 c-p">Encounter  Setup </h5>
                        </div>
                        <div className='col-md-5 pull-right d-flex justify-content-end p-0 mt-1'>
                            <h5 className="pt-1">Study:  <span className="text-muted bluetxt pt-1" title={props.match.params.study}>
                                {props.match && Common.getSubString(props.match.params.study, 15)} </span>
                                <span className="text-muted small ml-1 mr-1"> | </span> Source Data Name:  <span className="pt-1 bluetxt text-muted" title={props.match.params.protocolName}>
                                    {props.match && Common.getSubString(props.match.params.protocolName, 15)} </span> </h5>
                        </div>
                        <div className="col-md-auto col-sm-auto text-right p-0">
                            <div className="edit-btn-group d-flex flex-row">
                                <i className="material-icons" title='Save' onClick={this.saveProtocolEncounterSetup.bind(this)}>save</i>
                                <i className="material-icons" title='Cancel' onClick={this.cancelProtocolEncounterSetup.bind(this)}>clear</i>
                            </div>
                        </div>
                    </div>
                    <div className="row col-12 p-0 m-0">
                        <table ref="enTable" className="table table-responsive table-bordered  encounter-setup-table" id="encounterTable">
                            <thead>
                                <tr style={{ textAlign: "center" }}>{this.renderEpochHeaderDataSet()}</tr>
                                {this.renderEncounterHeader()}
                            </thead>
                            <tbody onScroll={this.myFunction.bind(this)}>
                                {
                                    this.state.elements && this.state.elements.length > 0 ?
                                        this.state.elements.map((ele, idx) => {
                                            return <tr draggable="true"
                                                onDragStart={(e) => this.onTrDragStart(e, idx)}
                                                onDragOver={(e) => this.onTrDragOver(e, idx)}
                                                onDrop={(e) => { this.onTrDrop(e, "wip", idx) }}
                                                onDragEnter={(e) => { this.onTrDragEnter(e, idx) }}
                                                onDragLeave={(e) => { this.onTrDragLeave(e, idx) }}
                                                key={idx}>{this.rednerElementListItemForEpoch(ele, idx)}</tr>
                                        })
                                        :
                                        <tr><td colSpan={this.state.epochData.reduce((ac, currentV) => { return ac + currentV.encounters.length }, 0)} style={style} >No record found.</td></tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    )
 }
}
function mapDispatchToProps(dispatch) {
    return {

        modalAction : bindActionCreators(modalAction,dispatch)
    };
}

function mapStateToProps(state){
    return {
        modal : state.modal
    }
}
export default  connect(mapStateToProps , mapDispatchToProps)(EncounterSetup);