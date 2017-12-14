import React, { Component } from 'react'
import { browserHistory, IndexLink, Link } from 'react-router'
import { connect } from 'react-redux'
import { getTotalCounts } from '../../actions/MasterDatas'


class Header extends Component {

    constructor() {
        super();
        this.state = {};
    }

  componentDidMount() {
    this.props.getTotalCounts()
  }

    showMenu() {
        let menu;
        menu = <li className="nav-link"><IndexLink to='/' activeClassName="header-active-link"></IndexLink></li>;
        return menu;
    }

    renderLinks() {
        if (localStorage.getItem('token')) {
            return (
                <ul className="submenu profile-dropdown">
                    <li key={7}>
                        <Link>Profile</Link>
                    </li>
                    <li key={8}>
                        <Link to="/login">Log out</Link>
                    </li>
                </ul>
            );
        } else {
            return (
                <ul className="submenu">
                    <li key={9}>
                        <Link to="/login">Log in</Link>
                    </li>
                </ul>
            );
        }
    }

    logOut () {
        localStorage.setItem('isLoggedIn', false);
        window.location.replace('/login')
    }

    kFormatter (num) {
      return num > 999 ? (num / 1000).toFixed(1) + 'k' : num
    }

    render() {

        let {isCustomHeader} = this.props;

        return (
            <div>
                <header className="navigation" role="banner">
                    <div className="navigation-wrapper">
                        <div className="header-logo-wrap pull-left">
                            <IndexLink to="/" className="navbar-brand">
                                <img alt="" className="header-logo" src="./static/images/ibLogo.png"/>
                            </IndexLink>
                        </div>
                        <div className="col-md-9 col-sm-7 col-xs-6">
                            <div className="user-profile-nav pull-right">
                                <img className="profilePic img-circle more" src=""/>
                            </div>
                            <button className="pull-right user-login" onClick={this.logOut.bind(this)}><i className="ib-icon-user"></i> Logout
                            </button>
                        </div>
                    </div>

                </header>

                    <div className="hero">
                        <div className="hero-inner clearfix">
                            <div className="wizard-wrap">
                                <div className={this.props.step===1?'wizard-step step1 active-step':'wizard-step step1'}>
                                    <div className="wizard-step-num">
                                        <span className="step-number">1</span>
                                    </div>
                                    <div className="wizard-step-content">
                                        <h2>Sectors/ Customers</h2>
                                        <p>Add/ Select a customer and sectors for build your segment</p>
                                    </div>
                                </div>
                                <div className={this.props.step===2?'wizard-step step2 active-step':'wizard-step step2'}>
                                    <div className="wizard-step-num">
                                        <span className="step-number">2</span>
                                    </div>
                                    <div className="wizard-step-content">
                                        <h2>Build Segments</h2>
                                        <p>Filter your sectors for segment charts</p>
                                    </div>
                                </div>
                              <div className={this.props.step===3?'wizard-step step3 active-step':'wizard-step step3'}>
                                <div className="wizard-step-num">
                                  <span className="step-number">3</span>
                                </div>
                                <div className="wizard-step-content">
                                  <h2>Summary</h2>
                                  <p>View charts and export data</p>
                                </div>
                              </div>

                              <div className="wizard-step step3 active-step">
                                  <div className="record-number"><span className="record-number-count">{this.kFormatter(this.props.totalCompanies)}</span> <br />Companies </div>
                                  <div className="record-number"><span className="record-number-count">{this.kFormatter(this.props.totalRecords)}</span> <br />Records</div>  
                              </div>
                            </div>
                        </div>
                    </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        step: state.selectedSegment.step,
        totalCompanies:state.masterData.totalCompanies,
        totalRecords:state.masterData.totalRecords
    };
}


export default connect(mapStateToProps,{getTotalCounts})(Header);
