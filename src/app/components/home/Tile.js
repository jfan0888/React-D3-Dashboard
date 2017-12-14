import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { get } from 'lodash';

class Tile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewModal: false,
    };
  }

  componentDidMount() {
    //
  }

  render() {
    const content = get(this.props, 'content', 'Content');

    return (
      <div className="card-types">
        <span className="card-type">
          {content}
        </span>
      </div>
    );
  }
}

Tile.propTypes = {
  content: PropTypes.string,
};

function mapStateToProps(state) {
  return {

  };
}

export default connect(mapStateToProps, { })(Tile);
