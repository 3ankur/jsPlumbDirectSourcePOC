/**
 * Copyright (c) 2018
 * @summary Protocol setup component to creating protocol rules for study
 * @author Ankur Vishwakarma,Poonam Banode,Mangesh Pimprikar,Irfan Bagwan
 */

import React, { Component } from 'react';
import ApiService from '../../api';
import  SetupComponent from './setupComponent'
import jsplumb  from 'jsplumb';
import 'jsplumb/css/jsplumbtoolkit-defaults.css';
import './protocol-setup.css';
import * as modalAction from '../../actions/modalActions';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux' ;
import { MODAL_TYPE_EPOCH_DETAILS,MODAL_TYPE_ENCOUNTER_DETAILS,MODAL_TYPE_ALERT_POPUP,
    MODAL_TYPE_PUBLISH_SETUP,MODAL_TYPE_CONFIRM_POPUP,MODAL_TYPE_NOTIFY} from '../../constants/modalTypes';
import _ from 'lodash';
import common  from '../../common/common';
import {NotificationManager} from 'react-notifications';
import moment from 'moment';
const errorTypes ={

}
class ProtocolSetup extends Component{

    constructor(props){

       super(props);

       this.jsPlumbInstance = null;
       this.state = { setupRules:[],protocolName:'',currentVersion:'',versionId:"",previousEpochEncounterList:[],windowEncounterList:[],epochStatusList:{}}
       this.addNewEpoch = this.addNewEpoch.bind(this);
       this.allEndPoints = {};
       this.errorMsg="";
     //  this.deleteEpocData = this.deleteEpocData.bind(this);



    const  arrowCommon = { foldback: 0.7,  width: 14,events:{
        click:function() { console.log("you clicked on the arrow overlay")
        }
    } };
     this.connectOverlays = [
            [ "Arrow", { location: 0.7 }, arrowCommon ,],
            [ "Label", {
                location: [0.5, 1.5],
                visible:true,
                id: "label",
                cssClass: "aLabel",
                events:{
                    tap:function() { console.log("hey"); }
                }
            }],

            [ "Custom", {
                create:function(component) {
                    var el = document.createElement('span');
                    el.innerHTML="<i class='glyphicon glyphicon-remove-circle'></i>";
                    return el;
                },
            location: 0.4,
            events:{
                click:(et)=> {

                    try{
                        this.jsPlumbInstance.select({source:et.component.source.id, target:et.component.target.id}).delete()
                    }
                    catch(e){
                        console.log(e)

                    }
                }
            }

        }]

        ];

        this.start_config = {
            endpoint: ["Dot", { radius: 11 }],
            paintStyle: { fill: "#691e44" },
            isSource: true,
            scope: "green",
            isTarget: false,
            maxConnections: -1,
            onMaxConnections: function(){
            },
            draggable: false,
            anchor: 'Right',
            connectorOverlays:this.connectOverlays

        };

        this.end_config = {
            endpoint: ["Dot", { radius: 11 }],
            paintStyle: { fill: "#691e44" },
        isSource: false,
        scope: "green",
        isTarget: true,
        maxConnections: -1,
        onMaxConnections: function(){
        },
        draggable: false,
        anchor: 'Left',
        connectorOverlays:this.connectOverlays
        };

    // configure some drop options for use by all endpoints.
     const  dropOptionsConfig = {
        tolerance: "touch",
        hoverClass: "dropHover",
        activeClass: "dragActive"
    };


    this.connectionLeftEndpointConfig = {
        endpoint: ["Dot", { radius: 11 }],
        paintStyle: { fill: "#691e44" },
        isSource: false,
        scope: "green",
        // connectorStyle: { stroke: color2, strokeWidth: 3},
        // connector: ["Bezier", { curviness: 63 } ],
        maxConnections: -1,
        isTarget: true,
        dropOptions: dropOptionsConfig,
        beforeDrop:  (params)=> {
            const isAlradyConnected = this.jsPlumbInstance.getConnections(params);
            const filterCount = isAlradyConnected.filter( (o)=>{return o.sourceId==params.sourceId && o.targetId == params.targetId } );

            if(params.sourceId==params.targetId){
                return false;
            }
            if(filterCount.length>0){
                return false;
                }
            return  true; //window.confirm("Connect " + params.sourceId + " to " + params.targetId + "?");
        },
      };


      this.connectionRightEndpointConfig = {
        endpoint: ["Dot", { radius: 11 }],
        paintStyle: { fill: "#691e44" },
        isSource: true,
        scope: "green",
        // connectorStyle: { stroke: color2, strokeWidth: 3},
        // connector: ["Bezier", { curviness: 63 } ],
        maxConnections: -1,
        isTarget: false,
        dropOptions: dropOptionsConfig,
        beforeDrop:  (params)=>{
            const isAlradyConnected = this.jsPlumbInstance.getConnections(params);
            const filterCount = isAlradyConnected.filter( (o)=>{return o.sourceId==params.sourceId && o.targetId == params.targetId } );
            if(params.sourceId==params.targetId){
                return false;
            }
            if(filterCount.length>0){
                return false;
                }
            return  true; //window.confirm("Connect " + params.sourceId + " to " + params.targetId + "?");
        },
      };


      this.epochDetailsPopUpCickHandler = this.epochDetailsPopUpCickHandler.bind(this);

    }

    //setting the jsplumb instance
    setJSplumbInstance(ins){
        this.jsPlumbInstance = ins;
    }

    //getting the jsplumb instance
    getJSplumbInstance(){
        return  this.jsPlumbInstance;
    }


    getEncounterList(epochID)
    {
// need to revisit on this code #AV
        if(epochID=="startWindow"){
            return false
            }
            let prevSt = this.state.windowEncounterList;
              let found =  this.state.setupRules.filter((e)=>e.nodeKey==epochID)
            if(found.length && found[0]["parent"].length){
                prevSt = prevSt.concat(found)
                 this.setState({windowEncounterList:prevSt})
                found[0]["parent"].forEach((ed,id)=>{
                   let hasTraveled =  this.state.windowEncounterList.filter((t)=>{return t.nodeKey===ed})
                   if(!hasTraveled.length){
                    this.getEncounterList(ed)
                   }

                })
            }

    }
    //setting the jsplumb instance

    //getting the last epoch encounter list
    getPreviousEpochEncounerList(encounterInfo,epochId){
       // previousEpochEncounterList

       try{
           this.setState({windowEncounterList:[]})
           let tempArr = [];
        const filterEpoch = this.state.setupRules.filter((n) => n.nodeKey === epochId);
        if (filterEpoch.length > 0) {

            let encIdx = _.findIndex(filterEpoch[0]["encounters"],(k)=>{return k.enNodeKey === encounterInfo[0]["enNodeKey"]})  // encounerInfo
                    if(encIdx>-1){
                          if(encIdx!=0){
                                for (let i = 0; i < encIdx; i++) {
                                  let obj = {
                                      id: common.getRandomNumber(),
                                      name: `${filterEpoch[0]["name"]}- ${filterEpoch[0]["encounters"][i]["encounterName"]}`, //encounterName displayName
                                      info: filterEpoch[0]["encounters"][i]
                                  }
                                  tempArr.push(obj)
                                 }
                          }
                    }

                    filterEpoch[0]["parent"].forEach((rt,ix)=>{
                        this.getEncounterList(rt)
                    })



            // for unique epoch
             let listEp =    _.uniqBy(this.state.windowEncounterList, 'name');
             //for excluding if starting epoch
             if( filterEpoch[0]["parent"].length &&  filterEpoch[0]["parent"].indexOf("startWindow")>-1){

                let findx = _.findIndex(listEp,(g)=>{return g.nodeKey===epochId});
                if(findx>-1){
                    listEp.splice(findx,1)
                }
             }

             listEp && listEp.forEach( (epList,epIdx)=>{
                epList.encounters.forEach((encDt,enxId)=>{

                    let obj = {
                        id:  common.getRandomNumber(), // enNodeKey  epList["enNodeKey"] 
                        name: `${epList["name"]}- ${encDt["encounterName"]}`, //encounterName displayName
                        info: encDt
                    }
                    tempArr.push(obj)
                })
             })

//removed unused code
        }

            return tempArr;
       }
       catch(e){
console.log("Exceptions",e)
       }
    }


    //get the abbreviation name
    getEncounterAbbreviation(name,inDisplayName){
        if(name){
            let withoutSpace = name.replace(/\s+/g, " ").trim();
            let spt = withoutSpace.split(" ");
            if(spt.length && spt.length>1){
                return `${spt[0].charAt(0).toUpperCase()}${spt[1].charAt(0).toUpperCase()}` 
            }
            else{
                return `${spt[0].charAt(0).toUpperCase()}`
            }
        }
        else{
            return inDisplayName;
        }

    }

    //encounter details pop up

    encounterDetailsPopUpHandeler(enInfo,epochId,encNo){
        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_ENCOUNTER_DETAILS,{
            onSaveEncounter: (rec) => {
                const prevSt = this.state.setupRules;
                let idx = _.findIndex(prevSt, (nx) => { return nx.nodeKey == epochId })
                if (idx > -1) {
                    //d.enNodeKey===encId
                    //dx.displayName == encNo
                    //check for encounter
                    let idxEnc = _.findIndex(prevSt[idx]["encounters"], (dx) => { return dx.enNodeKey === enInfo[0]["enNodeKey"] })
                    if(idxEnc>-1){
                        let oldEncName = enInfo[0]["encounterName"];
                        rec.displayName = this.getEncounterAbbreviation(rec.encounterName,rec.displayName)
                        Object.assign(prevSt[idx]["encounters"][idxEnc], rec);
                        this.setState({ setupRules: prevSt },()=>{
                            //Updating encounter abbreviation

                            if(enInfo && enInfo.length && enInfo[0]["enNodeKey"] ){
                                let enElRef = document.getElementById(enInfo[0]["enNodeKey"]);
                                if(enElRef.children && enElRef.children.length>1){
                                    enElRef.children[1].innerText =  rec.displayName; //this.getEncounterAbbreviation(rec.encounterName,rec.displayName) ;
                                }   
                                enElRef.children[0].setAttribute("title",rec.encounterName)
                                enElRef.children[1].setAttribute("title",rec.encounterName)

                            }
                             //check if encounter name not changed
                            if(oldEncName!=rec.encounterName){
                            this.updateT0EncounterWindow(epochId,rec.encounterName,rec["enNodeKey"] ,"encounter")  
                            }
                            
                        });
                    }

                }

            },
            enInfo,
            previousEpochEncounterList: this.getPreviousEpochEncounerList(enInfo,epochId)

        });

    }
    //END



    epochDetailsPopUpCickHandler(selectedEpochData,nodeId) {
        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_EPOCH_DETAILS,{
            onSave : (rec) => {
                //call save api
              // return false

               // this.setState({epochName:"ANkureer"})
                let refEle = document.getElementById(nodeId+"_title");
                refEle.innerText = rec.name ?  common.getSubString(rec.name,18)   : nodeId ;
                refEle.setAttribute("title",rec.name)
            const prevSt = this.state.setupRules;
            let idx = _.findIndex(prevSt,(nx)=>{return nx.nodeKey == nodeId})
            if(idx>-1){
                let previousEpochName = prevSt[idx]["name"]
               Object.assign(prevSt[idx],rec);
               this.setState({setupRules:prevSt},()=>{
                   if(previousEpochName!=rec.name){
                        this.updateT0EncounterWindow(nodeId,rec.name,null,"epoch")  
                   }
                  
               });
               this.jsPlumbInstance.repaintEverything();

            }
            },
            epocData:(e)=>{
            },
            selectedEpochData,
            epochStatusList:this.state.epochStatusList


        });
    }

    //remove the 
    removeT0EncounterRefrence(epochKey,encounterKey,type){
        let prevEpochState = this.state.setupRules;
        if(type==="epoch"){
            prevEpochState && prevEpochState.forEach((epData,epIndex)=>{
                epData.encounters.forEach((en,enIdx)=>{
                       if( epochKey && en.hasOwnProperty("baselineWindow") && en.hasOwnProperty("parentEnNodeKey") &&  en.parentEnNodeKey &&  en.parentEnNodeKey.indexOf(epochKey)>-1  ){
                           en["baselineWindow"] = "";en["parentEnNodeKey"] = ""; en["initialSelection"] = null;
                       }
                 })
               })
        }else{
            prevEpochState && prevEpochState.forEach((epData,epIndex)=>{
                epData.encounters.forEach((en,enIdx)=>{
                       if( en.hasOwnProperty("baselineWindow") && en.hasOwnProperty("parentEnNodeKey") &&  en.parentEnNodeKey &&  en.parentEnNodeKey === encounterKey ){
                        en["baselineWindow"] = "";en["parentEnNodeKey"] = "";en["initialSelection"] = null;
                       }
               })
               })
        }
        this.setState({setupRules:prevEpochState})
    }

    //updating T0 Window for encounter
    updateT0EncounterWindow(key,updatedName,encounterKey,type){
    let prevEpochState = this.state.setupRules;
    if(type==="epoch"){
        //parentEnNodeKey
        prevEpochState && prevEpochState.forEach((epInfo,epIndex)=>{
             epInfo.encounters.forEach((en,enIdx)=>{
                    if( updatedName && en.hasOwnProperty("baselineWindow") && en.hasOwnProperty("parentEnNodeKey") &&  en.parentEnNodeKey &&  en.parentEnNodeKey.indexOf(key)>-1  ){
                        en["baselineWindow"]["name"] = updatedName+"- "+en["baselineWindow"]["info"]["encounterName"];
                    }
            })
            })
    }
    else{
        prevEpochState && prevEpochState.forEach((epInfo,epIndex)=>{
            epInfo.encounters.forEach((en,enIdx)=>{
                   if(updatedName && encounterKey && en.hasOwnProperty("baselineWindow") && en.hasOwnProperty("parentEnNodeKey") &&  en.parentEnNodeKey &&  en.parentEnNodeKey === encounterKey ){
                       en["baselineWindow"]["name"] = epInfo.name+"- "+updatedName;
                   }
           })
           })
    }
    this.setState({setupRules:prevEpochState});
    }


    addEpochDetails(e1){
    }

    getEpochConfigJSON(){

     return    {
            "name": "",
            "description": "",
            "during_status": "",
            "ending_status": "",
            "drop_from": "",
            "parent": [],
            "child": [],
            "encounters": [],
            "position":{"left":400,"top":10},
            "nodeKey":"",
            "epochIdentifier":""
          }
    }

    getEncounterConfigJson(){
        return {
            "encounterName":"",
            "encounterDesc":"",
            "fromVisit":"",
            "toVisit":"",
            "fromType":"",
            "toType":"",
            "type":"",
            "displayName":"",
            "enNodeKey":"",
            "elements":[],
            "enDisplayName":"",
            "encounterIdentifier":""
        }
    }

    //create new epoc on state
    createNewEpochDataSet(epocCount,count){
        let prevRule = this.state.setupRules;
        let epochInfo = this.getEpochConfigJSON();
        epochInfo.name = "Epoch"+count;
        epochInfo.description = "";
        epochInfo.during_status = "";
        epochInfo.ending_status = "";
        epochInfo.drop_from = "";
        epochInfo.nodeKey = epocCount;
        prevRule.push(epochInfo);
        this.setState(prevRule);
    }

    //add new epoch

    addNewEpoch(position){
        var cnt = jsplumb.jsPlumb.getSelector(".protocol-epoch").length+1;
        var el = document.createElement("div");
        const epochId  = "epoch_"+common.getRandomNumber();
       // const randomId = common.getRandomNumber();
        el.setAttribute("id", epochId);
        el.style.left = position && position.left ?position.left+"px" : "400px";
        el.style.top = position && position.top ?position.top+"px" : "10px";
        el.className = "col-auto border mr-4 p-3  mt-3 protocol-epoch";
        el.innerHTML = `<div class="col-12 p-0 d-flex justify-content-between border-bottom-p-dotted pb-2 mb-3">
        <h5 data-toggle="tooltip" data-placement="top" title="Epoch${cnt}" class="ep_title col-auto p-0 c-p" id="${epochId}_title">Epoch${cnt}</h5>
        <div class="d-flex flex-row col-auto p-0 justify-content-between pt-1">
            <button class="glyphicon glyphicon-edit pr-2 c-p protocol-setup-btn" data-toggle="modal" onclick="event.preventDefault();addEpochDetails('${epochId}');event.stopPropagation();" ></button>
            <button class="glyphicon glyphicon-remove c-p protocol-setup-btn" onclick="event.preventDefault();event.stopPropagation();deleteEpocData('${epochId}')"></button>
        </div>
    </div>
    <div class="py-4" id="${epochId}_encounters"></div>
    <div class="addiconnline"> <button class="enaddbtn"  onclick="addEncounter('${epochId}');"></button></div>
    `;

    document.getElementById('canvas').appendChild(el);

    setTimeout( ()=>{
        // this.jsPlumbInstance.addEndpoint(el, { anchor: "LeftMiddle",connectorOverlays:this.connectOverlays   }, this.connectionLeftEndpointConfig);
        // this.jsPlumbInstance.addEndpoint(el, { anchor: "RightMiddle",connectorOverlays:this.connectOverlays   }, this.connectionRightEndpointConfig);


        this.allEndPoints[el.id] = [
            this.jsPlumbInstance.addEndpoint(el, { anchor: "LeftMiddle",connectorOverlays:this.connectOverlays   }, this.connectionLeftEndpointConfig),
            this.jsPlumbInstance.addEndpoint(el, { anchor: "RightMiddle",connectorOverlays:this.connectOverlays   }, this.connectionRightEndpointConfig)

        ]

    },20 );


    this.createNewEpochDataSet(epochId,cnt);

    this.jsPlumbInstance.draggable(el,{
        drag:(event)=>{

            try{

            let node = event.el;

            if (parseInt (node.style.top) < 0){
            node.style.top = "0px";
            }
            if (parseInt (node.style.left) < 0)
            {
            node.style.left = "0px";
            }

        const prevSt =  this.state.setupRules;

        const idx =   _.findIndex(prevSt, (o)=> { return o.nodeKey == el.id  });
    if(idx>-1){
       prevSt[idx]["position"]["left"] = event.pos[0];
       prevSt[idx]["position"]["top"]  = event.pos[1];
       this.setState({setupRules:prevSt});
    }

    }
            catch(e){
                console.log("error Occure ",e)
            }


        }
    });



    }

    //get study protocol details
    getStudySetupDetails(){
       try{
        this.setState({currentVersion:this.props.match.params.protocolVersion});
        ApiService.getProtocolSetupByVersionAndStatus(this.props.match.params.studyId,this.props.match.params.protocolIdentity,'Draft').then( (res)=>{

                if(res.data.responsecode===200 && res.data.status==="success" && res.data.response && typeof(res.data.response)==="object"){
                    //currentVersion
                    this.setState({currentVersion:this.props.match.params.protocolVersion,protocolName:res.data.response.name ? res.data.response.name  : this.props.match.params.protocolName,
                        versionId:res.data.response.versionId
                    });
                    const epochInfo =  res.data.response && res.data.response.epochData ? JSON.parse(res.data.response.epochData) : []
                        this.setState({setupRules:epochInfo,prevSetupRules:res.data.response.epochData});
                    setTimeout(()=>{

                    this.createEpochElemensOnCanvas()
                    //this.connectEpochEndPoints();
                    this.checkforPublish();
                    },30 )
                }
           },(error)=>{
           // NotificationManager.error("Something went wrong ..")
        });

   const stuydData = []
    }
    catch(e){}
  }


  //create epochs dataset on canvas
  createEpochElemensOnCanvas(){
    if(this.state.setupRules && this.state.setupRules.length)
    {
        this.state.setupRules.forEach( (epochInfo,epochIdx)=>{
            var cnt = jsplumb.jsPlumb.getSelector(".protocol-epoch").length+1;
        var el = document.createElement("div");
       //const randomId = common.getRandomNumber();
        let eleId = epochInfo.nodeKey ?  epochInfo.nodeKey : "epoch_"+common.getRandomNumber() ;
        el.setAttribute("id", eleId);
        el.style.left = epochInfo.position && epochInfo.position.left ? epochInfo.position.left+"px" : "400px";
        el.style.top  =  epochInfo.position && epochInfo.position.top ? epochInfo.position.top+"px" : "10px";
        el.className  = "col-auto border mr-4 p-3  mt-3 protocol-epoch";
        let epochName = epochInfo.name ?  epochInfo.name : `Epoch${epochIdx}`;




        el.innerHTML = `<div class="col-12 p-0 d-flex justify-content-between border-bottom-p-dotted pb-2 mb-3">
        <h5 data-toggle="tooltip" data-placement="top" title="${ epochName}" class="ep_title col-auto p-0 c-p" id="${eleId}_title">${common.getSubString(epochName,18)  }</h5>
        <div class="d-flex flex-row col-auto p-0 justify-content-between pt-1">
            <button class="glyphicon glyphicon-edit pr-2 c-p protocol-setup-btn" data-toggle="modal" onclick="addEpochDetails('${eleId}');event.stopPropagation();" ></button>
            <button class="glyphicon glyphicon-remove c-p protocol-setup-btn" onclick="event.stopPropagation();deleteEpocData('${eleId}')"></button>
        </div>
    </div>
    <div class="py-4 enscroll" id="${eleId}_encounters">
    ${this.createEncounterList(epochInfo)}
    </div>
    <div class="addiconnline"> <button class="enaddbtn"  onclick="addEncounter('${eleId}');"></button></div>
    `;

    document.getElementById('canvas').appendChild(el);
    setTimeout( ()=>{
         this.allEndPoints[el.id] = [
            this.jsPlumbInstance.addEndpoint(el, { anchor: "LeftMiddle",connectorOverlays:this.connectOverlays   }, this.connectionLeftEndpointConfig),
            this.jsPlumbInstance.addEndpoint(el, { anchor: "RightMiddle",connectorOverlays:this.connectOverlays   }, this.connectionRightEndpointConfig)
            ];

    },20 );

    this.jsPlumbInstance.draggable(el,{
        drag:(event)=>{

            try{
                let node = event.el;

            if (parseInt (node.style.top) < 0){
            node.style.top = "0px";
            }
            if (parseInt (node.style.left) < 0)
            {
            node.style.left = "0px";
            }
                const prevSt =  this.state.setupRules;
                const idx =   _.findIndex(prevSt, (o)=> { return o.nodeKey == el.id  });
                if(idx>-1){
                prevSt[idx]["position"]["left"] = event.pos[0];
                prevSt[idx]["position"]["top"]  = event.pos[1];
                this.setState({setupRules:prevSt});
             }
            }
            catch(e){
                console.log("error Occure ",e)
            }
        }
    });

        })
    }
    this.connectEpochEndPoints();
 }

 //create encounter list for epoch
 createEncounterList(epochInfo){
//digits = Math.floor(Math.random() * 9000000000) + 1000000000;
    let s = ``;
    epochInfo.encounters && epochInfo.encounters.forEach( (enc,enix)=>{

        let enKey = enc.enNodeKey ?  enc.enNodeKey :  epochInfo.nodeKey+"_"+common.getRandomNumber();
        //let encDisplayName = enc.encounterName ?  common.getEncounterAbbreviation(enc.encounterName,'') : `E${enix}` ;
        let encDisplayName = enc.displayName ?  enc.displayName : `E${enix}` ;
        s+=`<div class="d-inline position-relative encounter epoch_1_encounters enmargin" id="${enKey}">
        <span title="${enc.encounterName}" class="bg-dark rounded px-2 py-1 mr-4 protocol-box-overlay" onClick="event.stopPropagation();">
        <button class="glyphicon glyphicon-remove enc_del_btn" onClick="event.stopPropagation();deleteEpochEncounter('${epochInfo.nodeKey}','${enKey}');event.stopImmediatePropagation()"></button>
        </span>
        <span title="${enc.encounterName}" class="bg-light-grey rounded px-2 py-1 mr-4 enboxgrey"  onclick="event.stopPropagation();getEncounterDetails('${epochInfo.nodeKey}','${'E'+enix}','${enKey}')">${encDisplayName}
        </span>
        <button class="glyphicon glyphicon-edit edit_encounter_icon encedit" onclick="event.stopPropagation();getEncounterDetails('${epochInfo.nodeKey}','${'E'+enix}','${enKey}')"></button>
    </div>`
    })
return s;
//onClick="event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();"
//<i class="glyphicon glyphicon-remove" onClick="event.preventDefault();event.stopImmediatePropagation();deleteEpochEncounter('${epochInfo.nodeKey}','${enKey}');"></i>
//<button class="glyphicon glyphicon-remove" onClick="event.preventDefault();event.stopImmediatePropagation();deleteEpochEncounter('${epochInfo.nodeKey}','${enKey}');" ></button>
 }




  //creating elements on canvas and make connections
  connectEpochEndPoints(){
        setTimeout( ()=>{
            try{
                this.state.setupRules.map( (ep,idx)=>{

                        ep.parent.map( (c,io)=>{
                            const pcCon = this.jsPlumbInstance.select({source:ep.nodeKey, target:c});
                            const cpCon = this.jsPlumbInstance.select({source:c, target:ep.nodeKey});
                            if( (pcCon && pcCon.length>0) || (cpCon && cpCon.length>0) ){}
                            else{

                                for(var e in this.allEndPoints){
                                    if(e==c){
                                         if("startWindow"==c){
                                               this.jsPlumbInstance.connect({
                                                source: this.allEndPoints[c],
                                                target: this.allEndPoints[ep.nodeKey][0]
                                            });
                                        }
                                        else{
                                            this.jsPlumbInstance.connect({
                                                source: this.allEndPoints[c][1],
                                                target: this.allEndPoints[ep.nodeKey][0]
                                            });
                                         }
                                      }
                                    }
                                 }
                             });
                                 ep.child.map( (ch,io)=>{
                                    const child_pcCon = this.jsPlumbInstance.select({source:ep.nodeKey, target:ch});
                                    const child_cpCon = this.jsPlumbInstance.select({source:ch, target:ep.nodeKey});


            if( (child_pcCon && child_pcCon.length>0) || (child_cpCon && child_cpCon.length>0 )){}

            else{

                for(var e in this.allEndPoints){
                    if(e==ch){
                        if("endWindow"==ch){
                                this.jsPlumbInstance.connect({
                                    source: this.allEndPoints[ep.nodeKey][1],
                                    target: this.allEndPoints["endWindow"]
                                });
                               }
                               else{
                                this.jsPlumbInstance.connect({
                                    source: this.allEndPoints[ep.nodeKey][1],
                                    target: this.allEndPoints[ch][0]
                                });
                               }
                            }
                         }
                        }
                    });
                });
                this.jsPlumbInstance.repaintEverything();
              }
            catch(e){
                console.log(e)
            }

 } ,200)
  }

  // get epochDetail by nodeKey
  getEpochDetailsByNodeKey(nodeKey){
    return this.state.setupRules.filter((o)=>{return o.nodeKey===nodeKey})
  }


componentDidMount(){
    this.getEpochStatusList();
    this.initlizeJSplumb(this);
    this.getStudySetupDetails();
  }

  //getting the status lists of epoch
  getEpochStatusList(){

    ApiService.getEpochStatus().then((res)=>{
//epochStatusList
        if(res.data && res.data.response){
               res.data.response && res.data.response.drop_from_status.forEach((dpx,idx)=>{
                dpx.id = dpx.uniqueIdentifier;
               })
               res.data.response && res.data.response.ending_status.forEach((edx,idx)=>{
                edx.id = edx.uniqueIdentifier;
               })
               this.setState({epochStatusList:res.data.response});
        }
    })
  }

  initlizeJSplumb(currentContext){
    jsplumb.jsPlumb.ready( ()=>{
        const instance = jsplumb.jsPlumb.getInstance({
            DragOptions: { cursor: 'pointer', zIndex: 2000 },
            PaintStyle: { stroke: '#666' },
            EndpointHoverStyle: { fill: "orange" },
            HoverPaintStyle: { stroke: "orange" },
            EndpointStyle: { width: 20, height: 16, stroke: '#666' },
            Endpoint: "Rectangle",
            Anchors: ["TopCenter", "TopCenter"],
            Container: "canvas"
        });

        this.setJSplumbInstance(instance);

          //start end setting
          this.allEndPoints["startWindow"]  =  instance.addEndpoint(document.getElementById("startWindow"), this.start_config);
          this.allEndPoints["endWindow"]    =  instance.addEndpoint(document.getElementById("endWindow"), this.end_config);

        // make .window divs draggable
        instance.draggable(jsplumb.jsPlumb.getSelector(".protocol-setup-container .protocol-epoch"));


        instance.batch( ()=> {

            instance.bind("connection",  (info, originalEvent)=>{
               const prevSt = currentContext.state.setupRules;
               let idPt =  _.findIndex(prevSt,(nx)=>{ return nx.nodeKey == info.targetId }) //currentContext.setupRules.filter
               if(idPt>-1){
                   if(prevSt[idPt]["parent"].indexOf(info.sourceId) === -1){
                    prevSt[idPt]["parent"].push(info.sourceId);
                    currentContext.setState({setupRules:prevSt});

                   }

               }

               //setting the childId
               let idChild = _.findIndex(prevSt,(nx)=>{ return nx.nodeKey == info.sourceId });
               if(idChild>-1){
                   if(prevSt[idChild]["child"].indexOf(info.targetId)=== -1){
                    prevSt[idChild]["child"].push(info.targetId);
                    currentContext.setState({setupRules:prevSt});
                   }

             }

            });

            // detached connection
            instance.bind("connectionDetached",  (info, originalEvent) =>{
                try{
                    //checking for is that statwindows
                    if(info.sourceId =="startWindow"){
                        const prevSt = this.state.setupRules;
                        const idx =   _.findIndex(prevSt, (o)=> { return o.nodeKey == info.targetId });
                        const pidx = _.findIndex(prevSt[idx]["parent"],(c)=>{return c=="startWindow"});
                        if(pidx>-1){
                            prevSt[idx]["parent"].splice(pidx,1);
                            this.setState({setupRules:prevSt});
                        }
                    }
                    else{


                    //getting source id's  childs
                    const prevSt = this.state.setupRules;
                    const idx =   _.findIndex(prevSt, (o)=> { return o.nodeKey == info.sourceId });
                    const childIdx = _.findIndex(prevSt[idx]["child"],(c)=>{return c==info.targetId});
                    if(childIdx>-1){
                        prevSt[idx]["child"].splice(childIdx,1);
                        this.setState({setupRules:prevSt});
                    }

                //getting target id's  parents
                    const pidx =   _.findIndex(prevSt, (o)=> { return o.nodeKey == info.targetId });
                    const parentIdx = _.findIndex(prevSt[pidx]["parent"],(c)=>{return c==info.sourceId});
                    if(parentIdx>-1){
                        prevSt[pidx]["parent"].splice(parentIdx,1);
                        this.setState({setupRules:prevSt});

                    }


                    }
             }
                catch(e){

                }
             });

            instance.bind("connectionMoved",  (info, originalEvent)=>{
                //  only remove here, because a 'connection' event is also fired.
                // in a future release of jsplumb this extra connection event will not
                // be fired.
            });

            // instance.bind("click", function (component, originalEvent) {
            // });

        });


        // delete epoc functon
        window.deleteEpocData = (epocId)=>{
            //MODAL_TYPE_CONFIRM_POPUP
                    try{
                        currentContext.props.modalAction && currentContext.props.modalAction.showModal(MODAL_TYPE_CONFIRM_POPUP,{

                            onOkay: (d)=>{
                                const inst = currentContext.jsPlumbInstance;
                                const seleEle = document.getElementById(epocId);
                                const prevData = currentContext.state.setupRules;
                                let index = _.findIndex(prevData, (x) => { return x.nodeKey === epocId });
                                if (index > -1) {
                                    prevData.splice(index, 1);
                                    currentContext.setState({ setupRules: prevData },()=>{
                                        currentContext.removeT0EncounterRefrence(epocId,null,"epoch");
                                    });
                                    inst.remove(seleEle);
                                } else {
                                    console.log("some issue ");
                                }
                            },
                            className:"alertPopUp"

                        })
                    }
                    catch(e){
                        console.log(e)
                    }
                }

                //add encounter to epoc
                window.addEncounter = (pEle)=>{
                    let encountersId = pEle+"_encounters"; //id="epoc_1_encounters"
                    var theDiv =   document.getElementById(encountersId);
                     let childCount = 0;  //theDiv.children.length;
                    //added for maintaining the sequence
                    if(theDiv.children.length>0){

                        let currentEpochData = this.getEpochDetailsByNodeKey(pEle);
                            if(currentEpochData && currentEpochData.length){
                              let lastEncLen =   currentEpochData[0]["encounters"].length ? currentEpochData[0]["encounters"].length-1 : 0 
                              if(currentEpochData[0]["encounters"][lastEncLen]["enDisplayName"]){
                               let ct =  currentEpochData[0]["encounters"][lastEncLen]["enDisplayName"].split("E")[1];
                                childCount = parseInt(ct)+1;
                              }else{
                                childCount = theDiv.children.length;
                              }
                            } 

                        // let prevEncName = theDiv.children[theDiv.children.length-1].textContent.trim();
                        // let prvEncCount = prevEncName.split("E")[1];
                        // childCount = parseInt(prvEncCount)+1;
                    }
                  var countEn =  document.getElementsByClassName(encountersId).length;
                  const newEncId = `${pEle}_E${childCount}_${common.getRandomNumber()}`;
                  theDiv.innerHTML+=`<div class="d-inline position-relative encounter enmargin ${encountersId}" id="${newEncId}">
                                                    <span title="E${childCount}" class="bg-dark rounded px-2 py-1 mr-4 protocol-box-overlay" onClick="event.preventDefault();event.stopImmediatePropagation();">
                                                        <button class="glyphicon glyphicon-remove enc_del_btn" onClick="deleteEpochEncounter('${pEle}','${newEncId}');event.preventDefault();event.stopImmediatePropagation();"></button>
                                                    </span>
                                                    <span title="E${childCount}" class="bg-light-grey rounded px-2 py-1 mr-4 enboxgrey" onClick="event.preventDefault();event.stopImmediatePropagation();">E${childCount}
                                                    </span>
                                                    <button class="glyphicon glyphicon-edit edit_encounter_icon encedit" onClick="getEncounterDetails('${pEle}','E${childCount}','${newEncId}');event.preventDefault();event.stopImmediatePropagation();"></button>
                                                </div>`
                    let encounter_json_conf =  currentContext.getEncounterConfigJson();
                    const prevData =  currentContext.state.setupRules;
                    let index = _.findIndex(prevData, (x)=> { return x.nodeKey == pEle} );
                    if(index>-1){
                        encounter_json_conf.displayName = `E${childCount}`;
                        encounter_json_conf.encounterName=`E${childCount}`;
                        encounter_json_conf.enDisplayName=`E${childCount}`;
                        encounter_json_conf.enNodeKey =  newEncId; //`${encountersId}_E${countEn}_${common.getRandomNumber()}`     //encountersId+""+common.getRandomNumber();
                        prevData[index]["encounters"].push(encounter_json_conf);
                        currentContext.setState({setupRules:prevData});
                    }
                    currentContext.jsPlumbInstance.repaintEverything();
                }

                //add epoc details
                window.addEpochDetails = (e)=>{
                    const filterEpoch = currentContext.state.setupRules.filter((n)=>n.nodeKey==e );
                    currentContext.epochDetailsPopUpCickHandler(filterEpoch,e);
                }

                window.getEncounterDetails = (epochId,enc,encId)=>{
                    try{
                    const filterEpoch = currentContext.state.setupRules.filter((n)=>  n.nodeKey===epochId );
                    if(filterEpoch.length>0){

                        const filterEncounter = filterEpoch[0].encounters.filter((d)=>d.enNodeKey===encId);
                        currentContext.encounterDetailsPopUpHandeler(filterEncounter,epochId,enc);
                    }
                    }
                    catch(e){
                    }
                }

                //delete epoch encounter
        window.deleteEpochEncounter = (epochId, encId) => {
            window.currentContext = currentContext;
            try {
                currentContext.props.modalAction && currentContext.props.modalAction.showModal(MODAL_TYPE_CONFIRM_POPUP, {
                    onOkay: (d) => {
                     if (document.getElementById(epochId)) {

                            let prevState = currentContext.state.setupRules;
                            const eleIndex = _.findIndex(prevState, (o) => { return o.nodeKey === epochId });
                            if (eleIndex > -1) {
                                 //getting encounter index
                                const encounterIndex = _.findIndex(prevState[eleIndex]["encounters"], (en) => {  return en.enNodeKey === encId });
                                if (encounterIndex > -1) {
                                    prevState[eleIndex]["encounters"].splice(encounterIndex, 1);
                                    currentContext.setState({ setupRules: prevState },()=>{
                                        currentContext.removeT0EncounterRefrence(epochId,encId,"encounter");
                                    });
                                    // document.getElementById(encId).remove();
                                    currentContext.jsPlumbInstance.remove(document.getElementById(encId))
                                }
                            }
                        }
                    },
                    className:"alertPopUp"
                })
            }
            catch (e) {

            }

        }

        window.addEventListener("resize", (event)=> {

            try{
                currentContext.jsPlumbInstance.repaintEverything();
            }catch(e){

            }
        })
    });

  }

     //for canceling the changes
     cancelProtocolSetup(){

            let encounterArr = [];
            try{
                if(this.state.setupRules.length){
                    const oldRules = JSON.parse(this.state.prevSetupRules);
                const currentSetup = this.state.setupRules;

                if(oldRules.length === currentSetup.length){

                    currentSetup.forEach( (info,idx)=>{
                     if(info.encounters.length != oldRules[idx]["encounters"].length){
                            encounterArr.push(false);
                        }
                    });

                    if(encounterArr.indexOf(false)>-1){
                        this. checkForRedirect();
                    }
                    else{
                        this.props.history.push(`/protocol-details`);
                    }


                }
                else{
                this. checkForRedirect();

                }
                }
                else{
                    this. checkForRedirect();

                    }
                 }
            catch(e){
          }
        }

         //for redirecting page
    checkForRedirect() {

        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_NOTIFY, {
            onOkay: () => {
                this.props.history.push(`/protocol-details`);
            }
        });
    }

// check for publishing setup
  checkforPublish(){
    if(this.validateProtocolSetup("publish")){
        this.setState({isReadyToPublish:true});
    }
    else{
        this.setState({isReadyToPublish:false});
    }
}


  //validating  the setup for save
  validateProtocolSetup(type){

    let isValid = false;
   let validationArry = [];
    if(this.state.setupRules && this.state.setupRules.length){


       this.state.setupRules && this.state.setupRules.forEach( (dx,dix)=>{

           const hasEncounter      = dx.encounters.length ? true : false;
           const hasEpochConnected = dx.parent.length && dx.child.length ? true : false;

           if(!hasEncounter){ this.errorMsg = "No encounter at "+dx.name; }
           if(!hasEpochConnected){ this.errorMsg = dx.name +" is not connected"; }

           dx.encounters.forEach( (enc,ix)=>{
               if(enc.encounterName &&  enc.fromVisit && enc.toVisit && enc.toType && enc.fromType){
                    if(enc.hasOwnProperty("parentEnNodeKey") && enc.parentEnNodeKey){
                        validationArry.push(true);
                    }
                    else{
                        if(dx.parent && dx.parent.indexOf("startWindow")>-1){
                            validationArry.push(true);
                        }
                        else{
                            validationArry.push(false);
                            this.errorMsg = "Encounter window missing on "+dx.name;
                            console.log(this.errorMsg)
                        }
                    }
               }
           else{
            validationArry.push(false);
            this.errorMsg = "Encounter details are missing on "+dx.name+" -"+enc.displayName;
           }
         })

           if(dx.ending_status && dx.drop_from && dx.name){
            validationArry.push(true);
           }
           else{
            validationArry.push(false);
            this.errorMsg ="Epoch details are missing on "+dx.name;
           }

           if( hasEncounter && hasEpochConnected){
               validationArry.push(true);
           }
           else{
               validationArry.push(false);
               this.errorMsg ="Epoch details are missing on "+dx.name;
             }
             if(type==="publish" && dx.encounters.length){

               dx.encounters.forEach( (elx,inx)=>{
                 // elx.elements.length ?  validationArry.push(true) : validationArry.push(false) ;
                    if(elx.elements.length ){
                        validationArry.push(true);
                    }else{
                        validationArry.push(false);
                        this.errorMsg ="Unable to publish setup, Epoch: "+dx.name+" Encounter "+elx.displayName +" has no itemgroup"; 
                    }
               })

           }
       })
       if(validationArry.indexOf(false)>-1){
           isValid = false
       }
       else{
           isValid = true
       }

    }else{
       isValid = false
    }

    return   isValid;

  }

  // save protocol setup
  saveProtocolHandeler(){
        try{
            if(this.state.setupRules.length>0 && this.validateProtocolSetup("save")){
                let data= {}
                data.protocolId = this.props.match.params.versionId;
                data.studyIdentifier = this.props.match.params.studyId;
                data.uniqueIdentifier = this.props.match.params.protocolIdentity;
                data.sourceIdentifier = null
                data.language =  "EN";
                data.version =   this.props.match.params.protocolVersion;
                data.versionId = this.state.versionId ?  this.state.versionId : 0
                data.name = this.state.protocolName ? this.state.protocolName : 'Source Data';
                data.status = "Draft"
                data.epochData = JSON.stringify(this.state.setupRules) ;
                data.lastModifiedOn = new Date()
                data.lastModifiedBy = "Admin";
                data.epoch = this.state.setupRules;
             
     ApiService.saveProtocolSetupJSON(this.props.match.params.studyId,this.props.match.params.protocolIdentity,data).then( (res)=>{

                    if(res.status=="200"){
                        this.setState({prevSetupRules : JSON.stringify(this.state.setupRules) });
                        common.clearNotification();
                        NotificationManager.success("Source Data Setup saved successfully");
                    }
                },(err)=>{})
            }
            else{
                common.clearNotification();
                if(this.errorMsg){
                    NotificationManager.error(this.errorMsg)
                }
                else{
                    NotificationManager.error("Invalid Source Data Setup")
                }
            }
        }
        catch(e){

        }
  }

  // publish the setup
  publishProtocolHandeler(){

    try{
        if(this.state.setupRules.length>0 && this.validateProtocolSetup("publish")){

            this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_PUBLISH_SETUP,{
                onSave : (res) => {
                if(res.publishDate){
                    let data = {};
                    data.protocolId = this.props.match.params.versionId;
                    data.studyIdentifier = this.props.match.params.studyId;
                    data.uniqueIdentifier = this.props.match.params.protocolIdentity;
                    data.sourceIdentifier = null
                    data.language =  "EN";
                    data.version =   this.props.match.params.protocolVersion;
                    data.name = this.state.protocolName;
                    data.status = "Draft"
                    data.epochData = JSON.stringify(this.state.setupRules) ;
                    data.lastModifiedOn = new Date()
                    data.lastModifiedBy = "Admin";
                    data.publishDate=  common.formatDate(res.publishDate,"YYYY-MM-DD"),
                    data.epoch = this.state.setupRules;
                    data.versionId = this.state.versionId

                       ApiService.publishProtocolSetup(this.props.match.params.studyId,this.props.match.params.protocolIdentity,data).then( (serRes)=>{
                        common.clearNotification();
                            NotificationManager.success("Source Data publish  on - "+  moment(res.publishDate).format('DD/MMM/YYYY'));
                            this.props.modalAction.hideModal();
                            setTimeout( ()=>{
                                this.props.history.push(`/protocol-details`);
                            },2000 );
                        },(error)=>{
                            if (error.response && error.response.status == '404') {
                                common.clearNotification();
                                NotificationManager.warning(error.response.data && error.response.data.apierror && error.response.data.apierror.message);
                            }else{
                                common.clearNotification();
                                NotificationManager.error('something went wrong');
                            }
                        })
                }
            },
        });

        }
        else{
            common.clearNotification();
            if(this.errorMsg){
                NotificationManager.error(this.errorMsg)
            }
            else{
                NotificationManager.error("Invalid Source Data Setup")
            }

        }
    }
    catch(e){

    }



  }



  dropNewEpochHandeler(position){
    this.addNewEpoch(position);
  }

  //validation for setup changes
  hasSetupChanged(){

    let hasValid = true;
    let encounterArr = [];
    try{

        if(this.state.setupRules.length){
            const oldRules = JSON.parse(this.state.prevSetupRules);
            const currentSetup = this.state.setupRules;

        if(oldRules.length === currentSetup.length){

            currentSetup.forEach( (info,idx)=>{
             if(info.encounters.length != oldRules[idx]["encounters"].length){
                    encounterArr.push(false);
                }
            });

            if(encounterArr.indexOf(false)>-1){
                hasValid = false;
            }
         }
        else{
            hasValid = false;

          }
        }
        return hasValid;
    }
        catch(e){

        }

  }

  encounterSetupHandeler(){

try{
        if(this.hasSetupChanged() && this.state.setupRules.length>0){

            this.props.history.push(`/protocol-details/protocol-setup-new/protocol-encounter-setup/${this.props.match.params.study}/${this.props.match.params.versionId}/${this.props.match.params.studyId}/${this.props.match.params.protocolVersion}/${this.state.protocolName}/${this.props.match.params.protocolIdentity}`);
        }
        else{

            // this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_NOTIFY, {
            //     onOkay: () => {
            //         this.props.history.push(`/protocol-details`);
            //     }
            // });

            this.alertPopUpHandeler({title:"Please save Source Data setup before proceeding to Encounter setup"});
        }

         }
    catch(e){
  }






}


elementSetupHandeler(){


    if(this.hasSetupChanged() && this.state.setupRules.length>0){
        this.props.history.push(`/protocol-details/protocol-setup-new/protocol-element-setup/${this.props.match.params.study}/${this.props.match.params.versionId}/${this.props.match.params.studyId}/${this.props.match.params.protocolVersion}/${this.props.match.params.protocolName}/${this.props.match.params.protocolIdentity}/${null}/${null}`);
            }
            else{
                this.alertPopUpHandeler({title:"Please save Source Data Setup before proceeding to ItemGroup setup"});
            }
 }

 changeProtocolNameHandler(name){
     this.setState({protocolName:name});
     }

alertPopUpHandeler(info){
    this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_ALERT_POPUP,{
        onOkay:(rec)=>{
      },
      info,
      className:"alertPopup"
    });
}

    render(){

        return(

        <div>
                {/* <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                    </ol>
                </nav> */}
                <section className="baseline-container">
                <div className="border p-3 m-0 row justify-content-between footpadb">
                    <div className="row col-12 justify-content-between border-bottom-dotted m-0 mb-3 pb-2 px-0">
                        <div className="col-5 p-0">
                            <h5 className=" c-p">Source Data Setup:<span className="text-muted bluetxt"> {this.props.match.params.study}</span> </h5>
                        </div>
                </div>


                  <SetupComponent
                   addNewEpochHandeler={this.addNewEpoch}
                   epochDropHandler={this.dropNewEpochHandeler.bind(this)}
                   changeVersionName={this.changeProtocolNameHandler.bind(this)}
                   protocolName={this.state.protocolName}
                   currentVersion={this.state.currentVersion}
                   jsPlumbRef = {this.jsPlumbInstance}

                  />

                    <div className="row m-0 col-md-12 p-0 justify-content-end mt-1">
                        <div className="col-md-auto p-0">
                            <button type="button" className="btn text-white align-bottom bg-p  mr-2" onClick={this.saveProtocolHandeler.bind(this)}>Save</button>
                            <button type="button" className="btn text-white align-bottom bg-p  mr-2" onClick={this.publishProtocolHandeler.bind(this)} >Publish</button>
                            <button type="button" className="btn text-white align-bottom bg-p mr-2" onClick={this.elementSetupHandeler.bind(this)}>ItemGroup Setup</button>
                            <button type="button" className="btn text-white align-bottom bg-p  mr-2" onClick={this.encounterSetupHandeler.bind(this)}> Encounter Setup</button>
                            <button type="button" className="btn text-white align-bottom bg-p" onClick={this.cancelProtocolSetup.bind(this)} >Cancel</button>
                        </div>
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


//export default ProtocolSetup;
export default  connect(mapStateToProps , mapDispatchToProps)(ProtocolSetup);