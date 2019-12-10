import React,{Component,Children} from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import ActivitySummery from '../landing-Page/activitysummary';
import StudySummary from '../landing-Page/studySummary';
import { connect } from 'react-redux' ;
import ScheduleDetailViewSummary from '../landing-Page/scheduleDetailViewSummary';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';
import common from '../../../src/common/common';
import ApiService from '../../../src/api';
import { NotificationManager } from 'react-notifications';


BigCalendar.momentLocalizer(moment);

const renderTooltipOverlay = (event)=>{
  return <div>
      {event.patients && event.patients[0].description && <div>
          <div>
              {event.patients[0].description.encounter ? event.patients[0].description.encounter :'--'}
          </div>
          <div>
             {event.patients && event.patients[0].description.epoch ? event.patients[0].description.epoch :'--'}
          </div>
      </div>}
  </div>
}

const CURRENT_DATE = moment().toDate();

class bigcalender extends Component{
    constructor(props){
      super(props);
      this.state = {
        events: [],
        patientSheduleData : [],
      }
      this.dummyData = []
    }

    loadCalendarData = (date)=>{
      ApiService.getCalendarSummaryData(date,1).then((res) => {
        if(res && res.data && res.data.response){
            let getShedulePatientData = res.data.response.filter((item)=>{return item.patientCount != 0});
            getShedulePatientData.length && getShedulePatientData.forEach((item)=>{
              let startDate =  item.startDate && moment(item.startDate, ['MM/DD/YYYY HH:mm','DD/MM/YYYY HH:mm']);
              let endDate =  item.endDate && moment(item.endDate, ['MM/DD/YYYY HH:mm','DD/MM/YYYY HH:mm']);
               item['start'] =   startDate._d;
               item['end'] = endDate._d;
               item['title'] = item.displayText;
            });
            this.setState({events:getShedulePatientData},()=>{
              var tt = document.getElementsByClassName("rbc-event");
                if(tt.length){
                  for(var i=0;i<tt.length;i++){
                    tt[i].title = ""
                    }
                }
            });
        }
      },(err)=>{})
    }


    componentDidMount(){
      let date = common.formatDate(new Date(),'DD/MMM/YYYY');
      this.loadCalendarData(date);
      var curr = new Date(); // get current date
      var first = curr.getDate() - curr.getDay()+1; // First day is the day of the month - the day of the week
      var last = first + 4; // last day is the first day + 4
      var firstday = new Date(curr.setDate(first)).toUTCString();
      var lastday = new Date(curr.setDate(last)).toUTCString();
      console.log('firstDay', firstday ,'----------- lastday', lastday);
      this.sheduleDetailViewData('week');
    }

    sheduleDetailViewData = (timestamp)=>{
      ApiService.getPatientSheduleDetailSummaryData(timestamp).then((res) => {
        if(res && res.data && res.data.response){
          this.setState({ patientSheduleData : res.data.response })
        }
      }, (error) => {
          common.clearNotification();
          NotificationManager.error('something went wrong');
      });
    }

    customEvent = ({ event }) => {
      return <div>
        <span>{event.displayText || event.title}</span>
        </div>
    }

    MyToolbar = (a,b,c,d)=>{
      console.log('toolbar',a,b,c,d)
      return <div>test</div>
    }

    onNavigate = (selectedWeekDate)=>{
      let date = common.formatDate(selectedWeekDate,'DD/MMM/YYYY');
      this.loadCalendarData(date);
     // console.log('onNavigate',selectedWeekDate)
    }

    onSelectEventClick = (eventObj)=>{
      if(eventObj){
        this.sheduleDetailViewData(eventObj.uniqueIdentifier);
      }
    }

  render(){
    const { localizer } = this.props
    console.log('render state',this.state.events)
    // let today = moment();
    // let am7 = today.set('hour', 7).set('minutes', 0).toDate();
    // let pm9 = today.set('hour', 22).set('minutes', 0).toDate();
    return(
        <div className="footpadb">
          {(this.props.loginUserInfo.role =="ROLE_CRA" || this.props.loginUserInfo.role =="ROLE_EXTERNAL_AUDITOR" )? "" :
          <div>
              <section>
                <div className="row p-2 m-0 mb-2">
                  <div className="col-md-6 pr-2">
                  <img className="img-fluid" src={"assets/images/elogo.png"} />
                    <div className="col p-0 pt-2"><h5 className="c-p">Patient Schedule</h5></div>
                    <div className="col-12 px-0 activitylisttable">
                        <BigCalendar
                          selectable={false}
                          messages={{next:"Next Week",previous:"Previous Week",today:"Today"}}
                          localizer={localizer}
                          events={this.state.events}
                          views={['week']}
                          view={'week'}
                          onView={()=>{}}
                          step={30}
                          eventPropGetter = {(e) => ({className: 'calendarEventBgColor' })}
                          showMultiDayTimes={false}
                          onSelectEvent={this.onSelectEventClick}
                          onNavigate={this.onNavigate}
                          components={{
                            event : this.customEvent
                          }}
                        />
                    </div>
                  </div>
                  <div className="col-md-6 pl-0 pr-0">
                      <ScheduleDetailViewSummary patientSheduleData={this.state.patientSheduleData} />
                  </div>
                </div>
              </section>
              <section>
                <div className="row">
                  <div className="col-md-6 pl-4 pr-0">
                      <ActivitySummery/>
                  </div>
                  <div className="col-md-6 pl-0 pr-4">
                      <StudySummary/>
                  </div>
                </div>
              </section>
            </div>}
        </div>
      )
  }

}

  function mapStateToProps(state){
    return {
        loginUserInfo : state.login,
        patientInfo  : state.getPatientInfo
    }
  }

export default  connect(mapStateToProps)(bigcalender);
