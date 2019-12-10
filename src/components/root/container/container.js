/**
* Copyright (c) 2018
* @summary Application routing functionality
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*/

import React, { Component } from 'react';
//import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom';
import { Route, HashRouter, Switch, Redirect } from 'react-router-dom';
import Layout from '../layout/layout';
import PatientDetails from '../../patientdetails/patientdetails';
import ActivityList from '../../activitylist/activitylist';
import EncounterDetails from '../../encounter/encounterdetails';
import Screened from  '../../encounter/screened';
import ModalRoot from '../modalRoot';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import StudySiteDetails from '../../studysetup/studySiteDetails';
import PatientDescription from '../../patientdetails/patientdescription';
import ProtocolSetup from '../../protocol-setup/protocolSetup'
import ProtocolDetails from '../../protocol-details/protocolDetails'
import ProtocolPreview from '../../protocol-setup/previewSetup';
 import ProtocolSetupNew from '../../protocol-setup-new/protocolSetup';
import ProtocolElementSetup from '../../protocol-encounter-setup';
import Loader  from '../../loader/LoadManager';
import SiteDetails from '../../studysetup/siteDetails';
import PreviewProtocolSetup from '../../protocol-preview';
import { LastLocationProvider } from 'react-router-last-location';
import IcfDetails from '../../encounter/icf';
import ElementSetupNew from '../../studysetup/element-setup/elementSetupNew';
import ReviewPI from '../../encounter/reviewPI';
import EncounterDescription from '../../encounter/encounterDescNew';
import GetDomainDetailsElement from '../../encounter/getDomainDetailElements';
import SummaryPage from '../../landing-Page/summary';
import IcfSetup from '../../icfsetup/icfsetup';
import IrbSetup from '../../icfsetup/irbsetup';
import Common from '../../../common/common';
import { connect } from 'react-redux' ;
import patientProgress from '../../reports/patientProgress';
import studyMetrics from '../../reports/studyMetrics';
import CraPatientList from '../../cra/craPatientList';

const UserAuth = {
  isAuthenticated: false,
  authenticate(com,rxProps) {

    this.isAuthenticated = true;
    let infoL = Common.getLoginUserInfo();
    const accessInfo = infoL ? infoL :  rxProps.rxProps.loginUserInfo;
    if(com.location && com.location.pathname){
      if(com.location.pathname.indexOf("protocol-details")>-1 && accessInfo &&  accessInfo.menuAccess && accessInfo.menuAccess.indexOf("ST")>-1){
          return true;
      }
      else if(com.location.pathname.indexOf("patientdetails")>-1 && accessInfo &&  accessInfo.menuAccess && accessInfo.menuAccess.indexOf("PL")>-1){
        return true;
      }
      else if(com.location.pathname.indexOf("craPatientList")>-1 && accessInfo &&  accessInfo.menuAccess && accessInfo.menuAccess.indexOf("PLA")>-1){
        return true;
      }
      else if(com.location.pathname.indexOf("activitylist")>-1 && accessInfo &&  accessInfo.menuAccess && accessInfo.menuAccess.indexOf("AL")>-1){
        return true;
      }
      else if(com.location.pathname.indexOf("studysitedetails")>-1 && accessInfo &&  accessInfo.menuAccess && ( accessInfo.menuAccess.indexOf("ST") || accessInfo.menuAccess.indexOf("STD")>-1 ) ){
        return true;
      }
      else{

        NotificationManager.error("Unauthorized access")
        return false;
      }
    }
    return true
  }
};

class Container extends Component {

  constructor(props, context){
      super(props, context);
    }

  render() {
    return (
      <HashRouter>
          <LastLocationProvider>
        <div className="page-outer-container">
          <Switch>
            <Layout>
               <Route exact path='/'   component={(props) => <ProtocolSetup {...props} />} />
                <PrivateRoute exact path='/patientdetails' rxProps={this.props}   component={() => <PatientDetails  patientlist={[]} />} />
                <PrivateRoute exact path='/activitylist' rxProps={this.props}   component={() => <ActivityList />} />
                <Route exact path='/encounterdetails'  component={EncounterDetails} />
                <Route exact path='/screened'  component={Screened} />
                <PrivateRoute exact path='/studysitedetails' rxProps={this.props} component={(props) => <StudySiteDetails {...props} />}/>
                <PrivateRoute exact path='/patientdetails/patientdescription/:patientId' rxProps={this.props} component={PatientDescription} />
                <PrivateRoute exact path='/patientdetails/patientdescription/patientEncounter/:patientId/:patDetailIdentity/:studyIdentity/:siteIdentifier/:epochIdentifier' rxProps={this.props}  component={(props) => <EncounterDescription {...props} />} />
                {/* <PrivateRoute exact path='/protocol-details/protocol-setup/:study/:versionId/:studyId/:protocolVersion/:protocolName/:protocolIdentity' rxProps={this.props} component={ProtocolSetupNew} /> */}
                <PrivateRoute exact path='/protocol-details/protocol-setup-new/:study/:versionId/:studyId/:protocolVersion/:protocolName/:protocolIdentity' rxProps={this.props} component={ProtocolSetup} />

                <PrivateRoute exact path='/protocol-preview' component={ProtocolPreview} />
                <PrivateRoute exact path='/protocol-details' rxProps={this.props} component={ProtocolDetails} />
                <PrivateRoute exact path='/patientdetails/patientdescription/patientEncounter/element/:uniqIdenfier/:elementFormIdenfier/:patEncId/:patDetailIdentity/:studyIdentity/:siteIdentifier/:epochIdentifier'  rxProps={this.props} component={GetDomainDetailsElement} />

                <PrivateRoute exact
                    path='/protocol-details/protocol-setup-new/protocol-element-setup/:study/:versionId/:studyId/:protocolVersion/:protocolName/:protocolIdentity/:domain_key/:element_name'
                    rxProps={this.props}
                   component={ElementSetupNew} />
                <PrivateRoute exact
                      path='/protocol-details/protocol-setup-new/protocol-encounter-setup/protocol-element-setup/:study/:versionId/:studyId/:protocolVersion/:protocolName/:protocolIdentity/:domain_key/:element_name/:element_logo/:who_did/:when_did/:element_identifier'
                      rxProps={this.props}
                     component={ElementSetupNew} />
                <PrivateRoute exact
                      path='/protocol-details/protocol-setup-new/protocol-encounter-setup/:study/:versionId/:studyId/:protocolVersion/:protocolName/:protocolIdentity'
                      rxProps={this.props}
                     component={ProtocolElementSetup} />
                <PrivateRoute exact path='/protocol-details/setup-preview/:study/:versionId/:studyId/:protocolVersion/:publishDate/:protocolName/:protocolStatus/:protocolIdentity' rxProps={this.props} component={PreviewProtocolSetup} />
                <PrivateRoute exact path='/studysitedetails/siteDetails/:siteName/:studyName' rxProps={this.props} component={(props)=> <SiteDetails {...props} />} />
                <Route exact path='/encounterdetails/icf/'  component={IcfDetails} />
                <Route exact path='/encounterdetails/reviewpi'  component={ReviewPI} />
                <Route exact path='/elementSetupNew'  component={ElementSetupNew} />
                <Route exact path='/summary'   component={(props) => <SummaryPage {...props} />} />
                <Route exact path='/irbSetup/icfSetup'  component={IcfSetup} />
                <Route exact path='/irbSetup'  component={IrbSetup} />
                <Route exact path='/patientProgress'  component={patientProgress} />
                <Route exact path='/studyMetrics'  component={studyMetrics} />
                <Route exact path='/craPatientList' component={() => <CraPatientList />} />
               <ModalRoot />
               <NotificationContainer/>
               <Loader/>
            </Layout>
          </Switch>
        </div>
        </LastLocationProvider>
      </HashRouter>
    );
  }
}

function mapStateToProps(state){
  return {
      loginUserInfo : state.login
  }
}

export default connect(mapStateToProps)(Container);;


const PrivateRoute = ({ component : Component , ...rest}) =>(
    <Route {...rest} render = { (props) =>

        ( UserAuth.authenticate(props,rest) ?  (
          <Component {...props} />
        ) :
        <Redirect
            to={{
              pathname: "/",
              state: { from: props.location }
            }}
          />
         ) }
    />
)