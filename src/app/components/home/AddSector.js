import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class AddSector extends Component {
  constructor(props) {
    super(props);
    this.state = {   viewModal: false};
  }

  componentDidMount() {
    //
  }

  
  render() {

    return (
      <div onClick={this.props.handleAddSector} className="card-block add-sector-card">
        <div className="card-content-area">
          <span className="card-title">
            ADD SECTOR
          </span>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {

  };
}

export default connect(mapStateToProps, { })(AddSector);
