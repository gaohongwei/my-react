import React, {useState, Fragment } from 'react';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import getData from '../data/DB'

export default class ClsTable extends React.Component{
  constructor(){
    super()
    this.state = {
      selections: []
    }
    this.columns = [
    {
      id: "checkbox",
      accessor: "",
      Cell: ({ original }) => {
        return (
          <input
            type="checkbox"
            className="checkbox"
            value={original.id}
            onChange ={ (e) => this.updateSelection(e, original.id)}
          />
        );
      },
      width: 50
    },
    {
        Header: 'Edit',
        accessor: 'editButton',
        render: (value) => (
            <button >
                click me!
            </button>
        ),
        maxWidth: 60
    },
    {
      Header: 'Name',
      accessor: 'name' // String-based value accessors!
    },
    {
      Header: 'Age',
      accessor: 'age',
      Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
    }, {
      id: 'friendName', // Required because our accessor is not a string
      Header: 'Friend Name',
      // accessor: 'friend.name'
      accessor: d => d.friend.name // Custom value accessors!
    }, {
      id: 'friendAge',
      Header: props => <span>Friend Age</span>, // Custom header components!
      //accessor: 'friend.age',
      accessor: d => d.friend.age
    }]

    this.data = getData();
  }

  checkBoxState(id){
    if (this.state.selections.includes(id)){
      return 'checked'
    } else {
      return ''
    }
  }
  updateSelection(e, id){
    let selections = this.state.selections;
    let index = selections.indexOf(id);
    if (e.target.checked) {
      this.setState({selections: [...selections, id]})
    } else {
      selections.splice(index,1)
      this.setState({selections: selections})
    }
    console.log(this.state.selections)
  }


  render(){
    return (
      <Fragment>
        <div>
          Component class, Selected IDS:
          {this.state.selections.join(',')}
        </div>
        <ReactTable
          data={this.data}
          columns={this.columns}
        />

      </Fragment>

      )
  }
}
