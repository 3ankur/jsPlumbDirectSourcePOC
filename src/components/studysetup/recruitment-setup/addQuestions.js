import React,{Component} from 'react';

class AddQuestions extends Component{

    constructor(props){
        super(props)
        this.state = {

            answerType:["Short Text","Large Text","Multipal Choice","Select List"]
        }
    }

    render(){

        return(
            <form class="my-3">
            <div class="form-group row">
                <label  class="col-sm-3 col-md-3 col-lg-2 col-form-label text-right">Question</label>
                <div class="col-sm-8 col-md-8 col-lg-4">
                    <input type="text" name="ques" />
                </div>
            </div>
            <div class="form-group row">
                <label  class="col-sm-3 col-md-3 col-lg-2 col-form-label text-right">Answer Type</label>
                <div class="col-sm-8 col-md-8 col-lg-4">
                    <select class="form-control">
                    <option>Select</option>
                    {
                        this.state.answerType.map( (d,i)=>{
                    return  <option  key={i}>{d}</option>
                        })
                    }
                        
                    </select>
                </div>
            </div>
            <div class="form-group row">
                    
            </div>
        </form>
        );
    }
}

export default AddQuestions;