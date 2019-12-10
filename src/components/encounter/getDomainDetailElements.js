/**
* Copyright (c) 2018
* @summary Add filter according to custom options
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import common from '../../../src/common/common';
import GenerateHtml from '../generateHtml/generatehtml';
import TableView from '../generate-table/UserFormTable';
import ReactSuperSelect from 'react-super-select';
import '../../../node_modules/react-super-select/lib/react-super-select.css';
import ApiService from '../../api';
import { NotificationManager } from 'react-notifications';
import * as modalAction from '../../actions/modalActions';
import * as patientInfo from '../../actions/getPatientInfo';
import { MODAL_TYPE_REMAINING_ELEMENT,MODAL_TYPE_CONFIRM_POPUP } from '../../constants/modalTypes';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ICF from '../encounter/icf';
import _ from 'lodash';
import DateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import Common from '../../../src/common/common';
import ReviewPI from '../encounter/reviewPI';
import CommentTemplate from '../encounter/commentTemplate';
import { isNullOrUndefined } from 'util';
var toDay = DateTime.moment();
var valid = function( current ){
    return current.isBefore( toDay );
};

const formValidationType = ["show/hide"]
const EDIT_CHECK_DOMAINS = ["AE","CE","CM","DA","DV","DE","IE","VS","PR"]
const customClassObject = {
    'textbox' : {
        containerClass : '',
        elementClass : 'form-control select-width'
    },
    'dropdown': {
        containerClass : '',
        elementClass : 'form-control select-width'
    },
    'date': {
        containerClass : '',
        elementClass : ''
    },
    'radio': {
        containerClass : '',
        elementClass : 'col-md-8 col-lg-8 col-xs-12 p-0'
    },
    'textarea': {
        containerClass : '',
        elementClass : 'form-control'
    },
    'time': {
        containerClass : '',
        elementClass : 'col-xs-12 p-0'
    },
    'checkbox': {
        containerClass : '',
        elementClass : ''
    },
    'label': {
        containerClass : '',
        elementClass : ''
    },
    'file' : {
        containerClass : 'file btn btn-default',
        elementClass : 'select-width custom-file-input'
    },
    'reminder' : {
        containerClass : 'col-md-12 ml-0 position-relative pl-0',
        elementClass : ''
    }
}


class GetDomainDetailElements extends Component {

    constructor(props){
        super(props);
       // this.child = React.createRef();
        this.state = {
            startDate :'',
            inputs:{},
            jsonForSave:[],
            whenDidDateFlag:false,
            personnaName:personnaName,
            fillDate:null,
            selectedPersonna:"",
            tableViewData:[],
            tableFilledData:[],
            fileList:[],
            patientEncounterFormGroupIdentifier:"",
            formBackupData:"",
            whoCdashList:[],
            hasTableView:false,
            additionNotes:"",
            additionNotesId:"",
            commentsWhen:'',
            commentsWho:'',
            formValidationRules:"",
            fullResponse:"",
            hasComments:false,
            deleteArray : [],
            currentProtocolIdentifer:null,
            allResponseData:[],
            otherResponse:"",
            hasTableType:false,
            editedRowType:""
        }
        this.saveFormJson = {}
        this.editCheckErrorMsg ="";
        this.tempDeleteArray=[]

    }

    getSaveJSONInfo(){
     return    {
        "answerStatus": 0,
        "attributeValue": "",
        "comments": "",
        "elementEncounterIdentifier": "",
        "meausrementvalue": "",
        "performedStatus":4,
        "tableview": 0

        }
    }

    onBackButtonEvent = (e) => {
        e.preventDefault();
        this.goBack();
    }


    componentDidMount(){
        window.onpopstate = this.onBackButtonEvent;

        ApiService.getPersonnelName(this.props.match.params.patDetailIdentity).then((res) => {
            res && res.data.response.length && res.data.response.forEach((d) => {
                d.name = d.name;//`${d.lastName},${d.firstName}`
                d.id=d.uniqueIdentifier;
            })
            this.setState({ whoCdashList: res.data.response, whenCdashList: [] })
            this.loadFormDataSet();
        }, (error) => {
            this.loadFormDataSet();
            common.clearNotification();
           // NotificationManager.error('Something Went Wrong');
        });


    }

    componentWillUnmount() {
        window.onpopstate = null;
    }


    //get current protocol key
    getCurrentProtocolKey = (paramsSet)=>{
        let retIden = null;
        if(this.state.currentProtocolIdentifer){
            retIden =   this.state.currentProtocolIdentifer;
        }
        else{
            if(paramsSet && paramsSet.data &&  paramsSet.data.hasOwnProperty("custommessages") &&   paramsSet.data.custommessages && paramsSet.data.custommessages.hasOwnProperty("current") &&   paramsSet.data.custommessages.current){
                retIden =  paramsSet.data.custommessages.current
            }
            else if(paramsSet.data && paramsSet.data.response && Object.keys(paramsSet.data.response).length){
                retIden =   Object.keys(paramsSet.data.response)[0];

            }
        }
        return retIden;
    }

    loadFormDataSet(){
        let parametes = {
            uniqueIdentifier : this.props.match.params &&  this.props.match.params.uniqIdenfier,
            elementIdentifier: this.props.match.params &&  this.props.match.params.elementFormIdenfier
          }
          this.setState({tableViewData:[]})
          ApiService.getEncounterDetailsItemGroup(parametes).then((res) => {

            this.props.patientInfo &&  this.props.patientInfo.patientInfoAction(res && res.data && res.data.userInfoResponse);

            this.setState({allResponseData: JSON.stringify(res.data.response) ,otherResponse:res.data.hasOwnProperty("custommessages") && res.data.custommessages })
            if(res.data &&  res.data.hasOwnProperty("custommessages") &&   res.data.custommessages && res.data.custommessages.hasOwnProperty("current") &&   res.data.custommessages.current){
                this.setState({currentProtocolIdentifer:res.data.custommessages.current})
            }

            //checking if
           if(res.data  && res.data.response.hasOwnProperty("form")  && res.data.response.form &&  res.data.response.form.hasOwnProperty("listOfComments") ){
               // this.setState({additionNotes:dataSet.formDefinition.comments});
                    if(res.data.response.form &&  res.data.response.form.hasOwnProperty("whenDiditInCdash") && res.data.response.form["whenDiditInCdash"]
                    ){
                        this.setState({fillDate: res.data.response.form["whenDiditInCdash"]})
                    }
                    if( res.data.response.form &&  res.data.response.form.hasOwnProperty("whoDiditInCdash") && res.data.response.form["whoDiditInCdash"]){
                        let temRes =  this.state.whoCdashList && this.state.whoCdashList.filter( (r)=>{return r.id ===  res.data.response.form["whoDiditInCdash"]})
                        this.setState({selectedPersonna:temRes.length ? temRes[0] : null})
                    }
                    else{
                        if( res.data.response && res.data.response.hasOwnProperty("itemDefination") && res.data.response.itemDefination && res.data.response.itemDefination.length>0 ){
                            //res.data.response.itemDefination.length>0
                            if( (res.data.response.itemDefination[0]).hasOwnProperty("formData") && res.data.response.itemDefination[0]["formData"].length  ){

                                let tmpDtCval= res.data.response.itemDefination[0]["formData"];
                                if(tmpDtCval[tmpDtCval.length-1] && (tmpDtCval[tmpDtCval.length-1]).hasOwnProperty("pateintEncounterFieldResponse") &&
                               (tmpDtCval[tmpDtCval.length-1]["pateintEncounterFieldResponse"]).hasOwnProperty("COVAL")

                            ){
                              let whnDidIt =   tmpDtCval[tmpDtCval.length-1]["pateintEncounterFieldResponse"]["COVAL"]["whenDiditInCdash"] ? tmpDtCval[tmpDtCval.length-1]["pateintEncounterFieldResponse"]["COVAL"]["whenDiditInCdash"] : null;
                              let whoDidIt =   tmpDtCval[tmpDtCval.length-1]["pateintEncounterFieldResponse"]["COVAL"]["whenDiditInCdash"] ? tmpDtCval[tmpDtCval.length-1]["pateintEncounterFieldResponse"]["COVAL"]["whoDiditInCdash"] : null;

                              let temRes =   whoDidIt && this.state.whoCdashList && this.state.whoCdashList.filter( (r)=>{return r.id === whoDidIt})
                                    this.setState({selectedPersonna:temRes && temRes.length ? temRes[0] : null,fillDate:whnDidIt})
                            }
                            }
                        }
                    }
                    this.setState({  hasTableView:true,inputs:res.data.response.form,allResponseData:JSON.stringify(res.data.response)});

            }
            else{

                 // let serviceResponse =
           // let resKey =  this.getCurrentProtocolKey(res);
            let dataSet = res.data.response &&  res.data.response.itemDefination.length && res.data.response.itemDefination[res.data.response.itemDefination.length-1];

            this.setState({fullResponse:dataSet}) //dataSet res.data.response
          if(res.data.response && dataSet && dataSet.formDefinition.labelList && Object.keys(dataSet.formDefinition.labelList).length){
            let formatItemList =  Common.getSortedBySequenceFields(dataSet.formDefinition.labelList);
            dataSet.formDefinition.labelList = this.sortItemList(formatItemList)
            dataSet.formDefinition.columnList.length>0 ? this.setState({  hasTableView:true}) : ""
            //hasTableType elementIcon
            this.setState({formBackupData: JSON.stringify(dataSet.formDefinition),formValidationRules:res.data.response && dataSet.formValidation},()=>{
                if( dataSet.formDefinition.elementIcon && dataSet.formDefinition.elementIcon==="Table"){
                        this.setState({hasTableType:true})
                }
            })
            if(dataSet.formData && Object.keys(dataSet.formData).length>0){
                this.questionsAnsMapping(dataSet,dataSet.formData,dataSet.fileList,res.data.response);
            }else{
               // let idx = _.findIndex(dataSet.form.labelList,(o)=>{return o.inputType==="reminder"})
                //let lblIdx =  _.findIndex(dataSet.form.labelList,(o)=>{return o.inputType==="label"})
                //filter the reminder  element
                let filterReminder = dataSet.formDefinition.labelList.filter((r)=>{return r.inputType==="reminder"});
                if(filterReminder.length){
                    let prevSvDt = this.state.jsonForSave;
                    filterReminder.forEach((rmDt,rmIdx)=>{
                        let jsInfo = this.getSaveJSONInfo()
                        jsInfo.answerStatus = 1;
                        jsInfo.attributeValue="reminder"
                        jsInfo.elementEncounterIdentifier= rmDt["uniqueIdentifier"] ;
                        jsInfo.performedStatus =1;
                        jsInfo.tableview  =   dataSet.formDefinition.columnList !== null && dataSet.formDefinition.columnList.length > 0  ?   1 : 0
                        prevSvDt.push(jsInfo);
                        //setting question value
                        let ix = _.findIndex(dataSet.formDefinition.labelList,(o)=>{return o.uniqueIdentifier=== rmDt["uniqueIdentifier"]});
                        if(ix>-1){
                            dataSet.formDefinition.labelList[ix]["inputValue"]  = "reminder";
                        }
                    })
                    this.setState({jsonForSave:prevSvDt})
                }
                let filterLabel = dataSet.formDefinition.labelList.filter((r)=>{return r.inputType==="label"});
                if(filterLabel.length){
                    let prevSvDt = this.state.jsonForSave;
                    filterLabel.forEach((lblDt,lblIdx)=>{
                        let jsInfo = this.getSaveJSONInfo()
                        jsInfo.answerStatus = 1;
                        jsInfo.attributeValue= lblDt["inputValue"]  ? lblDt["inputValue"]  : "label"
                        jsInfo.elementEncounterIdentifier= lblDt["uniqueIdentifier"] ;
                        jsInfo.performedStatus =1;
                        jsInfo.tableview  =   dataSet.formDefinition.columnList !== null && dataSet.formDefinition.columnList.length > 0  ?   1 : 0
                        prevSvDt.push(jsInfo);
                        //setting question value
                        let ilblx = _.findIndex(dataSet.formDefinition.labelList,(o)=>{return o.uniqueIdentifier=== lblDt["uniqueIdentifier"]});
                        if(ilblx>-1){
                            dataSet.formDefinition.labelList[ilblx]["inputValue"]  ? dataSet.formDefinition.labelList[ilblx]["inputValue"]  : "label"
                        }
                    })
                    this.setState({jsonForSave:prevSvDt})
                }

                let filterLabelLong = dataSet.formDefinition.labelList.filter((r)=>{return r.inputType==="textBlockLong"});
                if(filterLabelLong.length){
                    let prevSvDt = this.state.jsonForSave;
                    filterLabelLong.forEach((lblDt,lblIdx)=>{
                        let jsInfo = this.getSaveJSONInfo()
                        jsInfo.answerStatus = 1;
                        jsInfo.attributeValue= lblDt["inputValue"]  ? lblDt["inputValue"]  : "textBlockLong"
                        jsInfo.elementEncounterIdentifier= lblDt["uniqueIdentifier"] ;
                        jsInfo.performedStatus =1;
                        jsInfo.tableview  =   dataSet.formDefinition.columnList !== null && dataSet.formDefinition.columnList.length > 0  ?   1 : 0
                        prevSvDt.push(jsInfo);
                        //setting question value
                        let ilblx = _.findIndex(dataSet.formDefinition.labelList,(o)=>{return o.uniqueIdentifier=== lblDt["uniqueIdentifier"]});
                        if(ilblx>-1){
                            dataSet.formDefinition.labelList[ilblx]["inputValue"]  = dataSet.formDefinition.labelList[ilblx]["inputValue"]  ? dataSet.formDefinition.labelList[ilblx]["inputValue"]  : "textBlockLong"
                        }
                    })
                    this.setState({jsonForSave:prevSvDt})
                }
                this.setState({ inputs: res && res.data && res.data.response && dataSet.formDefinition,
                    hasTableView: res.data.response&& res.data.response.columnList &&  res.data.response.columnList.length ? true : false
                    },()=>{});
            }
        }else{

            //for reviewPi , reviewSm and Elligo Icf
    let resKey = res.data && res.data.response && Object.keys(res.data.response).length ?  Object.keys(res.data.response)[0] : null ;

          let dataSet = res.data.response && res.data.response.itemDefination &&  res.data.response.itemDefination[0] ; //[resKey];
            let editData = res.data && res.data.response && dataSet.formData;
            if( editData && editData.length && editData[0].hasOwnProperty("pateintEncounterFieldResponse") ){
                let objKeys = Object.keys(editData[0]["pateintEncounterFieldResponse"]);
                if(editData[0]["pateintEncounterFieldResponse"][objKeys[0]].hasOwnProperty("whenDiditInCdash")
                ){
                    this.setState({fillDate:editData[0]["pateintEncounterFieldResponse"][objKeys[0]]["whenDiditInCdash"]})
                }
                if(editData[0]["pateintEncounterFieldResponse"][objKeys[0]]["whoDiditInCdash"]){
                    let temRes =  this.state.whoCdashList && this.state.whoCdashList.filter( (r)=>{return r.id === editData[0]["pateintEncounterFieldResponse"][objKeys[0]]["whoDiditInCdash"]})
                    this.setState({selectedPersonna:temRes[0]})
                }
                this.setState({
                    additionNotes: editData[0]["pateintEncounterFieldResponse"]["COVAL"]["attributeValue"]
                })
            }
            this.setState({ inputs: res && res.data && res.data.response && dataSet.formDefinition},()=>{});
        }

            }



        });
    }

    //for ordering elements
    sortItemList(data){
        return common.sortByOrder(data,"ASC");
    }

    //map the questions ans
    questionsAnsMapping(dataset,qsData,fileList,allResponse){
         try{
            let tempDtArr = [];
            //tableViewData formDefinition dataset.formDefinition.columnList.length>0
            if( allResponse && allResponse.columnList && allResponse.columnList.length>0){
                let prevTblArr = this.state.tableViewData;
                //allResponse.tableData

                this.setState({tableViewData:allResponse.tableData,
                    inputs:  dataset.formDefinition,
                    tableFilledData:dataset.formData,
                    fileList : dataset.fileList,
                    hasTableView:true },()=>{
                })

            }else{
                if(dataset && dataset.formDefinition){
                    dataset.formDefinition.labelList.forEach( (qlist,qidx)=>{ //elementEncounterIdentifier
                        if(qlist && qlist.inputType && qlist.inputType === 'file'){
                            qlist.inputValue = '';
                            //qlist.downLoadUrl = fileList.length && fileList[0][qlist.uniqueIdentifier];
                            qlist.fileList = [];
                            fileList.forEach((item,index)=>{
                                if(qsData.length && qsData[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier].elementEncounterIdentifier == item.attributeIdentifier){
                                    qlist.fileList.push(item);
                                }
                            });
                        }else{
                            qlist.inputValue = qsData.length && qsData[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier] ?  qsData[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier]["attributeValue"] : ""
                        }
                        qlist.measurementValue = qsData.length &&   qsData[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier] ?  qsData[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier]["meausrementvalue"] : ""
                        if(qsData[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier]!=undefined ){

                            if( qsData[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier]["performedStatus"] &&   qsData[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier]["performedStatus"]!=4 || qsData[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier]["performedStatus"]!=1){
                                qlist.ansComments  =  qsData[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier] ?  qsData[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier]["comments"] : ""
                                qlist.ansStatus =  qsData[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier] ?  qsData[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier]["performedStatus"] : ""
                            }
                            }
                            //for multiselect
                            if(qlist.hasOwnProperty("codeDefinationList") &&
                            qlist["codeDefinationList"].length>0 &&
                            qlist["codeDefinationList"][0]["inputType"]=="multiselect"
                        ){
                            //multiValues
                            if(qsData[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier]!=undefined && qsData[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier]["isMultiOne"] && qsData[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier]["multiValues"] ){
                                qlist.inputValue =  JSON.stringify(qsData[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier]["multiValues"])
                            }
                        }
                        //for radio template
                        if(qlist.hasOwnProperty("codeDefinationList") &&
                        qlist["codeDefinationList"].length>0 &&
                        qlist["codeDefinationList"][0]["inputType"]=="radio"
                        ){
                            qlist.inputValue  = qsData[0]["pateintEncounterFieldResponse"] &&  qsData[0]["pateintEncounterFieldResponse"].hasOwnProperty(qlist.uniqueIdentifier) && qsData[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier]["attributeValue"] ?   this.getRadioCodeFromValue(qsData[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier]["attributeValue"]) : 0
                        }
                    })
                    for(var p in qsData[0]["pateintEncounterFieldResponse"]){
                        tempDtArr.push(qsData[0]["pateintEncounterFieldResponse"][p])
                    }
                    this.setState({ inputs:  dataset.formDefinition,jsonForSave:tempDtArr,
                        patientEncounterFormGroupIdentifier:qsData[0]["fromGroupIdentifier"]
                    },()=>{});

                    //extract  the  coval value
                    //additionNotesId
                    //additionNotes

                    if(qsData[0]["pateintEncounterFieldResponse"].hasOwnProperty("COVAL")){
                       // qsData[0]["pateintEncounterFieldResponse"]
                        this.setState({additionNotes: qsData[0]["pateintEncounterFieldResponse"]["COVAL"]["attributeValue"],
                              additionNotesId: { patient_encounter_form_identifier: qsData[0]["pateintEncounterFieldResponse"]["COVAL"]["patient_encounter_form_identifier"],
                                patientEncounterKey : qsData[0]["pateintEncounterFieldResponse"]["COVAL"]["patientEncounterKey"] }
                         })
                    }
                }
            }
            //  jsonForSave
            if( qsData && qsData.length && qsData[0].hasOwnProperty("pateintEncounterFieldResponse") ){
                let objKeys = Object.keys(qsData[0]["pateintEncounterFieldResponse"]);
                if(qsData[0]["pateintEncounterFieldResponse"][objKeys[0]].hasOwnProperty("whenDiditInCdash")
                ){
                    this.setState({fillDate:qsData[0]["pateintEncounterFieldResponse"][objKeys[0]]["whenDiditInCdash"]})
                }
                if(qsData[0]["pateintEncounterFieldResponse"][objKeys[0]]["whoDiditInCdash"]){
                    let temRes =  this.state.whoCdashList && this.state.whoCdashList.filter( (r)=>{return r.id === qsData[0]["pateintEncounterFieldResponse"][objKeys[0]]["whoDiditInCdash"]})
                    this.setState({selectedPersonna:temRes.length ?  temRes[0] : null })
                }
            }
        }catch(e){ console.log(e) }
    }

    onChangeTextHandler = (e,formLabelId,oid,questionData) =>{
        const prevSt = this.state.inputs;
        let qIndex = _.findIndex( prevSt.labelList, (o)=>{return questionData.uniqueIdentifier === o.uniqueIdentifier});
        if(qIndex>-1){
           let uid = prevSt.labelList[qIndex]["uniqueIdentifier"];
           prevSt.labelList[qIndex]["inputValue"] = e.target.value
            //check for questions ans has  alrady giver
            if(prevSt.labelList[qIndex].hasOwnProperty("ansStatus") && (e.target.value).trim()==""){
                prevSt.labelList[qIndex]["ansStatus"] = 4;
            }
             //setting question answers
            const prevSaveJson = this.state.jsonForSave;
            let checkForEle = _.findIndex(prevSaveJson,(r)=>{return r.elementEncounterIdentifier === prevSt.labelList[qIndex]["uniqueIdentifier"]});
            if(checkForEle>-1){
                prevSaveJson[checkForEle]["attributeValue"]  = e.target.value
                prevSaveJson[checkForEle]["comments"]  = ""
                prevSaveJson[checkForEle]["performedStatus"]  = 1
                prevSaveJson[checkForEle]["answerStatus"]  = (e.target.value).trim() ? 1 : 0;
                prevSaveJson[checkForEle]["attributeType"] = 'field';
            }else{
                    let qinfo = this.getSaveJSONInfo();
                    qinfo.attributeValue  = e.target.value
                    qinfo.performedStatus = 1;
                    qinfo.answerStatus = (e.target.value).trim() ? 1 : 0;
                    qinfo.elementEncounterIdentifier  = uid;
                    qinfo.comments = "";
                    qinfo.tableview  = questionData.isTable ? 1 : 0
                    qinfo["attributeType"] = 'field'
                    prevSaveJson.push(qinfo)
            }
            this.setState({jsonForSave:prevSaveJson,inputs:prevSt});
        }
    }

	onChangeDropDownHandler = (options,formLabelId,oid,questionData) =>{
        try{
            const prevSt = this.state.inputs
            let hasMesurement = false;
            let qIndex = _.findIndex( prevSt.labelList, (o)=>{return questionData.uniqueIdentifier === o.uniqueIdentifier});
            if(qIndex>-1){
               let uid = prevSt.labelList[qIndex]["uniqueIdentifier"];
               let selOptValue="";
               //for multiselect
                if(prevSt.labelList[qIndex].hasOwnProperty('codeDefinationList') &&
                 prevSt.labelList[qIndex]["codeDefinationList"].length > 0 &&
                 prevSt.labelList[qIndex]["codeDefinationList"][0]["inputType"]=="multiselect"){
                    let mltOpt = "";
                    let tmpAr = []
                    options && options.length && options.forEach( (mobj,midx)=>{
                        mltOpt+=((mobj.decode || mobj.name) ?  mobj.decode || mobj.name : "") +"$$###$$"
                        tmpAr.push(((mobj.decode || mobj.name) ?  mobj.decode || mobj.name : ""))
                    })
                    selOptValue = mltOpt;
                    prevSt.labelList[qIndex]["inputValue"] = JSON.stringify(tmpAr) //mltOpt;
                }
                //for singleselect drop down
                if(prevSt.labelList[qIndex].hasOwnProperty('codeDefinationList') &&
                 prevSt.labelList[qIndex]["codeDefinationList"].length > 0 &&
                 prevSt.labelList[qIndex]["codeDefinationList"][0]["inputType"]=="dropdown"){
                    selOptValue = options && (options.decode || options.name) ?  options.decode || options.name : "" ;
                    prevSt.labelList[qIndex]["inputValue"] = selOptValue;
                 }
                if(prevSt.labelList[qIndex].hasOwnProperty('measurementDefinitionList') && prevSt.labelList[qIndex].measurementDefinitionList.length > 0){
                    prevSt.labelList[qIndex]["inputValue"] = options && (options.decode || options.name) ? options.decode || options.name : "" ;
                    hasMesurement =  true;
                }
                //setting question answers
                const prevSaveJson = this.state.jsonForSave;
                let checkForEle = _.findIndex(prevSaveJson,(r)=>{return r.elementEncounterIdentifier === prevSt.labelList[qIndex]["uniqueIdentifier"]});
                if(checkForEle>-1){
                    prevSaveJson[checkForEle]["attributeValue"]  = !hasMesurement ?  selOptValue : '' ;
                    prevSaveJson[checkForEle]["comments"]  = ""
                    prevSaveJson[checkForEle]["meausrementvalue"]  = hasMesurement ? options && (options.decode || options.name) : '' ;
                    prevSaveJson[checkForEle]["performedStatus"]  = 1;
                    prevSaveJson[checkForEle]["attributeType"] = 'field';
                }else{
                    let qinfo = this.getSaveJSONInfo();
                    qinfo.attributeValue  = !hasMesurement ? selOptValue : '' ;
                    qinfo.performedStatus = 1;
                    qinfo.answerStatus =1
                    qinfo.elementEncounterIdentifier  = uid;
                    qinfo.comments = "";
                    qinfo.meausrementvalue = hasMesurement ? (options.decode || options.name) : '' ;
                    qinfo.tableview  = questionData.isTable ? 1 : 0;
                    qinfo["attributeType"] = 'field';
                    prevSt.columnList !== null && prevSt.columnList.length > 0  ?   1 : 0
                    prevSaveJson.push(qinfo)
                }
                this.setState({jsonForSave:prevSaveJson,inputs:prevSt});
            }
        }catch(e){ console.log(e) }
    }

    onDateChangeHandler = (e,formLabelId,oid,questionData) =>{
       try{
            const prevSt = this.state.inputs
            let qIndex = _.findIndex( prevSt.labelList, (o)=>{return questionData.uniqueIdentifier === o.uniqueIdentifier});
            if(qIndex>-1){
                let uid = prevSt.labelList[qIndex]["uniqueIdentifier"];
                prevSt.labelList[qIndex]["inputValue"] = common.formatDate(e._d);
                //setting question answers
                const prevSaveJson = this.state.jsonForSave;
                let checkForEle = _.findIndex(prevSaveJson,(r)=>{return r.elementEncounterIdentifier === prevSt.labelList[qIndex]["uniqueIdentifier"]});
                if(checkForEle>-1){
                    prevSaveJson[checkForEle]["attributeValue"]  = common.formatDate(e._d);
                    prevSaveJson[checkForEle]["comments"]  = "";
                    prevSaveJson[checkForEle]["performedStatus"]  = 1;
                    prevSaveJson[checkForEle]["attributeType"]  = 'field';
                }else{
                        let qinfo = this.getSaveJSONInfo();
                        qinfo.attributeValue  = common.formatDate(e._d);
                        qinfo.performedStatus = 1;
                        qinfo.answerStatus =1
                        qinfo.elementEncounterIdentifier  = uid;
                        qinfo.comments = "";
                        qinfo.tableview  = questionData.isTable ? 1 : 0;
                        qinfo["attributeType"] = 'field';
                        //qinfo.tableview  =   prevSt.columnList !== null && prevSt.columnList.length > 0  ?   1 : 0
                        prevSaveJson.push(qinfo)
                    }
                this.setState({jsonForSave:prevSaveJson,inputs:prevSt});
            }
        }catch(e){ console.log(e) }
    }

   deleteFile = (questionData,item,index)=>{
        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_CONFIRM_POPUP,{
            onOkay : () => {
                let obj = {
                        uniqueIdentifier : item.uniqueIdentifier ? item.uniqueIdentifier : ''
                }
                let prevSt =  this.state.inputs;
                let qIndex = _.findIndex( prevSt.labelList, (o)=>{return questionData.uniqueIdentifier === o.uniqueIdentifier});
                if(qIndex>-1){
                    let uid = prevSt.labelList[qIndex]["uniqueIdentifier"];
                    this.tempDeleteArray.push(item.uniqueIdentifier);
                    prevSt.labelList[qIndex].fileList.splice(index,1);
                    //common.clearNotification();
                   // NotificationManager.success("File Deleted Successfully");
                    this.setState({
                        inputs : prevSt,
                        deleteArray : this.tempDeleteArray
                    });
                }
            },
            hideModal : ()=>{ this.props.modalAction.hideModal(); },
            className:'confirm-modal',
            displayText : 'Are you sure you want to delete this file?'
        });

   }

    //for file change handeler
    onChangeFileHandler  = (e,itm,questionData)=>{
        const prevSt = this.state.inputs;
        let self = this;
        let reader = new FileReader();
        let file = e.target.files[0];
        e.target.value = '';
        reader.onload = function(upload) {
            let data = upload.target.result && upload.target.result.split(',');
            let qIndex = _.findIndex( prevSt.labelList, (o)=>{return questionData.uniqueIdentifier === o.uniqueIdentifier});
            if(qIndex>-1){
               let uid = prevSt.labelList[qIndex]["uniqueIdentifier"];
               prevSt.labelList[qIndex]["inputValue"] = file.name;

                // if(prevSt.labelList[qIndex].hasOwnProperty("ansStatus") && (e.target.value).trim()==""){
                //     prevSt.labelList[qIndex]["ansStatus"] = 4;
                // }
                //setting question answers
                const prevSaveJson = self.state.jsonForSave;
                let checkForEle = _.findIndex(prevSaveJson,(r)=>{return r.elementEncounterIdentifier === prevSt.labelList[qIndex]["uniqueIdentifier"]});
                if(checkForEle>-1){
                    prevSaveJson[checkForEle]["attributeValue"]  = data[1]
                    prevSaveJson[checkForEle]["attributeType"] = 'file'
                    prevSaveJson[checkForEle]["extraAttributeValues"] = {
                        name : file && file.name,
                        type : file && file.type
                    }
                    prevSaveJson[checkForEle]["comments"]  = "";
                    prevSaveJson[checkForEle]["performedStatus"]  = 1;
                    prevSaveJson[checkForEle]["answerStatus"]  = 1;
                }else{
                    let qinfo = self.getSaveJSONInfo();
                    qinfo.attributeValue  = data[1]
                    qinfo.performedStatus = 1;
                    qinfo.answerStatus = 1;
                    qinfo.elementEncounterIdentifier  = uid;
                    qinfo.comments = "";
                    qinfo.tableview  = questionData.isTable ? 1 : 0
                    qinfo["attributeType"] = 'file'
                    qinfo["extraAttributeValues"] = {
                        name : file && file.name,
                        type : file && file.type
                    }
                    prevSaveJson.push(qinfo)
                }
                self.setState({jsonForSave:prevSaveJson,inputs:prevSt});
                // self.setState({
                //     fileUploadUrl: data[1],
                //     fileUploadName : file.name
                // });
            }
        };
        file && reader.readAsDataURL(file);
    }

    onCloseSelectedFile = (questionData)=>{
        const prevSt = this.state.inputs;
        let qIndex = _.findIndex( prevSt.labelList, (o)=>{return questionData.uniqueIdentifier === o.uniqueIdentifier});
        const prevSaveJson = this.state.jsonForSave;
        if(qIndex>-1){
            prevSt.labelList[qIndex]["inputValue"] = '';
            let checkForEle = _.findIndex(prevSaveJson,(r)=>{return r.elementEncounterIdentifier === prevSt.labelList[qIndex]["uniqueIdentifier"]});
            if(checkForEle>-1){
                prevSaveJson[checkForEle]["attributeValue"]  = '';
                prevSaveJson[checkForEle]["attributeType"] = '';
                prevSaveJson[checkForEle]["extraAttributeValues"] = {};
                prevSaveJson[checkForEle]["multiValues"] = []
            }
        }
        this.setState({jsonForSave:prevSaveJson,inputs:prevSt});
    }

    onChangeRadioHandler = (e,formLabelId,oid,radioVal,questionData)=>{
        try{
            const prevSt = this.state.inputs
            let qIndex = _.findIndex( prevSt.labelList, (o)=>{return questionData.uniqueIdentifier === o.uniqueIdentifier});
            if(qIndex>-1){
                let uid = prevSt.labelList[qIndex]["uniqueIdentifier"];
                if(e.target.checked){
                    prevSt.labelList[qIndex]["inputValue"] = radioVal;
                }else{
                    prevSt.labelList[qIndex]["inputValue"] = 0;
                }
            //setting question answers
            const prevSaveJson = this.state.jsonForSave;
            let checkForEle = _.findIndex(prevSaveJson,(r)=>{return r.elementEncounterIdentifier === prevSt.labelList[qIndex]["uniqueIdentifier"]});
                if(checkForEle>-1){
                prevSaveJson[checkForEle]["attributeValue"]  = this.getRadioCodeValue(prevSt.labelList[qIndex]["inputValue"])
                prevSaveJson[checkForEle]["comments"]  = ""
                if(radioVal==1 || radioVal==2){
                    prevSaveJson[checkForEle]["answerStatus"]  = 1
                    prevSaveJson[checkForEle]["performedStatus"]  = 1
                }else{
                        prevSaveJson[checkForEle]["answerStatus"]  = 0;
                        prevSaveJson[checkForEle]["performedStatus"]  = 4;
                        prevSaveJson[checkForEle]["ansComments"]  = ""
                        prevSt.labelList[qIndex]["ansComments"] = "";
                        prevSt.labelList[qIndex]["ansStatus"] = 4;
                        prevSt.labelList[qIndex]["attributeType"] = 'field';
                    }
                }else{
                    let qinfo = this.getSaveJSONInfo();
                    qinfo.attributeValue  = this.getRadioCodeValue(prevSt.labelList[qIndex]["inputValue"])
                    qinfo.performedStatus = 1;
                    qinfo.answerStatus =1
                    qinfo.elementEncounterIdentifier  = uid;
                    qinfo.comments = "";
                    qinfo["attributeType"] = 'field';
                    qinfo.tableview  = questionData.isTable ? 1 : 0
                    prevSaveJson.push(qinfo)
                }
            this.setState({jsonForSave:prevSaveJson,inputs:prevSt},()=>{

                //validate for the Edit check
            if(this.addRequiredClassOnEditCheckQuestion(questionData.uniqueIdentifier,this.state.formValidationRules)){
                //checkQuestionHasValidValue
               if(!this.checkQuestionHasValidValue(questionData.uniqueIdentifier,radioVal,this.state.formValidationRules)){
                   this.resetEditCheckFormFillValues(questionData.uniqueIdentifier,Object.keys(this.state.formValidationRules),radioVal);
               }else{
                   this.retainOldStatus(questionData.uniqueIdentifier,this.state.formValidationRules,radioVal);
               }
           }
            //END
            });
            }
        }catch(e){ console.log(e)}
    }

    onchangeTimeHandler = (moment,formLabelId,oid,questionData)=>{
       try{
            const prevSt = this.state.inputs
            let qIndex = _.findIndex( prevSt.labelList, (o)=>{return questionData.uniqueIdentifier === o.uniqueIdentifier});
            if(qIndex>-1){
                let uid = prevSt.labelList[qIndex]["uniqueIdentifier"];
                prevSt.labelList[qIndex]["inputValue"] = moment //common.getTimefromDate(moment._d,'24')
                    //setting question answers
                const prevSaveJson = this.state.jsonForSave;
                let checkForEle = _.findIndex(prevSaveJson,(r)=>{return r.elementEncounterIdentifier === prevSt.labelList[qIndex]["uniqueIdentifier"]});
                if(checkForEle>-1){
                    prevSaveJson[checkForEle]["attributeValue"]  = common.getTimefromDate(moment._d,'12')
                    prevSaveJson[checkForEle]["comments"]  = ""
                    prevSaveJson[checkForEle]["performedStatus"]  = 1;
                    prevSaveJson[checkForEle]["attributeType"] = 'field'
                }else{
                        let qinfo = this.getSaveJSONInfo();
                        qinfo.attributeValue  = common.getTimefromDate(moment._d,'12')
                        qinfo.performedStatus = 1;
                        qinfo.answerStatus =1
                        qinfo.elementEncounterIdentifier  = uid;
                        qinfo.comments = "";
                        qinfo.tableview  = questionData.isTable ? 1 : 0;
                        qinfo["attributeType"] = 'field'
                        prevSaveJson.push(qinfo)
                }
                this.setState({jsonForSave:prevSaveJson,inputs:prevSt});
            }
        }catch(e){}
    }

   //return the code value for radio
    getRadioCodeValue(type){
       let codeValue = "NA";
       if(parseInt(type)===1 ){
        codeValue =  "Yes";
       }
       if(parseInt(type)===2 ){
        codeValue =  "No";
       }
       return codeValue;
    }

    //return the code from value
    getRadioCodeFromValue(typeValue){
        let code = 0;
        if( typeValue && typeValue.toLowerCase()==="yes" ){
            code =  1;
        }
        if( typeValue && typeValue.toLowerCase()==="no" ){
            code =  2;
        }
        return code;
    }

    //get the date selection
    getWhenWasDoneDate(){
        if(this.state.fillDate){
            return  this.state.fillDate
        }
        else{
            this.setState({fillDate:moment(new Date()).format("DD/MMM/YYYY")})
            return moment(new Date()).format("DD/MMM/YYYY")
        }
    }

    //validation for popup
    validationForSave(){
       try{
            let validateArr = [];
            this.state.inputs.labelList.forEach( (idata,idx)=>{
                if(idata.inputValue!="" ){
                    validateArr.push(true);
                }
                else{
                    validateArr.push(false);
                }
            })
            if(validateArr.length>0 && validateArr.indexOf(false)>-1){
                return true;
            }else{
                return false;
            }
        } catch(e){}
    }

    onSaveData = ()=>{
        if(this.state.fillDate && this.state.selectedPersonna){

            if(!this.checkFormSubmitValidationRules()){

                if( this.state.inputs && !this.state.inputs.hasOwnProperty("comments")){

                    if(this.validationForSave()){
                        this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_REMAINING_ELEMENT, {
                            onSave: (data) => {

                                  //set the additional comments
                            let additionNote= {
                                answerStatus:1,
                                attributeValue: this.state.additionNotes,
                                comments:this.state.additionNotes,
                                elementEncounterIdentifier:"COVAL",
                                meausrementvalue:"",
                                performedStatus:this.state.additionNotes && this.state.additionNotes.trim().length>0 ? 1 : 4,
                                tableview:0
                                }

                                if(this.state.inputs &&  this.state.inputs.columnList.length>0){
                                    additionNote["tableview"] = 1;
                                }


                            let covalIdx = _.findIndex(data,(u)=>{return u.elementEncounterIdentifier ==='COVAL' });
                            if(covalIdx>-1){
                               // additionNote["patientEncounterKey"] = prevSvJson[covalIdx]["patientEncounterKey"]
                               // additionNote["patient_encounter_form_identifier"] = prevSvJson[covalIdx]["patient_encounter_form_identifier"]
                               data[covalIdx]["attributeValue"] = this.state.additionNotes
                               data[covalIdx]["comments"] = this.state.additionNotes;
                               data[covalIdx]["performedStatus"]  =   this.state.additionNotes && this.state.additionNotes.trim().length>0 ? 1 : 4;

                            }
                            else{
                                data.push(additionNote)
                            }

                                let obj = {
                                    "patientEncounterFormGroupIdentifier":this.state.patientEncounterFormGroupIdentifier ,
                                    "patientEncounterFormIdentifier" :  this.props.match.params.elementFormIdenfier,
                                    "whoDiditInCdash":this.state.selectedPersonna && this.state.selectedPersonna.id,
                                    "whenDiditInCdash":this.state.fillDate,
                                    "attributeList": data,
                                    "hasTableType":this.state.hasTableType,
                                    "tableTitle":this.state.editedRowType
                                }
                            this.saveAllChnagesForElement(obj);
                            },
                            hideModal: () => {
                                this.props.modalAction.hideModal();
                            },
                            className : 'element-remaining-modal',
                            actualFormData : this.state.inputs,
                        //  saveServiceJSON:this.saveFormJson,
                            forSaveForm:this.state.jsonForSave
                        });
                    }else{

                            //set the additional comments
                            let additionNote= {
                                answerStatus:1,
                                attributeValue: this.state.additionNotes,
                                comments:this.state.additionNotes,
                                elementEncounterIdentifier:"COVAL",
                                meausrementvalue:"",
                                performedStatus:this.state.additionNotes && this.state.additionNotes.trim().length>0 ? 1 : 4,
                                tableview:0
                                }

                                if(this.state.inputs &&  this.state.inputs.columnList.length>0){
                                    additionNote["tableview"] = 1;
                                }


                            let  prevSvJson = this.state.jsonForSave;
                            let covalIdx = _.findIndex(prevSvJson,(u)=>{return u.elementEncounterIdentifier ==='COVAL' });
                            if(covalIdx>-1){
                               prevSvJson[covalIdx]["attributeValue"] = this.state.additionNotes
                               prevSvJson[covalIdx]["comments"] = this.state.additionNotes

                               prevSvJson[covalIdx]["performedStatus"] = this.state.additionNotes && this.state.additionNotes.trim().length>0 ? 1 : 4;

                            }
                            else{
                                prevSvJson.push(additionNote)
                            }



                            this.setState({jsonForSave:prevSvJson},()=>{

                                let obj = {
                                    "patientEncounterFormGroupIdentifier": this.state.patientEncounterFormGroupIdentifier ,
                                    "patientEncounterFormIdentifier" : this.props.match.params.elementFormIdenfier,
                                    "whoDiditInCdash": this.state.selectedPersonna && this.state.selectedPersonna.id,
                                    "whenDiditInCdash":this.state.fillDate,
                                    "attributeList": this.state.jsonForSave,
                                    "hasTableType":this.state.hasTableType,
                                    "tableTitle":this.state.editedRowType
                                }
                                this.saveAllChnagesForElement(obj);

                            }

                        )


                    }
                }else{

                      let  additionNote= {
                        answerStatus:1,
                        attributeValue: this.state.additionNotes,
                        comments:this.state.additionNotes,
                        elementEncounterIdentifier:"COVAL",
                        meausrementvalue:"",
                        performedStatus:this.state.additionNotes && this.state.additionNotes.trim().length>0 ? 1 : 4,
                        tableview:0
                        }
                    if(this.state.jsonForSave && this.state.jsonForSave.length>0 && this.state.jsonForSave[0].hasOwnProperty("patientEncounterKey") && this.state.jsonForSave[0]["patientEncounterKey"]){
                        additionNote.patientEncounterKey = this.state.jsonForSave[0]["patientEncounterKey"]
                    }

              let obj = {
                        "patientEncounterFormGroupIdentifier": this.state.patientEncounterFormGroupIdentifier ,
                        "patientEncounterFormIdentifier" : this.props.match.params.elementFormIdenfier,
                        "whoDiditInCdash": this.state.selectedPersonna && this.state.selectedPersonna.id,
                        "whenDiditInCdash":this.state.fillDate,
                        "attributeList": [additionNote],
                        "hasTableType":this.state.hasTableType,
                        "tableTitle":this.state.editedRowType
                    }
                    this.saveAllChnagesForElement(obj);

                }

            }
            else{
                //hide show form condition
                //add code for  verify the conditions for validations

                if(this.validationForFinalEditCheckSubmit(this.state.formValidationRules,this.state.jsonForSave)){
                    let  prevSvJson = this.state.jsonForSave;

                    if(this.state.inputs && this.state.inputs.labelList.length>0){
                        this.state.inputs.labelList.forEach((lblData,lblIdx)=>{

                            //elementEncounterIdentifier
                          let hasDt =   prevSvJson.filter((r)=>{return r.elementEncounterIdentifier === lblData.uniqueIdentifier})
                          if(hasDt.length>0){}
                          else{
                              let rTmpObj = {
                                answerStatus:1,
                                attributeValue: "",
                                comments:"",
                                elementEncounterIdentifier:lblData.uniqueIdentifier,
                                meausrementvalue:"",
                                performedStatus:1,
                                tableview: this.state.inputs.columnList.length > 0 ? 1 : 0
                                }
                            prevSvJson.push(rTmpObj)
                          }
                        })
                    }

                    //set the additional comments
                    let additionNote= {
                        answerStatus:1,
                        attributeValue: this.state.additionNotes,
                        comments:this.state.additionNotes,
                        elementEncounterIdentifier:"COVAL",
                        meausrementvalue:"",
                        performedStatus:this.state.additionNotes && this.state.additionNotes.trim().length>0 ? 1 : 4,
                        tableview:0
                        }
                        if(this.state.inputs &&  this.state.inputs.columnList.length>0){
                            additionNote["tableview"] = 1;
                        }



                    let covalIdx = _.findIndex(prevSvJson,(u)=>{return u.elementEncounterIdentifier ==='COVAL' });
                    if(covalIdx>-1){
                       prevSvJson[covalIdx]["attributeValue"] = this.state.additionNotes

                       prevSvJson[covalIdx]["comments"] = this.state.additionNotes;
                       prevSvJson[covalIdx]["performedStatus"] = this.state.additionNotes && this.state.additionNotes.trim().length>0 ? 1 : 4

                    }
                    else{
                        prevSvJson.push(additionNote)
                    }
                    //END
                    this.setState({jsonForSave:prevSvJson},()=>{

                        let obj = {
                            "patientEncounterFormGroupIdentifier": this.state.patientEncounterFormGroupIdentifier ,
                            "patientEncounterFormIdentifier" : this.props.match.params.elementFormIdenfier,
                            "whoDiditInCdash": this.state.selectedPersonna && this.state.selectedPersonna.id,
                            "whenDiditInCdash":this.state.fillDate,
                            "attributeList": this.state.jsonForSave,
                            "hasTableType":this.state.hasTableType,
                            "tableTitle":this.state.editedRowType
                        }
                        this.saveAllChnagesForElement(obj);
                    });
                }
                else{
                   //error message for invalid form
                    let msg = this.editCheckErrorMsg  ? this.editCheckErrorMsg  :  "Please select required fields";
                    NotificationManager.error(msg)
                }
            }


        }else{
        NotificationManager.warning("Please fill the required field");
        }
    }

    onChangePersonna = (op,type)=>{
       if(op){ this.setState({selectedPersonna:op}) }
    }

    //add required on edit check fields
    addRequiredClassOnEditCheckQuestion(questionId,validationRules){
        try{
            const sourceValidationQuestion = validationRules &&  Object.keys(validationRules);
            if(validationRules && sourceValidationQuestion.length>0){
                 return  sourceValidationQuestion.indexOf(questionId) > -1 ;
            }
            return false;
             //sourceIdentifier
        }
        catch(e){
            console.log(e)
             return false;
        }

    }

    //saving form changes
    saveAllChnagesForElement(data){
        if(this.props.match && this.props.match.params.epochIdentifier === "fromUnexpectedEncounter"){

            if(this.props.match && this.props.match.params.elementFormIdenfier != "null"){
                ApiService.saveEncounterForm(data).then( (res)=>{
                    NotificationManager.success("Date Saved Successfully.");
                    this.props.modalAction.hideModal();
                    this.loadFormDataSet();
                    if(this.state.inputs && this.state.inputs.columnList && this.state.inputs.columnList.length>0){
                    TableView.resetFormView();
                    }
                    if(this.state.fullResponse && this.state.fullResponse.form &&  this.state.fullResponse.form.hasOwnProperty("listOfComments") ){
                        CommentTemplate.resetFormView()
                    }
                    localStorage.removeItem('unExpectedEncounterName');
                },
                (err)=>{})
            }else{

            }

            //end for test
        }else{
            if(this.state.deleteArray && this.state.deleteArray.length > 0){
                this.state.deleteArray.forEach((item)=>{
                    ApiService.deleteFile({ uniqueIdentifier : item}).then((res) => {
                        if(res){
                        // this.loadFormDataSet();
                          //  common.clearNotification();
                          //  NotificationManager.success("File Deleted Successfully");
                        }
                    },(err)=>{})
                })
            }
            ApiService.saveEncounterForm(data).then( (res)=>{
                NotificationManager.success("Date Saved Successfully.");
                this.props.modalAction.hideModal();
                this.loadFormDataSet();
                if(this.state.inputs &&  this.state.inputs.columnList && this.state.inputs.columnList.length>0){
                TableView.resetFormView();
            }
            //fullResponse
            if(this.state.inputs && this.state.inputs.hasOwnProperty("comments")  &&  this.state.inputs.hasOwnProperty("listOfComments") ){
                CommentTemplate.resetFormView()
            }

            },
            (err)=>{})
        }
    }

    onRowClickHandeler =(fid)=>{

        try{
            if(this.state.otherResponse  && this.state.otherResponse.hasOwnProperty(fid) && this.state.otherResponse[fid]){

                let resAllDt = this.state.allResponseData &&  JSON.parse(this.state.allResponseData);
                //for removing the refrence
              //  resAllDt = JSON.parse(resAllDt);
//JSON.stringify(res.data.response)
                let found =  resAllDt && resAllDt.itemDefination[this.state.otherResponse[fid]] && resAllDt.itemDefination[this.state.otherResponse[fid]]["formData"].filter((p)=>{return p.fromGroupIdentifier===fid} )  //this.state.tableFilledData.filter((p)=>{return p.fromGroupIdentifier===fid});
                let fileList = this.state.fileList;

                if(found.length){
                    let prevState = resAllDt.itemDefination[this.state.otherResponse[fid]]["formDefinition"] ;
                    let formatItemList =  prevState &&  prevState.labelList ?  Common.getSortedBySequenceFields(prevState.labelList) : prevState.labelList ;
                     prevState.labelList = this.sortItemList(formatItemList)

                    let allFilledData = [];
                    for(var p in found[0]["pateintEncounterFieldResponse"]){
                        allFilledData.push(found[0]["pateintEncounterFieldResponse"][p])
                        //setting value for edited type 
                        if(this.state.hasTableType && p=="9999999"){
                            this.setState({editedRowType:found[0]["pateintEncounterFieldResponse"][p]["attributeValue"]})
                        }
                    }
                    let  covalFound = allFilledData.filter((cv)=>{return cv.elementEncounterIdentifier === "COVAL"})
                    covalFound.length >0 ? this.setState({additionNotes:covalFound[0]["attributeValue"] }) : this.setState({additionNotes:"" })

                    prevState.labelList.forEach( (qlist,qidx)=>{ //elementEncounterIdentifier
                        if(qlist.hasOwnProperty("codeDefinationList")  && qlist.codeDefinationList.length &&
                        qlist.codeDefinationList[0]["inputType"] === "multiselect" ){
                            qlist.inputValue =   found[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier]["multiValues"] ? JSON.stringify(found[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier]["multiValues"]) : null
                            //multiValues
                        }else if(qlist.hasOwnProperty("codeDefinationList")  && qlist.codeDefinationList.length &&
                            qlist.codeDefinationList[0]["inputType"] === "checkbox" ){
                            qlist.inputValue =   found[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier] ?  found[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier]["attributeValue"] : false
                            //checkbox
                        }else if(qlist.hasOwnProperty("codeDefinationList")  && qlist.codeDefinationList.length &&
                        qlist.codeDefinationList[0]["inputType"] === "radio" ){
                            qlist.inputValue = found[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier] ? this.getRadioCodeFromValue(found[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier]["attributeValue"]) : false
                        }else if(qlist.inputType === 'file'){
                            qlist.inputValue =  "";
                            qlist.fileList = [];
                            let uploadFilesNames = [];
                            fileList.forEach((item,index)=>{
                                if(found[0].pateintEncounterFieldResponse[qlist.uniqueIdentifier]["elementEncounterIdentifier"] == item.attributeIdentifier){
                                    qlist.fileList.push(item);
                                    uploadFilesNames.push(item.fileName);
                                }
                            });
                        } else if(qlist.inputType === "label" ){
                            qlist.inputValue =  qlist.inputValue  ? qlist.inputValue  : "label"
                        }else {
                            qlist.inputValue =  found[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier] ?  found[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier]["attributeValue"] : ""
                            qlist.measurementValue =  found[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier] ?  found[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier]["meausrementvalue"] : ""
                        }
                        if(found[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier]!=undefined ){
                            if( found[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier]["performedStatus"] &&   found[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier]["performedStatus"]!=4 || found[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier]["performedStatus"]!=1){
                                qlist.ansComments  =  found[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier] ?  found[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier]["comments"] : ""
                                qlist.ansStatus =  found[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier] ?  found[0]["pateintEncounterFieldResponse"][qlist.uniqueIdentifier]["performedStatus"] : ""
                            }
                        }
                    });
                    // formValidationRules:validationRules
                    //this.state.allResponseData.itemDefination[this.state.otherResponse[fid]]["formValidation"]
                    this.setState({jsonForSave:allFilledData,
                        inputs:prevState,
                        formValidationRules:resAllDt.itemDefination[this.state.otherResponse[fid]]["formValidation"],
                        patientEncounterFormGroupIdentifier:fid,hasTableView:false},()=>{

                        })

                }
              }
            }
        catch(e){
            console.log(e)
        }



    }

    //adding fresh form for table
    resetRowFrmId = ()=>{
        try{
            let tmp = [];
            //allResponseData
            //fullResponse
            //this.state.formBackupData && this.state.formBackupData!=""
            if( this.state.otherResponse && this.state.otherResponse.hasOwnProperty("current") && this.state.otherResponse.current){
                let allResData = this.state.allResponseData && JSON.parse(this.state.allResponseData);
                let selectItmIdxVD = allResData["itemDefination"][this.state.otherResponse[this.state.otherResponse["current"]]]["formValidation"];
                let newForm = allResData["itemDefination"][this.state.otherResponse[this.state.otherResponse["current"]]]["formDefinition"];  //JSON.parse(this.state.formBackupData);

                let formatItemList =  Common.getSortedBySequenceFields(newForm.labelList);
                newForm.labelList = this.sortItemList(formatItemList)

                let idx = _.findIndex(newForm.labelList,(o)=>{return o.inputType==="reminder"})
                let lblIdx =  _.findIndex(newForm.labelList,(o)=>{return o.inputType==="label"})
                //filter the reminder  element
                let filterReminder = newForm.labelList.filter((r)=>{return r.inputType==="reminder"});
                if(filterReminder.length){
                    // let prevSvDt = this.state.jsonForSave;
                    filterReminder.forEach((rmDt,rmIdx)=>{
                        let jsInfo = this.getSaveJSONInfo()
                        jsInfo.answerStatus = 1;
                        jsInfo.attributeValue="reminder"
                        jsInfo.elementEncounterIdentifier= rmDt["uniqueIdentifier"] ;
                        jsInfo.performedStatus =1;
                        jsInfo.tableview  =   newForm.columnList !== null && newForm.columnList.length > 0  ?   1 : 0
                        tmp.push(jsInfo);
                        //setting question value
                        let ix = _.findIndex(newForm.labelList,(o)=>{return o.uniqueIdentifier=== rmDt["uniqueIdentifier"]});
                        if(ix>-1){
                        newForm.labelList[ix]["inputValue"]  = "reminder";
                        }
                    });
                    // this.setState({jsonForSave:prevSvDt})
                }
                let filterLabel = newForm.labelList.filter((r)=>{return r.inputType==="label"});
                if(filterLabel.length){
                    filterLabel.forEach((lblDt,lblIdx)=>{
                        let jsInfo = this.getSaveJSONInfo()
                        jsInfo.answerStatus = 1;
                        jsInfo.attributeValue= lblDt["inputValue"]  ? lblDt["inputValue"]  : "label"
                        jsInfo.elementEncounterIdentifier= lblDt["uniqueIdentifier"] ;
                        jsInfo.performedStatus =1;
                        jsInfo.tableview  =   newForm.columnList !== null && newForm.columnList.length > 0  ?   1 : 0
                        tmp.push(jsInfo);
                        //setting question value
                        let ilblx = _.findIndex(newForm.labelList,(o)=>{return o.uniqueIdentifier=== lblDt["uniqueIdentifier"]});
                        if(ilblx>-1){
                        newForm.labelList[ilblx]["inputValue"]  ? newForm.labelList[ilblx]["inputValue"]  : "label"
                        }
                    });
                }

                let filterLabelong = newForm.labelList.filter((r)=>{return r.inputType==="textBlockLong"});
                if(filterLabelong.length){
                    filterLabelong.forEach((lblDt,lblIdx)=>{
                        let jsInfo = this.getSaveJSONInfo()
                        jsInfo.answerStatus = 1;
                        jsInfo.attributeValue= lblDt["inputValue"]  ? lblDt["inputValue"]  : "textBlockLong"
                        jsInfo.elementEncounterIdentifier= lblDt["uniqueIdentifier"] ;
                        jsInfo.performedStatus =1;
                        jsInfo.tableview  =   newForm.columnList !== null && newForm.columnList.length > 0  ?   1 : 0
                        tmp.push(jsInfo);
                        //setting question value
                        let ilblx = _.findIndex(newForm.labelList,(o)=>{return o.uniqueIdentifier=== lblDt["uniqueIdentifier"]});

                        if(ilblx>-1){
                        newForm.labelList[ilblx]["inputValue"] =   newForm.labelList[ilblx]["inputValue"]  ? newForm.labelList[ilblx]["inputValue"]  : "textBlockLong";
                        }
                    });
                }
                let validationRules = selectItmIdxVD ? selectItmIdxVD :  (this.state && this.state.formValidationRules) ? this.state.formValidationRules : (this.formValidationRules ? this.formValidationRules : '')
                this.setState({
                    inputs:newForm,
                    patientEncounterFormGroupIdentifier:"",
                    jsonForSave:tmp,hasTableView:false,
                    additionNotes:"",
                    formValidationRules:validationRules

                });
            }else{
                // let prevSt = this.state.inputs;
                // prevSt.labelList.forEach((item, i) => {
                //     if (item.hasOwnProperty("codeDefinationList") && Object.keys(item.codeDefinationList).length > 0 && item.codeDefinationList && item.codeDefinationList[0].inputType == "radio" && (item.inputValue == 0 || item.inputValue == '')) {
                //         item.inputValue = 0;
                //     }
                //     else {
                //         item.inputValue = "";
                //     }
                // });
                let tmpArr = [];
                let resData = this.state.allResponseData && this.state.allResponseData.length && JSON.parse(this.state.allResponseData)
                let tmpAllData =  resData.itemDefination && resData.itemDefination.length  && resData.itemDefination[resData.itemDefination.length-1];
                let tmpValidationRules =  tmpAllData && tmpAllData.hasOwnProperty("formValidation") && tmpAllData.formValidation;
                let validationSrcKey = Object.keys(tmpValidationRules).length &&  Object.keys(tmpValidationRules)[0]
                let addFormData = null;

                if(tmpValidationRules && validationSrcKey && resData.itemDefination && resData.itemDefination.length  && resData.itemDefination){
                     // resData.itemDefination.forEach((frmObjDt,frmObjIdx)=>{
                    // });
                    for(let tmCt=0;resData.itemDefination.length;tmCt++){

                       let tmpFrmDef =  resData.itemDefination[tmCt]["formDefinition"];
                       let tmpFrmtItemList = tmpFrmDef && tmpFrmDef.labelList  ? Common.getSortedBySequenceFields(tmpFrmDef.labelList) : null;

                     let tmpIdx =   tmpFrmtItemList && _.findIndex(tmpFrmtItemList,(o)=>{return o.uniqueIdentifier === validationSrcKey});
                     if(tmpIdx>-1){
                            tmpFrmDef.labelList =  this.sortItemList(tmpFrmtItemList);
                            addFormData = tmpFrmDef;
                            break;
                      }

                    }

                    //for manipulating
                    addFormData && addFormData.labelList  &&  addFormData.labelList.forEach((item, i) => {
                        if (item.hasOwnProperty("codeDefinationList") && Object.keys(item.codeDefinationList).length > 0 && item.codeDefinationList && item.codeDefinationList[0].inputType == "radio" && (item.inputValue == 0 || item.inputValue == '')) {
                            item.inputValue = 0;
                        }
                        else if(item.hasOwnProperty("inputType") &&  item.inputType === "reminder"){
                            let jsInfo = this.getSaveJSONInfo()
                            jsInfo.answerStatus = 1;
                            jsInfo.attributeValue=item.inputValue  ? item.inputValue  :  "reminder";
                            jsInfo.elementEncounterIdentifier= item["uniqueIdentifier"] ;
                            jsInfo.performedStatus =1;
                            jsInfo.tableview  =   addFormData && addFormData.columnList !== null && addFormData.columnList.length > 0  ?   1 : 0
                            tmpArr.push(jsInfo);
                            //setting question value
                            item.inputValue = item.inputValue  ? item.inputValue  :  "reminder";
                        }
                        else if(item.hasOwnProperty("inputType") &&  item.inputType === "label"){
                            let jsInfo = this.getSaveJSONInfo()
                            jsInfo.answerStatus = 1;
                            jsInfo.attributeValue=item.inputValue  ? item.inputValue  :  "label";
                            jsInfo.elementEncounterIdentifier= item["uniqueIdentifier"] ;
                            jsInfo.performedStatus =1;
                            jsInfo.tableview  =   addFormData && addFormData.columnList !== null && addFormData.columnList.length > 0  ?   1 : 0
                            tmpArr.push(jsInfo);
                            //setting question value
                            item.inputValue = item.inputValue  ? item.inputValue  :  "label";
                        }
                        else if(item.hasOwnProperty("inputType") &&  item.inputType === "textBlockLong"){
                            let jsInfo = this.getSaveJSONInfo()
                            jsInfo.answerStatus = 1;
                            jsInfo.attributeValue=item.inputValue  ? item.inputValue  :  "textBlockLong";
                            jsInfo.elementEncounterIdentifier= item["uniqueIdentifier"] ;
                            jsInfo.performedStatus =1;
                            jsInfo.tableview  =   addFormData && addFormData.columnList !== null && addFormData.columnList.length > 0  ?   1 : 0
                            tmpArr.push(jsInfo);
                            //setting question value
                            item.inputValue = item.inputValue  ? item.inputValue  :  "textBlockLong";
                        }
                        else {
                            item.inputValue = "";
                        }
                    });


                }
                else{

                    addFormData = tmpAllData.formDefinition;
               let formatItemList = addFormData && addFormData.labelList  ? Common.getSortedBySequenceFields(addFormData.labelList) : null;
               addFormData.labelList =  formatItemList && this.sortItemList(formatItemList)

               addFormData && addFormData.labelList  &&  addFormData.labelList.forEach((item, i) => {
                    if (item.hasOwnProperty("codeDefinationList") && Object.keys(item.codeDefinationList).length > 0 && item.codeDefinationList && item.codeDefinationList[0].inputType == "radio" && (item.inputValue == 0 || item.inputValue == '')) {
                        item.inputValue = 0;
                    }
                    else if(item.hasOwnProperty("inputType") &&  item.inputType === "reminder"){
                        let jsInfo = this.getSaveJSONInfo()
                        jsInfo.answerStatus = 1;
                        jsInfo.attributeValue=item.inputValue  ? item.inputValue  :  "reminder";
                        jsInfo.elementEncounterIdentifier= item["uniqueIdentifier"] ;
                        jsInfo.performedStatus =1;
                        jsInfo.tableview  =   addFormData && addFormData.columnList !== null && addFormData.columnList.length > 0  ?   1 : 0
                        tmpArr.push(jsInfo);
                        //setting question value
                        item.inputValue = item.inputValue  ? item.inputValue  :  "reminder";
                    }
                    else if(item.hasOwnProperty("inputType") &&  item.inputType === "label"){
                        let jsInfo = this.getSaveJSONInfo()
                        jsInfo.answerStatus = 1;
                        jsInfo.attributeValue=item.inputValue  ? item.inputValue  :  "label";
                        jsInfo.elementEncounterIdentifier= item["uniqueIdentifier"] ;
                        jsInfo.performedStatus =1;
                        jsInfo.tableview  =   addFormData && addFormData.columnList !== null && addFormData.columnList.length > 0  ?   1 : 0
                        tmpArr.push(jsInfo);
                        //setting question value
                        item.inputValue = item.inputValue  ? item.inputValue  :  "label";
                    }

                    else if(item.hasOwnProperty("inputType") &&  item.inputType === "textBlockLong"){
                        let jsInfo = this.getSaveJSONInfo()
                        jsInfo.answerStatus = 1;
                        jsInfo.attributeValue=item.inputValue  ? item.inputValue  :  "textBlockLong";
                        jsInfo.elementEncounterIdentifier= item["uniqueIdentifier"] ;
                        jsInfo.performedStatus =1;
                        jsInfo.tableview  =   addFormData && addFormData.columnList !== null && addFormData.columnList.length > 0  ?   1 : 0
                        tmpArr.push(jsInfo);
                        //setting question value
                        item.inputValue = item.inputValue  ? item.inputValue  :  "textBlockLong";
                    }
                    else {
                        item.inputValue = "";
                    }
                 });
                }


                this.setState({
                    inputs:addFormData,
                    patientEncounterFormGroupIdentifier:"",
                    jsonForSave:tmpArr,hasTableView:false,additionNotes:"",
                    formValidationRules:tmpAllData && tmpAllData.formValidation
                },()=>{  })
            }
        }catch(e){console.log(e)
        this.setState({hasTableView:false})
        }
    }

    cancelTableForm = ()=>{
        this.setState({hasTableView:true})
    }

    onchangeCheckboxHandler =(e,questionData)=>{
        try{
            const prevSt = this.state.inputs
            let qIndex = _.findIndex( prevSt.labelList, (o)=>{return questionData.uniqueIdentifier === o.uniqueIdentifier});
            if(qIndex>-1){
                let uid = prevSt.labelList[qIndex]["uniqueIdentifier"];
                prevSt.labelList[qIndex]["inputValue"] = e;
                const prevSaveJson = this.state.jsonForSave;
                let checkForEle = _.findIndex(prevSaveJson,(r)=>{return r.elementEncounterIdentifier === prevSt.labelList[qIndex]["uniqueIdentifier"]});
                if(checkForEle>-1){
                    prevSaveJson[checkForEle]["attributeValue"]  = e
                    prevSaveJson[checkForEle]["comments"]  = ""
                    prevSaveJson[checkForEle]["performedStatus"]  = 1
                }else{
                    let qinfo = this.getSaveJSONInfo();
                    qinfo.attributeValue  = e
                    qinfo.performedStatus = 1;
                    qinfo.answerStatus =1
                    qinfo.elementEncounterIdentifier  = uid;
                    qinfo.comments = "";
                    qinfo.tableview  = questionData.isTable ? 1 : 0;
                    prevSaveJson.push(qinfo);
                }
                this.setState({jsonForSave:prevSaveJson,inputs:prevSt});
            }
        }catch(e){}
    }

    goBack = ()=>{

        let Obj = {
            patientId : this.props.match && this.props.match.params.patEncId,
            patDetailIdentity : this.props.match && this.props.match.params.patDetailIdentity,
            studyIdentity : this.props.match && this.props.match.params.studyIdentity,
            siteIdentifier : this.props.match && this.props.match.params.siteIdentifier,
            epochIdentifier : this.props.match && this.props.match.params.epochIdentifier
        }
        if(this.props && this.props.location &&  this.props.location.pathname.indexOf("fromUnexpectedEncounter")>-1){
            let backUrl = `/patientdetails/patientdescription/patientEncounter/${Obj.siteIdentifier}/${Obj.patDetailIdentity}/${Obj.studyIdentity}/${Obj.siteIdentifier}/${Obj.epochIdentifier}`
            this.props.history && this.props.history.push(backUrl);
        }
        else{
            let backUrl = `/patientdetails/patientdescription/patientEncounter/${Obj.patientId}/${Obj.patDetailIdentity}/${Obj.studyIdentity}/${Obj.siteIdentifier}/${Obj.epochIdentifier}`
            this.props.history && this.props.history.push(backUrl);

        }


    }

    // for table additional note
    onTblCovalChangeHandeler = (e)=>{
        this.setState({additionNotes:e.target.value});
    }


    // for additional comments
    onChangeCOVAL_Handler =(e)=>{
        this.setState({additionNotes:e.target.value});
    }

        //onForm submit validations
        checkFormSubmitValidationRules(){
            //this.state.inputs.domainCode
            try{

     let hasValidForm = false;
    if(this.state.inputs && this.state.inputs.domainCode &&
         EDIT_CHECK_DOMAINS.indexOf(this.state.inputs.domainCode)>-1 )
    {
        if( this.state.formValidationRules && Object.keys(this.state.formValidationRules).length>0  ){

            for(let sIden in this.state.formValidationRules){

                const filterCount =   this.state.jsonForSave &&   this.state.jsonForSave.filter((o)=>{return o.elementEncounterIdentifier === sIden})
                if(filterCount.length>0 && this.state.formValidationRules[sIden]["validationType"]=="show/hide"  &&  (filterCount[0]["attributeValue"]).toLowerCase() === (this.state.formValidationRules[sIden]["trueConditionValue"]).toLowerCase()) {
                   hasValidForm = false;
                }
                else if(this.state.formValidationRules[sIden]["validationType"]==="lookup" && filterCount.length>0 && filterCount[0]["attributeValue"]!="")
                {

                    if( (this.state.formValidationRules[sIden]["targetIdentifierList"]).indexOf(filterCount[0]["attributeValue"])>-1 ){
                        hasValidForm = false;
                    }
                    else{
                        hasValidForm = true;
                        break
                    }
                }
                else{
                   // return true;
                    hasValidForm = true;
                    break;
                }
            }
            return hasValidForm;
        }
        else{
            return false;
        }
    }
    else{
        return false;
    }


            }catch(e){

            }

        }

            //check for validation
    checkforFormValidation(quesId,quesData,formData,validationRules,filledQuesAnsData){
        // need to remove the redendent code for this validations
        try{
        if( validationRules && Object.keys(validationRules).length>0  ){

            //domainCode
            if(formData &&  formData.domainCode!="DA"){
                for(let sIden in validationRules){

                    if( validationRules && (validationRules[sIden]).hasOwnProperty("sourceIdentifier") && validationRules[sIden]["sourceIdentifier"] !=quesId ){

                        const filterCount =   filledQuesAnsData &&   filledQuesAnsData.filter((o)=>{return o.elementEncounterIdentifier === sIden})

                         if(filterCount.length>0  ){
                             //attributeValue
                             if( formValidationType.indexOf(validationRules[sIden]["validationType"])>-1
                    &&  typeof (filterCount[0]["attributeValue"] ) == "string"
                    && (filterCount[0]["attributeValue"]).toLowerCase() === (validationRules[sIden]["trueConditionValue"]).toLowerCase()){

                                 if((validationRules[sIden]).hasOwnProperty("targetIdentifierList")
                                 &&  validationRules[sIden]["targetIdentifierList"].indexOf(quesId)>-1){
                                     return true;
                                 }
                                //  else{
                                //      return false;
                                //  }

                                // return true;
                             }
                             else{

                                if((validationRules[sIden]).hasOwnProperty("targetIdentifierList")
                                &&  validationRules[sIden]["targetIdentifierList"].indexOf(quesId)>-1){
                                    return false;
                                }
                                else{
                                    return true;
                                }


                               //  return false
                             }
                         }
                         else{
                             return true;
                         }
                     }
                      return true
                     //sourceIdentifier
                }
            }
            else{
                //when DA Domain
                let willRender = true;
                const sourceIdecKeys = Object.keys(validationRules);
               //rednder question id  == quesId
                if(sourceIdecKeys.length>0){
                    for(let k=0;k<sourceIdecKeys.length;k++){
                        let dc_key =  sourceIdecKeys[k];
                        if( quesId!=validationRules[dc_key]["sourceIdentifier"] && validationRules[dc_key]["targetIdentifierList"].indexOf(quesId)>-1){
                            let  filterCount =   filledQuesAnsData &&   filledQuesAnsData.filter((o)=>{return o.elementEncounterIdentifier === validationRules[dc_key]["sourceIdentifier"]})
                            if(filterCount.length>0){
                                if(  (filterCount[0]["attributeValue"]).toLowerCase() === (validationRules[dc_key]["trueConditionValue"]).toLowerCase()){
                                    willRender = true;
                                    break;
                                }
                                else{
                                    willRender = false;
                                    break;
                                }
                            }else{
                                willRender = true;
                                break;
                            }
                        }
                    }
                    // sourceIdecKeys.forEach((gh)=>{// })
                    return willRender;
                }
                 return true;
            }

        }

        return true

                }
                catch(e){
                    console.log(e);
                    return true;
                }
            }

           //validation for conditional
           validationForFinalEditCheckSubmit(validationRules,filledData){
               try{
                let isValid = true;
                let sourceValidationKey = Object.keys(validationRules);
                if(validationRules && sourceValidationKey.length>0){
                    for(let m =0;m<sourceValidationKey.length;m++){
                        let dc_key =  sourceValidationKey[m];
                        //validationType:"show/hide"
                        const filterSrcInfo = filledData && filledData.filter((k)=>{return k.elementEncounterIdentifier ===  validationRules[dc_key]["sourceIdentifier"] })
                        if(validationRules[dc_key]["validationType"]=="show/hide"){
                            if(filterSrcInfo.length>0   ){
                                if((filterSrcInfo[0]["attributeValue"]=="" || filterSrcInfo[0]["attributeValue"]=="NA" )){
                                    isValid =  false;
                                    this.editCheckErrorMsg = "Please select required fields"
                                     break;
                                }
                            }
                            else{
                                isValid =  false;
                                break;
                            }
                        }
                        else if( validationRules[dc_key]["validationType"]==="lookup"){
                            //check for is any  dependent validation
                            if(this.isAnyParentValidation( dc_key,validationRules)){

                                if(filterSrcInfo.length>0 && filterSrcInfo[0]["attributeValue"]!="" &&  (  validationRules[dc_key]["targetIdentifierList"].indexOf(filterSrcInfo[0]["attributeValue"])>-1) ){
                                    isValid =  true;
                                }
                                else{
                                    this.editCheckErrorMsg =   validationRules[dc_key]["validationMsg"] ?  validationRules[dc_key]["validationMsg"]  : "Invalid required value"
                                    isValid =  false;
                                    break;
                                }
                            }
                            else{
                                //skipping the validation for lookup
                                isValid =  true;
                            }


                        }
                        else{
                            isValid =  false;
                            break;
                        }
                    }
                  return isValid;
                }
                else{
                    return true;
                }
               }
               catch(e){
                return true;
               }
           }

           //check for parent validation like "show/hide"

           isAnyParentValidation(quesId,validationRules){
            let parentKey = "";
            let parentValue = ""
            let isValidParentRules = false;
            const sourceValidationArry =  validationRules && Object.keys(validationRules);
            if(sourceValidationArry){
                 for(let k =0;k<sourceValidationArry.length;k++)
                 {
                     let stKey = sourceValidationArry[k];
                    if(  validationRules[stKey]["validationType"]==="show/hide"){
                        parentKey = stKey;
                        parentValue = validationRules[stKey]["trueConditionValue"] ;
                        break;
                    }
                 }

                 if(parentKey && this.state.jsonForSave.length){
                    let searchQ = this.state.jsonForSave.filter((h)=>{return h.elementEncounterIdentifier === parentKey });

                    if(searchQ.length>0 && (searchQ[0]["attributeValue"]).toLowerCase()===parentValue.toLowerCase()){
                        isValidParentRules = true;
                    }
                    else{
                        //skip this validation
                        isValidParentRules = false;
                    }
                 }//&&  validationRules[stKey]["trueConditionValue"]
                 return isValidParentRules;
            }
            return isValidParentRules;

           }


           // check for question is source for validation
           checkQuestionHasValidValue(questionId,selectedData, validationRules){
               try{
                    const sourceValidation = validationRules && Object.keys(validationRules).length
                    if(sourceValidation){

                        let srcData =validationRules[questionId]
                        if( srcData["trueConditionValue"]  && (srcData["trueConditionValue"]).toLowerCase()=="yes" && selectedData=="1"){
                            return true;
                        }
                        else if(srcData["trueConditionValue"]  && (srcData["trueConditionValue"]).toLowerCase()=="no" && selectedData=="2"){
                            return true;
                        }
                        else{
                            return false;
                        }
                    }

               }catch(e){
                return false;
               }
           }

           //reset the form filled value
           resetEditCheckFormFillValues =(quesId,sourceArrays,selectVal)=>{
                try {
                    if (this.state.inputs && this.state.inputs.labelList) {
                        let prevSt = this.state.inputs;
                        let prevSavedJSONData = this.state.jsonForSave;
                        prevSt.labelList.forEach((frmQues, frmQIdx) => {
                            //adding show/hide patch for DA domain
                            if (this.state.inputs && this.state.inputs.domainCode != "DA") {
                                if (quesId != frmQues.uniqueIdentifier) //questionData.uniqueIdentifier (sourceArrays.indexOf(frmQues.uniqueIdentifier)<0)
                                {
                                    if (frmQues.inputType != "label") {
                                        frmQues.inputValue = "";
                                    }
                                    if (this.state.jsonForSave && this.state.jsonForSave.length) {
                                        let tpIdx = this.state.jsonForSave.findIndex((lo) => {
                                            return lo.elementEncounterIdentifier == frmQues.uniqueIdentifier
                                        })
                                        frmQues.ansStatus = selectVal == "2" && tpIdx > -1 ? this.state.jsonForSave[tpIdx]["elementEncounterIdentifier"]["performedStatus"] : 4;
                                        if (frmQues.inputType == "label" && tpIdx > -1) {
                                            prevSavedJSONData[tpIdx]["attributeValue"] = frmQues.inputValue;
                                        }
                                    } else {
                                        frmQues.ansStatus = 4;
                                    }
                                }
                            } else {
                                if (this.state.formValidationRules[quesId] && (this.state.formValidationRules[quesId]["targetIdentifierList"]).indexOf(frmQues.uniqueIdentifier) > -1) {
                                    if (frmQues.inputType != "label") {
                                        frmQues.inputValue = "";
                                    }
                                    if (this.state.jsonForSave && this.state.jsonForSave.length) {
                                        let tpIdx = this.state.jsonForSave.findIndex((lo) => {
                                            return lo.elementEncounterIdentifier == frmQues.uniqueIdentifier
                                        })
                                        frmQues.ansStatus = selectVal == "2" && tpIdx > -1 ? this.state.jsonForSave[tpIdx]["elementEncounterIdentifier"]["performedStatus"] : 4;
                                        if (frmQues.inputType == "label" && tpIdx > -1) {
                                            prevSavedJSONData[tpIdx]["attributeValue"] = frmQues.inputValue;
                                        }
                                    } else {
                                        frmQues.ansStatus = 4;
                                    }
                                }
                            }

                        })
                        this.setState({
                            inputs: prevSt,
                            jsonForSave: prevSavedJSONData
                        })
                    }
                    if (this.state.jsonForSave && this.state.jsonForSave.length) {
                        let prevSvJson = this.state.jsonForSave;
                        prevSvJson.forEach((fj, ji) => {
                            //adding show/hide patch for DA domain
                            if (this.state.inputs && this.state.inputs.domainCode != "DA") {
                                if (quesId != fj.elementEncounterIdentifier) // (sourceArrays.indexOf(fj.elementEncounterIdentifier)<0)
                                {
                                    fj.answerStatus = 1;
                                    fj.attributeValue = "";
                                    fj.comments = "";
                                    fj.performedStatus = fj.performedStatus ? fj.performedStatus : 4;
                                }
                            } else {
                                if (this.state.formValidationRules[quesId] && (this.state.formValidationRules[quesId]["targetIdentifierList"]).indexOf(fj.elementEncounterIdentifier) > -1) {
                                    fj.answerStatus = 1;
                                    fj.attributeValue = "";
                                    fj.comments = "";
                                    fj.performedStatus = fj.performedStatus ? fj.performedStatus : 4;
                                }
                            }
                        })

                        this.setState({
                            jsonForSave: prevSvJson
                        })

                    }
                } catch (e) {
                    console.log(e)
                }
           }
           addNewComment = () => {
               this.setState({
                   additionNotes: "",
                   hasTableView: false,
                   patientEncounterFormGroupIdentifier: "",
                   jsonForSave: []
               });
           }
           editAditionalNotes =(editData)=>{
            this.setState({additionNotes:editData.original.comments ? editData.original.comments  : '',
            patientEncounterFormGroupIdentifier:editData.original && editData.original.formGroupIdentifier,
            jsonForSave:[editData.original]
        })
           }

           //retaining old status
           retainOldStatus =(qId,rules,selectVal)=>{
            try{
                let excludeQues = ["label","textBlockLong","reminder"];
                if(this.state.inputs && this.state.inputs.labelList){
                    let prevSt = this.state.inputs;
                    prevSt.labelList.forEach((frmQues,frmQIdx)=>{
                        if(frmQues.inputType &&  (excludeQues.indexOf(frmQues.inputType)>-1)){
                            frmQues.ansStatus = 1;
                            frmQues.inputValue = frmQues.inputValue ? frmQues.inputValue : frmQues.inputType;
                        }else{
                            if(frmQues.hasOwnProperty("ansStatus") && frmQues.ansStatus){
                                if(frmQues.hasOwnProperty("inputValue")   && frmQues.inputValue.toString().trim()==""){
                                    frmQues.ansStatus = 4;
                                 }
                                 if(frmQues.hasOwnProperty("codeDefinationList") && Object.keys(frmQues.codeDefinationList).length>0 && frmQues.codeDefinationList[0].inputType=="radio" &&  (frmQues.inputValue == 0 || frmQues.inputValue == ''  )){
                                    frmQues.ansStatus = 4;
                                    }
                            }else{
                                frmQues.ansStatus = 4;
                            }
                        }

                    })
                    this.setState({inputs:prevSt});
                }

            }catch(e){
                console.log("exception occure",e);
            }
        }

    dynamicClassesForFieldName = (item)=>{
        if(item.inputType == 'textBlockLong'){
            return 'pr-2 col-md-12 pl-0 overflow-ellipsis-multiple-line'
        }
        return 'pr-2 col-md-3 pl-0 overflow-ellipsis-multiple-line'
    }

    render({props,state}=this) {
        let formData = state.inputs;
       return (
            <section className='iefixflex footpadb'>
                <div className="border p-3 m-0 row justify-content-between">
                    { formData && formData.domainCode !=="EICF" &&
                    <div className='col-12 form-row pb-1 px-0 m-0 justify-content-between border-bottom-dotted'>
                        <div className="col-md-5 col-lg-5 p-0">
                            <h5 className="col-12 px-0 c-p mb-0 pt-2" title={formData && formData.hasOwnProperty('comments') ? "Comment Logs" : formData.elementName}>{formData && formData.hasOwnProperty('comments') ? "Comment Logs" : common.getSubString(this.state.inputs.elementName,20)}</h5>
                        </div>
                        <div className="input-group col-md-3 col-lg-3 ">
                            <label htmlFor="site" className='col-md-6 pt-2 text-right'>When was it done?</label>
                            <div className="input-group col-md-6 p-0 whenDate">
                                <DateTime dateFormat="DD/MMM/YYYY"
                                value={this.getWhenWasDoneDate()}//this.state.fillDate
                                timeFormat={false}
                                // className='reqfeild'
                                onChange={(event) => this.setState({whenDidDateFlag:false,fillDate:common.formatDate(event._d)})}
                                closeOnSelect={true}
                                open={this.state.whenDidDateFlag}
                                isValidDate={ valid }
                                inputProps={{ readOnly: true }}
                                />
                                <i className="glyphicon glyphicon-calendar dateicon3 cursor-pointer dtfix" onClick={ ()=>this.setState({whenDidDateFlag:!this.state.whenDidDateFlag}) }></i>
                            </div>
                        </div>
                        <div className="input-group col-md-3 col-lg-3 custred">
                            <label htmlFor="site" className='col-md-5 pt-2 text-right'>Who did it?</label>
                            <ReactSuperSelect
                                placeholder="Select"
                                clearSearchOnSelection={true}
                                dataSource={state.whoCdashList ? state.whoCdashList : []}
                                onChange={(option) => this.onChangePersonna(option, 'who_cdash')}
                                searchable={true}
                                keepOpenOnSelection={false}
                                closeOnSelectedOptionClick={true}
                                deselectOnSelectedOptionClick={false}
                                customClass='select-container col-md-6 col-lg-6 p-0'
                                customSelectedValueTemplateFunction={this.customSelectedValueTemplateFunction}
                                clearable={false}
                                initialValue={state.selectedPersonna && state.selectedPersonna != "" ? state.selectedPersonna : null}
                            />
                        </div>

                    {!this.state.hasTableView && <div className="col-md-auto justify-content-end p-0">
                            <div className="edit-btn-group  pull-right plcustom">
                                <i className="material-icons" title='Save' onClick={this.onSaveData}>save</i>
                                <i className="material-icons" title='Cancel' onClick={this.goBack}>
                                    clear</i>
                            </div>
                        </div> }

                    </div>}
                    <div className={"col-12 "+( formData && formData.hasOwnProperty('comments') ? '':'form-row')+" p-0 m-0 mt-3"}>
                        {   formData && formData.domainCode=="EICF" ? <ICF /> :
                         (  formData && ( formData.domainCode=="EREVPI" || formData.domainCode=="EREVSM")  ?  <ReviewPI fullData ={this.state.fullResponse} onTblCovalChangeHandeler = {this.onTblCovalChangeHandeler} additionNotes={this.state.additionNotes} allURIParams = {this.props.match && this.props.match.params} patientEncounterId={this.props.match && this.props.match.params && this.props.match.params.patEncId}  /> :
                         (  formData && ( formData.hasOwnProperty('comments'))  ?  <CommentTemplate editAditionalNotes={this.editAditionalNotes}  addNewComment={this.addNewComment} cancelTableForm = {this.cancelTableForm } onTblCovalChangeHandeler = {this.onTblCovalChangeHandeler} additionNotes={this.state.additionNotes} patientEncounterId={this.props.match && this.props.match.params && this.props.match.params.patEncId} formData={formData} /> :
                            this.state.allResponseData &&  this.state.allResponseData.length && JSON.parse(this.state.allResponseData).hasOwnProperty('columnList') && JSON.parse(this.state.allResponseData).columnList !== null && JSON.parse(this.state.allResponseData).columnList.length > 0 ? <TableView  ref={instance => { this.child = instance; }}
                            onChangeTextHandler={this.onChangeTextHandler}
                            onChangeDropDownHandler={this.onChangeDropDownHandler}
                            onDateChangeHandler={this.onDateChangeHandler}
                            onChangeRadioHandler={this.onChangeRadioHandler}
                            onchangeTimeHandler={this.onchangeTimeHandler}
                            onChangeFileHandler={this.onChangeFileHandler}
                            deleteFile={this.deleteFile}
                            onCloseSelectedFile={this.onCloseSelectedFile}
                            tableData={[formData]} userEnd={true}
                            tableHeaderColumn = {this.state.allResponseData && JSON.parse(this.state.allResponseData)}
                            tableAnswersData={this.state.tableViewData}
                            onRowClickHandeler ={this.onRowClickHandeler}
                            resetRowFrmId={this.resetRowFrmId}
                            filledQuestionsAns ={this.state.jsonForSave}
                            cancelTableForm={this.cancelTableForm}
                            hasTableView={this.state.hasTableView}
                            onchangeCheckboxHandler={this.onchangeCheckboxHandler}
                            onTblCovalChangeHandeler = {this.onTblCovalChangeHandeler}
                            additionNotes={this.state.additionNotes}
                            checkforFormValidation={this.checkforFormValidation}
                            formValidationRules = {this.state.formValidationRules}
                            addRequiredClassOnEditCheckQuestion = {this.addRequiredClassOnEditCheckQuestion}
                            hasTableType={this.state.hasTableType}
                            editedRowType={this.state.editedRowType}
                            /> :
                        // formData && formData.labelList && common.sortByOrder(formData.labelList,'ASC').map((formLabelData,idx)=>{ })
                                //return (
                                    <div className='form-group pt-2 col-xs-12 col-md-12 position-relative'>
                                        {/* { formLabelData.formLabelName && <div className='col-md-12 col-xs-12 pl-0 pr-0'>
                                            <label className='vital-label-heading'> { this.getFormatedSubelementName(formLabelData.formLabelName) } </label>
                                            { formLabelData && formLabelData.isRepeat ? <span className='pl-2'>
                                                <button className='btn text-white form-addition-btn position-relative' onClick={()=>this.onRepeateFormLabel(formLabelData.formLabelName)}> <span className='plus-sign'>+</span></button>
                                                </span> : ''
                                            }
                                        </div>
                                    } */}
                                        <div  className={`col-md-12 col-xs-12 pl-0 ${formData && formData.name} mb-2`}>
                                            { formData && formData.labelList  && formData.labelList.length > 0 && formData.labelList.map((item,index)=>{

                                                if(item.hasOwnProperty("codeDefinationList") && Object.keys(item.codeDefinationList).length>0 && item.codeDefinationList && item.codeDefinationList[0].inputType=="radio" &&  (item.inputValue == 0 || item.inputValue == ''  )){
                                                item.inputValue = 0;
                                                }

                                                return (
                                                    this.checkforFormValidation(item.uniqueIdentifier,item,formData,this.state.formValidationRules,this.state.jsonForSave) &&  <div key={index} className={`input-group mt-2 col-md-12 col-lg-12 pl-0 ${formData.name}-form-grp ques_row`}>
                                                                {/* <label className='pr-2 col-md-3 pl-0'>{ item.name }</label> */}
                                                                { item.inputType !== 'reminder' &&
                                                                    ( item.inputType != '' || item.hasOwnProperty('codeDefinationList') && typeof item.codeDefinationList === 'object' &&
                                                                    item.codeDefinationList.length !== 0  &&  item.codeDefinationList[0].inputType !== 'checkbox') &&
                                                                    <label className={ `${this.dynamicClassesForFieldName(item)} ${this.addRequiredClassOnEditCheckQuestion(item.uniqueIdentifier,this.state.formValidationRules) ? 'form_required_class' : '' }` }  >
                                                                        { item.name }
                                                                    </label> }

                                                                <GenerateHtml labelText={item.label}  data={item}
                                                                // formLabelId={ formLabelData ? formLabelData && formLabelData.labelId : ''} itemId={item.itemId}
                                                                    onChangeTextHandler={this.onChangeTextHandler}
                                                                    onChangeDropDownHandler={this.onChangeDropDownHandler}
                                                                    onDateChangeHandler={this.onDateChangeHandler}
                                                                    onChangeRadioHandler={this.onChangeRadioHandler}
                                                                    onchangeTimeHandler={this.onchangeTimeHandler}
                                                                    onChangeFileHandler={this.onChangeFileHandler}
                                                                    onCloseSelectedFile={this.onCloseSelectedFile}
                                                                    onchangeCheckboxHandler={this.onchangeCheckboxHandler}
                                                                    customClassObject={customClassObject}
                                                                    itemDefIndex={index}
                                                                    deleteFile={this.deleteFile}
                                                                    fromWhichPage='encounterDetail'
                                                                />
                                                            </div>
                                                    )
                                                })
                                            }
                                            { formData && formData.labelList && formData.labelList.length > 0 &&
                                                <div className="form-group">
                                                <label>Comment</label>
                                                <textarea name="COVAL" className="form-control" value={this.state.additionNotes}
                                                     onChange={(e)=>{this.onChangeCOVAL_Handler(e)}}
                                                 />
                                                </div>}
                                            {/* { formLabelData && formLabelData.customItemDefinationList && formLabelData.customItemDefinationList.length > 0 && common.sortByOrder(formLabelData.itemDefinationList,'ASC').map((item,index)=>{
                                                    return (
                                                            <div key={index} className={`input-group mt-2 col-md-12 col-lg-12 pl-0 ${formData.name}-form-grp`}>
                                                                <label className='pr-2 col-md-3 pl-0'>{ item.name }</label>
                                                                <GenerateHtml labelText={item.label}  data={item} formId={formData.formId} formLabelId={formLabelData.formLableId}
                                                                    onChangeTextHandler={this.onChangeTextHandler}
                                                                    onChangeDropDownHandler={this.onChangeDropDownHandler}
                                                                    onDateChangeHandler={this.onDateChangeHandler}
                                                                    onChangeRadioHandler={this.onChangeRadioHandler}
                                                                    onchangeTimeHandler={this.onchangeTimeHandler}
                                                                    onChangeFileHandler={this.onChangeFileHandler}
                                                                    customClassObject={customClassObject}
                                                                    itemDefIndex={index}
                                                                />
                                                            </div>
                                                    )
                                                })
                                            } */}
                                        </div>
                                    </div>
                                //)
                            )
                        )
                        }
                    </div>
                </div>
            </section>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        modalAction: bindActionCreators(modalAction, dispatch),
        patientInfo  : bindActionCreators(patientInfo,dispatch)
    };
}

function mapStateToProps(state) {
    return {
        modal: state.modal
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GetDomainDetailElements);

const personnaName = [
    {id:1,name:"John Smith"},
    {id:2,name:"Steve "},
    {id:3,name:"Tim "},
]
