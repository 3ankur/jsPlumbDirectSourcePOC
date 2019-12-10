/**
* Copyright (c) 2018
* @summary Application full Encounter Modal
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React,{Component} from 'react';
import { connect } from 'react-redux';
import Modal from '../modaldialog/modal';
// import ReactTable from "react-table";
import 'react-table/react-table.css';
// import ApiService from '../../api';
// import Common from '../../common/common';
import ReactToPrint from './reacttoprint';
import PrintFullEncounterData from '../../components/patientdetails/fullEncounterPrintFun';


const status = {
    "0": "--",
    "1" : "Completed",
    "2" : "Not performed",
    "3" : "Never Get",
    "4" : "Incomplete"
}


class FullEncounter extends Component{

    constructor(props){
        super(props);
        this.state = {

        }
    }

    getAnswerValues(data){
    if(data){

        if(data.indexOf("$$###$$")>-1){
           return  data.split("$$###$$").join(",")
        }
    }
        return data;

    }

    getFormattedListItem = ()=>{
        let prevState = this.state.patientFEDetails;
        let tempArray = [];
        if(prevState.hasOwnProperty('formList') && prevState.formList && prevState.formList.length > 0){
            prevState.formList.forEach((formElement)=>{
                formElement.encounterAttribute.forEach((formQuestion)=>{
                    formQuestion.encounterAttributeValue.forEach((formAnswer)=>{
                        let tempFormElementObj = {};
                        tempFormElementObj['domainName'] = formElement.domainName;
                        tempFormElementObj['questionString'] = formQuestion.questionString ? formQuestion.questionString : '--';
                        tempFormElementObj['updatedDateTime'] = formAnswer.updatedDateTime;
                        tempFormElementObj['performedUser'] = formAnswer.performedUser ? formAnswer.performedUser : "SYSTEM";
                        tempFormElementObj['previousValue'] = formAnswer.previousValue ? this.getAnswerValues(formAnswer.previousValue)  : "--" ;
                        tempFormElementObj['currentValue'] =   formAnswer.currentValue ? this.getAnswerValues(formAnswer.currentValue ) : "--" ;
                        tempFormElementObj['performStatus'] = status[formAnswer.performStatus];
                        tempFormElementObj['subelement'] = formAnswer.subelement;
                        tempFormElementObj['alldata'] = formAnswer;
                        tempArray.push(tempFormElementObj);
                    });
                });
                this.setState({
                    formattedListItemData : tempArray
                },()=>{});
            });
        }
    }

    componentDidMount(){
        // if(this.props.encounterGroupIdentifier){
        //     ApiService.getEncounterFEDetails(this.props.encounterGroupIdentifier.original.uniqueIdentifier).then((res)=>{
        //         this.setState({patientFEDetails:res.data.response},()=>{
        //            this.getFormattedListItem();
        //         })
        //     });
        // }
    }

    onClose = () => {
        this.props.hideModal && this.props.hideModal();
        if (this.props.afterClose) {
            this.props.afterClose();
        }
    };

    render({props,state} = this){
        let { afterClose, hideModal } = props;
        return (
            <Modal className={props.className}>
                <div className="modal-header border-bottom-p mx-4 p-0 py-3">
                    <h5 className="modal-title c-p" id="exampleModalLabel">Full Encounter Summary</h5>
                    <ReactToPrint
                        trigger={() => <div className="printicon" title="Print"><i className="material-icons bluetxt">print</i></div>}
                        content={() => this.componentRef}
                        printHeading="Full Encounter Summary"
                    />
                    <button type="button" className="close c-p" onClick={this.onClose}> <span aria-hidden="true">&times;</span> </button>
                </div>
                <div className="modal-body px-4 text-left">
                    <PrintFullEncounterData ref={el => {(this.componentRef = el) }} fromCraPatientReport={this.props.fromCraPatientReport} encounterGroupIdentifier={this.props.encounterGroupIdentifier && this.props.encounterGroupIdentifier.original.uniqueIdentifier} />
                </div>
            </Modal>
        );
    }

}

const FullEncounterData = {
    encounterInfo : [{
        "study":"EL-12",
        "subjectId":"1234",
        "site":"Austin OBGYN",
        "encounterDate":"16/Apr/2018 0:09:04",
        "patient":"Smith",
        "checkin":"Yes",
        "epoch":"Screening",
        "encounter":"E2"
    }],
    patientReminder : [
        // 'Remind the patient that the IP is to be taken daily in the numbered order',
        // 'Remind the patient that the IP is to be taken before the visit of the next encounter',
        // 'Remind the patient to fill out the eDiary daily',
        // 'Remind the patient of the proper procedure for the rescure medication',
        // 'Remind the patient of the next Encounter'
    ],
    listItemTable : [
        // {
        //     "datetime" : "16/Apr/2018 00:09:04",
        //     "element":"Screening",
        //     "subelement":"1805",
        //     "question":"Is the Patient Diabetic",
        //     "previousAns":"Null",
        //     "newAns":"No",
        //     "previousState":"Incomplete",
        //     "newState":"Complete",
        //     "byUser":"James"
        // },
        // {
        //     "datetime" : "16/Apr/2018 00:09:04",
        //     "element":"Screening",
        //     "subelement":"1805",
        //     "question":"Is the Patient Diabetic",
        //     "previousAns":"Null",
        //     "newAns":"No",
        //     "previousState":"Incomplete",
        //     "newState":"Complete",
        //     "byUser":"James"
        // },
        // {
        //     "datetime" : "16/Apr/2018 00:09:04",
        //     "element":"Screening",
        //     "subelement":"1805",
        //     "question":"Is the Patient Diabetic",
        //     "previousAns":"Null",
        //     "newAns":"No",
        //     "previousState":"Incomplete",
        //     "newState":"Complete",
        //     "byUser":"James"
        // },
        // {
        //     "datetime" : "16/Apr/2018 00:09:04",
        //     "element":"Screening",
        //     "subelement":"1805",
        //     "question":"Is the Patient Diabetic",
        //     "previousAns":"Null",
        //     "newAns":"No",
        //     "previousState":"Incomplete",
        //     "newState":"Complete",
        //     "byUser":"James"
        // }, {
        //     "datetime" : "16/Apr/2018 00:09:04",
        //     "element":"Screening",
        //     "subelement":"1805",
        //     "question":"Is the Patient Diabetic",
        //     "previousAns":"Null",
        //     "newAns":"No",
        //     "previousState":"Incomplete",
        //     "newState":"Complete",
        //     "byUser":"James"
        // }
    ],
    dateOfNextEncounter:"Saturday, April 14th, 2018 11:00 AM"
}

export default connect(null, null )(FullEncounter);