import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

class Datatable extends Component {
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
      <BootstrapTable data={products} bordered={false}>
        <TableHeaderColumn dataField="id" isKey={true}>Product ID</TableHeaderColumn>
        <TableHeaderColumn dataField="name">Product Name</TableHeaderColumn>
        <TableHeaderColumn dataField="price">Product Price</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}

function mapStateToProps(state) {
  return {
    //
  };
}

export default connect(mapStateToProps, { })(Datatable);
