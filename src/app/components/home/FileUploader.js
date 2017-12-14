import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';

class Fileuploader extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount() {
    //
  }

  onDrop = (acceptFiles, rejectedFiles) => {

  }

  render() {
    return {

    };
  }
}

function mapStateToProps(state) {
  return {
    //
  };
}

export default connect(mapStateToProps, { })(Fileuploader);
