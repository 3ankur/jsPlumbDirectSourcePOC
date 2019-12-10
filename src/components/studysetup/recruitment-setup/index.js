import React, { Component } from 'react';
import Filter from '../../filter/filter';
import MenuOptions from '../../menuoptions/menuoptions';
import AddQuestions from './addQuestions'
//import ApiService from '../../api/getAllSites';
import { NotificationManager } from 'react-notifications';

class ReacruitmentSetup extends Component {



    constructor(props) {

        super(props);

        this.state = {

            subheaderOptions : {
                site: true,
                study: true
            }
        }




    }



    render() {
        return (


            <div>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                </ol>
            </nav>
            <Filter options={this.state.subheaderOptions} />


            <section>
                <div className="border p-3 m-0 row mt-2">
                    <div className="row col-12 m-0 p-0 justify-content-between border-bottom    ">
                        <div className="col-8 p-0">
                                <h5 className=" pb-2 px-0 pt-2">Recruitment Setup: <span className="c-b small">St. Hospital</span></h5>
                        </div>
                        <div className="col-4 text-right py-2">
                            <span data-toggle="modal" data-target="#addSubElement"><span className="float-right add-btntxt">Sub Element</span> <span className="add-btn"><i className="material-icons">add</i></span></span>

                        </div>
                    </div>

                    <div className="col element-question">

                    <div className="col-md-5  col-lg-5 col-sm-10 p-4 mt-3 mr-5 border">
                    <AddQuestions/>

                    </div>

                    </div>

            </div>
        </section>


          </div>

        );
    }

}

export default ReacruitmentSetup;