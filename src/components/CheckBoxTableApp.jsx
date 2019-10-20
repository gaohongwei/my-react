import React from "react";
import CheckBoxTable from "./CheckBoxTable";
import getData from '../data/DB'

const data = getData()
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

const CheckBoxTableApp = () => {
  return (
    <div className="App">
      <CheckBoxTable data={data} columns={columns} keyField="id" />
    </div>
  );
};

export default CheckBoxTableApp;
