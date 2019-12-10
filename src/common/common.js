import moment from 'moment'
import axios from 'axios';
import {NotificationManager} from 'react-notifications';

class Common{

    constructor(){
        this.loaderIns = null;
        this.loginUserInfo = null;
    }

    static formatDate(d,format){
        return  d ? moment(d).format(format ? format : 'DD/MMM/YYYY'):null;
    }
    static getRandomNumber(){
        return  Math.floor(Math.random() * 9000000000) + 1000000000+''+new Date().getTime();
        //Math.random().toString(36).replace('0.', '')+new Date().getTime();
        //Math.floor(Math.random() * 9000000000) + 1000000000;
    }

    static getTimefromDate(d,type){
        if(type===12 ||  type==="12"){
            return  moment(d).format("hh:mm a")
        }
        else{
            return  moment(d).format("HH:mm")
        }

    }

    static setLoaderRef(loaderIns){
        this.loaderIns = loaderIns;
    }

    static getLoaderRef(){
        return this.loaderIns;
    }

    static showLoader(){
        this.loaderIns ? this.loaderIns.showLoader() : ""
    }
    static hideLoader(){
        this.loaderIns ? this.loaderIns.hideLoader() : ""
    }

    static sortByOrder(array,by,feild){
        if(array){
            if(feild){
                if(by && by==='ASC'){
                    return array.sort((a, b) => a[feild].toLowerCase() > b[feild].toLowerCase())
                }else if(by && by==='DESC'){
                    return array.sort((a, b) => a[feild].toLowerCase() < b[feild].toLowerCase())
                }else {
                    return array
                }
            }else{
                if(by && by==='ASC'){
                    return array.sort((a, b) => parseInt(a.sequence) - parseInt(b.sequence) )
                }else if(by && by==='DESC'){
                    return array.sort((a, b) => parseInt(a.sequence) - parseInt(b.sequence))
                }else {
                    return array
                }
            }   
        }

    }

    static getSubString(str,count){
        if(str && str.length > count) {
            return str.substring(0,count)+'...';
        }else{
            return str;
        }
    }

    static clearNotification(){
        var s = document.querySelector(".notification-container");
        var t = s.childNodes[0];
        if(t.childNodes && t.childNodes.length>0){
            t.childNodes && t.childNodes.forEach((vx)=>{
            vx.style.display = "none";
            })
        }
    }

    static getFormatedPhoneNumber(number){
        if(number){
            let firstThreeNum = number.toString().substring(0,3);
            let secondThreeNum = number.toString().substring(3,6);
            let thirdFourNum =  number.toString().substring(6,10);
            let formatedNumber = `(${firstThreeNum}) ${secondThreeNum} - ${thirdFourNum}`;
            return formatedNumber;
        }
        return number
    }

    //wrapper for Ajax request
    static AjaxRequest(END_POINT,TYPE,SERVIVE_NAME,PARAMS={},CONFIG={}){

        let response = null;
        switch(TYPE){
            case 'GET':
            response =  axios.get(`${END_POINT}${SERVIVE_NAME}`,PARAMS,CONFIG);
            break
            case 'POST':
            response =  axios.post(`${END_POINT}${SERVIVE_NAME}`,PARAMS,CONFIG);
            break
            case 'PUT':
            response =  axios.put(`${END_POINT}${SERVIVE_NAME}`,PARAMS,CONFIG);
            break
            case 'DELETE':
            response =  axios.delete(`${END_POINT}${SERVIVE_NAME}`,PARAMS,CONFIG);
            break
            case 'PATCH':
            response =  axios.patch(`${END_POINT}${SERVIVE_NAME}`,PARAMS,CONFIG);
            break
            case 'HEAD':
            response =  axios.head(`${END_POINT}${SERVIVE_NAME}`,PARAMS,CONFIG);
            break
            case 'OPTIONS':
            response =  axios.options(`${END_POINT}${SERVIVE_NAME}`,PARAMS,CONFIG);
            break

            
        }

        return response && response.then( (res)=>{
            if(res.status==200){
                return new Promise( (resolve,reject)=>{
                    resolve(res)
                })
            }
            else if(res.status==403){
                this.clearNotification();
                NotificationManager.error('Unauthorized access');
                return new Promise( (resolve,reject)=>{
                    resolve(res)
                })

            }

        },(err)=>{
            this.clearNotification();
            NotificationManager.error('Something went wrong');
            return new Promise( (resolve,reject)=>{
                resolve({data:[]})
            })

        })
    }

    static getSortedBySequenceFields(data){
        let array = [];
        data && data.forEach((item,index)=>{
            if(item.hasOwnProperty('itemDefinationList') && item.itemDefinationList && item.itemDefinationList.length){
                array = array.concat(item.itemDefinationList);
            }
            if(item.hasOwnProperty('customItemDefinationList') && item.customItemDefinationList  &&  item.customItemDefinationList.length){
                //Obj.push(item.customItemDefinationList);
                array = array.concat(item.customItemDefinationList);
            }
        });

        return array;
    }

    static setLoginUserInfo(info){
        this.loginUserInfo = info
    }

    static getLoginUserInfo(){
       return  this.loginUserInfo
    }
}

export default Common;

