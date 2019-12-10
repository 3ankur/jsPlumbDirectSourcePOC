/**
* Copyright (c) 2018
* @summary Shows BreadCrumbs on Top of Page
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import Route from 'route-parser';

const routes = {
  '/': 'Summary',
  '/about': 'About',
  '/studysitedetails': 'Study Setup',
  '/studysitedetails/siteDetails/:siteName/:studyName': 'Site Details',
  '/protocol/:id/:verson/:name' : 'Protocol',
  '/element-setup':'Element Setup',
  '/protocol-details' : 'Source Data Details',
  '/protocol-details/setup-preview/:study/:versionId/:studyId/:protocolVersion/:publishDate/:protocolName/:protocolStatus/:protocolIdentity' : 'Source Data Preview',
  '/protocol-details/protocol-setup-new/:study/:versionId/:studyId/:protocolVersion/:protocolName/:protocolIdentity' : 'Source Data Setup',
  '/protocol-details/protocol-setup-new/protocol-encounter-setup/:study/:versionId/:studyId/:protocolVersion/:protocolName/:protocolIdentity' : 'Encounter Setup',
  '/protocol-details/protocol-setup-new/protocol-element-setup/:study/:versionId/:studyId/:protocolVersion/:protocolName/:domain_key/:element_name':'ItemGroup Setup',
  '/protocol-details/protocol-setup-new/protocol-encounter-setup/protocol-element-setup/:study/:versionId/:studyId/:protocolVersion/:protocolName/:domain_key/:element_name/:element_logo/:who_did/:when_did/:element_identifier':'ItemGroup Setup',
  '/encounterdetails' : 'Encounter Details',
  '/patientdetails/patientdescription/patientEncounter/element/:uniqIdenfier/:elementFormIdenfier/:patEncId/:patDetailIdentity/:studyIdentity': 'Type',
  '/patientdetails' : 'Patient List',
  '/patientdetails/patientdescription/:patientId' : 'Patient Info',
  '/patientdetails/patientdescription/patientEncounter/:patientId/:patDetailIdentity/:studyIdentity/:siteIdentifier/:epochIdentifier' : 'Encounter Detail',
  '/irbSetup' : 'IRB Setup',
  '/irbSetup/icfSetup' : 'ICF Setup',
  '/summary':'Summary',
  '/activitylist' : "Activity List",
  '/patientProgress' : "Patient Progress Report",
  '/studyMetrics' : "Study Metrics Report",
  '/craPatientList' : "Patient List (Audit)"
};

const isFunction = value => typeof value === 'function';
let userRole={};
const getPathTokens = pathname => {
  const paths = [''];
  if (pathname === '/') {
    paths.push('/');
    return paths
  }
  pathname.split('/').reduce((prev, curr) => {
    const currPath = `${prev}/${curr}`;
    paths.push(currPath);
    return currPath;
  });
  return paths;
};

function getRouteMatch(routes, path) {
  return Object.keys(routes)
    .map(key => {
        if(key ===`/protocol-details/protocol-setup-new/:study/:versionId/:studyId/:protocolVersion/:protocolName/:protocolIdentity` &&
        (path &&  path.indexOf("/protocol-details/protocol-setup-new/protocol-encounter-setup/")>-1)){
      }
      const params = new Route(key).match(path);
      return {
        didMatch: params !== false,
        params,
        key
      };
    })
    .filter(item => {
      return item.didMatch == true
    })[0];
}

function getEncounterType(loc){
  let route = new Route(loc);
  let params =  route.match(window.location.hash)
  return  params.elementType  ? params.elementType : "ItemGroup"
}

function getBreadcrumbs({ match, location }) {
  const pathTokens = getPathTokens(location.pathname);
  return pathTokens.map((path, i) => {
    const routeMatch = getRouteMatch(routes, path);
    const routeValue = routeMatch && routes[routeMatch.key];
    const name = isFunction(routeValue)
      ? routeValue(routeMatch.params)
      : routeValue;
    return { name, path };
  });
}

function Breadcrumbs({ match, location,encounterType,loginUserInfo }) {
  userRole=loginUserInfo;
  const breadcrumbs = getBreadcrumbs({  match, location });
    if(location && location.pathname.indexOf("/protocol-details/protocol-setup-new/protocol-encounter-setup/protocol-element-setup/")>-1){
      breadcrumbs && breadcrumbs.forEach( (bd)=>{
       if(bd.name==="Source Data Setup"){
            let tp =   location.pathname.lastIndexOf("/")
            let nu = location.pathname.substring(0,tp)
            let  spv = nu.split("/protocol-details/protocol-setup-new/protocol-encounter-setup/protocol-element-setup/");
            let fnidx1 = spv[1].lastIndexOf("/");
            let sub1 = spv && spv[1].substring(0,fnidx1);
            let fnidx2 = sub1.lastIndexOf("/");
            let sub2 = sub1 && sub1.substring(0,fnidx2);
            let fnidx3 = sub2.lastIndexOf("/");
            let sub3 = sub2 && sub2.substring(0,fnidx3);
            let fnidx4 = sub3.lastIndexOf("/");
            let sub4 = sub3 && sub3.substring(0,fnidx4);
            let fnidx5 = sub4.lastIndexOf("/");
            let sub5 = sub4 && sub4.substring(0,fnidx5);
            bd.path = `/protocol-details/protocol-setup-new/${sub5}`
         }
         if(bd.name==="Encounter Setup"){
          let tp =   location.pathname.lastIndexOf("/")
          let nu = location.pathname.substring(0,tp)
          let  spv = nu.split("/protocol-details/protocol-setup-new/protocol-encounter-setup/protocol-element-setup/");
          let fnidx1 = spv[1].lastIndexOf("/");
          let sub1 = spv && spv[1].substring(0,fnidx1);
          let fnidx2 = sub1.lastIndexOf("/");
          let sub2 = sub1 && sub1.substring(0,fnidx2);
          let fnidx3 = sub2.lastIndexOf("/");
          let sub3 = sub2 && sub2.substring(0,fnidx3);
          let fnidx4 = sub3.lastIndexOf("/");
          let sub4 = sub3 && sub3.substring(0,fnidx4);
          let fnidx5 = sub4.lastIndexOf("/");
          let sub5 = sub4 && sub4.substring(0,fnidx5);
          bd.path = `/protocol-details/protocol-setup-new/protocol-encounter-setup/${sub5}`
       }
        if(bd.name==="ItemGroup Setup"){
          bd.path = location.pathname
        }
     })
   }
   else if(location && location.pathname.indexOf("/protocol-details/protocol-setup-new/protocol-encounter-setup/")>-1){
        breadcrumbs && breadcrumbs.forEach( (bd)=>{
            if(bd.name==="Source Data Setup"){
              let  spv = location.pathname.split("/protocol-details/protocol-setup-new/protocol-encounter-setup/");
              bd.path = `/protocol-details/protocol-setup-new/${spv[1]}`
            }
        })

    }
   else if(location && location.pathname.indexOf("/protocol-details/protocol-setup-new/protocol-element-setup/")>-1){
       breadcrumbs && breadcrumbs.forEach( (bd)=>{
        if(bd.name==="Source Data Setup"){
            let  spv = location.pathname.split("/protocol-details/protocol-setup-new/protocol-element-setup/");
            bd.path = `/protocol-details/protocol-setup-new/${spv[1].split("/null/null")[0]}`
          }
          if(bd.name==="ItemGroup Setup"){
            bd.path = location.pathname
          }
      })
    }
   else if(location && location.pathname.indexOf("/patientdetails/patientdescription/patientEncounter/element/")>-1){
    breadcrumbs && breadcrumbs.forEach( (bd)=>{
      try{
        if(bd.name==="Patient Info"){
             let  spv = location.pathname.lastIndexOf("/");
             let pd = location.pathname.substring(0,spv);
             let ki = pd.lastIndexOf("/")
             let ui = pd.substring(0,ki)
            let rem = ui.lastIndexOf("/");
            let rem1 = ui.substring(0,rem)
            let rempd = rem1.lastIndexOf('/');
            let pd1 = rem1.substring(rempd);
             bd.path = `/patientdetails/patientdescription${pd1}`
           }
           if(bd.name==="Encounter Detail"){
            let  cs1 = location.pathname.lastIndexOf("/");
            let epch = location.pathname.substring(cs1) // epochId
            let g = location.pathname.substring(0,cs1)
            let g1 = g.lastIndexOf('/')
            let g12 = g.substring(g1) //site id
            let studyParam = location.pathname.substring(0,cs1);
            let an = studyParam.lastIndexOf('/')
            let a = studyParam.substring(0,an)
            let sidn = a.lastIndexOf('/')
            let sid = a.substring(sidn)   // StudyId
            let pidn = a.lastIndexOf('/')
            let pid = a.substring(0,pidn)
            let c = pid.lastIndexOf('/')
            let cv = pid.substring(c)   // pid
            let d = pid.lastIndexOf('/')
            let dv = pid.substring(0,d)
            let enIdn = dv.lastIndexOf('/')
            let dnIdv = dv.substring(enIdn) //enIdn
            let unexpd = dv.substring(0,enIdn);
            let unExpId = unexpd.lastIndexOf('/');
            let isUnexpId = unexpd.substring(unExpId);
            let updatedUrlPram =  dnIdv;
            //"/fromUnexpectedEncounter" && isUnexpId === '/null' ? '/null' : dnIdv;
               bd.path = `/patientdetails/patientdescription/patientEncounter${updatedUrlPram}${cv}${sid}${g12}${epch}`
                if(epch === "/fromUnexpectedEncounter"){
                  bd.path = `/patientdetails/patientdescription/patientEncounter${g12}${cv}${sid}${g12}${epch}`
                }
              }
        if(bd.name==="Type"){
          let  spv = location.pathname.lastIndexOf("/");
          let pd = location.pathname.substring(spv)
          bd.path = `/patientdetails/patientdescription${pd}`
        }
      }
      catch(e){}
   })
 }
 else if(location && location.pathname.indexOf("/patientdetails/patientdescription/patientEncounter/")>-1){
    breadcrumbs && breadcrumbs.forEach( (bd)=>{
      try{
        if(bd.name==="Patient Info"){
          let  spv = location.pathname.lastIndexOf("/");
          let pd = location.pathname.substring(0,spv);
          let gh = pd.lastIndexOf("/")
          let lt = pd.substring(0,gh)
          let ePid = lt.lastIndexOf("/")
          let nS = lt.substring(0,ePid);
          let patientIdIndex = nS.lastIndexOf("/")
          let patientId = nS.substring(patientIdIndex)
          bd.path = `/patientdetails/patientdescription${patientId}`
        }
      }
      catch(e){}
  })
}
function roleCheck(breadcrumb){
  if((userRole.role =="ROLE_CRA" || userRole.role=="ROLE_EXTERNAL_AUDITOR") && breadcrumb.name =="Summary"){
    return false;
  }else{
    return true;
  }
}

  return (
    <div className='breadcrumb breadcrumbIE'>
      { breadcrumbs.map((breadcrumb, i) =>{
        return breadcrumb.name === 'Type' ? getEncounterType('#/patientdetails/patientdescription/patientEncounter/:elementType/:study/:uniqIdenfier/:studyId') :
         <span className='breadCrumb-item' key={i}>
         {roleCheck(breadcrumb) && <Link to={breadcrumb.path}>
         {breadcrumb.name}
       </Link>}
          {breadcrumb.name ? (i < breadcrumbs.length - 1 ? ' / ' : ' ') : ' '}
        </span>
      })}
    </div>
  );
}

export default withRouter(Breadcrumbs);


