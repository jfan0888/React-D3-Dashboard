import React, { Component } from 'react';
import { connect } from 'react-redux';

class Checkbox extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {
    //
  }

  render() {
    return (
      <div className="checkContainter">
        <div className="round">
          <input type="checkbox" id="checkboxinput" />
          <label id="checkbox"></label>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    //
  };
}

export default connect(mapStateToProps, { })(Checkbox);
