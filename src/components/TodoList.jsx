import React, { Component } from 'react';
import cx from 'classnames';

export default class TodoList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      term: {},
      items: []
    };
  }

  onChange = (event) => {
    this.setState({ term: {name: event.target.value, status: false } });
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.setState({
      term: {name: ''},
      items: [...this.state.items, this.state.term]
    });
  }

  toggle = (event, index) => {
    event.preventDefault();
    let items = this.state.items;
    let item = items[index]
    item.status = !item.status
    this.setState({items: items})
  }

  cssClass = (status) =>{
    return status ? 'is-done' : ''
  }

  summary(){
    if (this.state.items.length < 1) {
      return ('')
    }
    let items = this.state.items;
    let total =  items.length;
    let remaining = items.filter(x=> !x.status).length
    return (
      <p class = 'task-counter'> {remaining} remaining out of {total} tasks.</p>

    )
  }

  ListTodo(){
    return (
      <ul>
        {
          this.state.items.map((item, index) =>
            <li className ={this.cssClass(item.status)}
            key={index}
            onClick = { event => this.toggle(event, index)}
            >{item.name}
            </li>
        )}
      </ul>
      )
  }

  render() {
    return (
      <>
        <style>{`
            .is-done {
                text-decoration: line-through;
            }
            .task-counter {
              color: blue
            }
        `}</style>

        <div>
            <h2>
                Todo List
            </h2>
        </div>
        {this.summary()}
          <form onSubmit={this.onSubmit}>
            <input value={this.state.term.name} onChange={this.onChange} />
            <button>Submit</button>
          </form>
          { this.ListTodo() }
      </>
    );
  }
}
