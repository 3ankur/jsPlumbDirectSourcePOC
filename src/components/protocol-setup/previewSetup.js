//const setupData = [{"name":"Screening","description":"Screening Description","during_status":"Screened","ending_status":"Randomized","drop_from":"Screen Fail","parent":["startWindow"],"child":["epoch_2"],"encounters":[{"encounterName":"Screening Encounter1","encounterDesc":"Screening Encounter1 Description","fromVisit":"1","toVisit":"12","fromType":"Days","toType":"Days","type":"","displayName":"E0","enNodeKey":"epoch_1_encounters_E0_dnd3l2ejq9"},{"encounterName":"Screening Encounter2","encounterDesc":"Screening Encounter2 Description","fromVisit":"1","toVisit":"3","fromType":"Month","toType":"Month","type":"","displayName":"E1","enNodeKey":"epoch_1_encounters_E1_ugtpdwd7rp"}],"position":{"left":296,"top":114},"nodeKey":"epoch_1"},{"name":"BloodDrop","description":"","during_status":"Randomized","ending_status":"Randomized","drop_from":"Drop","parent":["epoch_1"],"child":["endWindow"],"encounters":[{"encounterName":"BloodDrop Encounter1","encounterDesc":"BloodDrop Encounter1 Description","fromVisit":"1","toVisit":"3","fromType":"Month","toType":"Month","type":"","displayName":"E0","enNodeKey":"epoch_2_encounters_E0_6173pcajj8w"},{"encounterName":"BloodDrop Encounter2","encounterDesc":"BloodDrop Encounter2","fromVisit":"3","toVisit":"21","fromType":"Days","toType":"Days","type":"","displayName":"E1","enNodeKey":"epoch_2_encounters_E1_v9y0jjeb6lb"}],"position":{"left":922,"top":122},"nodeKey":"epoch_2"}];
import React, { Component } from 'react';
import MenuOptions from '../menuoptions/menuoptions';
import ApiService from '../../api';
import  SetupComponent from './setupComponent'
import jsplumb  from 'jsplumb';
import 'jsplumb/css/jsplumbtoolkit-defaults.css';
import './protocol-setup.css';
import * as modalAction from '../../actions/modalActions';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux' ;
import { MODAL_TYPE_EPOCH_DETAILS,MODAL_TYPE_ENCOUNTER_DETAILS} from '../../constants/modalTypes';
import _ from 'lodash';
import common  from '../../common/common';

class PreviewSetup extends React.Component{

    constructor(props){

        super(props);

        this.jsPlumbInstance = null;
        this.state = { setupData:[{"name":"Epoch1","description":"","during_status":"","ending_status":"","drop_from":"","parent":["startWindow"],"child":["epoch_2","epoch_3"],"encounters":[],"position":{"left":203,"top":20},"nodeKey":"epoch_1"},{"name":"Epoch2","description":"","during_status":"","ending_status":"","drop_from":"","parent":["epoch_1","epoch_3"],"child":["endWindow"],"encounters":[],"position":{"left":773,"top":11},"nodeKey":"epoch_2"},{"name":"Epoch3","description":"","during_status":"","ending_status":"","drop_from":"","parent":["epoch_1"],"child":["epoch_2"],"encounters":[],"position":{"left":476,"top":165},"nodeKey":"epoch_3"}]}
      // this.addNewEpoch = this.addNewEpoch.bind(this);
      // this.deleteEpocData = this.deleteEpocData.bind(this);
      this.allEndPoints = {};
      //[{"name":"Epoch1","description":"","during_status":"","ending_status":"","drop_from":"","parent":["startWindow"],"child":["epoch_2","epoch_3"],"encounters":[],"position":{"left":203,"top":20},"nodeKey":"epoch_1"},{"name":"Epoch2","description":"","during_status":"","ending_status":"","drop_from":"","parent":["epoch_1","epoch_3"],"child":["endWindow"],"encounters":[],"position":{"left":773,"top":11},"nodeKey":"epoch_2"},{"name":"Epoch3","description":"","during_status":"","ending_status":"","drop_from":"","parent":["epoch_1"],"child":["epoch_2"],"encounters":[],"position":{"left":476,"top":165},"nodeKey":"epoch_3"}]

      //old
      //[{"name":"Screening","description":"Screening Description","during_status":"Screened","ending_status":"Randomized","drop_from":"Screen Fail","parent":["startWindow"],"child":["epoch_2"],"encounters":[{"encounterName":"Screening Encounter1","encounterDesc":"Screening Encounter1 Description","fromVisit":"1","toVisit":"12","fromType":"Days","toType":"Days","type":"","displayName":"E0","enNodeKey":"epoch_1_encounters_E0_dnd3l2ejq9"},{"encounterName":"Screening Encounter2","encounterDesc":"Screening Encounter2 Description","fromVisit":"1","toVisit":"3","fromType":"Month","toType":"Month","type":"","displayName":"E1","enNodeKey":"epoch_1_encounters_E1_ugtpdwd7rp"}],"position":{"left":296,"top":114},"nodeKey":"epoch_1"},{"name":"BloodDrop","description":"","during_status":"Randomized","ending_status":"Randomized","drop_from":"Drop","parent":["epoch_1"],"child":["endWindow"],"encounters":[{"encounterName":"BloodDrop Encounter1","encounterDesc":"BloodDrop Encounter1 Description","fromVisit":"1","toVisit":"3","fromType":"Month","toType":"Month","type":"","displayName":"E0","enNodeKey":"epoch_2_encounters_E0_6173pcajj8w"},{"encounterName":"BloodDrop Encounter2","encounterDesc":"BloodDrop Encounter2","fromVisit":"3","toVisit":"21","fromType":"Days","toType":"Days","type":"","displayName":"E1","enNodeKey":"epoch_2_encounters_E1_v9y0jjeb6lb"}],"position":{"left":922,"top":122},"nodeKey":"epoch_2"}]

 
     const  arrowCommon = { foldback: 0.7,  width: 14,events:{
         click:function() {}
     } };
      this.connectOverlays = [
             [ "Arrow", { location: 0.7 }, arrowCommon ,],
             [ "Label", {
                 location: [0.5, 1.5],
                 visible:true,
                 id: "label",
                 cssClass: "aLabel",
                 events:{
                     tap:function() { }
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
             maxConnections: 1,
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
         maxConnections: 1,
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


     this.connectionEndpointConfig = {
         endpoint: ["Dot", { radius: 11 }],
         paintStyle: { fill: "#691e44" },
         isSource: true,
         scope: "green",
         // connectorStyle: { stroke: color2, strokeWidth: 3},
         // connector: ["Bezier", { curviness: 63 } ],
         maxConnections: -1,
         isTarget: true,
         dropOptions: dropOptionsConfig,
         beforeDrop: function (params) {

             if(params.sourceId==params.targetId){
                 return false;
             }

             return  true;
         },
       };


      // this.epochDetailsPopUpCickHandler = this.epochDetailsPopUpCickHandler.bind(this);

     }

     //initlize the jsplumb setup
     componentDidMount(){
      this.initPreviewJSplumb(this);
        }

        initPreviewJSplumb(currentStateRef){


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


        this.jsPlumbInstance = instance;
                //start end setting
                this.allEndPoints["startWindow"]=  instance.addEndpoint(document.getElementById("startWindow"), this.start_config);
                this.allEndPoints["endWindow"] =  instance.addEndpoint(document.getElementById("endWindow"), this.end_config);

        // make .window divs draggable
        instance.draggable(jsplumb.jsPlumb.getSelector(".protocol-setup-container .protocol-epoch"));
        var parentMain  = document.getElementById('canvas');
        
        

        this.state.setupData.map( (epData,idx)=>{

            var el = document.createElement("div");
            el.setAttribute("id", epData.nodeKey);
            el.style.left = epData.position.left+"px";
            el.style.top = epData.position.top+"px";
            el.className = "col-auto border mr-4 p-3  mt-3 protocol-epoch";
            el.innerHTML = `<div class="col-12 p-0 d-flex justify-content-between border-bottom-p-dotted pb-2 mb-3">
            <h5 class=" col-auto p-0 c-p" id="${epData.nodeKey}_title">${epData.name}</h5>
            <div class="d-flex flex-row col-auto p-0 justify-content-between pt-1">
                <button class="glyphicon glyphicon-edit pr-2 c-p protocol-setup-btn"  ></button>
                <button class="glyphicon glyphicon-remove c-p protocol-setup-btn" ></button>
            </div>
        </div>
        <div class="py-4" id="epoch_${idx}_encounters"></div>
        <div> <button class="glyphicon glyphicon-plus protocol-setup-btn" ></button></div>
        `;

        document.getElementById('canvas').appendChild(el);

       // setTimeout( ()=>{  },20 );
           // console.log(this.jsPlumbInstance);
            this.allEndPoints[el.id] = [
                this.jsPlumbInstance.addEndpoint(el, { anchor: "LeftMiddle",connectorOverlays:this.connectOverlays   }, this.connectionEndpointConfig),
                this.jsPlumbInstance.addEndpoint(el, { anchor: "RightMiddle",connectorOverlays:this.connectOverlays   }, this.connectionEndpointConfig)

            ]

            this.jsPlumbInstance.draggable(el);


        })


        
        setTimeout( ()=>{

        try{


            
                // this.jsPlumbInstance.connect({
                //     source: this.allEndPoints["startWindow"],
                //     target: this.allEndPoints["epoch_1"][0]
                // });

                // this.jsPlumbInstance.connect({
                //     source: this.allEndPoints["epoch_1"][1],
                //     target: this.allEndPoints["epoch_2"][0]
                // });

                // this.jsPlumbInstance.connect({
                //     source: this.allEndPoints["epoch_2"][1],
                //     target: this.allEndPoints["endWindow"]
                // });


                this.state.setupData.map( (ep,idx)=>{

                        ep.parent.map( (c,io)=>{
                            const pcCon = this.jsPlumbInstance.select({source:ep.nodeKey, target:c});
                            const cpCon = this.jsPlumbInstance.select({source:c, target:ep.nodeKey});

        // this.jsPlumbInstance.select({source:et.component.source.id, target:et.component.target.id}) this.jsPlumbInstance.getAllConnections()

                            if( (pcCon && pcCon.length>0) || (cpCon && cpCon.length>0) ){

                            }
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



            //giving manully connection
            // this.jsPlumbInstance.connect({uuids:["chartWindow3-bottom", "chartWindow6-top" ]

            // });



                // this.jsPlumbInstance.connect({
                //     source: this.allEndPoints["epoch_2"][1],
                //     target: this.allEndPoints["endWindow"]
                // });

                //this.jsPlumbInstance.repaintEverything();










        }


        render(){

            return(

            <div>

                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                        </ol>
                    </nav>

                    <section className="baseline-container">
                    <div className="border p-3 m-0 row justify-content-between">
                        <div className="row col-12 justify-content-between border-bottom-dotted m-0 mb-3 pb-2 px-0">
                            <div className="col-5 p-0">
                                <h5 className=" c-p">Protocol Preview</h5>
                            </div>
                    </div>


                      <SetupComponent />


                    </div>

                    </section>

           </div>


            )

        }
}

export default PreviewSetup;