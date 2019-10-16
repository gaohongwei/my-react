import React, { useState } from 'react';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import getData from '../data/DB'

// function toggleRow(e){
//   console.log(e.target.value, e.target.checked, )
// }

export default function FunTable(){

  const [selections, setSelections] = useState([]);

  let updateSelection = (e, value) => {
    // e.preventDefault();
    let eValue =  e.target.value;
    let index = selections.indexOf(eValue)
    let checked = e.target.checked
    console.log('eValue:',  eValue)
    console.log('value:',  value)
    console.log('checked:', checked)
    let new_selections
    if ( index < 0 ){
      new_selections = [...selections, eValue]
    } else {
      selections.splice(index,1);
      new_selections = [...selections]
    }
    console.log('org selections:',  selections)
    console.log('new selections:',  new_selections)
    setSelections(new_selections)
  }

  let isChecked = (id) => selections.includes(id)
  let onClick = (e, value) => {
    console.log(e, value)
  }

  const columns = [
  {
    id: "checkbox",
    accessor: "",
    Cell: ({ original }) => {
      return (
        <input
          type="checkbox"
          className="checkbox"
          value={original.id}
          onChange={(e)=> updateSelection(e, original.id)}
        />
      );
    },
    width: 50
  },
  {
      Header: 'Edit',
      accessor: 'editButton',
      render: (value) => (
          <button onClick={ (e) => onClick(e, value)}>
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


  console.log('render again final:',selections)
  let data = getData();
  return (
    <div>
      <div>
        Functional Table, Selected IDS: {selections.join(',')}
      </div>
      <ReactTable
        data={data}
        columns={columns}
      />

    </div>
    )


}
