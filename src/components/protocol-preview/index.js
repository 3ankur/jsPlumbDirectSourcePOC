/**
 * Copyright (c) 2018
 * @summary Protocol setup & encounter setup preview page
 * @author Ankur Vishwakarma,Poonam Banode,Mangesh Pimprikar,Irfan Bagwan
 */

import React, { Component } from 'react';
import ApiService from '../../api';
import SetupComponent from './previewSetupComponent'
import jsplumb from 'jsplumb';
import 'jsplumb/css/jsplumbtoolkit-defaults.css';
import _ from 'lodash';
import common from '../../common/common';
import { NotificationManager } from 'react-notifications';
import { MODAL_TYPE_ELEMENT_PREVIEW } from '../../constants/modalTypes';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';
import GenerateHtml from '../generateHtml/generatehtml';
import TableView from '../generate-table/table';
import * as getFormAction from '../../actions/modalActions';
import * as modalAction from '../../actions/modalActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class ProtocolPreviewSetup extends React.Component {
    constructor(props) {
        super(props);
        this.jsPlumbInstance = null;
        this.state = { protocolSetupData: [], elements: [], previewVersion: "" }
        this.allEndPoints = {};
        this.previewDataList = {};
        const arrowCommon = {
            foldback: 0.7, width: 14, events: {
                click: function () { }
            }
        };
        this.connectOverlays = [
            ["Arrow", { location: 0.7 }, arrowCommon,],
            ["Label", {
                location: [0.5, 1.5],
                visible: true,
                id: "label",
                cssClass: "aLabel",
                events: {
                    tap: function () { }
                }
            }]
        ];
        this.start_config = {
            endpoint: ["Dot", { radius: 11 }],
            paintStyle: { fill: "#691e44" },
            isSource: true,
            scope: "green",
            isTarget: false,
            maxConnections: -1,
            onMaxConnections: function () {
            },
            draggable: false,
            anchor: 'Right',
            connectorOverlays: this.connectOverlays
        };
        this.end_config = {
            endpoint: ["Dot", { radius: 11 }],
            paintStyle: { fill: "#691e44" },
            isSource: false,
            scope: "green",
            isTarget: true,
            maxConnections: -1,
            onMaxConnections: function () {
            },
            draggable: false,
            anchor: 'Left',
            connectorOverlays: this.connectOverlays
        };
        // configure some drop options for use by all endpoints.
        const dropOptionsConfig = {
            tolerance: "touch",
            hoverClass: "dropHover",
            activeClass: "dragActive"
        };
        this.connectionEndpointConfig = {
            endpoint: ["Dot", { radius: 11 }],
            paintStyle: { fill: "#691e44" },
            isSource: true,
            scope: "green",
            // connectorStyle: { stroke: color2, strokeWidth: 3},
            // connector: ["Bezier", { curviness: 63 } ],
            maxConnections: -1,
            isTarget: true,
            dropOptions: dropOptionsConfig,
            detachable: false,
            reattach: false,
            beforeDrop: function (params) {
                if (params.sourceId == params.targetId) {
                    return false
                }

                return true;
            },
        };
    }


    updateJSPlumbConfigToElel(el) {
        try {
            setTimeout(() => {
                this.allEndPoints[el.epoch.id] = [
                    this.jsPlumbInstance.addEndpoint(el.epoch, { anchor: "LeftMiddle", connectorOverlays: this.connectOverlays }, this.connectionEndpointConfig),
                    this.jsPlumbInstance.addEndpoint(el.epoch, { anchor: "RightMiddle", connectorOverlays: this.connectOverlays }, this.connectionEndpointConfig)

                ];
            }, 10)
        }
        catch (e) {
            console.log(e)
        }
    }
    //connct with end points
    connectEpochEndPoints() {
        setTimeout(() => {
            try {
                this.state.protocolSetupData.map((ep, idx) => {
                    ep.parent.map((c, io) => {
                        const pcCon = this.jsPlumbInstance.select({ source: ep.nodeKey, target: c });
                        const cpCon = this.jsPlumbInstance.select({ source: c, target: ep.nodeKey });
                        // this.jsPlumbInstance.select({source:et.component.source.id, target:et.component.target.id}) this.jsPlumbInstance.getAllConnections()
                        if ((pcCon && pcCon.length > 0) || (cpCon && cpCon.length > 0)) {
                        }
                        else {
                            for (var e in this.allEndPoints) {
                                if (e == c) {
                                    if ("startWindow" == c) {
                                        this.jsPlumbInstance.connect({
                                            source: this.allEndPoints[c],
                                            target: this.allEndPoints[ep.nodeKey][0]
                                        });
                                    }
                                    else {
                                        this.jsPlumbInstance.connect({
                                            source: this.allEndPoints[c][1],
                                            target: this.allEndPoints[ep.nodeKey][0]
                                        });
                                    }
                                }
                            }
                        }
                    });
                    ep.child.map((ch, io) => {
                        const child_pcCon = this.jsPlumbInstance.select({ source: ep.nodeKey, target: ch });
                        const child_cpCon = this.jsPlumbInstance.select({ source: ch, target: ep.nodeKey });
                        if ((child_pcCon && child_pcCon.length > 0) || (child_cpCon && child_cpCon.length > 0)) { } else {
                            for (var e in this.allEndPoints) {
                                if (e == ch) {
                                    if ("endWindow" == ch) {
                                        this.jsPlumbInstance.connect({
                                            source: this.allEndPoints[ep.nodeKey][1],
                                            target: this.allEndPoints["endWindow"]
                                        });
                                    } else {
                                        this.jsPlumbInstance.connect({
                                            source: this.allEndPoints[ep.nodeKey][1],
                                            target: this.allEndPoints[ch][0]
                                        });
                                    }
                                }
                            }
                        }
                    });
                });
                this.jsPlumbInstance.repaintEverything();
            }
            catch (e) {
                console.log(e)
            }
        }, 200)
    }

    //get setupup details of study
    getStudySetupDetails() {
        try { //protocolStatus
            ApiService.getProtocolSetupByVersionAndStatus(this.props.match.params.studyId, this.props.match.params.protocolIdentity, this.props.match.params.protocolStatus).then((res) => {
                if (res.data.status === "success" && res.data.responsecode === 200 && res.data.response && typeof (res.data.response) === "object") {
                    let encounterElList = [];
                    let epochJSON = res.data.response && res.data.response.epochData ? JSON.parse(res.data.response.epochData) : [];
                    this.setState({ protocolSetupData: epochJSON, previewVersion: `${this.props.match.params.protocolVersion}` })
                    epochJSON.forEach((o, i) => {
                        if (o.encounters.length > 0) {
                            o.encounters.forEach((s, pi) => {
                                encounterElList.push(...s.elements)
                            })
                        }
                    })

                    //for unique element
                    encounterElList = _.uniqBy(encounterElList, 'elementName');
                    //sort by itemgroup sequence
                    encounterElList = _.orderBy(encounterElList, 'itemGroupSequence', 'asc');
                    this.setState({ elements: encounterElList });
                    setTimeout(() => {
                        this.connectEpochEndPoints();
                    }, 30)
                }

            }, (error) => {
                NotificationManager.error("Something went wrong ..")
            });
        }
        catch (e) { }
    }

    componentDidMount() {
        this.initlizeJSplumb(this);
        this.getStudySetupDetails();
    }

    initlizeJSplumb(currentContext) {
        jsplumb.jsPlumb.ready(() => {
            const instance = jsplumb.jsPlumb.getInstance({
                DragOptions: { cursor: 'pointer', zIndex: 2000 },
                PaintStyle: { stroke: '#666' },
                EndpointHoverStyle: { fill: "orange" },
                HoverPaintStyle: { stroke: "orange" },
                EndpointStyle: { width: 20, height: 16, stroke: '#666' },
                Endpoint: "Rectangle",
                Anchors: ["TopCenter", "TopCenter"],
                Container: "canvas"
            });
            this.jsPlumbInstance = instance;
            //start end setting
            this.allEndPoints["startWindow"] = instance.addEndpoint(document.getElementById("startWindow"), this.start_config);
            this.allEndPoints["endWindow"] = instance.addEndpoint(document.getElementById("endWindow"), this.end_config);
            // make .window divs draggable
            instance.draggable(jsplumb.jsPlumb.getSelector(".protocol-setup-container .protocol-epoch"));
            instance.batch(() => {
                instance.bind("connection", (info, originalEvent) => {

                });
            });
        });
    }

    checkForElementClass(epochElement, eleName) {
        const filterEle = epochElement.filter((f) => { return f.elementName === eleName.elementName });
        return filterEle.length ? 'bg-success align-middle text-center' : '';
    }

    rednerPreviewElementEpochList(ele) {
        const elementEncounterList = [];
        const uniqueKey = common.getRandomNumber();
        elementEncounterList.push(<td key={uniqueKey} className='align-middle text-right position-relative enc_tbl_padding'>{ele.elementName}</td>);
        this.state.protocolSetupData.map((epochInf, epid) => {
            epochInf.encounters.map((ec, idx) => {
                const uniqueKey = epid + '' + idx + common.getRandomNumber();
                elementEncounterList.push(<td className={this.checkForElementClass(ec["elements"], ele.elementName)} key={uniqueKey} ><i className={this.checkForElementClass(ec["elements"], ele.elementName) != '' ? 'glyphicon glyphicon-ok white-text' : ''} ></i></td>)
            });
        });
        return elementEncounterList;
    }

    rednerElementListItemForEpoch(ele) {
        const elementEncounterList = [];
        const lbl = [<span>testing </span>];
        let toolTipTxt = "";
        let itemGropTooltip = "";
        itemGropTooltip = ele.elementName;
        if (ele.domainName === "Custom Domain") {
            toolTipTxt = "CD-Custom Domain";
        }
        else {
            if (ele.domainName === "Elligo Reminder") {
                toolTipTxt = "ER-Elligo Reminder";
            } else {
                toolTipTxt = ele.domainName + (ele.description ? "-" + ele.description : "");
            }
        }

        let tmpSt = {};
        if (this.refs.enTable) {
            let tableRef = this.refs.enTable;
            let tbodyScrollPos = tableRef.children[1].scrollLeft;
            tmpSt = tbodyScrollPos > 0 ? { "left": tbodyScrollPos + "px" } : {}
        }

        elementEncounterList.push(<td key={Math.floor((Math.random() * 10000) + 1)} className='align-middle text-right position-relative enc_tbl_padding' style={tmpSt}>
        <Tooltip
                placement="top"
                mouseEnterDelay={0}
                mouseLeaveDelay={0.1}
                destroyTooltipOnHide={false}
                trigger={Object.keys({ hover: 1 })}
                onVisibleChange={this.onVisibleChange}
                overlay={<div >ItemGroup Domain: {toolTipTxt ? toolTipTxt : 'Domain'}<div>ItemGroup Name: {itemGropTooltip}</div></div>}
                align={{
                    offset: [0, -3],
                }}
            >
                <label style={{ "cursor": "pointer", "color": "#6395d6" }} className="encounter_elements" onClick={(e) => this.getElementFormPreview(ele.elementUniqueIdentifier)}>{ele.elementName && common.getSubString(ele.elementName, 15)}</label>
            </Tooltip>
        </td>);
        this.state.protocolSetupData.forEach((epochInf, epid) => {
            epochInf.encounters.forEach((ec, idx) => {
                const uniqueKey = epochInf.nodeKey + "-" + epochInf.name + "-" + epid + "-" + idx;
                elementEncounterList.push(<td className={this.checkForElementClass(ec["elements"], ele)} key={uniqueKey}><i className={this.checkForElementClass(ec["elements"], ele) ? 'glyphicon glyphicon-ok white-text' : ''} ></i></td>)
            });
        });

        return elementEncounterList;
    }

    //rendering the header data Epoch & encounter
    renderEpochHeaderDataSet() {

        const epochList = [];
        let tmpSt = {}
        if (this.refs.enTable) {
            let tableRef = this.refs.enTable;
            let tbodyScrollPos = tableRef.children[1].scrollLeft;
            tmpSt = tbodyScrollPos > 0 ? { "left": tbodyScrollPos + "px" } : {}
        }
        epochList.push(<th width="200" key={Math.random()} rowSpan="2" className="align-middle text-right table-bordered" style={tmpSt}>ItemGroup</th>)
        this.state.protocolSetupData && this.state.protocolSetupData.map((epochData, idx) => {
            epochList.push(<th style={{ background: "#f7f7f7" }} key={idx} colSpan={epochData.encounters.length} title={epochData.name}>{epochData.name ? common.getSubString(epochData.name, 6) : 'Epoch' + idx}</th>)

        })
        return epochList;
    }

    //render list item
    renderListItem() {
        const encounterList = [];
        this.state.protocolSetupData && this.state.protocolSetupData.forEach((epd, epid) => {
            epd.encounters.forEach((ec, idx) => {
                encounterList.push(<th style={{ textAlign: "center" }} key={epid + '' + idx}>
                    <Tooltip
                        placement="top"
                        mouseEnterDelay={0}
                        mouseLeaveDelay={0.1}
                        destroyTooltipOnHide={false}
                        trigger={Object.keys({ hover: 1 })}
                        onVisibleChange={this.onVisibleChange}
                        overlay={<div >{ec.encounterName ? ec.encounterName : 'Encounter ' + (encounterList.length + 1)}</div>}
                        align={{
                            offset: [0, -3],
                        }}
                    >
                        <span className="bg-light-grey rounded px-2 py-1">{ec.displayName ? ec.displayName : 'E' + idx}</span>
                    </Tooltip>
                </th>)
            });

        })
        return encounterList;
    }

    //render encounter  header
    renderEncounterHeader() {
        return (<tr className="text-black">
            {
                this.renderListItem()
            }

        </tr>)
    }


    myFunction(e) {

        let tableRef = this.refs.enTable;
        let tbodyScrollPos = tableRef.children[1].scrollLeft;
        tableRef.children[0].style.left = -tbodyScrollPos + "px";
        tableRef.children[0].children[0].children[0].style.left = tbodyScrollPos + "px";
        tableRef.children[0].children[0].children[0].style.left = tbodyScrollPos + "px";
        for (let i = 0; i < tableRef.children[1].children.length; i++) {
            tableRef.children[1].children[i].children[0].style.left = tbodyScrollPos + "px";
        }
    }

    //for form preview
    getElementFormPreview = (elementIdentifer) => {
        let params = {
            study_identifier: this.props && this.props.match && this.props.match.params.studyId,
            element_identifier: elementIdentifer
        }
        ApiService.getItemGroupDetailsFromEncounter(params).then((res) => {
            this.previewDataList = {};
            this.getPreviewViewData(res.data.response);
        })
    }

    getPreviewViewData = (prevSt) => {
        var formData = prevSt && JSON.parse(JSON.stringify(prevSt));
        let columnList = [];
        let mandatoryDataList = [];
        let optionalDataList = [];
        let customDataList = [];
        if (formData) {
            if (formData.hasOwnProperty('mandatory') && formData.mandatory && formData.mandatory.length > 0) {
                formData.mandatory.forEach((formLabel, index) => {
                    mandatoryDataList = formLabel.itemDefinationList.filter((item) => { return item.isTable && item.isTable === true });
                });
            }
            if (formData.hasOwnProperty('optional') && formData.optional && formData.optional.length > 0) {
                formData.optional.forEach((formLabel, index) => {
                    optionalDataList = formLabel.itemDefinationList.filter((item) => { return item.isTable && item.isTable === true });
                });
            }
            if (formData.hasOwnProperty('custom') && formData.custom && formData.custom.length > 0) {
                let getMergeCustomList = common.getSortedBySequenceFields(formData.custom);
                customDataList = getMergeCustomList.length > 0 && getMergeCustomList.filter((item) => { return item.isTable && item.isTable === true })
            }
            let columnMergeArray = [].concat(mandatoryDataList, optionalDataList, customDataList)
            common.sortByOrder(columnMergeArray, 'ASC').forEach((item) => {
                columnList.push(item.updatedQuestion ? item.updatedQuestion : item.name)
            });

            if (columnList.length > 0) {
                formData.columnList = columnList;
                formData.formview = 'table';
            }
            const newUpdatedFormData = [].concat(formData.mandatory || [], formData.optional || [], formData.custom || []);
            formData['labelList'] = newUpdatedFormData;
            formData.labelList.forEach((label) => { })
            this.previewDataList = formData;
        } else {
            this.previewDataList['labelList'] = [];
        }
        if (this.previewDataList.hasOwnProperty('mandatory')) {
            delete this.previewDataList.mandatory
        }
        if (this.previewDataList.hasOwnProperty('optional')) {
            delete this.previewDataList.optional
        }
        if (this.previewDataList.hasOwnProperty('custom')) {
            delete this.previewDataList.custom
        }
        this.openElementPreviewModal();
    }

    //open the preview modal
    openElementPreviewModal = () => {
        let getSortedBySequenceFields = common.getSortedBySequenceFields(this.previewDataList.labelList);
        let previewShowObj = {
            ...this.previewDataList,
            labelList: getSortedBySequenceFields
        }
        let isSequenceEmpty = previewShowObj && previewShowObj.labelList && previewShowObj.labelList.filter((item) => {
            return item.sequence == ''
        });
        let valueArr = previewShowObj && previewShowObj.labelList && previewShowObj.labelList.map(function (item) { return item.sequence });
        const isDuplicate = valueArr.some(function (item, idx) {
            return valueArr.indexOf(item) != idx
        });
        if (isSequenceEmpty && isSequenceEmpty.length > 0) {
            common.clearNotification();
            NotificationManager.error('Sequence can not be blank');
        } else {
            if (!isDuplicate) {
                this.props.modalAction && this.props.modalAction.showModal(MODAL_TYPE_ELEMENT_PREVIEW, {
                    onSave: (data) => {
                    },
                    hideModal: () => this.props.modalAction.hideModal(),
                    className: 'element_preview_modal',
                    renderFormData: this.renderForm(previewShowObj),
                    header: this.previewDataList && this.previewDataList.domainName && this.previewDataList.elementName ? `- ${this.previewDataList.elementName}` : "-Element"
                });
            } else {
                common.clearNotification();
                NotificationManager.error('Please Enter Unique Sequence');
            }
        }
    }

    getFormElementClasses = (formData, itm) => {
        let cls = `input-group mt-0 mb-3 col-md-12 col-lg-12 pl-0 ${formData.name}-form-grp`;
        return cls;
    }

    dynamicClassesForFieldName = (item) => {
        if (item.inputType == 'textBlockLong') {
            return 'pr-2 pl-0 overflow-ellipsis-multiple-line'
        }
        return 'pr-2 col-md-3 pl-0'
    }

    //for render form
    renderForm = (formData, type) => {
        let customClassObject = {
            'textbox': {
                containerClass: 'p-0',
                elementClass: 'form-control select-width'
            },
            'dropdown': {
                containerClass: 'p-0',
                elementClass: 'form-control select-width'
            },
            'date': {
                containerClass: 'custonDate',
                elementClass: 'p-0'
            },
            'radio': {
                containerClass: 'col-auto d-flex flex-row p-0',
                elementClass: 'p-0'
            },
            'textarea': {
                containerClass: 'col pr-0 pl-0 display-inline',
                elementClass: 'form-control'
            },
            'time': {
                containerClass: '',
                elementClass: 'select-width p-0'
            },
            'checkbox': {
                containerClass: 'p-0',
                elementClass: ''
            },
            'label': {
                containerClass: 'p-0',
                elementClass: ''
            },
            'file': {
                containerClass: 'input-group ml-0 position-relative',
                elementClass: 'select-width custom-file-input'
            },
            'reminder': {
                containerClass: 'col-md-12 ml-0 position-relative pl-0',
                elementClass: ''
            }
        }
        if (Object.keys(formData).length === 0) {
            return <div className='alert alert-info p-1 text-center'>Please Add Items</div>
        } else {
            return formData.formview && formData.formview === 'table' ? <TableView tableData={[formData]} /> :
                <div className='row col-xs-12 col-md-12 form-scroll'>
                    <div className='form-group pt-2 row col-xs-12 col-md-12 position-relative ml-0 mr-0'>
                        {formData && (formData.domainCode === "EREVSM" || formData.domainCode === "EREVPI" || formData.domainCode === "EICF") && <div class="alert alert-info col-md-12 text-center">No preview for this element</div>}
                        {formData && formData.labelList && formData.labelList.length > 0 && common.sortByOrder(formData.labelList, 'ASC').map((item, index) => {
                            return (
                                item.isChecked && item.isChecked === true && <div key={index} className={this.getFormElementClasses(formData, item)} >
                                    {(item.inputType != '' && item.inputType != 'reminder' || (item.hasOwnProperty('codeDefinationList') && typeof item.codeDefinationList === 'object' &&
                                        item.codeDefinationList.length !== 0 && item.codeDefinationList[0].inputType !== 'checkbox')) && <label className={this.dynamicClassesForFieldName(item)}>{item.updatedQuestion ? item.updatedQuestion : item.name}</label>}
                                    <GenerateHtml labelText={item.label} data={item} formId={formData.formId} formLabelId={formData.formLableId}
                                        customClassObject={customClassObject}
                                        itemDefIndex={index}
                                        fromWhichPage='popUp'
                                    />
                                </div>
                            )
                        })
                        }
                    </div>
                </div>
        }
    }

    render() {
        const style = { textAlign: "center" }
        return (
            <div>
                <section className="baseline-container">
                    <div className="border p-3 m-0 row justify-content-between footpadb">
                        <div className="row col-12 justify-content-between border-bottom-dotted m-0 mb-3 pb-2 px-0">
                            <div className="col-5 p-0">
                                <h5 className=" c-p">Source Data Preview: <span className="protocol_study_color bluetxt ">{this.props.match.params.study}</span></h5>
                            </div>
                        </div>
                        <SetupComponent epochs={this.state.protocolSetupData}
                            updateEndPointHandler={this.updateJSPlumbConfigToElel.bind(this)}
                            protocolVersion={this.props.match.params.protocolVersion}
                            publishDate={new Date(parseInt(this.props.match.params.publishDate))}
                            protocolName={this.props.match.params.protocolName}
                        />
                        <div className="row col-12 justify-content-between border-bottom-dotted m-0 mb-3 pb-2 px-0">
                            <div className="col-5 p-0">
                                <h5 className=" c-p">Encounter  Preview</h5>
                            </div>
                        </div>
                        <div className="row col-12 p-0 m-0">
                            <table ref="enTable" className="table table-responsive table-bordered  encounter-setup-table" id="encounterTable">
                                <thead>
                                    <tr style={{ textAlign: "center" }}>{this.renderEpochHeaderDataSet()}</tr>
                                    {this.renderEncounterHeader()}
                                </thead>
                                <tbody onScroll={this.myFunction.bind(this)}>
                                    {
                                        this.state.elements && this.state.elements.length > 0 ?
                                            this.state.elements.map((ele, idx) => {
                                                return <tr key={idx}>{this.rednerElementListItemForEpoch(ele)}</tr>
                                            })
                                            :
                                            <tr><td colSpan={this.state.protocolSetupData.reduce((ac, currentV) => { return ac + currentV.encounters.length }, 0)} style={style} >No record found.</td></tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getForm: bindActionCreators(getFormAction, dispatch),
        modalAction: bindActionCreators(modalAction, dispatch)
    };
}
function mapStateToProps(state) {
    return {
        FormJson: state.getFormReducer,
        modal: state.modal
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ProtocolPreviewSetup);