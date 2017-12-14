import React, {Component} from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import Modal from "react-responsive-modal";

class FooterWizard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            shouldRestartWarning:false
        }
    }

    restartSegmentBuildProcess = (force=false)=>{
        if(!force && this.props.id===0){
            this.setState({shouldRestartWarning:true})
        }else{
            this.setState({shouldRestartWarning:false},()=>{
                window.location.replace('.')
            })
        }

    }

    onCloseShouldRestartWarning =()=>{
        console.log('onCloseShouldRestartWarning')
        this.setState({shouldRestartWarning:false})
    }

    render() {
        return (
            <div className="footerWizard clearfix">
                <div className="footerWizard_left">
                    {(this.props.warning.message !== "") ?
                        <div className={this.props.warning.type==='Error'?"alert alert-error": (this.props.warning.type==='Success')?"alert alert-success":"alert alert-warning"}><span>{this.props.warning.message}</span></div> :
                        <span>&nbsp;</span>}
                </div>
                <div className="footerWizard_right">
                    {(this.props.step === 1) ?
                        <Link to={'build'} className="build-segment-btn btn btn-green"
                              onClick={this.props.onButtonClick}> Build Segment <i
                            className="ib-icon-arrow-right"></i></Link> : null}
                    {(this.props.step === 2) ?
                        <div className="tabbar-components">
                            <div className="tabbar-addbutton btn-group">
                                {(this.props.selectedMarketSelectors.length === 0)
                                    ? <button className="btn-orange btn-border btn"
                                              onClick={() => this.restartSegmentBuildProcess(true)}><i
                                        className="ib-icon-recycle"></i> Restart Process
                                    </button>
                                    : null}
                                <Link to={'chart'} className="build-segment-btn btn btn-green"
                                      onClick={this.props.onButtonClick}> Summary <i
                                    className="ib-icon-arrow-right"></i></Link>
                            </div>
                        </div>
                        : null}
                    {(this.props.step === 3) ?
                        <div>
                            <div className="tabbar-components">
                                <div className="tabbar-addbutton btn-group">
                                    <button className="btn-orange btn-border btn" onClick={()=>this.restartSegmentBuildProcess()}><i className="ib-icon-recycle"></i> Restart Process
                                    </button>
                                    <button className="btn btn-green" onClick={this.props.saveSegment} ><i className="ib-icon-save"></i> Save Segment</button>
                                    {this.props.chartDataLength >= this.props.totalData
                                        ? <button className="btn btn-orange" onClick={this.props.exportToPdf}><i className="ib-icon-export"></i> Export to PDF</button>
                                        :null}
                                </div>
                            </div>
                        </div>
                       : null}

                </div>
                <Modal open={this.state.shouldRestartWarning} onClose={this.onCloseShouldRestartWarning} overlayClassName={"small"}
                       little>
                    <div className="model-title">
                        <h2>Confirm to continue</h2>
                    </div>
                    <div className="model-content">
                        Are you sure you want to continue with out saving this segment?
                    </div>
                    <div className="model-buttons btn-group pull-right">
                        <button className="btn btn-green pull-right" onClick={()=>this.restartSegmentBuildProcess(true)}>Yes</button>
                        <button className="btn btn-gray pull-right" onClick={()=>this.onCloseShouldRestartWarning()}>No</button>
                    </div>
                </Modal>
            </div>

        );
    }
}

function mapStateToProps(state) {
    return {

        warning: state.view.warning,
        step: state.selectedSegment.step,
        id: state.selectedSegment.id,
        selectedMarketSelectors:state.selectedMarketSelectors
    };
}

export default connect(mapStateToProps)(FooterWizard);
