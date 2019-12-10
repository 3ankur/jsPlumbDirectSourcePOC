/**
 * Copyright (c) 2018
 * @summary Protocol setup component to creating protocol rules for study
 * @author Ankur Vishwakarma,Poonam Banode,Mangesh Pimprikar,Irfan Bagwan
 */

import React, { Component } from 'react';
import jsplumb  from 'jsplumb';
import ApiService from '../../api';
import  SetupComponent from './setupComponent'
import 'jsplumb/css/jsplumbtoolkit-defaults.css';
import './protocol-setup.css';
import * as modalAction from '../../actions/modalActions';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux' ;
import { MODAL_TYPE_EPOCH_DETAILS,MODAL_TYPE_ENCOUNTER_DETAILS,
         MODAL_TYPE_ALERT_POPUP, MODAL_TYPE_PUBLISH_SETUP,
         MODAL_AUTHENTICATION,MODAL_TYPE_NOTIFY} from '../../constants/modalTypes';
import _ from 'lodash';
import Common from '../../common/common'
import {NotificationManager} from 'react-notifications';
import dragDropTouch from './DragDropTouch'


class ProtocolSetup extends Component{

    constructor(props){

       super(props);

       this.jsPlumbInstance = null;
       this.state = {
           setupRules:[],
           hasProtocolSaved:false,
           currentVersion:"",
           isReadyToPublish:false,
           prevSetupRules:"",
           protocolName:""

     }

     this.allEndPoints = {};
      // this.addNewEpoch = this.addNewEpoch.bind(this);
       this.addNewDesignEpoch = this.addNewDesignEpoch.bind(this);
       this.func = {
        addEpochDetails: (e)=>{
        }

       };
     //  this.deleteEpocData = this.deleteEpocData.bind(this);



    const  arrowCommon = { foldback: 0.7,  width: 14,events:{
        click:function() { alert("you clicked on the arrow overlay")}
    } };
     this.connectOverlays = [
            [ "Arrow", { location: 0.7 }, arrowCommon ,],
            [ "Label", {
                location: [0.5, 1.5],
                visible:true,
                id: "label",
                cssClass: "aLabel",
                events:{
                    tap:function() { alert("hey"); }
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

    /*
    this.connectionEndpointConfig = {
        endpoint: ["Dot", { radius: 11 }],
        paintStyle: { fill: "#691e44" },
        isSource: true,
        scope: "green",
        maxConnections: -1,
        isTarget: true,
        dropOptions: dropOptionsConfig,
        beforeDrop:  (params)=> {


            const isAlradyConnected = this.jsPlumbInstance.getConnections(params);
            const filterCount = isAlradyConnected.filter( (o)=>{return o.sourceId==params.sourceId && o.targetId == params.targetId } );
            if(params.sourceId==params.targetId){
                return false
            }
            if(filterCount.length>0){
            return false;
            }
            return  true;
        },
      };
      */

      /* Start END New Config*/

      this.connectionLeftEndpointConfig = {
        endpoint: ["Dot", { radius: 11 }],
        paintStyle: { fill: "#691e44" },
        isSource: false,
        scope: "green",
        maxConnections: -1,
        isTarget: true,
        dropOptions: dropOptionsConfig,
        beforeDrop:  (params)=> {

            const isAlradyConnected = this.jsPlumbInstance.getConnections(params);
            const filterCount = isAlradyConnected.filter( (o)=>{return o.sourceId==params.sourceId && o.targetId == params.targetId } );
            if(params.sourceId==params.targetId){
                return false
            }
            if(filterCount.length>0){
            return false;
            }
           return  true;
        },
      };


      this.connectionRightEndpointConfig = {
        endpoint: ["Dot", { radius: 11 }],
        paintStyle: { fill: "#691e44" },
        isSource: true,
        scope: "green",
        maxConnections: -1,
        isTarget: false,
        dropOptions: dropOptionsConfig,
        beforeDrop:  (params)=> {

            const isAlradyConnected = this.jsPlumbInstance.getConnections(params);
            const filterCount = isAlradyConnected.filter( (o)=>{return o.sourceId==params.sourceId && o.targetId == params.targetId } );
            if(params.sourceId==params.targetId){
                return false
            }
            if(filterCount.length>0){
            return false;
            }
            return  true;
        },
      };
      /*END */


      this.epochDetailsPopUpCickHandler = this.epochDetailsPopUpCickHandler.bind(this);
      this.encounterDetailsPopUpHandeler = this.encounterDetailsPopUpHandeler.bind(this);

    }

    //setting the jsplumb instance
    setJSplumbInstance(ins){
        this.jsPlumbInstance = ins;
    }

    //getting the jsplumb instance
    getJSplumbInstance(){
        return  this.jsPlumbInstance;
    }

    //Update epoch Setting
  epochDetailsPopUpCickHandler(selectedEpochId,nodeId) {
       const editEpoch = this.state.setupRules[selectedEpochId];//unwanted code need to remove later
       const selectedEpochData = [editEpoch]; //need to remove it ,actully that component accept that pattern.
        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_EPOCH_DETAILS,{
            onSave : (rec) => {
            const prevSt = this.state.setupRules;
            Object.assign(prevSt[selectedEpochId],rec);
            this.setState({setupRules:prevSt});
            setTimeout(()=>{
                this.jsPlumbInstance.repaintEverything();
            },20)

        },
            epocData:(e)=>{
            },
            selectedEpochData


        });
    }


        alertPopUpHandeler(info){
            //MODAL_TYPE_ALERT_POPUP

            this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_ALERT_POPUP,{
                onOkay:(rec)=>{

              },
              info


            });
        }


 //encounter details pop up
//epochId,enconterId,encounterInfo
    encounterDetailsPopUpHandeler(epochId,enconterId,encounterInfo){
        const selEpochSt = this.state.setupRules[epochId];
        const enInfo = [selEpochSt["encounters"][enconterId]]
        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_ENCOUNTER_DETAILS,{
            onSaveEncounter:(rec)=>{
           const prevSt = this.state.setupRules;
           Object.assign(prevSt[epochId]["encounters"][enconterId],rec);
           this.setState({setupRules:prevSt});

          },
            enInfo

        });

    }
    //END




    addEpochDetails(e1){
    }

    getEncounterConfigJSON(idx){
        return {
            "encounterName":"",
            "encounterDesc":"",
            "fromVisit":"",
            "toVisit":"",
            "fromType":"",
            "toType":"",
            "type":"",
            "displayName":"E"+idx,
            "enNodeKey":"",
            "elements":[]
        }
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
            "position":{"left":200,"top":150},
            "nodeKey":""
          }
    }

    //create new epoc on state
    createNewEpochDataSet(epocCount){
        let prevRule = this.state.setupRules;
        let epochInfo = this.getEpochConfigJSON();
        epochInfo.name = "Epoch"+epocCount;
        epochInfo.description = "";
        epochInfo.during_status = "";
        epochInfo.ending_status = "";
        epochInfo.drop_from = "";
        epochInfo.nodeKey = "epoch_"+Common.getRandomNumber();//10 digit alphanumeric value
        prevRule.push(epochInfo);
        this.setState(prevRule);
        //setupRules

    }

    addNewDesignEpoch(){
      this.createNewEpochDataSet(this.state.setupRules.length+1);


    }

     //after droped the epoch on canvas,will create new epoch on that position
     createNewEpochOnDropedpPosition(position){
console.log(this.state.setupRules)
        let prevRule = this.state.setupRules;
        let count = prevRule.length+1
        let epochInfo = this.getEpochConfigJSON();
        epochInfo.name = "Epoch"+count;
        epochInfo.description = "";
        epochInfo.during_status = "";
        epochInfo.ending_status = "";
        epochInfo.drop_from = "";
        epochInfo.nodeKey = "epoch_"+Common.getRandomNumber();//10 digit alphanumeric value
        epochInfo.position = position
        prevRule.push(epochInfo);
        this.setState(prevRule);
    }


    updateJSPlumbConfigToElel(el){

        try{

            setTimeout( ()=>{

               // const el = document.getElementById(id);
            this.allEndPoints[el.epoch.id] = [
                this.jsPlumbInstance.addEndpoint(el.epoch, { anchor: "LeftMiddle",connectorOverlays:this.connectOverlays   }, this.connectionLeftEndpointConfig),
                this.jsPlumbInstance.addEndpoint(el.epoch, { anchor: "RightMiddle",connectorOverlays:this.connectOverlays   }, this.connectionRightEndpointConfig)

            ]

            window.allEndPOints = this.allEndPoints;


            this.jsPlumbInstance.draggable(el.epoch,{
                drag:(event)=>{

                    try{
                      // console.log("hi i m for ",el);

                const prevSt =  this.state.setupRules;

                const idx =   _.findIndex(prevSt, (o)=> { return o.nodeKey == el.epoch.id  });
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

            },10 )


        }
        catch(e){

        }


    }

    addEpochEncounterHdl(idx){
      //  console.log("adding new encounter to epocjs..>!!",idx,this.state);
        const prevEc = this.state.setupRules;

        let encJSON = this.getEncounterConfigJSON(prevEc[idx]["encounters"].length);
        encJSON.enNodeKey = `${ prevEc[idx]["nodeKey"]}_E${prevEc[idx]["encounters"].length}_${Common.getRandomNumber()}`; 
        prevEc[idx]["encounters"].push(encJSON);
        this.setState({setupRules:prevEc});
        setTimeout(()=>{// repainting the jsplumb node for endpoints updating position
            this.jsPlumbInstance.repaintEverything();
        },20)
    }


    handelDeleteEpoch(nodeId,epochId){

       console.log("Deleting epoch Data fo r===>",nodeId,epochId);


        try{

                          let prevSt = this.state.setupRules;
                           const seleEle = document.getElementById(nodeId);

                        //this.jsPlumbInstance.remove(seleEle);
                      this.jsPlumbInstance.removeAllEndpoints(nodeId)
                         //this.jsPlumbInstance.repaintEverything();


                          prevSt.splice(epochId,1);
                          this.setState({setupRules:prevSt})


                    }
                    catch(e){
                        console.log(e)
                    }

    }

    //adding new details to epoch
    getEpochDetailsHandler(nodeId,epochId){

      //  console.log("Here is the finall handler which open the pop up for ",nodeId,epochId);
        this.epochDetailsPopUpCickHandler(epochId,nodeId);

    }
    //adding new details to encounter
    addNewDetailsToEncounter(enId,enData,epochId){
//console.log("EpochId==>",epochId,"EncounterId=>",enId);
this.encounterDetailsPopUpHandeler(epochId,enId,enData)
    }

    //delete the encounter
   deleteSelectedEncounter(enId,enData,epochId){
        //console.log("EpochId==>",epochId,"EncounterId=>",enId);
        // this.encounterDetailsPopUpHandeler(epochId,enId,enData)
        console.log("for deleing encounter data",enId,enData,epochId);
        try{

            const prevSet = this.state.setupRules;
            console.log(prevSet);
           // prevSet[epochId]["encounters"]
           prevSet[epochId] && prevSet[epochId]["encounters"] ?  prevSet[epochId]["encounters"].splice(enId,1) : ""
           this.setState({setupRules:prevSet});
           this.jsPlumbInstance.repaintEverything();


        }catch(e){

            console.log("issue occure");

        }





            }

    //connct with end points
    connectEpochEndPoints()
    {


       // console.log(this.allEndPoints);
        setTimeout( ()=>{

        try{


          //  console.log(this.jsPlumbInstance);
          this.state.setupRules && this.state.setupRules.map( (ep,idx)=>{

                        ep.parent.map( (c,io)=>{
                          //  console.log("Parent Map ==>",c)

                            const pcCon = this.jsPlumbInstance.select({source:ep.nodeKey, target:c});
                            const cpCon = this.jsPlumbInstance.select({source:c, target:ep.nodeKey});

        // this.jsPlumbInstance.select({source:et.component.source.id, target:et.component.target.id}) this.jsPlumbInstance.getAllConnections()
                           // console.log("Connection Info",this.jsPlumbInstance.select({source:ep.nodeKey, target:c}));
                           // console.log("Connection Opposite ",this.jsPlumbInstance.select({source:c, target:ep.nodeKey}));

                            if( (pcCon && pcCon.length>0) || (cpCon && cpCon.length>0) ){

                            }
                            else{

                                for(var e in this.allEndPoints){
                                    if(e==c){

                                        if("startWindow"==c){
                                          //  console.log( "End point ==>",ep.nodeKey.toString(),this.allEndPoints,this.allEndPoints[ep.nodeKey.toString()]);
                                         //   console.log("ep.nodeKey===>",this.allEndPoints.epoch_1)
                                            // console.log("End bu node key ",this.allEndPoints.hasOwnProperty(ep.nodeKey),ep.nodeKey,e,ep.nodeKey==e )
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
                                   // console.log("child Map ==>",ch)

                                    const child_pcCon = this.jsPlumbInstance.select({source:ep.nodeKey, target:ch});
                                    const child_cpCon = this.jsPlumbInstance.select({source:ch, target:ep.nodeKey});


            if( (child_pcCon && child_pcCon.length>0) || (child_cpCon && child_cpCon.length>0 )){

                                            }

            else{

                for(var e in this.allEndPoints){
                    if(e==ch){

                                // console.log("End bu node key ",this.allEndPoints.hasOwnProperty(ep.nodeKey),ep.nodeKey,e,ep.nodeKey==e )

                               if("endWindow"==ch){
                               // console.log( "End point 1212 ==>",ep.nodeKey.toString(),this.allEndPoints);


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


    //get setupup details of study
    getStudySetupDetails(){

        try{
            this.setState({currentVersion:this.props.match.params.protocolVersion,protocolName:this.props.match.params.protocolName});
            ApiService.getProtocolSetupByVersionAndStatus(this.props.match.params.studyId,this.props.match.params.versionId,'Draft').then( (res)=>{

                    if(res.data.responsecode===200 && res.data.status==="success" && res.data.response && typeof(res.data.response)==="object"){
                        //currentVersion
                        const epochInfo =  res.data.response && res.data.response.epochData ? JSON.parse(res.data.response.epochData) : []
                        this.setState({setupRules:epochInfo,prevSetupRules:res.data.response.epochData});
                        setTimeout(()=>{

                        this.connectEpochEndPoints();
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


    checkforPublish(){
        if(this.validateProtocolSetup("publish")){
          //  console.log("yes its the ready for publish");
            this.setState({isReadyToPublish:true});
        }
        else{
           // console.log("No its not ready");
            this.setState({isReadyToPublish:false});
        }
    }

    componentDidUpdate( prevProps,  prevState){

        //console.log("State changes happend ...!!");
    }

componentDidMount(){

    localStorage.setItem("fromMenu",false)
   // console.log(jsplumb);
    this.initlizeJSplumb(this);
   // console.log("Ohh Really its interpreter.......@")
    this.getStudySetupDetails();

  }

  initlizeJSplumb(currentContext){

    //console.log("Loaded....!!");
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

        window.mineJsIns  = instance;
        this.setJSplumbInstance(instance);

          //start end setting
          this.allEndPoints["startWindow"] =  instance.addEndpoint(document.getElementById("startWindow"), this.start_config);
          this.allEndPoints["endWindow"]   =  instance.addEndpoint(document.getElementById("endWindow"), this.end_config);

        // make .window divs draggable
        instance.draggable(jsplumb.jsPlumb.getSelector(".protocol-setup-container .protocol-epoch"));


        instance.batch( ()=> {

            instance.bind("connection",  (info, originalEvent)=> {
               // console.log("connected ...!!",info);
              //  console.log("This contet ==>");

                //setting parent
                const prevSt = this.state.setupRules;
                let idPt =  _.findIndex(prevSt,(nx)=>{ return nx.nodeKey == info.targetId }) //currentContext.setupRules.filter
              //  console.log("new idx",idPt);
                if(idPt>-1){
                    if( prevSt[idPt]["parent"].indexOf(info.sourceId)<0){
                        prevSt[idPt]["parent"].push(info.sourceId);
                       this.setState({setupRules:prevSt});
                    }

                }

                //setting the childId
                let idChild = _.findIndex(prevSt,(nx)=>{ return nx.nodeKey == info.sourceId });
               // console.log("new idx child-=>",idChild);
                if(idChild>-1){
                    if(prevSt[idChild]["child"].indexOf(info.targetId)<0){
                        prevSt[idChild]["child"].push(info.targetId);
                        this.setState({setupRules:prevSt});
                    }

              }
            });

            // detached connection
            instance.bind("connectionDetached",  (info, originalEvent)=> {
                //console.log("Dettached ...!!",info,originalEvent);

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
                       // console.log("sourceIndex ==>",prevSt[idx],idx,info.sourceId);

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

            instance.bind("connectionMoved", function (info, originalEvent) {
                //  only remove here, because a 'connection' event is also fired.
                // in a future release of jsplumb this extra connection event will not
                // be fired.
              //  console.log("Connection moved ...!!");
                //updateConnections(info.connection, true);
            });

            // instance.bind("click", function (component, originalEvent) {
            //     alert("click!")
            // });

        });

    });

  }


//   shouldComponentUpdate(nextProps, nextState) {
//     console.log("Next props == = ====>",nextProps);
//     console.log("Next state = =====>",nextState);

//     return true
// }



  //method for save setup data
  saveProtocolHandeler(){

    console.log(JSON.stringify(this.state.setupRules));
    // we should have validation for rules
    //if all set then go to save api
    //

    //this.props.match.params.studyId,this.props.match.params.versionId
    // console.log(this.validateProtocolSetup("save"))
    //return false
    try{
        if(this.state.setupRules.length>0 && this.validateProtocolSetup("save")){

            //preparing the data set 
            // jsonData: this.state.setupRules,
            //     versionId:this.state.currentVersion

            let data= {}
            data.protocolId = this.props.match.params.versionId;
            data.studyId = this.props.match.params.studyId;
            data.uniqueIdentifier = this.props.match.params.protocolIdentity;
            data.sourceIdentifier = null
            data.language =  "EN";
            data.version =   this.props.match.params.protocolVersion;
            data.name = this.state.protocolName;
            data.status = "Draft"
            data.epochData = JSON.stringify(this.state.setupRules) ;
            data.lastModifiedOn = new Date()
            data.lastModifiedBy = "Admin";
            data.epoch = this.state.setupRules;
            console.log("Updated JSON ...");
           // return false

            

            ApiService.saveProtocolSetupJSON(this.props.match.params.studyId,data).then( (res)=>{
               // console.log(res);
                if(res.status=="200"){
                    this.setState({prevSetupRules : JSON.stringify(this.state.setupRules) });
                    Common.clearNotification();
                    NotificationManager.success("Setup saved successfully");
                }
            },(err)=>{})
        }
        else{
            Common.clearNotification();
            NotificationManager.error("Invalid setup")
        }
    }
    catch(e){

    }

  }
  publishProtocolHandeler(){

    //POST /api/v1/setup/studies/{studyId}/protocol/publish

    try{
        if(this.state.setupRules.length>0 && this.validateProtocolSetup("publish")){

            this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_PUBLISH_SETUP,{
                onSave : (res) => {
                //console.log(res,Common.formatDate(res.publishDate,"YYYY-MM-DD"))

                if(res.publishDate){
                    // let data = {
                    //     "versionId": this.props.match.params.versionId,
                    //     "versionParentStudyId": this.props.match.params.studyId,
                    //     "version_date_published": Common.formatDate(res.publishDate,"YYYY-MM-DD"),

                    //    }

                     let data = {};

                    data.protocolId = this.props.match.params.versionId;
                    data.studyId = this.props.match.params.studyId;
                    data.uniqueIdentifier = this.props.match.params.protocolIdentity;
                    data.sourceIdentifier = null
                    data.language =  "EN";
                    data.version =   this.props.match.params.protocolVersion;
                    data.name = this.state.protocolName;
                    data.status = "Draft"
                    data.epochData = JSON.stringify(this.state.setupRules) ;
                    data.lastModifiedOn = new Date()
                    data.lastModifiedBy = "Admin";
                    data.publishDate=  Common.formatDate(res.publishDate,"YYYY-MM-DD"),
                    data.epoch = this.state.setupRules;

                     

                       ApiService.publishProtocolSetup(this.props.match.params.studyId,data).then( (serRes)=>{
                        Common.clearNotification();
                            NotificationManager.success("Protocol publish  on - "+res.publishDate);
                            this.props.modalAction.hideModal();
                            setTimeout( ()=>{
                                this.props.history.push(`/protocol-details`);
                            },2000 );
                        },(error)=>{
                            if (error.response && error.response.status == '404') {
                                Common.clearNotification();
                                NotificationManager.warning(error.response.data && error.response.data.apierror && error.response.data.apierror.message);
                            }else{
                                Common.clearNotification();
                                NotificationManager.error('something went wrong');
                            }
                        })

                     //  console.log(data);
                    // this.props.modalAction && this.props.modalAction.showModal(MODAL_AUTHENTICATION,{
                    //     onSave : (res1) => {
                    //       //  this.onClose();
                    //         ApiService.publishProtocolSetup(data).then( (serRes)=>{
                    //             NotificationManager.success("Protocol publish  on:"+res.publishDate);
                    //             this.props.modalAction.hideModal();
                    //             setTimeout( ()=>{
                    //                 this.props.history.push(`/protocol-details`);
                    //             },2000 );
                    //         },error=>{})
                    //     },
                    //     hideModal : ()=>{
                    //         this.props.modalAction.hideModal();
                    //     }
                    // });
                }
                // setTimeout(()=>{
                //     this.jsPlumbInstance.repaintEverything();
                // },20)

            },

        });

        }
        else{
            Common.clearNotification();
            NotificationManager.error("Invalid protocol setup,");

        }
    }
    catch(e){

    }





  }

  encounterSetupHandeler(){
console.log(this.state.setupRules)

        if(this.state.setupRules.length>0){
    this.props.history.push(`/protocol-details/protocol-setup-new/protocol-encounter-setup/${this.props.match.params.study}/${this.props.match.params.versionId}/${this.props.match.params.studyId}/${this.props.match.params.protocolVersion}/${this.state.protocolName}/${this.props.match.params.protocolIdentity}`);
        }
        else{
            this.alertPopUpHandeler({title:"Please create & save setup before proceeding to encounter setup.."});
        }
 }

 elementSetupHandeler(){


    if(this.state.setupRules.length>0){
        this.props.history.push(`/protocol-details/protocol-setup-new/protocol-element-setup/${this.props.match.params.study}/${this.props.match.params.versionId}/${this.props.match.params.studyId}/${this.props.match.params.protocolVersion}/${this.props.match.params.protocolName}/${this.props.match.params.protocolIdentity}/${null}/${null}`);
            }
            else{
                this.alertPopUpHandeler({title:"Please create & save setup before proceeding to ItemGroup setup.."});
            }


 }

  dropNewEpochHandeler(position){
   // console.log(position)
    this.createNewEpochOnDropedpPosition(position);
  }

  //validating  the setup for save
   validateProtocolSetup(type){

     let isValid = false;
    let validationArry = [];
     if(this.state.setupRules && this.state.setupRules.length){


        this.state.setupRules && this.state.setupRules.forEach( (dx,dix)=>{

            const hasEncounter      = dx.encounters.length ? true : false;
            const hasEpochConnected = dx.parent.length && dx.child.length ? true : false;
            if( hasEncounter && hasEpochConnected){
                validationArry.push(true);
            }
            else{
                validationArry.push(false);
              }
              if(type==="publish" && dx.encounters.length){

                dx.encounters.forEach( (elx,inx)=>{
                   elx.elements.length ?  validationArry.push(true) : validationArry.push(false) ;
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
     checkForRedirect(){

        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_NOTIFY,{
            onOkay : () => {
                this.props.history.push(`/protocol-details`);
        }


        });
     }

     changeProtocolNameHandler(name){ this.setState({protocolName:name}); }


    render(){

        return(
            <div>
                <section className="baseline-container">
                <div className="border p-3 m-0 row justify-content-between footpadb">
                   <div className="row col-12 justify-content-between border-bottom-dotted m-0 mb-3 pb-2 px-0">
                        <div className="col-5 p-0">
                            <h5 className=" c-p">Protocol Setup: <span className="protocol_study_color">{this.props.match.params.study}</span></h5>
                        </div>
                    </div>


                <SetupComponent  epochs={this.state.setupRules}
                 currentVersion={this.state.currentVersion}
                  protocolName={this.state.protocolName}
                  addNewEpochHandeler={this.addNewDesignEpoch}
                  updateEndPointHandler={this.updateJSPlumbConfigToElel.bind(this)}
                  addEncounterToEpoch={this.addEpochEncounterHdl.bind(this)}
                  deleteEpochData={this.handelDeleteEpoch.bind(this)}
                  getEpochDetails={this.getEpochDetailsHandler.bind(this)}
                  encounterDetailsHandler ={this.addNewDetailsToEncounter.bind(this)}
                  deleteEncounterDetailsHandler={this.deleteSelectedEncounter.bind(this)}
                  epochDropHandler={this.dropNewEpochHandeler.bind(this)}
                  jsPlumbRef = {this.jsPlumbInstance}
                  changeVersionName={this.changeProtocolNameHandler.bind(this)}
                  />

                    <div className="row m-0 col-md-12 p-0 justify-content-end mt-1">
                        <div className="col-md-auto p-0">
                            <button type="button" className="btn text-white align-bottom bg-p mr-2" onClick={this.saveProtocolHandeler.bind(this)}>Save</button>
                           <button type="button" className="btn text-white align-bottom bg-p mr-2" onClick={this.publishProtocolHandeler.bind(this)} >Publish</button>
                           <button type="button" className="btn text-white align-bottom bg-p mr-2" onClick={this.elementSetupHandeler.bind(this)}> ItemGroup Setup</button>
                            <button type="button" className="btn text-white align-bottom bg-p mr-2" onClick={this.encounterSetupHandeler.bind(this)}> Encounter Setup</button>
                           <button type="button" className="btn text-white align-bottom bg-p"     onClick={this.cancelProtocolSetup.bind(this)} >Cancel</button>
                        </div>
                    </div>
                </div>

                </section>

                  {/* */}


                  {/* <SetupComponent addNewEpochHandeler={this.addNewEpoch} /> */}
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