/**
* Copyright (c) 2018
* @summary  Encounter Vital Sign Page
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import ApiService from '../../api';
import _ from 'lodash';
import GetDomainDetailElements from './getDomainDetailElements';

class ElementForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showForm : false,
            formName : '',
            inputs : {},
            dataSaveObj : {},
            repeatForm : 1,
            repeatFormLabel:1,
            domain:"",
        }
    }

    componentDidMount() {
      let parametes = {
        studyId : '9f099977a5da11e8a97fb348647226e2',//this.props.match.params &&  this.props.match.params.studyId,
        uniqueIdentifier : 'c4f30ccba75d11e8bab51960182b4275'//this.props.match.params &&  this.props.match.params.uniqIdenfier
      }
      ApiService.getEncounterDetailsItemGroup(parametes).then((res) => {
          this.setState({ inputs: res && res.data && res.data.response && res.data.response},()=>{});
      });
    }

    getFormJson = ()=>{
        let tempObj = {
            "domainId": 41,
            "studyId": "QATST02",
            "metaVersionId": null,
            "elementName": "Vital Sign test ele",
            "elementIcon": "Procedure",
            "whoCdashMap": "",
            "whenCdashMap": "",
            "uniqueIdentifier": "4912a2f0-a1e9-11e8-b974-454d9506d307",
            "sourceIdentifier": null,
            "domainCode": "VS",
            "domainName": "Vital Signs",
            "sequence": 1,
            "language": "EN",
            "enabled": true,
            "isCustom": null,
            "mandatory": null,
            "optional": null,
            "custom": null,
            "columnList": [
              "Height",
              "Temperature",
              "Diastolic"
            ],
            "labelList": [
              {
                "labelId": 57,
                "isRepeat": null,
                "uniqueIdentifier": "4912a2f1-a1e9-11e8-b974-6db4c39cd2c8",
                "sourceIdentifier": null,
                "sequence": 1,
                "language": "EN",
                "enabled": true,
                "itemDefinationList": [
                  {
                    "@itemId": 1,
                    "itemId": 227,
                    "codeOid": "VS_1_2018-08-17_064636",
                    "isTable": true,
                    "inputType": "textbox",
                    "inputValue": "",
                    "name": "Height",
                    "cdashAliasName": "",
                    "codelist": "",
                    "domain": "VS",
                    "cdashCore": "Highly Recommended",
                    "sdtm": "",
                    "description": "",
                    "question": "Height",
                    "completion_instructions": "",
                    "isElligoStandard": true,
                    "uniqueIdentifier": "4912a2f2-a1e9-11e8-b974-69b391f08bc7",
                    "sourceIdentifier": null,
                    "sequence": 2,
                    "language": "EN",
                    "enabled": true,
                    "codeDefinationList": [],
                    "measurementDefinitionList": [
                      {
                        "measurementOid": "MU__1_2018-08-17_064636",
                        "name": "CM",
                        "symbol": "",
                        "inputType": "dropdown",
                        "uniqueIdentifier": "4912a2f3-a1e9-11e8-b974-671c5911272c",
                        "sourceIdentifier": null,
                        "sequence": 1,
                        "language": null,
                        "enabled": true,
                        "measurementId": 81
                      },
                      {
                        "measurementOid": "MU__1_2018-08-17_064636",
                        "name": "IN",
                        "symbol": "",
                        "inputType": "dropdown",
                        "uniqueIdentifier": "4912a2f4-a1e9-11e8-b974-5b72426ef95f",
                        "sourceIdentifier": null,
                        "sequence": 1,
                        "language": null,
                        "enabled": true,
                        "measurementId": 82
                      },
                      {
                        "measurementOid": "MU__1_2018-08-17_064636",
                        "name": "CM",
                        "symbol": "",
                        "inputType": "dropdown",
                        "uniqueIdentifier": "4912a2f5-a1e9-11e8-b974-551c4bea7464",
                        "sourceIdentifier": null,
                        "sequence": 1,
                        "language": null,
                        "enabled": true,
                        "measurementId": 83
                      },
                      {
                        "measurementOid": "MU__1_2018-08-17_064636",
                        "name": "IN",
                        "symbol": "",
                        "inputType": "dropdown",
                        "uniqueIdentifier": "4912a2f6-a1e9-11e8-b974-8b96a6022022",
                        "sourceIdentifier": null,
                        "sequence": 1,
                        "language": null,
                        "enabled": true,
                        "measurementId": 84
                      }
                    ],
                    "infoforSponsors": ""
                  },
                  {
                    "@itemId": 2,
                    "itemId": 228,
                    "codeOid": "VS_1_2018-08-17_064636",
                    "isTable": true,
                    "inputType": "textbox",
                    "inputValue": "",
                    "name": "Temperature",
                    "cdashAliasName": "",
                    "codelist": "",
                    "domain": "VS",
                    "cdashCore": "Highly Recommended",
                    "sdtm": "",
                    "description": "",
                    "question": "Temperature",
                    "completion_instructions": "",
                    "isElligoStandard": true,
                    "uniqueIdentifier": "4912a2f7-a1e9-11e8-b974-211e95b4824a",
                    "sourceIdentifier": null,
                    "sequence": 1,
                    "language": "EN",
                    "enabled": true,
                    "codeDefinationList": [],
                    "measurementDefinitionList": [
                      {
                        "measurementOid": "MU_°C_1_2018-08-17_064636",
                        "name": "°C",
                        "symbol": "°C",
                        "inputType": "dropdown",
                        "uniqueIdentifier": "4912a2f8-a1e9-11e8-b974-3d60c4bb9825",
                        "sourceIdentifier": null,
                        "sequence": 1,
                        "language": null,
                        "enabled": true,
                        "measurementId": 85
                      },
                      {
                        "measurementOid": "MU_°F_1_2018-08-17_064636",
                        "name": "°F",
                        "symbol": "°F",
                        "inputType": "dropdown",
                        "uniqueIdentifier": "4912a2f9-a1e9-11e8-b974-6f5e24fe0c3f",
                        "sourceIdentifier": null,
                        "sequence": 1,
                        "language": null,
                        "enabled": true,
                        "measurementId": 86
                      }
                    ],
                    "infoforSponsors": ""
                  },
                  {
                    "@itemId": 3,
                    "itemId": 229,
                    "codeOid": "VS_1_2018-08-17_064636",
                    "isTable": true,
                    "inputType": "textbox",
                    "inputValue": "",
                    "name": "Diastolic",
                    "cdashAliasName": "",
                    "codelist": "",
                    "domain": "VS",
                    "cdashCore": "Highly Recommended",
                    "sdtm": "",
                    "description": "",
                    "question": "Diastolic",
                    "completion_instructions": "",
                    "isElligoStandard": true,
                    "uniqueIdentifier": "4912a2fa-a1e9-11e8-b974-51f030702489",
                    "sourceIdentifier": null,
                    "sequence": 4,
                    "language": "EN",
                    "enabled": true,
                    "codeDefinationList": [],
                    "measurementDefinitionList": [
                      {
                        "measurementOid": "MU__1_2018-08-17_064636",
                        "name": "mmHg",
                        "symbol": "",
                        "inputType": "dropdown",
                        "uniqueIdentifier": "4912a2fb-a1e9-11e8-b974-f73e1538d5f1",
                        "sourceIdentifier": null,
                        "sequence": 1,
                        "language": null,
                        "enabled": true,
                        "measurementId": 87
                      }
                    ],
                    "infoforSponsors": ""
                  },
                  {
                    "@itemId": 4,
                    "itemId": 230,
                    "codeOid": "VS_1_2018-08-17_064636",
                    "isTable": null,
                    "inputType": "textbox",
                    "inputValue": "",
                    "name": "Weight",
                    "cdashAliasName": "",
                    "codelist": "",
                    "domain": "VS",
                    "cdashCore": "Highly Recommended",
                    "sdtm": "",
                    "description": "",
                    "question": "Weight",
                    "completion_instructions": "",
                    "isElligoStandard": true,
                    "uniqueIdentifier": "4912a2fc-a1e9-11e8-b974-6312332fb925",
                    "sourceIdentifier": null,
                    "sequence": 3,
                    "language": "EN",
                    "enabled": true,
                    "codeDefinationList": [],
                    "measurementDefinitionList": [
                      {
                        "measurementOid": "MU__1_2018-08-17_064636",
                        "name": "KG",
                        "symbol": "",
                        "inputType": "dropdown",
                        "uniqueIdentifier": "4912a2fd-a1e9-11e8-b974-33b537dc8957",
                        "sourceIdentifier": null,
                        "sequence": 1,
                        "language": null,
                        "enabled": true,
                        "measurementId": 88
                      },
                      {
                        "measurementOid": "MU__1_2018-08-17_064636",
                        "name": "LB",
                        "symbol": "",
                        "inputType": "dropdown",
                        "uniqueIdentifier": "4912ca0e-a1e9-11e8-b974-712d12be1f9c",
                        "sourceIdentifier": null,
                        "sequence": 1,
                        "language": null,
                        "enabled": true,
                        "measurementId": 89
                      },
                      {
                        "measurementOid": "MU__1_2018-08-17_064636",
                        "name": "KG",
                        "symbol": "",
                        "inputType": "dropdown",
                        "uniqueIdentifier": "4912ca0f-a1e9-11e8-b974-d7e7742c55f5",
                        "sourceIdentifier": null,
                        "sequence": 1,
                        "language": null,
                        "enabled": true,
                        "measurementId": 90
                      },
                      {
                        "measurementOid": "MU__1_2018-08-17_064636",
                        "name": "LB",
                        "symbol": "",
                        "inputType": "dropdown",
                        "uniqueIdentifier": "4912ca10-a1e9-11e8-b974-091eed140d9d",
                        "sourceIdentifier": null,
                        "sequence": 1,
                        "language": null,
                        "enabled": true,
                        "measurementId": 91
                      }
                    ],
                    "infoforSponsors": ""
                  },
                  {
                    "@itemId": 5,
                    "itemId": 231,
                    "codeOid": "VS_1_2018-08-17_064636",
                    "isTable": null,
                    "inputType": "textbox",
                    "inputValue": "",
                    "name": "Systolic",
                    "cdashAliasName": "",
                    "codelist": "",
                    "domain": "VS",
                    "cdashCore": "Highly Recommended",
                    "sdtm": "",
                    "description": "",
                    "question": "Systolic",
                    "completion_instructions": "",
                    "isElligoStandard": true,
                    "uniqueIdentifier": "4912ca11-a1e9-11e8-b974-29800cf5a84f",
                    "sourceIdentifier": null,
                    "sequence": 5,
                    "language": "EN",
                    "enabled": true,
                    "codeDefinationList": [],
                    "measurementDefinitionList": [
                      {
                        "measurementOid": "MU__1_2018-08-17_064636",
                        "name": "mmHg",
                        "symbol": "",
                        "inputType": "dropdown",
                        "uniqueIdentifier": "4912ca12-a1e9-11e8-b974-510d51ba2cec",
                        "sourceIdentifier": null,
                        "sequence": 1,
                        "language": null,
                        "enabled": true,
                        "measurementId": 92
                      }
                    ],
                    "infoforSponsors": ""
                  },
                  {
                    "@itemId": 6,
                    "itemId": 232,
                    "codeOid": "VS_1_2018-08-17_064636",
                    "isTable": null,
                    "inputType": "textbox",
                    "inputValue": "",
                    "name": "Heart Rate",
                    "cdashAliasName": "",
                    "codelist": "",
                    "domain": "VS",
                    "cdashCore": "Highly Recommended",
                    "sdtm": "",
                    "description": "",
                    "question": "Heart Rate",
                    "completion_instructions": "",
                    "isElligoStandard": true,
                    "uniqueIdentifier": "4912ca13-a1e9-11e8-b974-af41d2c3be2d",
                    "sourceIdentifier": null,
                    "sequence": 10,
                    "language": "EN",
                    "enabled": true,
                    "codeDefinationList": [],
                    "measurementDefinitionList": [
                      {
                        "measurementOid": "MU_BEATS/MIN_1_2018-08-17_064636",
                        "name": "BEATS/MIN",
                        "symbol": "BEATS/MIN",
                        "inputType": "dropdown",
                        "uniqueIdentifier": "4912ca14-a1e9-11e8-b974-83e900beccc9",
                        "sourceIdentifier": null,
                        "sequence": 1,
                        "language": null,
                        "enabled": true,
                        "measurementId": 93
                      }
                    ],
                    "infoforSponsors": ""
                  },
                  {
                    "@itemId": 7,
                    "itemId": 233,
                    "codeOid": "VS_1_2018-08-17_064636",
                    "isTable": null,
                    "inputType": "textbox",
                    "inputValue": "",
                    "name": "Respiratory Rate",
                    "cdashAliasName": "",
                    "codelist": "",
                    "domain": "VS",
                    "cdashCore": "Highly Recommended",
                    "sdtm": "",
                    "description": "",
                    "question": "Respiratory Rate",
                    "completion_instructions": "",
                    "isElligoStandard": true,
                    "uniqueIdentifier": "4912ca15-a1e9-11e8-b974-3fdbdfe6f695",
                    "sourceIdentifier": null,
                    "sequence": 9,
                    "language": "EN",
                    "enabled": true,
                    "codeDefinationList": [],
                    "measurementDefinitionList": [
                      {
                        "measurementOid": "MU_BEATS/MIN_1_2018-08-17_064636",
                        "name": "BEATS/MIN",
                        "symbol": "BEATS/MIN",
                        "inputType": "dropdown",
                        "uniqueIdentifier": "4912ca16-a1e9-11e8-b974-3fd3bf63c08a",
                        "sourceIdentifier": null,
                        "sequence": 1,
                        "language": null,
                        "enabled": true,
                        "measurementId": 94
                      }
                    ],
                    "infoforSponsors": ""
                  },
                  {
                    "@itemId": 8,
                    "itemId": 234,
                    "codeOid": "VS_1_2018-08-17_064636",
                    "isTable": null,
                    "inputType": "date",
                    "inputValue": "",
                    "name": "Date Of Birth",
                    "cdashAliasName": "",
                    "codelist": null,
                    "domain": "VS",
                    "cdashCore": "Highly Recommended",
                    "sdtm": "",
                    "description": "",
                    "question": "Date Of Birth",
                    "completion_instructions": "",
                    "isElligoStandard": true,
                    "uniqueIdentifier": "4912ca17-a1e9-11e8-b974-4ff660e2c3f6",
                    "sourceIdentifier": null,
                    "sequence": 6,
                    "language": "EN",
                    "enabled": true,
                    "codeDefinationList": [],
                    "measurementDefinitionList": [],
                    "infoforSponsors": ""
                  },
                  {
                    "@itemId": 9,
                    "itemId": 235,
                    "codeOid": "VS_1_2018-08-17_064636",
                    "isTable": null,
                    "inputType": null,
                    "inputValue": "",
                    "name": "BP Location",
                    "cdashAliasName": "",
                    "codelist": "",
                    "domain": "VS",
                    "cdashCore": "Highly Recommended",
                    "sdtm": "",
                    "description": "",
                    "question": "BP Location",
                    "completion_instructions": "",
                    "isElligoStandard": true,
                    "uniqueIdentifier": "4912ca18-a1e9-11e8-b974-a9422fcb36a8",
                    "sourceIdentifier": null,
                    "sequence": 8,
                    "language": "EN",
                    "enabled": true,
                    "codeDefinationList": [
                      {
                        "codeId": 3,
                        "codeOid": "CL_1_2018-08-17_064636",
                        "name": "BP Anatomical Location",
                        "inputType": "dropdown",
                        "codedValue": null,
                        "decode": "BRACHIAL ARTERY",
                        "uniqueIdentifier": "4912ca19-a1e9-11e8-b974-7f8c65873bae",
                        "sourceIdentifier": null,
                        "sequence": 1,
                        "language": "EN",
                        "enabled": true
                      },
                      {
                        "codeId": 4,
                        "codeOid": "CL_1_2018-08-17_064636",
                        "name": "BP Anatomical Location",
                        "inputType": "dropdown",
                        "codedValue": null,
                        "decode": "ANKLE",
                        "uniqueIdentifier": "4912ca1a-a1e9-11e8-b974-39b39a774f37",
                        "sourceIdentifier": null,
                        "sequence": 1,
                        "language": "EN",
                        "enabled": true
                      }
                    ],
                    "measurementDefinitionList": [],
                    "infoforSponsors": ""
                  },
                  {
                    "@itemId": 10,
                    "itemId": 236,
                    "codeOid": "VS_1_2018-08-17_064636",
                    "isTable": null,
                    "inputType": null,
                    "inputValue": "",
                    "name": "Vital signs collected",
                    "cdashAliasName": "",
                    "codelist": "",
                    "domain": "VS",
                    "cdashCore": "Highly Recommended",
                    "sdtm": "",
                    "description": "",
                    "question": "Vital signs collected",
                    "completion_instructions": "",
                    "isElligoStandard": true,
                    "uniqueIdentifier": "4912ca1b-a1e9-11e8-b974-47fe58045c22",
                    "sourceIdentifier": null,
                    "sequence": 7,
                    "language": "EN",
                    "enabled": true,
                    "codeDefinationList": [
                      {
                        "codeId": 2,
                        "codeOid": "CL_1_2018-08-17_064636",
                        "name": "No Yes Response",
                        "inputType": "radio",
                        "codedValue": null,
                        "decode": "NO",
                        "uniqueIdentifier": "4912ca1c-a1e9-11e8-b974-79ea3457a470",
                        "sourceIdentifier": null,
                        "sequence": 2,
                        "language": "EN",
                        "enabled": true
                      },
                      {
                        "codeId": 1,
                        "codeOid": "CL_1_2018-08-17_064636",
                        "name": "No Yes Response",
                        "inputType": "radio",
                        "codedValue": "Y",
                        "decode": "YES",
                        "uniqueIdentifier": "4912ca1d-a1e9-11e8-b974-d1674542dbcc",
                        "sourceIdentifier": null,
                        "sequence": 1,
                        "language": "EN",
                        "enabled": true
                      }
                    ],
                    "measurementDefinitionList": [],
                    "infoforSponsors": ""
                  },
                  {
                    "@itemId": 11,
                    "itemId": 237,
                    "codeOid": "VS_1_2018-08-17_064636",
                    "isTable": null,
                    "inputType": "textbox",
                    "inputValue": "",
                    "name": "ID",
                    "cdashAliasName": "",
                    "codelist": null,
                    "domain": "VS",
                    "cdashCore": "Highly Recommended",
                    "sdtm": "",
                    "description": "",
                    "question": "ID",
                    "completion_instructions": "",
                    "isElligoStandard": true,
                    "uniqueIdentifier": "4912ca1e-a1e9-11e8-b974-5bcddc276594",
                    "sourceIdentifier": null,
                    "sequence": 17,
                    "language": "EN",
                    "enabled": true,
                    "codeDefinationList": [],
                    "measurementDefinitionList": [],
                    "infoforSponsors": ""
                  },
                  {
                    "@itemId": 12,
                    "itemId": 238,
                    "codeOid": "VS_1_2018-08-17_064636",
                    "isTable": null,
                    "inputType": "time",
                    "inputValue": "",
                    "name": "Visit Time",
                    "cdashAliasName": "",
                    "codelist": null,
                    "domain": "VS",
                    "cdashCore": "Highly Recommended",
                    "sdtm": "",
                    "description": "",
                    "question": "Visit Time",
                    "completion_instructions": "",
                    "isElligoStandard": true,
                    "uniqueIdentifier": "4912ca1f-a1e9-11e8-b974-d7fdb852cead",
                    "sourceIdentifier": null,
                    "sequence": 18,
                    "language": "EN",
                    "enabled": true,
                    "codeDefinationList": [],
                    "measurementDefinitionList": [],
                    "infoforSponsors": ""
                  }
                ],
                "customItemDefinationList": [],
                "labelName": "Vital Signs"
              },
              {
                "labelId": 58,
                "isRepeat": null,
                "uniqueIdentifier": "4912ca20-a1e9-11e8-b974-97e423be650b",
                "sourceIdentifier": null,
                "sequence": 1,
                "language": "EN",
                "enabled": true,
                "itemDefinationList": [],
                "customItemDefinationList": [],
                "labelName": "Vital Signs"
              }
            ]
          }
        this.setState({ inputs: tempObj},()=>{});
    }

    findLastIndexHandler = (x,currentLabelId)=>{
        var lableId = x.formLableId.replace(/[^a-zA-Z]+/g, '');
        return currentLabelId === lableId;
    }

    getFormLabelJson = (data) =>{
        ApiService.getFormLabelJson(data).then((res) => {
            let tempArray = this.state.inputs;
            tempArray.map((form,index)=>{
                var currentLabelId = res.data[0].formlabel[0].formLableId.replace(/[^a-zA-Z]+/g, '');
                let testIndex = _.findLastIndex(form.formlabel,(x)=>{return this.findLastIndexHandler(x,currentLabelId)} );
                form.formlabel.splice(testIndex+1,0,res.data[0].formlabel[0]);
            })
            this.setState({inputs : tempArray});
        });
    }

	onSaveData = ()=>{
		this.state.inputs.map((data,index)=>{
			data.formlabel.map((formLabelData,index1)=>{
				formLabelData.itemDefinationList.map((itemDef,index2)=>{
                    if(itemDef.codeDefination){
                        this.state.dataSaveObj[ data.formId + '##' + formLabelData.formLableId + '##' + itemDef.oid + '##' + itemDef.codeDefination.oid]  =  itemDef.codeDefination.value;
                    }else if(itemDef.measurementUnitDefinition){
                        this.state.dataSaveObj[ data.formId +  '##'  + formLabelData.formLableId + '##' +  itemDef.oid + '##' +  itemDef.measurementUnitDefinition.oid] = itemDef.value + '##' + (itemDef.measurementUnitDefinition.unit || itemDef.measurementUnitDefinition.value);
                    } else {
                        this.state.dataSaveObj[data.formId + '##'  + formLabelData.formLableId + '##' + itemDef.oid] = itemDef.value;
                    }
				})
			})
        });
        ApiService.saveDynamicFormJson(JSON.stringify(this.state.dataSaveObj)).then((res) => {
            if(res.status === 200){
                NotificationManager.success('Data Save Successfully');
            }else{
                NotificationManager.error('Something went wrong');
            }
        });
    }

    getFormatedSubelementName = (name) =>{
        let numbers = name && name.match(/\d+/g)
        if(numbers){
            let updatedName = name && `${name.split(numbers && numbers[0])[0]} ${numbers && numbers[0]}`;
            return updatedName
        }
        return name;
    }

    getFormElementClasses = (formData,itm)=>{
        let cls = `form-group mt-0 col-md-4 col-lg-4 pl-0 ${formData.name}-form-grp`;
        if(formData.name === 'CO' && itm.name==="Notes" && itm.input_type==="textarea"){
            cls = `form-group mt-0 col-md-12 col-lg-12 pl-0 ${formData.name}-form-grp`;
        }
        return cls;
    }

    render({props,state} = this) {
        return (
        <div className='encounter-detail vital-sign'>
              <GetDomainDetailElements data={this.state.inputs} elementType={this.props.match.params &&  this.props.match.params.elementType}/>
          </div>
        );
    }
}

export default ElementForm;