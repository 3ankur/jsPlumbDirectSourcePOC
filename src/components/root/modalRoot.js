import React from 'react';
import { connect } from 'react-redux';
import AddPatientModal from '../patientdetails/addPatientModal';
import EpochDetailsModal from '../protocol-setup/epochDetailsModal';
import EncounterDetails from '../protocol-setup/encounterDetailsModal'
import ConfirmPopUp from '../../common-modals/confirm'
import GreenPhire from '../patientdetails/addGreenPhire';
import AddSiteModal from '../patientdetails/addSiteModal';
import SheduleEncounter from '../../common-modals/sheduleEncounter';
import AddStudyModal from '../patientdetails/addStudyModal';
import FullEncounterModal from '../patientdetails/fullEncounter';
import PatientEncounterModal from '../patientdetails/patientEncounter';
import PersonnelDetailModal from '../studysetup/addPersonnel';
import AlertPopUp from '../../common-modals/alert';
import PublishModal  from '../protocol-setup/publishModal';
import ElementFormModal from '../studysetup/elementFormModal';
import SubElementModal from '../studysetup/subElementModal';
import NotifyModal from '../../common-modals/notifyPopup';
import ElementListModal from '../studysetup/element-setup/elementlistpopup'
//import Authenticate from '../../common-modals/modalAuthentication';
import EnvelopeStatus from '../encounter/envelopeStatusPopup';
import RecipentStatus from '../encounter/recipentStatusPopup';
import ElementPreviewModal from '../studysetup/elementPreviewModal';
import AddWithDrawModal from '../patientdetails/addWithdraw';
import AuditTrail from '../protocol-details/auditTrailPopup';
import RemainingElement from '../encounter/elementNotSaveModal';
import ActivityListPostItModal from '../activitylist/activityListPostItModal';
import AddIrbSetup from '../icfsetup/irbsetupModal';
import AddIcfSetup from '../icfsetup/icfsetupModal';
import DndReason from '../encounter/dndPopup';
import EditFormFields from '../studysetup/element-setup/editFormFields';
import EditFormAnswerFields from '../studysetup/element-setup/editFormAnswerFields';




import { MODAL_TYPE_Add_Patient,
         MODAL_TYPE_EPOCH_DETAILS,
         MODAL_TYPE_ENCOUNTER_DETAILS,
         MODAL_TYPE_GREEN_PHIRE,
         MODAL_TYPE_CONFIRM_POPUP,
         MODAL_TYPE_ADD_SITE,
         MODAL_TYPE_SHEDULE_ENCOUNTER,
         MODAL_TYPE_STUDY_MODAL,
         MODAL_TYPE_FULL_ENCOUNTER,
         MODAL_TYPE_PATIENT_ENCOUNTER,
         MODAL_TYPE_PERSONNEL_DETAILS,
         MODAL_TYPE_ALERT_POPUP,
         MODAL_TYPE_PUBLISH_SETUP,
         MODAL_TYPE_ELEMENT_FORM,
         MODAL_TYPE_SUBELEMENT,
         MODAL_TYPE_NOTIFY,
         MODAL_TYPE_ELEMENT_LIST,
         MODAL_AUTHENTICATION ,
         MODAL_ENVELOPSTATUS,
         MODAL_RECIPENTSTATUS,
         MODAL_TYPE_ELEMENT_PREVIEW,
         MODAL_TYPE_WITHDRAW,MODAL_AUDIT_TRAIL,
         MODAL_TYPE_REMAINING_ELEMENT,
         MODAL_TYPE_ACTIVITY_LIST_POST_IT,
         MODAL_TYPE_ADD_IRB_SETUP,
         MODAL_TYPE_ADD_ICF_SETUP,
         MODAL_TYPE_DND,
         MODAL_TYPE_EDIT_FORM_FEILDS,MODAL_TYPE_EDIT_FORM_ANSWER_FIELDS } from '../../constants/modalTypes';

const MODAL_COMPONENTS = {
    [MODAL_TYPE_Add_Patient]: AddPatientModal,
    [MODAL_TYPE_EPOCH_DETAILS]: EpochDetailsModal,
    [MODAL_TYPE_ENCOUNTER_DETAILS]:EncounterDetails,
    [MODAL_TYPE_GREEN_PHIRE]:GreenPhire,
    [MODAL_TYPE_CONFIRM_POPUP]:ConfirmPopUp,
    [MODAL_TYPE_ADD_SITE]:AddSiteModal,
    [MODAL_TYPE_SHEDULE_ENCOUNTER]:SheduleEncounter,
    [MODAL_TYPE_STUDY_MODAL]: AddStudyModal,
    [MODAL_TYPE_FULL_ENCOUNTER]:FullEncounterModal,
    [MODAL_TYPE_PATIENT_ENCOUNTER]:PatientEncounterModal,
    [MODAL_TYPE_PERSONNEL_DETAILS] : PersonnelDetailModal,
    [MODAL_TYPE_ALERT_POPUP] : AlertPopUp,
    [MODAL_TYPE_PUBLISH_SETUP]:PublishModal,
    [MODAL_TYPE_ELEMENT_FORM]:ElementFormModal,
    [MODAL_TYPE_SUBELEMENT]:SubElementModal,
    [MODAL_TYPE_NOTIFY]:NotifyModal,
    [MODAL_TYPE_ELEMENT_LIST]:ElementListModal,
    //[MODAL_AUTHENTICATION]:Authenticate,
    [MODAL_ENVELOPSTATUS]:EnvelopeStatus,
    [MODAL_RECIPENTSTATUS]:RecipentStatus,
    [MODAL_TYPE_ELEMENT_PREVIEW]:ElementPreviewModal,
    [MODAL_TYPE_WITHDRAW]:AddWithDrawModal,
    [MODAL_AUDIT_TRAIL]:AuditTrail,
    [MODAL_TYPE_REMAINING_ELEMENT]:RemainingElement,
    [MODAL_TYPE_ACTIVITY_LIST_POST_IT]:ActivityListPostItModal,
    [MODAL_TYPE_ADD_IRB_SETUP] : AddIrbSetup,
    [MODAL_TYPE_ADD_ICF_SETUP] : AddIcfSetup,
    [MODAL_TYPE_DND] : DndReason,
    [MODAL_TYPE_EDIT_FORM_FEILDS]:EditFormFields,
    [MODAL_TYPE_EDIT_FORM_ANSWER_FIELDS]:EditFormAnswerFields

};

const ModalRoot = ({ type, props }) => {
  if (!type) {
    return null;
  }


  const ModalComponent = MODAL_COMPONENTS[type];
  return <ModalComponent {...props} />;
};

export default connect(state => state.modal)(ModalRoot);
