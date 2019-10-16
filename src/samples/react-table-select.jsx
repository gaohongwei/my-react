import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";

import Table from "react-table";
import selectTableHOC from "react-table/lib/hoc/selectTable";
import faker from "faker";
import { Factory } from "rosie";

import "react-table/react-table.css";
import "./styles.css";

const SelectTable = selectTableHOC(Table);

const personFactory = Factory.define("person")
  .attr("name", faker.name.findName)
  .attr("age", () => Math.floor(Math.random() * 100));

const dataFactory = Factory.define("data")
  .sequence("id")
  .extend(personFactory)
  .attr("friend", () => personFactory.build());

const data = dataFactory.buildList(50);
const columns = [
  {
    Header: "Name",
    accessor: "name" // String-based value accessors!
  },
  {
    Header: "Age",
    accessor: "age",
    Cell: props => <span className="number">{props.value}</span> // Custom cell components!
  },
  {
    id: "friendName", // Required because our accessor is not a string
    Header: "Friend Name",
    accessor: d => d.friend.name // Custom value accessors!
  },
  {
    Header: props => <span>{props.value}</span>, // Custom header components!
    accessor: "friend.age"
  }
];

class MyTable extends Component {
  static defaultProps = {
    keyField: "id"
  };

  static propTypes = {
    keyField: PropTypes.string
  };

  /**
   * Toggle a single checkbox for select table
   */
  toggleSelection = (key, shift, row) => {
    // start off with the existing state
    let selection = [...this.state.selection];
    const keyIndex = selection.indexOf(key);

    // check to see if the key exists
    if (keyIndex >= 0) {
      // it does exist so we will remove it using destructing
      selection = [
        ...selection.slice(0, keyIndex),
        ...selection.slice(keyIndex + 1)
      ];
    } else {
      // it does not exist so add it
      selection.push(key);
    }
    // update the state
    this.setState({ selection });
  };

  /**
   * Toggle all checkboxes for select table
   */
  toggleAll = () => {
    const { keyField } = this.props;
    const selectAll = !this.state.selectAll;
    const selection = [];

    if (selectAll) {
      // we need to get at the internals of ReactTable
      const wrappedInstance = this.checkboxTable.getWrappedInstance();
      // the 'sortedData' property contains the currently accessible records based on the filter and sort
      const currentRecords = wrappedInstance.getResolvedState().sortedData;
      // we just push all the IDs onto the selection array
      currentRecords.forEach(item => {
        selection.push(`select-${item._original[keyField]}`);
      });
    }
    this.setState({ selectAll, selection });
  };

  /**
   * Whether or not a row is selected for select table
   */
  isSelected = key => {
    return this.state.selection.includes(`select-${key}`);
  };

  rowFn = (state, rowInfo, column, instance) => {
    const { selection } = this.state;

    return {
      onClick: (e, handleOriginal) => {
        console.log("It was in this row:", rowInfo);

        // IMPORTANT! React-Table uses onClick internally to trigger
        // events like expanding SubComponents and pivots.
        // By default a custom 'onClick' handler will override this functionality.
        // If you want to fire the original onClick handler, call the
        // 'handleOriginal' function.
        if (handleOriginal) {
          handleOriginal();
        }
      },
      style: {
        background:
          rowInfo &&
          selection.includes(`select-${rowInfo.original.id}`) &&
          "lightgreen"
      }
    };
  };

  state = {
    selectAll: false,
    selection: []
  };

  render() {
    return (
      <SelectTable
        {...this.props}
        ref={r => (this.checkboxTable = r)}
        toggleSelection={this.toggleSelection}
        selectAll={this.state.selectAll}
        selectType="checkbox"
        toggleAll={this.toggleAll}
        isSelected={this.isSelected}
        getTrProps={this.rowFn}
      />
    );
  }
}

const App = () => {
  return (
    <div className="App">
      <MyTable data={data} columns={columns} keyField="id" />
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
