/**
* Copyright (c) 2018
* @summary Application Patient Encounter Modal
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React,{Component} from 'react';
import { connect } from 'react-redux';
import Modal from '../modaldialog/modal';
import ApiService from '../../api';
import PrintPatientEncounterSummaryData from '../../components/patientdetails/printPatientEncounterSummaryData';
import ReactToPrint from './reacttoprint';
import '../../../src/index.css';


class PatientEncounter extends Component{

    constructor(props){
        super(props);
        this.state = {
            peDetails:{}
        }
    }

    componentDidMount(){
       if(this.props.encounterGroupIdentifier.original &&  this.props.encounterGroupIdentifier.original.uniqueIdentifier){
        ApiService.getEncounterPEDetails(this.props.encounterGroupIdentifier.original.uniqueIdentifier).then((res) => {
             if(res.data && res.data.response){
                 this.setState({peDetails:res.data.response});
             }
        }, (error) => {
           // common.clearNotification();
           // NotificationManager.error('Something Went Wrong');
        });

       }

    }
    onClose = () => {
       // hideModal();
        this.props.hideModal && this.props.hideModal();
        if (this.props.afterClose) {
            this.props.afterClose();
        }
    };

    onPrintTest = ()=>{
        // var elem  = document.getElementById("root");
	    // var domClone = elem.cloneNode(true);
	    // var $printSection = document.getElementById("printSection");
	    // if (!$printSection) {
	    //     var $printSection = document.createElement("div");
	    //     $printSection.id = "printSection";
	    //     document.body.appendChild($printSection);
	    // }
	    // $printSection.innerHTML = "";
	    // $printSection.appendChild(domClone);
        // window.print();
        var divElements = document.getElementById('printSection').innerHTML;

        var newWin = window.frames["printf"];
        newWin.write('<body>'+ divElements + '</body>');
        //contentWindow
        newWin.focus();
        newWin.print();
        //Get the HTML of whole page
        //var oldPage = document.body.innerHTML;

        //Reset the page's HTML with div's HTML only
        //document.body.innerHTML =
        //  "<html><head><title></title></head><body>" +
         // divElements + "</body>";

        //Print Page
       // window.print();
        //window.close();
        //Restore orignal HTML
       // document.body.innerHTML = oldPage;
    }


    render({props} = this){
        let { afterClose, hideModal } = props;
        return (
            <Modal className={props.className}>
                <div className="modal-header border-bottom-p mx-4 p-0 py-3">
                    <h5 className="modal-title c-p" id="exampleModalLabel">Patient Encounter Summary</h5>
                    {/* <button class='btn btn-default' onClick={this.onPrintTest}>Print Test</button> */}
                    <ReactToPrint
                        trigger={() => <div className="printicon" title="Print"><i className="material-icons bluetxt">print</i></div>}
                        content={() => this.componentRef}
                        copyStyles={true}
                        printHeading="Patient Encounter Summary"
                    />
                    <button type="button" className="close c-p" title='Close' data-dismiss="modal" aria-label="Close" onClick={this.onClose}> <span aria-hidden="true">&times;</span> </button>
                </div>
                <div className="modal-body px-4 text-left">
                    <PrintPatientEncounterSummaryData ref={el => { console.log('print data',el);(this.componentRef = el) }} fromCraPatientReport={this.props.fromCraPatientReport} peDetails={this.state.peDetails} />
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
        'Remind the patient that the IP is to be taken daily in the numbered order',
        'Remind the patient that the IP is to be taken before the visit of the next encounter',
        'Remind the patient to fill out the eDiary daily',
        'Remind the patient of the proper procedure for the rescure medication',
        'Remind the patient of the next Encounter'
    ],
    listItemTable : [
        {
            "datetime" : "16/Apr/2018 00:09:04",
            "element":"Screening",
            "subelement":"1805",
            "question":"Is the Patient Diabetic",
            "previousAns":"Null",
            "newAns":"No",
            "previousState":"Incomplete",
            "newState":"Complete",
            "byUser":"James"
        },
        {
            "datetime" : "16/Apr/2018 00:09:04",
            "element":"Screening",
            "subelement":"1805",
            "question":"Is the Patient Diabetic",
            "previousAns":"Null",
            "newAns":"No",
            "previousState":"Incomplete",
            "newState":"Complete",
            "byUser":"James"
        },
        {
            "datetime" : "16/Apr/2018 00:09:04",
            "element":"Screening",
            "subelement":"1805",
            "question":"Is the Patient Diabetic",
            "previousAns":"Null",
            "newAns":"No",
            "previousState":"Incomplete",
            "newState":"Complete",
            "byUser":"James"
        },
        {
            "datetime" : "16/Apr/2018 00:09:04",
            "element":"Screening",
            "subelement":"1805",
            "question":"Is the Patient Diabetic",
            "previousAns":"Null",
            "newAns":"No",
            "previousState":"Incomplete",
            "newState":"Complete",
            "byUser":"James"
        }, {
            "datetime" : "16/Apr/2018 00:09:04",
            "element":"Screening",
            "subelement":"1805",
            "question":"Is the Patient Diabetic",
            "previousAns":"Null",
            "newAns":"No",
            "previousState":"Incomplete",
            "newState":"Complete",
            "byUser":"James"
        }
    ],
    dateOfNextEncounter:"Saturday, April 14th, 2018 11:00 AM"
}
const listItemColumns = [
    {
        Header: 'Date Time',
        accessor: 'datetime'
    },
    {
        Header: 'Element',
        accessor: 'element'
    },
    {
        Header: 'Sub Element',
        accessor: 'subelement'
    },
    {
        Header: 'Question',
        accessor: 'question'
    },
    {
        Header: 'Previous Answer',
        accessor: 'previousAns'
    },
    {
        Header: 'New Answer',
        accessor: 'newAns'
    },
    {
        Header: 'Previous State',
        accessor: 'previousState'
    },
    {
        Header: 'New State',
        accessor: 'newState'
    },
    {
        Header: 'By User',
        accessor: 'byUser'
    }
]

export default connect(null, null )(PatientEncounter);
